(function(){
var cv=document.getElementById("grass");if(!cv||!window.THREE)return;
var RM=matchMedia("(prefers-reduced-motion: reduce)").matches,small=innerWidth<820;
var R;try{R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true})}catch(e){return}
R.setPixelRatio(Math.min(devicePixelRatio,small?1.4:1.8));
var S=new THREE.Scene(),C=new THREE.PerspectiveCamera(42,1,.1,80);C.position.set(0,1.9,7.5);C.lookAt(0,.4,-2);
var SEASONS={
 spring:{base:[.05,.16,.07],tip:[.62,.86,.3],flower:1,leaves:0,fog:[.043,.078,.055]},
 summer:{base:[.07,.16,.05],tip:[.86,.82,.36],flower:.25,leaves:0,fog:[.06,.075,.045]},
 autumn:{base:[.09,.12,.05],tip:[.86,.55,.22],flower:0,leaves:1,fog:[.07,.06,.04]},
 winter:{base:[.06,.12,.1],tip:[.78,.88,.84],flower:0,leaves:0,fog:[.05,.07,.075]}};
var U={t:{value:0},base:{value:new THREE.Color().fromArray(SEASONS.spring.base)},tip:{value:new THREE.Color().fromArray(SEASONS.spring.tip)},
 fogc:{value:new THREE.Color().fromArray(SEASONS.spring.fog)},ptr:{value:new THREE.Vector3(99,0,99)},ps:{value:0},wind:{value:1}};
// blade
var g=new THREE.PlaneGeometry(.06,1,1,5);g.translate(0,.5,0);
var pos=g.attributes.position;for(var i=0;i<pos.count;i++){var y=pos.getY(i);pos.setX(i,pos.getX(i)*(1-y*.92))}
var N=small?9000:22000,ig=new THREE.InstancedBufferGeometry();ig.index=g.index;ig.attributes.position=g.attributes.position;ig.attributes.uv=g.attributes.uv;
var off=new Float32Array(N*4);for(i=0;i<N;i++){var z=-Math.random()*16+6.2,x=(Math.random()-.5)*(10+(6.2-z)*1.1);off[i*4]=x;off[i*4+1]=z;off[i*4+2]=.45+Math.random()*.75*(1-(z+11)/18*.3);off[i*4+3]=Math.random()*6.283}
ig.setAttribute("off",new THREE.InstancedBufferAttribute(off,4));ig.instanceCount=N;
var gm=new THREE.ShaderMaterial({uniforms:U,side:THREE.DoubleSide,vertexShader:
"uniform float t,ps,wind;uniform vec3 ptr;attribute vec4 off;varying float vy;varying float vd;void main(){vec3 p=position;float h=off.z;p.y*=h;float y=position.y;"+
"float c=cos(off.w),s=sin(off.w);p.xz=mat2(c,-s,s,c)*p.xz;vec3 w=vec3(off.x,0.,off.y)+p;"+
"float sway=(sin(t*1.3+off.x*.35+off.y*.2)*.18+sin(t*2.7+off.w)*.05)*wind;w.x+=sway*y*y*h;w.z+=sway*.4*y*y*h;"+
"vec2 d=w.xz-ptr.xz;float dl=length(d);float push=ps*smoothstep(1.6,0.,dl);w.xz+=normalize(d+1e-4)*push*y*y*h*.9;w.y-=push*y*y*h*.35;"+
"vy=y;vec4 mv=modelViewMatrix*vec4(w,1.);vd=-mv.z;gl_Position=projectionMatrix*mv;}",
fragmentShader:"uniform vec3 base,tip,fogc;varying float vy;varying float vd;void main(){vec3 col=mix(base,tip,pow(vy,1.4));col*=.75+.35*vy;float f=smoothstep(4.,15.,vd);col=mix(col,fogc,f);gl_FragColor=vec4(col,1.);}"});
var grass=new THREE.Mesh(ig,gm);grass.frustumCulled=false;S.add(grass);
var ground=new THREE.Mesh(new THREE.PlaneGeometry(40,30),new THREE.MeshBasicMaterial({color:0x0b140e}));ground.rotation.x=-Math.PI/2;ground.position.z=-4;S.add(ground);
// flowers + leaves (points)
function pts(n,shader){var b=new THREE.BufferGeometry(),a=new Float32Array(n*3),sd=new Float32Array(n);for(var i=0;i<n;i++){a[i*3]=(Math.random()-.5)*20;a[i*3+1]=Math.random();a[i*3+2]=-Math.random()*12+2.5;sd[i]=Math.random()}
 b.setAttribute("position",new THREE.BufferAttribute(a,3));b.setAttribute("seed",new THREE.BufferAttribute(sd,1));return new THREE.Points(b,shader)}
var fl=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{t:U.t,amt:{value:1},pr:{value:R.getPixelRatio()},ptr:U.ptr,ps:U.ps},
 vertexShader:"uniform float t,amt,pr,ps;uniform vec3 ptr;attribute float seed;varying float s;varying float a;void main(){vec3 p=position;p.y=.35+seed*.5;p.x+=sin(t*1.3+p.x*.35+p.z*.2)*.08;vec2 d=p.xz-ptr.xz;p.xz+=normalize(d+1e-4)*ps*smoothstep(1.6,0.,length(d))*.4;s=seed;a=step(seed,amt);vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=(7.+seed*7.)*pr*(6./-mv.z);gl_Position=projectionMatrix*mv;}",
 fragmentShader:"varying float s;varying float a;void main(){float d=length(gl_PointCoord-.5);if(d>.5||a<.5)discard;vec3 c=s<.33?vec3(.98,.86,.3):s<.66?vec3(.72,.55,.95):vec3(1.,.97,.95);gl_FragColor=vec4(c*(1.-d*.6),1.);}"});
var flowers=pts(small?160:420,fl);S.add(flowers);
var lv=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{t:U.t,amt:{value:0},pr:{value:R.getPixelRatio()}},
 vertexShader:"uniform float t,pr;attribute float seed;varying float s;void main(){vec3 p=position;float life=fract(seed+t*.05*(.5+seed));p.y=4.5-life*5.;p.x+=sin(t*.8+seed*30.)*1.2*life+life*2.;p.z+=cos(t*.6+seed*9.)*.5;s=seed;vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=(10.+seed*10.)*pr*(6./-mv.z);gl_Position=projectionMatrix*mv;}",
 fragmentShader:"uniform float amt;varying float s;void main(){vec2 q=gl_PointCoord-.5;float d=abs(q.x)+abs(q.y)*1.6;if(d>.5)discard;vec3 c=mix(vec3(.85,.42,.12),vec3(.95,.72,.25),s);gl_FragColor=vec4(c,amt*(1.-d));}"});
var leaves=pts(small?60:140,lv);S.add(leaves);

var cur={};function target(name){var s=SEASONS[name];cur={base:new THREE.Color().fromArray(s.base),tip:new THREE.Color().fromArray(s.tip),fog:new THREE.Color().fromArray(s.fog),fl:s.flower,lv:s.leaves}}
target("spring");
window.GARDEN={season:function(n){target(n);if(RM)loop(performance.now())}};

var ray=new THREE.Raycaster(),m=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0),hit=new THREE.Vector3(),active=0;
function setP(e){var r=cv.getBoundingClientRect();m.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(m,C);if(ray.ray.intersectPlane(plane,hit)){U.ptr.value.copy(hit);active=1}}
cv.parentElement.addEventListener("pointermove",setP,{passive:true});cv.parentElement.addEventListener("pointerleave",function(){active=0});
cv.parentElement.addEventListener("pointerdown",function(e){setP(e);U.wind.value=2.4},{passive:true});
var baseY=1.9,lookY=.4;function layout(){var w=cv.clientWidth,h=cv.clientHeight;baseY=w<820?3.4:1.9;lookY=w<820?-.9:.4;R.setSize(w,h,false);C.aspect=w/h;C.fov=w<820?55:42;C.updateProjectionMatrix()}
addEventListener("resize",layout);layout();
var last=performance.now(),run=true,vis=true;
document.addEventListener("visibilitychange",function(){run=!document.hidden;if(run){last=performance.now();requestAnimationFrame(loop)}});
new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis&&run)requestAnimationFrame(loop)}).observe(cv);
function loop(now){if(!run||!vis)return;var dt=Math.min(.05,(now-last)/1000);last=now;var k=1-Math.exp(-dt*2.5);
 U.t.value=RM?1:now/1000;U.base.value.lerp(cur.base,RM?1:k);U.tip.value.lerp(cur.tip,RM?1:k);U.fogc.value.lerp(cur.fog,RM?1:k);
 fl.uniforms.amt.value+=(cur.fl-fl.uniforms.amt.value)*(RM?1:k);lv.uniforms.amt.value+=(cur.lv-lv.uniforms.amt.value)*(RM?1:k);
 U.ps.value+=((active?1:0)-U.ps.value)*Math.min(1,dt*5);U.wind.value+=(1-U.wind.value)*Math.min(1,dt*1.2);
 C.position.y=baseY-Math.min(1,scrollY/innerHeight)*.5;C.lookAt(0,lookY,-2);
 R.render(S,C);if(!RM)requestAnimationFrame(loop)}
requestAnimationFrame(loop);
})();
