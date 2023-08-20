import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as type from './type';
import path = require('path');
import {
	getJsonFileObjPath,
	handleHasCjsVersionObj,
	nameVersionStringify,
} from '../utils';
import field from '../field';
import { DenpendType, DependHash } from '../type';
function getPnpmYamlObj() {
	const pnpm_yamlPath = path.join(
		process.cwd().replace(/\\/g, '/'),
		'/pnpm-lock.yaml'
	);
	try {
		const PnpmYamlObj = yaml.load(fs.readFileSync(pnpm_yamlPath, 'utf-8'));
		return PnpmYamlObj as type.pnpmLockYamlObj;
	} catch (e) {
		console.log(e);
	}
}

function getPnpmAllDependHash(depnedType: DenpendType = field.dependencies) {
	const yamlObj = getPnpmYamlObj();
	const hash: Record<string, Record<string, string>> = {};
	Object.entries(yamlObj?.packages || {}).forEach(([key, value]) => {
		const arr = key.split('/');
		arr.shift();
		const version = arr.pop()!;
		const name = arr.join('/');
		hash[nameVersionStringify(name, version)] = handleHasCjsVersionObj(
			value.dependencies || {}
		);
	});
	//获取用户包的名字
	const entryPack = require(path.join(
		process.cwd().replace(/\\/g, '/'),
		'./package.json'
	));
	const nameVersion = nameVersionStringify(entryPack.name, entryPack.version);
	hash[nameVersion] = handleHasCjsVersionObj(yamlObj?.[depnedType] || {});
	return hash;
}

function getPnpmDependHash(/** 递归的最大深度*/ d: number) {
	const AllDependHash = getPnpmAllDependHash(field.dependencies);
	const AllDevDependHash = getPnpmAllDependHash(field.devDependencies);
	const entryPack = require(path.join(
		process.cwd().replace(/\\/g, '/'),
		'./package.json'
	));

	function dfs(
		depth: number,
		nameVersion: string,
		allHash: DependHash,
		hash: DependHash
	) {
		if (depth > d || hash[nameVersion]) return;
		hash[nameVersion] = allHash[nameVersion];
		Object.entries(hash[nameVersion] || {}).forEach(([name, version]) => {
			dfs(depth + 1, nameVersionStringify(name, version), allHash, hash);
		});
	}
	const nameVersion = nameVersionStringify(entryPack.name, entryPack.version);
	const hash: DependHash = {};
	const devHash: DependHash = {};
	dfs(1, nameVersion, AllDependHash, hash);
	dfs(1, nameVersion, AllDevDependHash, devHash);
	return [hash, devHash] as [DependHash, DependHash];
}

export default getPnpmDependHash;
