(function(){
  var reduce = window.KG.reduce, small = innerWidth < 768;
  var stage = document.getElementById("stage");
  var PH = [
    ["תכנון","מודדים, מתכננים ובוחרים חומרים. התוכנית נכנסת להצעה."],
    ["פירוק ופינוי","המטבח הישן, הריצוף והכלים יוצאים. הכל מפונה מהבניין."],
    ["אינסטלציה וחשמל","צנרת חדשה ונקודות חשמל, לפני שסוגרים קירות."],
    ["ריצוף","אריח אחרי אריח, בקווים ישרים ובפוגות נקיות."],
    ["חיפוי וחדר רחצה","חיפוי קירות, איטום והכנה לכלים."],
    ["גבס וצבע","קירות חלקים וצבע בגוון שבחרתם."],
    ["מטבח וגימור","מטבח, כלים ופרטים קטנים שמשנים הכל."],
    ["מסירה","ניקיון, בדיקה אחרונה, ומסירת מפתח בתאריך שבהצעה."]];
  var cells = document.getElementById("cells");
  PH.forEach(function(p,i){ cells.insertAdjacentHTML("beforeend", '<div class="cell"><i></i><span>שבוע ' + (i+1) + '</span></div>'); });
  var cellEls = [].slice.call(cells.querySelectorAll(".cell"));
  var heroIn = document.getElementById("heroIn"), phase = document.getElementById("phase"), wkn = document.getElementById("wkn"), ph = document.getElementById("ph"), pp = document.getElementById("pp"), stamp = document.getElementById("stamp");
  var lastW = -1;
  function ui(p){
    heroIn.style.opacity = Math.max(0, 1 - p*9); heroIn.style.pointerEvents = p > .08 ? "none" : "auto";
    var b = Math.max(0, (p - .06)/.9), w = Math.min(7, Math.floor(b*8));
    phase.classList.toggle("on", p > .09 && p < .985);
    if (w !== lastW){ lastW = w; wkn.textContent = w+1; ph.textContent = PH[w][0]; pp.textContent = PH[w][1]; }
    cellEls.forEach(function(c,i){ c.style.setProperty("--f", Math.max(0, Math.min(1, b*8 - i)).toFixed(3)); });
    stamp.classList.toggle("on", b >= 1);
  }
  var target = 0, progress = 0;
  function readScroll(){ var r = stage.getBoundingClientRect(); target = Math.max(0, Math.min(1, -r.top / (r.height - innerHeight))); }
  addEventListener("scroll", readScroll, {passive:true}); readScroll();

  var canvas = document.getElementById("gl");
  function noGL(){ ui(target); addEventListener("scroll", function(){ ui(target); }, {passive:true}); }
  if (!window.THREE) return noGL();
  var renderer;
  try { renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, alpha:true, powerPreference:"high-performance"}); } catch(e){ return noGL(); }
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .82;

  var scene = new THREE.Scene();
  var camera = new THREE.OrthographicCamera(-1,1,1,-1,.1,100);
  var hemi = new THREE.HemisphereLight(0xdfe6ee, 0x2a2c2e, .5); scene.add(hemi);
  var key = new THREE.DirectionalLight(0xfff4e6, 1.45); key.position.set(6, 11, 7); key.castShadow = true;
  var sm = small ? 1024 : 2048; key.shadow.mapSize.set(sm, sm); Object.assign(key.shadow.camera, {left:-8,right:8,top:8,bottom:-8,near:1,far:40}); key.shadow.bias = -0.0005; key.shadow.radius = 3;
  scene.add(key);
  var room = new THREE.Group(); scene.add(room);
  function std(c, r, m, o){ return new THREE.MeshStandardMaterial(Object.assign({color:c, roughness:r === undefined ? .8 : r, metalness:m || 0}, o || {})); }
  function mk(w,h,dd,mat,x,y,z,parent){ var m = new THREE.Mesh(new THREE.BoxGeometry(w,h,dd), mat); m.position.set(x,y,z); m.castShadow = true; m.receiveShadow = true; (parent || room).add(m); return m; }
  var SIG = 0xc5f04a;

  var grid = new THREE.GridHelper(30, 60, 0x2b3036, 0x1f2327); grid.position.y = -.21; scene.add(grid);
  mk(8.4, .2, 6.4, std(0x6f7376, .95), 0, -.1, 0);
  var plaster = new THREE.Color(0x6a6762), paint = new THREE.Color(0xd9d2c6), accent = new THREE.Color(0x6f8a6c);
  var wallMatA = std(0x8d8a84, .95, 0, {transparent:true, opacity:0}), wallMatB = std(0x8d8a84, .95, 0, {transparent:true, opacity:0}), wallMatC = std(0x8d8a84, .95, 0, {transparent:true, opacity:0});
  var wBack = mk(8.4, 2.8, .16, wallMatA, 0, 1.4, -3.12), wLeft = mk(.16, 2.8, 6.4, wallMatB, -4.12, 1.4, 0), wPart = mk(.14, 2.8, 2.6, wallMatC, 1.4, 1.4, -1.8);
  var glass = mk(1.9, 1.3, .04, std(0x9db9c9, .1, .2, {transparent:true, opacity:0}), -1.5, 1.7, -3.02);
  var frameM = std(0x1d2124, .5, .3, {transparent:true, opacity:0});
  mk(2.0,.08,.08,frameM,-1.5,2.37,-3.0); mk(2.0,.08,.08,frameM,-1.5,1.03,-3.0); mk(.08,1.4,.08,frameM,-2.5,1.7,-3.0); mk(.08,1.4,.08,frameM,-.5,1.7,-3.0);
  var edgeMat = new THREE.LineBasicMaterial({color:SIG, transparent:true, opacity:1});
  [wBack, wLeft, wPart].forEach(function(w){ var e = new THREE.LineSegments(new THREE.EdgesGeometry(w.geometry), edgeMat); e.position.copy(w.position); room.add(e); });
  var planLines = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(8.4,.01,6.4)), edgeMat); planLines.position.y = .01; room.add(planLines);

  var old = [mk(.6,.9,3.2,std(0x5a4636,.9,0,{transparent:true}),-3.7,.45,-1.2), mk(.6,.08,3.2,std(0x8a7a6a,.8,0,{transparent:true}),-3.7,.94,-1.2), mk(1.6,.55,.8,std(0xd8d2c6,.6,0,{transparent:true}),2.6,.28,-2.6), mk(8.2,.04,6.2,std(0x6d5a4a,.95,0,{transparent:true}),0,.02,0), mk(.5,1.6,.5,std(0x4a3b2e,.9,0,{transparent:true}),3.2,.8,1.6)];
  old.forEach(function(o){ o.userData.y0 = o.position.y; });

  var pipes = new THREE.Group(); room.add(pipes);
  function cyl(r,l,c,x,y,z,rx,rz){ var m = new THREE.Mesh(new THREE.CylinderGeometry(r,r,l,10), std(c,.4,.3,{transparent:true})); m.position.set(x,y,z); m.rotation.set(rx||0,0,rz||0); m.castShadow = true; pipes.add(m); return m; }
  cyl(.045, 4.2, 0x3a8dde, -1.9, .12, -2.95, 0, Math.PI/2); cyl(.045, 4.2, 0xe0533a, -1.9, .25, -2.95, 0, Math.PI/2);
  cyl(.045, 2.4, 0x3a8dde, 1.3, .12, -1.8, Math.PI/2, 0); cyl(.045, 2.4, 0xe0533a, 1.3, .25, -1.8, Math.PI/2, 0);
  cyl(.03, 2.4, SIG, -4.02, 1.3, -.4); cyl(.03, 2.4, SIG, -4.02, 1.3, 1.6); cyl(.03, 2.6, SIG, -2.6, 2.35, -3.02, 0, Math.PI/2); cyl(.03, 2.4, SIG, 2.6, 1.3, -3.02);
  pipes.children.forEach(function(c){ c.scale.set(1, .001, 1); });

  var TW = .5, NX = 16, NZ = 12, tiles = [];
  var oak = new THREE.InstancedMesh(new THREE.BoxGeometry(TW*.96, .05, TW*.96), std(0xc29a6c, .7), NX*NZ); oak.receiveShadow = true; room.add(oak);
  var dummy = new THREE.Object3D(), ti = 0;
  for (var z = 0; z < NZ; z++) for (var x = 0; x < NX; x++){
    var px = -4 + TW/2 + x*TW, pz = -3 + TW/2 + z*TW, bath = px > 1.4 && pz < -.5;
    tiles.push({x:px, z:pz, d:((NX-1-x) + z*1.3)/(NX+NZ*1.3)});
    oak.setColorAt(ti++, new THREE.Color(bath ? 0xd6d9da : ((x+z)%3===0 ? 0xb88f61 : 0xc6a072)));
  }
  oak.instanceColor.needsUpdate = true;
  var bathTiles = new THREE.Group(); room.add(bathTiles);
  var btMat = std(0xe4e8e8, .35, .05), t;
  for (var r = 0; r < 4; r++) for (var c = 0; c < 6; c++){ t = mk(.42,.42,.02,btMat, 1.72 + c*.44, .3 + r*.44, -3.02, bathTiles); t.userData.d = (r*6 + c)/24; t.scale.setScalar(.001); }
  for (r = 0; r < 4; r++) for (c = 0; c < 5; c++){ t = mk(.02,.42,.42,btMat, 1.49, .3 + r*.44, -2.85 + c*.44, bathTiles); t.userData.d = (r*5 + c)/20; t.scale.setScalar(.001); }

  var furn = [];
  function F(w,h,dd,col,x,y,z,ro,me){ var o = mk(w,h,dd,std(col,ro === undefined ? .6 : ro,me||0),x,y,z); o.userData.y0 = y; o.visible = false; furn.push(o); return o; }
  F(.62,.86,3.4,0x2f3a36,-3.72,.43,-1.1); F(.66,.06,3.44,0xe8e4dc,-3.72,.89,-1.1,.35);
  F(.62,.7,.9,0x2f3a36,-3.72,2.1,-1.6); F(.62,.7,.9,0x2f3a36,-3.72,2.1,-.5);
  F(1.6,.88,.8,0x2f3a36,-1.6,.44,-.9); F(1.7,.06,.9,0xe8e4dc,-1.6,.91,-.9,.35);
  F(2.2,.42,.9,0x4c5a52,-.2,.21,1.9); F(2.2,.5,.2,0x46534b,-.2,.55,2.3); F(.2,.36,.9,0x46534b,-1.25,.4,1.9); F(.2,.36,.9,0x46534b,.85,.4,1.9);
  F(2.6,.02,1.7,0xd9d2c4,-.2,.02,1.1,.95); F(.9,.36,.5,0x8a6a4c,-.2,.18,.7);
  F(1.5,.5,.75,0xf4f4f2,2.5,.25,-2.55,.2); F(.8,.8,.45,0x2f3a36,3.5,.4,-.8);
  var gl2 = F(.02,1.9,1.0,0x9db9c9,1.95,.95,-1.35,.05,.1); gl2.material.transparent = true; gl2.material.opacity = .45;
  var plant = F(.5,.5,.5,0xa07a5a,3.4,.25,2.4,.9); var leaves = new THREE.Mesh(new THREE.SphereGeometry(.45,12,10), std(0x5e7f4e,.9)); leaves.position.y = .6; leaves.castShadow = true; plant.add(leaves);

  var pend = [], pl = [];
  [[-1.6,-.9],[-.9,-.9],[-.2,1.3]].forEach(function(a){
    var x = a[0], zz = a[1];
    var cord = mk(.012, .9, .012, std(0x1d2124), x, 2.35, zz); cord.castShadow = false;
    var shade = new THREE.Mesh(new THREE.ConeGeometry(.2,.22,18,1,true), std(0x1d2124,.5,.3,{side:THREE.DoubleSide})); shade.position.set(x,1.83,zz); room.add(shade);
    var bulb = new THREE.Mesh(new THREE.SphereGeometry(.07,12,10), new THREE.MeshBasicMaterial({color:0x5a5650})); bulb.position.set(x,1.74,zz); room.add(bulb); pend.push(bulb);
    var L = new THREE.PointLight(0xffc98a, 0, 5, 2); L.position.set(x,1.65,zz); room.add(L); pl.push(L);
    [cord, shade, bulb].forEach(function(o){ o.visible = false; }); bulb.userData.parts = [cord, shade];
  });

  function clamp(v){ return Math.max(0, Math.min(1, v)); }
  function seg(b, a, z){ return clamp((b - a)/(z - a)); }
  function eo(t){ return 1 - Math.pow(1 - t, 3); }
  function bounce(t){ var c = 1.6; return 1 + (c+1)*Math.pow(t-1,3) + c*Math.pow(t-1,2); }

  function build(b){
    var w1 = seg(b, 0, .1), w2 = seg(b, .125, .24), w3 = seg(b, .25, .36), w4 = seg(b, .375, .5), w5 = seg(b, .5, .615), w6 = seg(b, .625, .74), w7 = seg(b, .75, .87), w8 = seg(b, .875, .99);
    var wo = eo(w1);
    [wallMatA, wallMatB, wallMatC].forEach(function(m){ m.opacity = .25 + wo*.75; m.transparent = m.opacity < .99; });
    edgeMat.opacity = Math.max(.12, 1 - wo*.75 - w6*.3);
    glass.material.opacity = wo*.55; frameM.opacity = wo;
    old.forEach(function(o,i){ var tt = clamp(w2*1.6 - i*.15); o.position.y = o.userData.y0 + eo(tt)*2.2; o.material.opacity = 1 - tt; o.visible = tt < 1; o.rotation.z = tt*.3*(i%2?1:-1); });
    pipes.children.forEach(function(c,i){ var tt = clamp(w3*1.5 - i*.06); c.scale.y = Math.max(.001, eo(tt)); c.material.opacity = 1 - seg(b, .6, .7); c.visible = c.material.opacity > .01; });
    var k = 0;
    tiles.forEach(function(tl){ var s = clamp((w4*1.4) - tl.d*.9), y = .03 + (1 - bounce(s))*1.6;
      dummy.position.set(tl.x, s <= 0 ? -5 : y, tl.z); dummy.rotation.set((1-s)*.4, 0, 0); dummy.scale.setScalar(s <= 0 ? .001 : 1); dummy.updateMatrix(); oak.setMatrixAt(k++, dummy.matrix); });
    oak.instanceMatrix.needsUpdate = true;
    bathTiles.children.forEach(function(tl){ var s = clamp(w5*1.6 - tl.userData.d); tl.scale.setScalar(Math.max(.001, bounce(s))); });
    var pt = eo(w6);
    wallMatA.color.copy(plaster).lerp(paint, pt); wallMatC.color.copy(plaster).lerp(paint, pt); wallMatB.color.copy(plaster).lerp(accent, pt);
    furn.forEach(function(o,i){ var s = clamp(w7*1.9 - i*.07); o.visible = s > 0; o.position.y = o.userData.y0 + (1 - bounce(s))*2.6; });
    pend.forEach(function(bl,i){ var s = clamp(w8*1.6 - i*.2), on = s > 0, off = (1-eo(s))*1.2; bl.visible = on; bl.userData.parts.forEach(function(p){ p.visible = on; });
      bl.position.y = 1.74 + off; bl.userData.parts[1].position.y = 1.83 + off; bl.userData.parts[0].position.y = 2.35 + off;
      bl.material.color.setRGB(.35 + s*.65, .34 + s*.6, .31 + s*.45); pl[i].intensity = s*2.2; });
    renderer.toneMappingExposure = .82 + w8*.06; hemi.intensity = .5 - w8*.14;
  }

  var mx = 0, smx = 0, aspect = 1;
  if (matchMedia("(pointer:fine)").matches) addEventListener("pointermove", function(e){ mx = e.clientX/innerWidth - .5; wake(); });
  function resize(){ var w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); aspect = w/h;
    var s = aspect < .8 ? 7.4 : (aspect < 1.2 ? 6.2 : 5.1);
    camera.left = -s*aspect; camera.right = s*aspect; camera.top = s; camera.bottom = -s; camera.updateProjectionMatrix(); wake(); }
  addEventListener("resize", resize);
  var visible = true, running = false, last = performance.now(), idle = 0;
  new IntersectionObserver(function(es){ visible = es[0].isIntersecting; if (visible) wake(); }).observe(stage);
  function wake(){ idle = performance.now() + 1500; if (!running && visible){ running = true; last = performance.now(); requestAnimationFrame(frame); } }
  addEventListener("scroll", wake, {passive:true});
  var look = new THREE.Vector3(), right = new THREE.Vector3(), up = new THREE.Vector3(0,1,0), Y = new THREE.Vector3(0,1,0);
  function frame(now){
    var dt = Math.min(.25, (now - last)/1000); last = now;
    var k = reduce ? 1 : 1 - Math.exp(-dt*5);
    progress += (target - progress)*k; smx += (mx - smx)*k*.6;
    var p = progress, b = clamp((p - .06)/.9);
    build(b);
    var drift = reduce ? 0 : Math.sin(now/6000)*.05;
    var a = Math.PI/4 + .28 - b*.42 + drift + smx*.15, R = 20, el = 13.2;
    camera.position.set(Math.sin(a)*R, el, Math.cos(a)*R);
    var ox = aspect > 1.2 ? 4.6 - b*1.3 : 0, oy = aspect < .8 ? -2.6 : (aspect < 1.2 ? -1.0 : 0);
    look.set(0, .9, 0);
    right.subVectors(look, camera.position).cross(Y).normalize();
    camera.position.addScaledVector(right, ox).addScaledVector(up, oy);
    camera.lookAt(look.addScaledVector(right, ox).addScaledVector(up, oy));
    renderer.render(scene, camera);
    ui(p);
    if (visible && (Math.abs(target - progress) > .0004 || now < idle || !reduce)) requestAnimationFrame(frame); else running = false;
  }
  resize(); wake();
})();
