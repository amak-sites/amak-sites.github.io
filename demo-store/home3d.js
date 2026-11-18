(function(){
var cv=document.getElementById("stones");if(!cv||!window.THREE)return;
var RM=matchMedia("(prefers-reduced-motion: reduce)").matches,small=innerWidth<820;
var R;try{R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true})}catch(e){return}
R.setPixelRatio(Math.min(devicePixelRatio,small?1.4:1.8));R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;
R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
var S=new THREE.Scene(),C=new THREE.PerspectiveCamera(32,1,.1,100);C.position.set(0,2.2,9);
S.add(new THREE.HemisphereLight(0xffe2c4,0x1a0f08,.35));
var key=new THREE.DirectionalLight(0xffe0bd,1.3);key.position.set(-3,6,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.radius=6;Object.assign(key.shadow.camera,{left:-4,right:4,top:4,bottom:-4});S.add(key);
var rim=new THREE.PointLight(0xe9a663,2.2,12,2);rim.position.set(2.5,1,-2.5);S.add(rim);
var under=new THREE.PointLight(0xff8a3d,0,6,2);under.position.set(0,-.6,0);S.add(under);
var G=new THREE.Group();S.add(G);

// ground glow
var gm=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{h:{value:0}},vertexShader:"varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
 fragmentShader:"uniform float h;varying vec2 v;void main(){float d=distance(v,vec2(.5));float a=smoothstep(.5,0.,d);gl_FragColor=vec4(mix(vec3(.9,.55,.25),vec3(1.,.7,.35),h)*a*(.35+h*.35),a*(.55+h*.3));}"});
var glow=new THREE.Mesh(new THREE.PlaneGeometry(7,7),gm);glow.rotation.x=-Math.PI/2;glow.position.y=-.75;G.add(glow);
var shadowCatcher=new THREE.Mesh(new THREE.PlaneGeometry(10,10),new THREE.ShadowMaterial({opacity:.45}));shadowCatcher.rotation.x=-Math.PI/2;shadowCatcher.position.y=-.74;shadowCatcher.receiveShadow=true;G.add(shadowCatcher);

function stoneGeo(rx,ry,rz,seed){var g=new THREE.SphereGeometry(1,small?48:80,small?32:56),p=g.attributes.position,v=new THREE.Vector3();
 for(var i=0;i<p.count;i++){v.fromBufferAttribute(p,i);var n=Math.sin(v.x*2.1+seed)*.035+Math.sin(v.z*2.7+seed*2.)*.03+Math.sin((v.x+v.z)*4.3+seed)*.012;
  var flat=v.y>0?1-.35*Math.pow(v.y,2):1-.5*Math.pow(-v.y,1.5);v.multiplyScalar(1+n);p.setXYZ(i,v.x*rx,v.y*ry*flat,v.z*rz)}
 g.computeVertexNormals();return g}
var stones=[],spec=[[1.55,.5,1.15,.0,1.3],[1.15,.42,.9,.78,2.1],[.78,.34,.62,1.42,3.4]];
spec.forEach(function(s,i){var m=new THREE.MeshStandardMaterial({color:0x2a211c,roughness:.42,metalness:.05,emissive:0xff6a1a,emissiveIntensity:0});
 var mesh=new THREE.Mesh(stoneGeo(s[0],s[1],s[2],s[4]),m);mesh.position.y=s[3]-.25;mesh.rotation.y=i*.7;mesh.castShadow=true;mesh.receiveShadow=true;
 mesh.userData={y0:mesh.position.y,heat:i===0?.35:0,ry:mesh.rotation.y,i:i};G.add(mesh);stones.push(mesh)});
// oil sheen highlight via env-like fresnel overlay
stones.forEach(function(s){s.material.onBeforeCompile=function(sh){sh.fragmentShader=sh.fragmentShader.replace("#include <dithering_fragment>","#include <dithering_fragment>\nfloat fr=pow(1.-max(dot(normalize(vNormal),vec3(0.,0.,1.)),0.),3.);gl_FragColor.rgb+=vec3(1.,.72,.45)*fr*.35;")}});

// steam
var N=small?90:180,sg=new THREE.BufferGeometry(),sp=new Float32Array(N*3),ss=new Float32Array(N);
for(var i=0;i<N;i++){sp[i*3]=(Math.random()-.5)*1.4;sp[i*3+1]=Math.random()*3;sp[i*3+2]=(Math.random()-.5)*1.0;ss[i]=Math.random()}
sg.setAttribute("position",new THREE.BufferAttribute(sp,3));sg.setAttribute("seed",new THREE.BufferAttribute(ss,1));
var sm=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{t:{value:0},h:{value:0},pr:{value:R.getPixelRatio()}},
 vertexShader:"uniform float t,pr;attribute float seed;varying float a;void main(){vec3 p=position;float life=fract(seed+t*.06*(.6+seed));p.y=1.55+life*3.2;p.x+=sin(t*.6+seed*20.+life*4.)*.35*life;p.z+=cos(t*.5+seed*13.)*.2*life;a=smoothstep(0.,.15,life)*(1.-life);vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=(60.+life*160.)*pr/-mv.z;gl_Position=projectionMatrix*mv;}",
 fragmentShader:"uniform float h;varying float a;void main(){float d=length(gl_PointCoord-.5);float k=smoothstep(.5,0.,d);float al=k*a*(.10+h*.12);gl_FragColor=vec4(vec3(1.,.93,.85)*al,al);}"});
var steam=new THREE.Points(sg,sm);G.add(steam);

// pointer + click
var ray=new THREE.Raycaster(),mouse=new THREE.Vector2(9,9),hover=null,mx=0,my=0;
function setM(e){var r=cv.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);mx=mouse.x;my=mouse.y}
addEventListener("pointermove",setM,{passive:true});
cv.parentElement.addEventListener("pointerdown",function(e){if(e.target.closest("a,button"))return;setM(e);ray.setFromCamera(mouse,C);var h=ray.intersectObjects(stones)[0];if(h){h.object.userData.heat=1;h.object.userData.kick=1}});

function layout(){var w=cv.clientWidth,h=cv.clientHeight;R.setSize(w,h,false);C.aspect=w/h;C.updateProjectionMatrix();
 var mob=w<820;G.position.set(mob?0:-2.6*Math.min(1.4,C.aspect/1.6),mob?1.55:-.1,0);G.scale.setScalar(mob?.6:1)}
addEventListener("resize",layout);layout();

var last=performance.now(),run=true;document.addEventListener("visibilitychange",function(){run=!document.hidden;if(run){last=performance.now();requestAnimationFrame(f)}});
var vis=true;new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis&&run)requestAnimationFrame(f)}).observe(cv);
function f(now){if(!run||!vis)return;var dt=Math.min(.05,(now-last)/1000);last=now;var T=RM?2:now/1000;
 ray.setFromCamera(mouse,C);var hit=ray.intersectObjects(stones)[0];hover=hit?hit.object:null;cv.parentElement.style.cursor=hover?"pointer":"";
 var tot=0,sc=Math.min(1,scrollY/innerHeight);
 stones.forEach(function(s,i){var u=s.userData;u.heat=Math.max(i===0?.35:0,u.heat-dt*.06);u.kick=Math.max(0,(u.kick||0)-dt*2.2);tot+=u.heat;
  s.material.emissiveIntensity=u.heat*1.35;s.material.color.setHex(0x2a211c).lerp(new THREE.Color(0x5a3a26),u.heat*.5);
  var lift=(s===hover?.08:0)+Math.sin(T*.9+i*1.3)*.025+u.kick*.15*Math.sin(u.kick*12)+sc*i*.55;
  s.position.y+=(u.y0+lift-s.position.y)*Math.min(1,dt*8);s.rotation.y=u.ry+T*.05*(i%2?1:-1)+sc*(i-1)*.6});
 var hh=Math.min(1,tot/1.6);gm.uniforms.h.value=hh;sm.uniforms.h.value=hh;sm.uniforms.t.value=T;under.intensity=hh*3;
 G.rotation.y+=(mx*.25-G.rotation.y)*Math.min(1,dt*3);G.rotation.x+=(-my*.06-G.rotation.x)*Math.min(1,dt*3);
 C.position.y=2.2-sc*.6;C.lookAt(0,.6,0);
 R.render(S,C);if(!RM)requestAnimationFrame(f)}
requestAnimationFrame(f);if(RM)addEventListener("pointerdown",function(){requestAnimationFrame(f)});
})();
