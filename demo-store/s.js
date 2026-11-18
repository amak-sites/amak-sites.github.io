(function(){
"use strict";
var d=document,$=function(s,r){return(r||d).querySelector(s)},$$=function(s,r){return[].slice.call((r||d).querySelectorAll(s))};
var RM=matchMedia("(prefers-reduced-motion: reduce)").matches,HOVER=matchMedia("(hover:hover)").matches;
var SHIP_FREE=250,SHIP=30;
var ils=function(n){return n.toLocaleString("he-IL")+" ₪"};

/* ---------- art ---------- */
var ART={
 voucher:'<svg viewBox="0 0 200 140"><defs><linearGradient id="vg" x1="0" x2="1"><stop offset="0" stop-color="#f6e7d1"/><stop offset=".5" stop-color="#e8cfa9"/><stop offset="1" stop-color="#f3dfc2"/></linearGradient></defs><rect x="14" y="22" width="172" height="104" rx="14" fill="url(#vg)" transform="rotate(-6 100 74)"/><g transform="rotate(-6 100 74)"><circle cx="40" cy="110" r="34" fill="none" stroke="#7a5640" stroke-opacity=".35"/><rect x="96" y="44" width="70" height="8" rx="4" fill="#2a1a0f" opacity=".75"/><rect x="120" y="60" width="46" height="5" rx="2.5" fill="#7a5640" opacity=".5"/><rect x="110" y="96" width="58" height="6" rx="3" fill="#7a5640" opacity=".35"/><path d="M30 22v104" stroke="#c98545" stroke-width="6" opacity=".7"/></g></svg>',
 stones:'<svg viewBox="0 0 200 140"><ellipse cx="100" cy="112" rx="70" ry="22" fill="#2a1d14"/><ellipse cx="100" cy="106" rx="66" ry="20" fill="#4a382c"/><ellipse cx="100" cy="80" rx="48" ry="16" fill="#2a1d14"/><ellipse cx="100" cy="75" rx="45" ry="14" fill="#5b4a40"/><ellipse cx="100" cy="54" rx="30" ry="11" fill="#2a1d14"/><ellipse cx="100" cy="50" rx="28" ry="9" fill="#6a564a"/><ellipse cx="92" cy="47" rx="10" ry="3" fill="#fff" opacity=".12"/><path d="M84 36c-6-8 6-12 0-22M100 34c-6-8 6-12 0-22M116 36c-6-8 6-12 0-22" stroke="#efe3d2" stroke-opacity=".35" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
 pack:'<svg viewBox="0 0 200 140"><g fill="#e8cfa9"><rect x="44" y="40" width="120" height="78" rx="10" transform="rotate(8 104 79)" opacity=".5"/><rect x="40" y="36" width="120" height="78" rx="10" transform="rotate(3 100 75)" opacity=".75"/><rect x="36" y="32" width="120" height="78" rx="10"/></g><g fill="#7a5640"><circle cx="60" cy="88" r="7"/><circle cx="80" cy="88" r="7"/><circle cx="100" cy="88" r="7" fill-opacity=".3"/><circle cx="120" cy="88" r="7" fill-opacity=".3"/><circle cx="140" cy="88" r="7" fill-opacity=".3"/></g><text x="146" y="62" font-family="Bellefair,serif" font-size="18" fill="#2a1a0f" text-anchor="end">כרטיסייה</text></svg>',
 couple:'<svg viewBox="0 0 200 140"><ellipse cx="100" cy="116" rx="80" ry="12" fill="#000" opacity=".35"/><rect x="26" y="78" width="70" height="26" rx="8" fill="#efe3d2"/><rect x="104" y="78" width="70" height="26" rx="8" fill="#efe3d2"/><rect x="30" y="102" width="6" height="14" fill="#7a5640"/><rect x="86" y="102" width="6" height="14" fill="#7a5640"/><rect x="108" y="102" width="6" height="14" fill="#7a5640"/><rect x="164" y="102" width="6" height="14" fill="#7a5640"/><circle cx="100" cy="44" r="14" fill="#ffd7a8"/><circle cx="100" cy="44" r="30" fill="#ffd7a8" opacity=".15"/></svg>',
 bottle:'<svg viewBox="0 0 200 140"><ellipse cx="100" cy="126" rx="40" ry="7" fill="#000" opacity=".35"/><rect x="88" y="14" width="24" height="16" rx="3" fill="#2a1d14"/><path d="M80 34h40v8c10 6 14 14 14 26v50c0 5-4 8-8 8H74c-4 0-8-3-8-8V68c0-12 4-20 14-26z" fill="#c98545" opacity=".9"/><path d="M80 34h40v8c10 6 14 14 14 26v50c0 5-4 8-8 8H74c-4 0-8-3-8-8V68c0-12 4-20 14-26z" fill="none" stroke="#ffd7a8" stroke-opacity=".5"/><rect x="74" y="70" width="52" height="34" rx="4" fill="#efe3d2"/><path d="M90 84c4-8 16-8 20 0-4 8-16 8-20 0z" fill="#9a7fb8"/><rect x="72" y="40" width="6" height="80" rx="3" fill="#fff" opacity=".25"/></svg>',
 bottle2:'<svg viewBox="0 0 200 140"><ellipse cx="100" cy="126" rx="40" ry="7" fill="#000" opacity=".35"/><rect x="90" y="10" width="20" height="22" rx="3" fill="#2a1d14"/><rect x="72" y="32" width="56" height="88" rx="12" fill="#8a5a2c"/><rect x="72" y="32" width="56" height="88" rx="12" fill="none" stroke="#ffd7a8" stroke-opacity=".4"/><rect x="78" y="62" width="44" height="36" rx="4" fill="#efe3d2"/><circle cx="100" cy="80" r="9" fill="#e9a663"/><rect x="76" y="38" width="6" height="76" rx="3" fill="#fff" opacity=".2"/></svg>',
 candle:'<svg viewBox="0 0 200 140"><ellipse cx="100" cy="124" rx="52" ry="9" fill="#000" opacity=".35"/><path d="M58 70h84v48c0 4-4 6-8 6H66c-4 0-8-2-8-6z" fill="#efe3d2"/><ellipse cx="100" cy="70" rx="42" ry="10" fill="#e8cfa9"/><ellipse cx="100" cy="70" rx="34" ry="7" fill="#d9b78a"/><path d="M100 64v-8" stroke="#2a1d14" stroke-width="2"/><path d="M100 56c-7-8-2-18 0-24 2 6 7 16 0 24z" fill="#ffd7a8"/><circle cx="100" cy="46" r="22" fill="#ffd7a8" opacity=".14"/><rect x="62" y="92" width="76" height="14" fill="#c98545" opacity=".5"/></svg>',
 pillow:'<svg viewBox="0 0 200 140"><ellipse cx="100" cy="122" rx="70" ry="10" fill="#000" opacity=".35"/><path d="M30 64c0-20 40-28 70-28s70 8 70 28v26c0 20-40 26-70 26S30 110 30 90z" fill="#7a5640"/><path d="M30 64c0-20 40-28 70-28s70 8 70 28" fill="none" stroke="#ffd7a8" stroke-opacity=".35"/><g stroke="#efe3d2" stroke-opacity=".25" stroke-dasharray="3 5"><path d="M70 40v74M100 36v80M130 40v74"/></g><path d="M80 30c-4-6 4-9 0-16M100 28c-4-6 4-9 0-16M120 30c-4-6 4-9 0-16" stroke="#efe3d2" stroke-opacity=".35" stroke-width="3" fill="none" stroke-linecap="round"/></svg>'
};
var P=[
 {id:"v-swedish",cat:"שוברים",art:"voucher",n:"שובר עיסוי שוודי",d:"עיסוי מרגיע לכל הגוף, אצלם בבית. אני מגיעה עם מיטה, שמנים ומוזיקה.",o:[["60 דקות",320],["90 דקות",440]],v:1,badge:"הכי נמכר"},
 {id:"v-deep",cat:"שוברים",art:"voucher",n:"שובר רקמות עמוק",d:"לגב, לכתפיים ולצוואר שסוחבים יותר מדי.",o:[["60 דקות",360],["90 דקות",480]],v:1},
 {id:"v-stones",cat:"שוברים",art:"stones",n:"שובר אבנים חמות",d:"אבני בזלת חמות לאורך הגב, וחום שנכנס עמוק לשרירים.",o:[["90 דקות",460]],v:1},
 {id:"v-open",cat:"שוברים",art:"voucher",n:"שובר בסכום פתוח",d:"הם בוחרים את הטיפול. אתם בוחרים את הסכום.",o:[["200 ₪",200],["300 ₪",300],["500 ₪",500]],v:1},
 {id:"p-5",cat:"חבילות",art:"pack",n:"כרטיסייה - 5 טיפולים",d:"חמישה טיפולים של 60 דקות, לנצל בתוך חצי שנה.",o:[["5 × 60 דקות",1450]],was:1600},
 {id:"p-couple",cat:"חבילות",art:"couple",n:"ערב זוגי בבית",d:"שתי מטפלות, שתי מיטות, טיפול במקביל בסלון שלכם.",o:[["60 דקות",760],["90 דקות",980]],badge:"חדש"},
 {id:"p-mom",cat:"חבילות",art:"pack",n:"אחרי לידה - 3 טיפולים",d:"שלושה טיפולים עדינים בשבועות הראשונים, בבית.",o:[["3 × 60 דקות",990]]},
 {id:"o-lav",cat:"מוצרים",art:"bottle",n:"שמן עיסוי לבנדר",d:"100 מ\"ל. השמן שאני משתמשת בו בטיפולים המרגיעים.",o:[["100 מ\"ל",89]],ph:1},
 {id:"o-arn",cat:"מוצרים",art:"bottle2",n:"שמן ארניקה לשרירים",d:"100 מ\"ל. לעיסוי עצמי אחרי ריצה או יום ארוך.",o:[["100 מ\"ל",95]],ph:1},
 {id:"candle",cat:"מוצרים",art:"candle",n:"נר עיסוי חם",d:"נר שנמס לשמן חמים. מדליקים, מחכים 10 דקות, ומעסים.",o:[["180 גרם",79]],ph:1},
 {id:"pillow",cat:"מוצרים",art:"pillow",n:"כרית חימום מזרעים",d:"מחממים במיקרו 90 שניות ומניחים על הצוואר.",o:[["כרית צוואר",129]],ph:1}
];
var byId={};P.forEach(function(p){byId[p.id]=p});
window.SH={P:P,ART:ART,byId:byId,ils:ils};

/* ---------- cart ---------- */
var mem=[];
function load(){try{var s=localStorage.getItem("shiran-cart");return s?JSON.parse(s):mem}catch(e){return mem}}
function save(c){mem=c;try{localStorage.setItem("shiran-cart",JSON.stringify(c))}catch(e){}renderCount();renderDrawer();d.dispatchEvent(new Event("cart"))}
function cart(){return load()}
function key(it){return it.id+"|"+it.oi+"|"+(it.to||"")+"|"+(it.from||"")}
function add(it){var c=cart(),k=key(it),f=c.find(function(x){return key(x)===k});if(f)f.q+=it.q||1;else{it.q=it.q||1;c.push(it)}save(c)}
function lineTotal(x){return byId[x.id].o[x.oi][1]*x.q}
function totals(c){var sub=c.reduce(function(s,x){return s+lineTotal(x)},0);var phys=c.some(function(x){return byId[x.id].ph});var physSub=c.filter(function(x){return byId[x.id].ph}).reduce(function(s,x){return s+lineTotal(x)},0);
 var ship=phys&&physSub<SHIP_FREE?SHIP:0;return{sub:sub,ship:ship,total:sub+ship,phys:phys,physSub:physSub,n:c.reduce(function(s,x){return s+x.q},0)}}
window.SH.cart=cart;window.SH.save=save;window.SH.add=add;window.SH.totals=totals;window.SH.lineTotal=lineTotal;

/* ---------- header count ---------- */
function renderCount(){var t=totals(cart());$$(".cartbtn .n").forEach(function(n){n.textContent=t.n;n.classList.toggle("on",t.n>0)})}

/* ---------- drawer ---------- */
var dr=$("#drawer"),scrim=$("#scrim"),lastF=null;
function lineHTML(x,i,ctrl){var p=byId[x.id],o=p.o[x.oi];
 return '<div class="line"><span class="th">'+ART[p.art]+'</span><div><b>'+p.n+'</b><small>'+o[0]+(x.to?" · ל"+esc(x.to):"")+'</small>'+
 (ctrl?'<div class="qty"><button type="button" data-q="'+i+'" data-d="-1" aria-label="פחות">−</button><span>'+x.q+'</span><button type="button" data-q="'+i+'" data-d="1" aria-label="עוד">+</button></div>':'<small>כמות: '+x.q+'</small>')+
 '</div><span class="lp">'+ils(lineTotal(x))+'</span></div>'}
window.SH.lineHTML=lineHTML;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
window.SH.esc=esc;
function renderDrawer(){if(!dr)return;var c=cart(),t=totals(c),b=$(".dbody",dr),f=$(".dfoot",dr);
 if(!c.length){b.innerHTML='<div class="empty">'+ART.stones+'<p>הסל ריק. שובר מתנה הוא התחלה טובה.</p></div>';f.hidden=true;return}
 f.hidden=false;var html="";
 if(t.phys){var left=Math.max(0,SHIP_FREE-t.physSub);html+='<div class="ship">'+(left?'עוד <b>'+ils(left)+'</b> במוצרים ומקבלים משלוח חינם':'יש לכם משלוח חינם')+'<div class="bar"><i style="width:'+Math.min(100,t.physSub/SHIP_FREE*100)+'%"></i></div></div>'}
 html+=c.map(function(x,i){return lineHTML(x,i,true)}).join("");b.innerHTML=html;
 $(".tot b",f).textContent=ils(t.total);$(".tot small",f).textContent=t.ship?"כולל משלוח "+ils(t.ship):"";}
function openD(){lastF=d.activeElement;dr.classList.add("on");scrim.classList.add("on");dr.setAttribute("aria-hidden","false");$(".x",dr).focus()}
function closeD(){dr.classList.remove("on");scrim.classList.remove("on");dr.setAttribute("aria-hidden","true");if(lastF)lastF.focus()}
window.SH.openD=openD;
if(dr){$$(".cartbtn").forEach(function(b){b.addEventListener("click",openD)});$(".x",dr).addEventListener("click",closeD);scrim.addEventListener("click",function(){closeD();closeM&&closeM()});
 dr.addEventListener("click",function(e){var q=e.target.closest("[data-q]");if(!q)return;var c=cart(),i=+q.dataset.q;c[i].q+=+q.dataset.d;if(c[i].q<=0)c.splice(i,1);save(c)});
 d.addEventListener("keydown",function(e){if(e.key==="Escape"&&dr.classList.contains("on"))closeD()})}

/* ---------- fly to cart ---------- */
window.SH.fly=function(fromEl){var cb=$(".cartbtn");if(!cb)return;if(RM||!fromEl){cb.classList.add("bump");setTimeout(function(){cb.classList.remove("bump")},600);return}
 var a=fromEl.getBoundingClientRect(),b=cb.getBoundingClientRect(),f=d.createElement("div");f.className="fly";d.body.appendChild(f);
 var x0=a.left+a.width/2-27,y0=a.top+a.height/2-27,x1=b.left+b.width/2-27,y1=b.top+b.height/2-27,t0=null;
 function st(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/750),e=1-Math.pow(1-k,3);var x=x0+(x1-x0)*e,y=y0+(y1-y0)*e-Math.sin(k*Math.PI)*120;
  f.style.transform="translate("+x+"px,"+y+"px) scale("+(1-k*.6)+")";if(k<1)requestAnimationFrame(st);else{f.remove();cb.classList.add("bump");setTimeout(function(){cb.classList.remove("bump")},600)}}
 requestAnimationFrame(st)};

/* ---------- toast + demo links ---------- */
var toast=$("#toast"),tt;
window.SH.toast=function(h){toast.innerHTML=h;toast.classList.add("on");clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove("on")},5200)};
d.addEventListener("click",function(e){var a=e.target.closest("[data-demo]");if(!a)return;e.preventDefault();window.SH.toast('זה אתר לדוגמה. באתר שלכם הכפתור הזה פותח וואטסאפ או חיוג ישירות אליכם. <a href="index.html#offer">רוצים חנות כזו?</a>')});
$$("[data-offer]").forEach(function(a){a.href="https://wa.me/972539232024?text="+encodeURIComponent("היי אסתר, ראיתי את החנות לדוגמה של שירן ואני רוצה חנות כזו לעסק שלי")});

/* ---------- reveal + tilt ---------- */
if("IntersectionObserver" in window&&!RM){var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}})},{threshold:.12});
 window.SH.reveal=function(r){$$(".rv:not(.in)",r).forEach(function(el){io.observe(el)})}}else{window.SH.reveal=function(r){$$(".rv",r).forEach(function(el){el.classList.add("in")})}}
window.SH.reveal();
window.SH.tilt=function(el,amt){if(!HOVER||RM)return;amt=amt||7;el.addEventListener("pointermove",function(e){var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
 el.style.setProperty("--mx",x*100+"%");el.style.setProperty("--my",y*100+"%");el.style.setProperty("--sh",(x*80-40)+"%");el.style.transform="perspective(1000px) rotateY("+((x-.5)*amt)+"deg) rotateX("+((.5-y)*amt*.8)+"deg) translateY(-4px)"});
 el.addEventListener("pointerleave",function(){el.style.transform=""})};

/* ---------- product modal (shop + home) ---------- */
var modal=$("#modal"),closeM=null,cur=null;
if(modal){
 var mv=$(".mvis",modal),mf=$(".mform",modal);
 function openM(id){var p=byId[id];cur={p:p,oi:0};lastF=d.activeElement;
  var opts=p.o.map(function(o,i){return'<button type="button" class="opt" data-oi="'+i+'" aria-pressed="'+(i?"false":"true")+'">'+o[0]+" · "+ils(o[1])+'</button>'}).join("");
  mf.innerHTML='<span class="k">'+p.cat+'</span><h2 id="mt">'+p.n+'</h2><p class="mute">'+p.d+'</p><div class="opts" role="group" aria-label="אפשרות">'+opts+'</div>'+
  (p.v?'<div class="row2"><label class="fl"><span>למי השובר</span><input id="vto" maxlength="22" placeholder="שם המקבל/ת"></label><label class="fl"><span>ממי</span><input id="vfrom" maxlength="22" placeholder="השם שלכם"></label></div><label class="fl"><span>הקדשה (לא חובה)</span><textarea id="vmsg" maxlength="90" placeholder="מגיע לך רגע רק בשבילך"></textarea></label><label class="fl"><span>איך לשלוח</span><select id="vdel"><option>בוואטסאפ, מעוצב כמו כאן</option><option>במייל</option><option>מודפס, במעטפה</option></select></label>':"")+
  '<div class="priceRow"><span class="price" id="mp"></span><button class="btn pri" type="button" id="madd">להוסיף לסל</button></div><p class="illus">המחירים והמוצרים להמחשה בלבד.</p>';
  mv.innerHTML=p.v?'<div class="voucher" id="vc"><div class="vt"><span>שובר מתנה</span><span>שירן · טיפולי מגע</span></div><div><div class="vn" id="vcn">'+p.n.replace("שובר ","")+'</div><div class="vto" id="vct">ל...</div><div class="vmsg" id="vcm"></div></div><div class="vb"><span id="vcf">באהבה</span><b id="vcp"></b></div></div>':'<div style="width:min(340px,90%)">'+ART[p.art]+'</div>';
  if(p.v){var vc=$("#vc");window.SH.tilt(vc,14);["vto","vfrom","vmsg"].forEach(function(i){$("#"+i).addEventListener("input",upd)})}
  $$(".opt",mf).forEach(function(b){b.addEventListener("click",function(){$$(".opt",mf).forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false")});cur.oi=+b.dataset.oi;upd()})});
  $("#madd").addEventListener("click",function(e){var it={id:p.id,oi:cur.oi,q:1};if(p.v){it.to=$("#vto").value.trim();it.from=$("#vfrom").value.trim();it.msg=$("#vmsg").value.trim();it.del=$("#vdel").value}
   add(it);window.SH.fly(e.currentTarget);setTimeout(function(){closeM();setTimeout(openD,350)},500)});
  upd();modal.classList.add("on");modal.setAttribute("aria-hidden","false");d.body.style.overflow="hidden";$(".mclose",modal).focus()}
 function upd(){var p=cur.p,o=p.o[cur.oi];$("#mp").textContent=ils(o[1]);if(p.v){var to=$("#vto").value.trim(),fr=$("#vfrom").value.trim(),m=$("#vmsg").value.trim();
  $("#vct").textContent=to?"ל"+to:"ל...";$("#vcf").textContent=fr?"באהבה, "+fr:"באהבה";$("#vcm").textContent=m;$("#vcp").textContent=p.id==="v-open"?ils(o[1]):o[0]}}
 closeM=function(){if(!modal.classList.contains("on"))return;modal.classList.remove("on");modal.setAttribute("aria-hidden","true");d.body.style.overflow="";if(lastF)lastF.focus()};
 $(".mclose",modal).addEventListener("click",closeM);modal.addEventListener("click",function(e){if(e.target===modal)closeM()});
 d.addEventListener("keydown",function(e){if(e.key==="Escape")closeM()});
 window.SH.openM=openM;
}

/* ---------- product grid ---------- */
window.SH.cardHTML=function(p){var o=p.o[0];return'<button type="button" class="card rv" data-id="'+p.id+'" data-cat="'+p.cat+'">'+(p.badge?'<span class="badge">'+p.badge+'</span>':"")+
 '<span class="art">'+ART[p.art]+'</span><span class="meta"><h3>'+p.n+'</h3><p>'+p.d+'</p><span class="priceRow"><span class="price">'+(p.o.length>1?"מ-":"")+ils(o[1])+(p.was?"<s>"+ils(p.was)+"</s>":"")+'</span><span class="add" aria-hidden="true">'+(p.v?"לעצב שובר":"לפרטים")+'</span></span></span></button>'};
window.SH.bindCards=function(root){$$(".card",root).forEach(function(c){window.SH.tilt(c,6);c.addEventListener("click",function(){window.SH.openM(c.dataset.id)})})};

renderCount();renderDrawer();
})();
