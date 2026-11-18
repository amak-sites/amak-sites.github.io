(function(){
  var d = document, html = d.documentElement;
  html.classList.add("js");
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function(s, r){ return (r || d).querySelector(s); }, $$ = function(s, r){ return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  window.KG = { reduce: reduce, $: $, $$: $$ };

  /* offer link */
  var WA = "972539232024";
  $$("[data-offer]").forEach(function(a){ a.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent("היי אסתר, ראיתי את האתר לדוגמה של קו גמר (אתר עם כמה עמודים) ואני רוצה אתר כזה לעסק שלי"); });

  /* header offset + solid + mobile bar */
  var hdr = $(".hdr"), rib = $(".ribbon"), mbar = $("#mbar"), heroEl = $("#stage") || $(".phero");
  function onUI(){
    var top = Math.max(0, rib ? rib.getBoundingClientRect().bottom : 0);
    hdr.style.top = top + "px";
    hdr.classList.toggle("solid", heroEl ? heroEl.getBoundingClientRect().bottom < 90 : true);
    if (mbar) mbar.classList.toggle("on", scrollY > innerHeight * .5);
  }
  addEventListener("scroll", onUI, {passive:true}); addEventListener("resize", onUI); onUI();

  /* drawer */
  var dr = $("#drawer"), bg = $(".burger"), dx = dr && $(".x", dr);
  function setDrawer(on){ dr.classList.toggle("on", on); dr.setAttribute("aria-hidden", on ? "false" : "true"); bg.setAttribute("aria-expanded", on); d.body.style.overflow = on ? "hidden" : ""; if (on) dx.focus(); else bg.focus(); }
  if (dr){ bg.addEventListener("click", function(){ setDrawer(true); }); dx.addEventListener("click", function(){ setDrawer(false); });
    d.addEventListener("keydown", function(e){ if (e.key === "Escape" && dr.classList.contains("on")) setDrawer(false); }); }

  /* demo toast */
  var toast = $("#toast"), tt;
  window.KG.toast = function(msg){ if (msg) $("div", toast).innerHTML = msg; toast.classList.add("on"); clearTimeout(tt); tt = setTimeout(function(){ toast.classList.remove("on"); }, 4600); };
  var defMsg = $("div", toast).innerHTML;
  d.addEventListener("click", function(e){ var a = e.target.closest("[data-demo]"); if (!a) return; e.preventDefault(); window.KG.toast(defMsg); });

  /* reveals */
  if (!reduce && "IntersectionObserver" in window){
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.remove("pre"); io.unobserve(e.target); } }); }, {rootMargin:"0px 0px -8% 0px"});
    $$(".rv").forEach(function(el, i){ if (el.getBoundingClientRect().top > innerHeight * .92){ el.classList.add("pre"); el.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(el); } });
  }

  /* spotlight on cards */
  if (matchMedia("(hover:hover)").matches && !reduce){
    $$(".pcard").forEach(function(c){
      c.addEventListener("pointermove", function(e){ var r = c.getBoundingClientRect(), x = (e.clientX - r.left)/r.width, y = (e.clientY - r.top)/r.height;
        c.style.setProperty("--mx", x*100 + "%"); c.style.setProperty("--my", y*100 + "%");
        c.style.transform = "perspective(1000px) rotateY(" + ((x - .5) * 7) + "deg) rotateX(" + ((.5 - y) * 6) + "deg) translateY(-4px)"; });
      c.addEventListener("pointerleave", function(){ c.style.transform = ""; });
    });
  }

  /* before / after sliders */
  window.KG.initBA = function(ba){
    var btn = $("button", ba), drag = false;
    function setX(v){ v = Math.max(0, Math.min(100, v)); ba.style.setProperty("--x", v + "%"); btn.setAttribute("aria-valuenow", Math.round(v)); }
    function fromEv(e){ var r = ba.getBoundingClientRect(); setX((e.clientX - r.left) / r.width * 100); }
    ba.addEventListener("pointerdown", function(e){ drag = true; ba.setPointerCapture(e.pointerId); fromEv(e); });
    ba.addEventListener("pointermove", function(e){ if (drag) fromEv(e); });
    ba.addEventListener("pointerup", function(){ drag = false; });
    btn.addEventListener("keydown", function(e){ var v = parseFloat(getComputedStyle(ba).getPropertyValue("--x")) || 50;
      if (e.key === "ArrowLeft"){ setX(v - 5); e.preventDefault(); } if (e.key === "ArrowRight"){ setX(v + 5); e.preventDefault(); } });
    ba.sweep = function(){ if (reduce) return; var t0 = null; function sw(t){ if (t0 === null) t0 = t; var k = (t - t0)/1800; if (k < 1 && !drag){ setX(50 + Math.sin(k*Math.PI*2)*28); requestAnimationFrame(sw); } else if (!drag) setX(50); } requestAnimationFrame(sw); };
    if (!reduce && "IntersectionObserver" in window && !ba.closest(".modal")){ var o = new IntersectionObserver(function(es){ if (es[0].isIntersecting){ o.disconnect(); ba.sweep(); } }, {threshold:.6}); o.observe(ba); }
    return ba;
  };
  $$(".ba").forEach(window.KG.initBA);
})();
