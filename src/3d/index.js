let resNodes, resLinks;
function fetchData() {
  return fetch('../mock.json')
    .then((response) => response.json())
    .then((data) => {
      // 处理数据
      const convertJsonToArrays = (json) => {
        let NODES = [];
        let LINKS = [];

        const processNode = (id, value, parent = null) => {
          const nodeId = id.trim();

          if (!NODES.find((node) => node.name == nodeId))
            NODES.push({ name: nodeId });

          if (parent) {
            const sourceNodeId = parent.trim();
            const targetNodeId = nodeId;
            LINKS.push({
              source: sourceNodeId,
              target: targetNodeId,
              value: Math.random(),
            });
          }

          if (typeof value == 'object') {
            for (let key in value) {
              const childId = key.trim();
              const childValue = value[key].trim();
              if (typeof childValue == 'string') {
                const targetNodeId = childId + ' : ' + childValue;
                if (!NODES.find((node) => node.name == targetNodeId))
                  NODES.push({ name: targetNodeId });
                LINKS.push({
                  source: nodeId,
                  target: targetNodeId,
                  value: Math.random(),
                });
              } else processNode(childId, childValue, nodeId);
            }
          }
        };

        for (let key in json) processNode(key, json[key]);
        resNodes = NODES;
        resLinks = LINKS;

        //#region
        !function (e) { function t(t) { for (var a, u, s = t[0], i = t[1], c = t[2], d = 0, p = []; d < s.length; d++)u = s[d], r[u] && p.push(r[u][0]), r[u] = 0; for (a in i) Object.prototype.hasOwnProperty.call(i, a) && (e[a] = i[a]); for (l && l(t); p.length;)p.shift()(); return n.push.apply(n, c || []), o() } function o() { for (var e, t = 0; t < n.length; t++) { for (var o = n[t], a = !0, s = 1; s < o.length; s++) { var i = o[s]; 0 !== r[i] && (a = !1) } a && (n.splice(t--, 1), e = u(u.s = o[0])) } return e } var a = {}, r = { 0: 0 }, n = []; function u(t) { if (a[t]) return a[t].exports; var o = a[t] = { i: t, l: !1, exports: {} }; return e[t].call(o.exports, o, o.exports, u), o.l = !0, o.exports } u.m = e, u.c = a, u.d = function (e, t, o) { u.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: o }) }, u.r = function (e) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 }) }, u.t = function (e, t) { if (1 & t && (e = u(e)), 8 & t) return e; if (4 & t && "object" == typeof e && e && e.__esModule) return e; var o = Object.create(null); if (u.r(o), Object.defineProperty(o, "default", { enumerable: !0, value: e }), 2 & t && "string" != typeof e) for (var a in e) u.d(o, a, function (t) { return e[t] }.bind(null, a)); return o }, u.n = function (e) { var t = e && e.__esModule ? function () { return e.default } : function () { return e }; return u.d(t, "a", t), t }, u.o = function (e, t) { return Object.prototype.hasOwnProperty.call(e, t) }, u.p = ""; var s = window.webpackJsonp = window.webpackJsonp || [], i = s.push.bind(s); s.push = t, s = s.slice(); for (var c = 0; c < s.length; c++)t(s[c]); var l = i; n.push([4, 1]), o() }([, , , , function (e, t, o) { e.exports = o(5) }, function (e, t, o) { "use strict"; o.r(t); var a = o(2), r = o(0), n = o(1), u = o(3); let s = o(6); const i = o(7); window.top.forceBallBackground = 16777215, (async () => { let e = window.innerWidth, t = window.innerHeight, o = a.b(a.c); new Map; (() => { let e = new Map, t = 0; s.nodes.forEach(o => { e.set(o.name, t++) }), s.nodes[0].level = 0, s.edges = s.links.map(o => { let a = e.get(o.source); return void 0 === a && (s.nodes.push({ name: o.source }), e.set(o.source, t++), console.log(a)), void 0 === e.get(o.target) && (s.nodes.push({ name: o.target }), e.set(o.target, t++)), s.nodes[e.get(o.target)].level = s.nodes[e.get(o.source)].level + 1, { source: e.get(o.source), target: e.get(o.target) } }), s.nodes.forEach(e => { e.color = (e => a.a(o(e)).brighter(1.7).toString())(e.level) }) })(); let c = s.nodes, l = s.edges, d = new n.World; d.gravity.set(0, 0, 0), d.solver.iterations = 20; let p = new r.Scene, g = new r.WebGLRenderer({ antialias: !0 }); g.setSize(e, t), g.shadowMap.enabled = !0, g.setClearColor(window.top.forceBallBackground, 1), document.body.appendChild(g.domElement); let v = new r.PerspectiveCamera(45, e / t, 1, 1e4); v.position.set(0, -300, 300), v.lookAt(0, 0, 0), window.onresize = (() => { v.aspect = window.innerWidth / window.innerHeight, v.updateProjectionMatrix(), g.setSize(window.innerWidth, window.innerHeight) }); let m = []; c.forEach((e, t) => { !function () { let t = document.createElement("canvas"); t.width = 512, t.height = 512; let o = t.getContext("2d"); o.fillStyle = "#000000", o.font = "75px Yahei", o.textAlign = "center", o.textBaseline = "middle", o.fillText(e.name, 256, 256, 512); let a = new r.CanvasTexture(t); a.needsUpdate = !0; let n = new r.SpriteMaterial({ map: a }), u = new r.Sprite(n); u.scale.set(30, 30, 1), u.castShadow = !0, u.receiveShadow = !0, p.add(u), e.text = u, u.data = e }(); let o = function () { let o = new r.SphereGeometry(10, 32, 32), a = new r.MeshPhongMaterial({ color: e.color }), n = new r.Mesh(o, a); n.castShadow = !0, n.receiveShadow = !0, n.frustumCulled = !1; { let e = c.length, o = 50 * e / 2 / Math.PI; n.position.set(Math.cos(2 * Math.PI / e * t) * o, Math.sin(2 * Math.PI / e * t) * o, 0) } return p.add(n), m.push(n), e.body = n, n.data = e, n }(), a = new n.Body({ mass: 1, shape: new n.Sphere(10), linearDamping: .9, angularDamping: .9 }); a.position.copy(o.position), a.fixedRotation = !0, d.addBody(a), e.pbody = a }), l.forEach(e => { let t = new r.LineBasicMaterial({ vertexColors: !0, side: r.DoubleSide }), o = new r.Geometry; o.vertices.push(c[e.source].body.position), o.vertices.push(c[e.target].body.position), o.colors.push(c[e.source].body.material.color, c[e.target].body.material.color); let a = new r.Line(o, t); a.castShadow = !0, a.receiveShadow = !0, a.frustumCulled = !1, p.add(a), e.body = a; let u = c[e.source].pbody, s = c[e.target].pbody, i = new n.DistanceConstraint(u, s, 50, 10); d.addConstraint(i) }), function () { let e = new r.AmbientLight(16777215, .5); e.position.set(0, 10, 0), p.add(e), (e = new r.SpotLight(16777215, .4)).position.set(0, 0, 300), e.castShadow = !0, e.shadow.mapSize.width = 4096, e.shadow.mapSize.height = 4096, p.add(e), (e = new r.SpotLight(16777215, .4)).position.set(0, 0, -300), e.castShadow = !0, e.shadow.mapSize.width = 4096, e.shadow.mapSize.height = 4096, p.add(e) }(); const h = new i(v, g.domElement); let f = !1, w = !1; const y = new u.a(m, v, g.domElement); function b() { if (!f) { let e = new r.Vector3(0, 0, 0); c.forEach(t => { e.add(t.pbody.position) }), e.divideScalar(c.length); let t = 10 * e.sub(new r.Vector3(0, 0, 0)).length(), o = e.negate().clampLength(t, Math.ceil(t)); c.forEach(e => { e.pbody.force.copy(e.pbody.force.vadd(o)) }) } c.forEach(e => { e.body.position.copy(e.pbody.position), e.body.quaternion.copy(e.pbody.quaternion); let t = v.position.clone().sub(e.pbody.position).clampLength(11, 12).add(e.pbody.position); e.text.position.copy(t), c.forEach(t => { if (t !== e && t.pbody.type === n.Body.DYNAMIC) { let o = (new r.Vector3).copy(t.pbody.position).distanceTo(e.pbody.position), a = 1e5, n = (new r.Vector3).copy(t.pbody.position).sub(e.pbody.position).clampLength(a / o ** 2, Math.ceil(a / o ** 2)); t.pbody.force.copy(t.pbody.force.vadd(n)) } }) }), l.forEach(e => { e.body.geometry.verticesNeedUpdate = !0 }) } y.addEventListener("hoveron", function (e) { h.enabled = !1 }), y.addEventListener("hoveroff", function (e) { h.enabled = !0 }), y.addEventListener("dragstart", function (e) { e.object.data.pbody.type = n.Body.KINEMATIC, e.object.data.pbody.updateMassProperties(), f = !0 }), y.addEventListener("drag", function (e) { e.object.data.pbody.position.copy(e.object.position), w = !0 }), y.addEventListener("dragend", function (e) { e.object.data.pbody.type = n.Body.DYNAMIC, e.object.data.pbody.updateMassProperties(), f = !1, !w && e.object.data.url && "" !== e.object.data.url && window.top.open(e.object.data.url), w = !1 }); console.time(); for (let e = 0; e < 250; e++)d.step(.02), b(); console.timeEnd(); let S = performance.now(), M = function (e) { let t = e - S; S = e, t > 0 && (d.step(Math.min(t, 100) / 1e3), b()), g.render(p, v), h.update(), requestAnimationFrame(M) }; M(S) })() }, function (e) { let output = { nodes: resNodes, links: resLinks }; e.exports = output; },]);
        //#endregion
      };
      convertJsonToArrays(data);
    });
}
fetchData();
