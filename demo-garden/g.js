(function(){
"use strict";
var d=document,$=function(s,r){return(r||d).querySelector(s)},$$=function(s,r){return[].slice.call((r||d).querySelectorAll(s))};
var RM=matchMedia("(prefers-reduced-motion: reduce)").matches,HOVER=matchMedia("(hover:hover)").matches;
var SHIP_FREE=250,SHIP=30;
var ils=function(n){return n.toLocaleString("he-IL")+" ₪"};

/* ---------- art ---------- */
var ART={
 voucher:'<svg viewBox="0 0 200 140"><defs><linearGradient id="vg" x1="0" x2="1"><stop offset="0" stop-color="#f1f6e6"/><stop offset=".5" stop-color="#d6e8b8"/><stop offset="1" stop-color="#eef4df"/></linearGradient></defs><g transform="rotate(-6 100 74)"><rect x="14" y="22" width="172" height="104" rx="14" fill="url(#vg)"/><path d="M30 22v104" stroke="#7fae35" stroke-width="6" opacity=".8"/><rect x="96" y="44" width="70" height="8" rx="4" fill="#163a1c" opacity=".8"/><rect x="120" y="60" width="46" height="5" rx="2.5" fill="#4d7a1f" opacity=".6"/><path d="M60 112c0-22 14-34 30-38-4 16-14 30-30 38zM60 112c-6-16-2-30 10-38 2 14-2 28-10 38z" fill="#7fae35"/></g></svg>',
 pot:'<svg viewBox="0 0 200 140"><ellipse cx="100" cy="128" rx="44" ry="7" fill="#000" opacity=".35"/><path d="M72 86h56l-8 40H80z" fill="#b5683d"/><rect x="68" y="80" width="64" height="10" rx="4" fill="#c97a4a"/><path d="M100 80c0-26-10-42-28-48 4 22 12 38 28 48zM100 80c2-28 14-46 34-52-2 24-14 42-34 52zM100 80V40" stroke="#163a1c" stroke-width="2" fill="#7fae35"/><g fill="#9a7fc8"><circle cx="86" cy="34" r="4"/><circle cx="92" cy="26" r="4"/><circle cx="112" cy="30" r="4"/><circle cx="118" cy="22" r="4"/></g></svg>',
 tree:'<svg viewBox="0 0 200 140"><ellipse cx="100" cy="128" rx="44" ry="7" fill="#000" opacity=".35"/><path d="M80 98h40l-6 28H86z" fill="#5b4a3a"/><rect x="97" y="54" width="6" height="46" fill="#6b4a2a"/><circle cx="100" cy="46" r="30" fill="#5f8f2c"/><circle cx="82" cy="54" r="18" fill="#7fae35"/><circle cx="120" cy="52" r="20" fill="#6c9e30"/><g fill="#f2d24a"><circle cx="90" cy="40" r="5"/><circle cx="114" cy="58" r="5"/><circle cx="104" cy="32" r="5"/></g></svg>',
 herbs:'<svg viewBox="0 0 200 140"><ellipse cx="100" cy="128" rx="70" ry="7" fill="#000" opacity=".35"/><g fill="#c97a4a"><path d="M36 96h36l-5 30H41z"/><path d="M82 96h36l-5 30H87z"/><path d="M128 96h36l-5 30h-26z"/></g><g fill="#7fae35"><circle cx="54" cy="82" r="16"/><circle cx="100" cy="78" r="18"/><circle cx="146" cy="82" r="15"/></g><g fill="#a6d45a"><circle cx="46" cy="76" r="8"/><circle cx="108" cy="70" r="9"/><circle cx="152" cy="74" r="7"/></g></svg>',
 seeds:'<svg viewBox="0 0 200 140"><ellipse cx="100" cy="128" rx="40" ry="7" fill="#000" opacity=".35"/><path d="M66 20h68l-4 106H70z" fill="#eef4df"/><rect x="66" y="20" width="68" height="16" fill="#4d7a1f"/><circle cx="100" cy="74" r="20" fill="#f2d24a"/><g fill="#7fae35"><path d="M100 104c-2-12 2-20 10-24 0 10-4 18-10 24z"/></g><rect x="78" y="108" width="44" height="6" rx="3" fill="#163a1c" opacity=".5"/></svg>',
 bag:'<svg viewBox="0 0 200 140"><ellipse cx="100" cy="128" rx="48" ry="8" fill="#000" opacity=".35"/><path d="M58 30h84l6 94H52z" fill="#6b4a2a"/><path d="M58 30c10 8 74 8 84 0" stroke="#3d2a18" stroke-width="3" fill="none"/><rect x="68" y="56" width="64" height="44" rx="6" fill="#eef4df"/><path d="M100 92c-2-14 4-24 14-28 0 12-6 22-14 28zM100 92c-8-10-8-20-2-28 4 10 6 20 2 28z" fill="#7fae35"/></svg>',
 drip:'<svg viewBox="0 0 200 140"><ellipse cx="100" cy="126" rx="70" ry="8" fill="#000" opacity=".35"/><path d="M24 92c40-20 112 20 152 0" stroke="#1d2a20" stroke-width="7" fill="none" stroke-linecap="round"/><g fill="#5fb0e0"><path d="M60 100c0 5-6 8-6 12a6 6 0 0 0 12 0c0-4-6-7-6-12z"/><path d="M100 104c0 5-6 8-6 12a6 6 0 0 0 12 0c0-4-6-7-6-12z"/><path d="M140 100c0 5-6 8-6 12a6 6 0 0 0 12 0c0-4-6-7-6-12z"/></g><circle cx="150" cy="40" r="20" fill="#163a1c" stroke="#b8e05a" stroke-width="3"/><path d="M150 40l8-10" stroke="#b8e05a" stroke-width="3"/></svg>',
 shears:'<svg viewBox="0 0 200 140"><ellipse cx="100" cy="126" rx="50" ry="7" fill="#000" opacity=".35"/><path d="M100 70l40-44c6-6 14 2 8 8L108 78z" fill="#c9d3c4"/><path d="M100 70l-40-44c-6-6-14 2-8 8L92 78z" fill="#a9b5a4"/><circle cx="100" cy="74" r="7" fill="#1d2a20"/><path d="M92 78l-30 40c-4 6 4 12 10 8l30-40zM108 78l30 40c4 6-4 12-10 8l-30-40z" fill="#b8e05a"/></svg>'
};
var P=[
 {id:"v-garden",cat:"שוברים",art:"voucher",n:"שובר גינה במתנה",d:"ביקור גינון בבית שלהם, או עיצוב פינה ירוקה מאפס.",o:[["ביקור גינון, שעתיים",390],["עיצוב פינת גינה",1200]],v:1,badge:"מתנה"},
 {id:"v-open",cat:"שוברים",art:"voucher",n:"שובר בסכום פתוח",d:"לשתילים, לכלים או לשירות. הם בוחרים.",o:[["200 ₪",200],["300 ₪",300],["500 ₪",500]],v:1},
 {id:"olive",cat:"צמחים",art:"tree",n:"עץ זית צעיר",d:"בעציץ 25 ליטר, מוכן לשתילה. עמיד ליובש.",o:[["עציץ 25 ליטר",149]],ph:1,badge:"הכי נמכר"},
 {id:"lemon",cat:"צמחים",art:"tree",n:"לימון בעציץ",d:"לימון ארבע עונות, מניב כבר בשנה הראשונה.",o:[["עציץ 20 ליטר",189]],ph:1},
 {id:"lavender",cat:"צמחים",art:"pot",n:"לבנדר",d:"פורח באביב ובקיץ, מושך פרפרים ודבורים.",o:[["עציץ 3 ליטר",39],["מגש 6 עציצים",199]],ph:1},
 {id:"herbs",cat:"צמחים",art:"herbs",n:"ערכת תבלינים",d:"נענע, בזיליקום, רוזמרין, טימין, פטרוזיליה וקורנית.",o:[["6 עציצים",119]],ph:1},
 {id:"drip",cat:"לגינה",art:"drip",n:"ערכת טפטוף עם מחשב",d:"מחשב השקיה, 20 מטר צינור ו-30 טפטפות. התקנה ב-20 דקות.",o:[["ערכה",169]],ph:1},
 {id:"compost",cat:"לגינה",art:"bag",n:"קומפוסט אורגני",d:"שק 25 ליטר. מערבבים באדמה לפני שתילה.",o:[["25 ליטר",59]],ph:1},
 {id:"seeds",cat:"לגינה",art:"seeds",n:"זרעי פרחי בר",d:"תערובת לפינה פורחת. זורעים בסתיו, פורח באביב.",o:[["שקית",25]],ph:1},
 {id:"shears",cat:"לגינה",art:"shears",n:"מזמרה מקצועית",d:"המזמרה שאני עובד איתה כל יום. להב מוחלף.",o:[["מזמרה",129]],ph:1}
];
var byId={};P.forEach(function(p){byId[p.id]=p});
window.SH={P:P,ART:ART,byId:byId,ils:ils};

/* ---------- cart ---------- */
var mem=[];
function load(){try{var s=localStorage.getItem("ganan-cart");return s?JSON.parse(s):mem}catch(e){return mem}}
function save(c){mem=c;try{localStorage.setItem("ganan-cart",JSON.stringify(c))}catch(e){}renderCount();renderDrawer();d.dispatchEvent(new Event("cart"))}
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
 if(!c.length){b.innerHTML='<div class="empty">'+ART.pot+'<p>הסל ריק. עץ זית צעיר הוא התחלה טובה.</p></div>';f.hidden=true;return}
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
d.addEventListener("click",function(e){var a=e.target.closest("[data-demo]");if(!a)return;e.preventDefault();window.SH.toast('זה אתר לדוגמה. באתר שלכם הכפתור הזה פותח וואטסאפ או חיוג ישירות אליכם. <a href="index.html#offer">רוצים אתר כזה?</a>')});
$$("[data-offer]").forEach(function(a){a.href="https://wa.me/972539232024?text="+encodeURIComponent("היי אסתר, ראיתי את האתר לדוגמה של יואב גינון (אתר מלא עם בלוג וחנות) ואני רוצה אתר כזה לעסק שלי")});

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
  (p.v?'<div class="row2"><label class="fl"><span>למי השובר</span><input id="vto" maxlength="22" placeholder="שם המקבל/ת"></label><label class="fl"><span>ממי</span><input id="vfrom" maxlength="22" placeholder="השם שלכם"></label></div><label class="fl"><span>הקדשה (לא חובה)</span><textarea id="vmsg" maxlength="90" placeholder="שתצמח לך פינה ירוקה"></textarea></label><label class="fl"><span>איך לשלוח</span><select id="vdel"><option>בוואטסאפ, מעוצב כמו כאן</option><option>במייל</option><option>מודפס, עם עציץ קטן</option></select></label>':"")+
  '<div class="priceRow"><span class="price" id="mp"></span><button class="btn pri" type="button" id="madd">להוסיף לסל</button></div><p class="illus">המחירים והמוצרים להמחשה בלבד.</p>';
  mv.innerHTML=p.v?'<div class="voucher" id="vc"><div class="vt"><span>שובר מתנה</span><span>יואב גינון</span></div><div><div class="vn" id="vcn">'+p.n.replace("שובר ","")+'</div><div class="vto" id="vct">ל...</div><div class="vmsg" id="vcm"></div></div><div class="vb"><span id="vcf">באהבה</span><b id="vcp"></b></div></div>':'<div style="width:min(340px,90%)">'+ART[p.art]+'</div>';
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
 '<span class="art">'+ART[p.art]+'</span><span class="meta"><h3>'+p.n+'</h3><p>'+p.d+'</p><span class="priceRow"><span class="price">'+(p.o.length>1?"מ-":"")+ils(o[1])+(p.was?"<s>"+ils(p.was)+"</s>":"")+'</span><span class="add" aria-hidden="true">'+(p.v?"לעצב שובר":"להוספה")+'</span></span></span></button>'};
window.SH.bindCards=function(root){$$(".card",root).forEach(function(c){window.SH.tilt(c,6);c.addEventListener("click",function(){window.SH.openM(c.dataset.id)})})};

renderCount();renderDrawer();
})();
