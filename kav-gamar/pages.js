(function(){
  var $ = window.KG.$, $$ = window.KG.$$;

  /* ---------- services: time estimator ---------- */
  var opts = $("#opts");
  if (opts){
    var gantt = $("#gantt"), tot = $("#tot"), totl = $("#totl"), boxes = $$("input", opts), shown = -1;
    var defaults = ["bath", "kitchen"];
    boxes.forEach(function(b){ if (defaults.indexOf(b.value) > -1) b.checked = true; });
    function calc(){
      var sel = boxes.filter(function(b){ return b.checked; });
      var full = sel.some(function(b){ return b.value === "full"; });
      var rows = [], start = 0, total = 0;
      if (full){
        rows.push({n:"שיפוץ דירה מלא", s:0, w:8}); total = 8;
      } else {
        // phases overlap: each next job starts when the previous is ~2/3 done
        sel.forEach(function(b, i){ var w = +b.dataset.w; rows.push({n:b.dataset.n, s:start, w:w}); total = Math.max(total, start + w); start = start + Math.max(1, Math.round(w * .6)); });
      }
      var html = '<div class="scale">' + Array.apply(null, Array(10)).map(function(_, i){ return '<span class="mono">' + (i+1) + '</span>'; }).join("") + "</div>";
      if (!rows.length) html += '<div class="gempty">בחרו מה רוצים לשפץ</div>';
      rows.forEach(function(r, i){ html += '<div class="grow"><span class="gb" style="grid-column:' + (r.s+1) + ' / span ' + Math.min(10 - r.s, r.w) + ';animation-delay:' + (i*120) + 'ms">' + r.n + '</span></div>'; });
      gantt.innerHTML = html;
      animateNum(total);
      totl.textContent = total === 1 ? "שבוע, בערך" : "שבועות, בערך";
      if (full) boxes.forEach(function(b){ if (b.value !== "full") b.closest(".opt").style.opacity = .45; });
      else boxes.forEach(function(b){ b.closest(".opt").style.opacity = ""; });
      try { sessionStorage.setItem("kg-est", JSON.stringify(sel.map(function(b){ return b.dataset.n; }))); } catch(e){}
    }
    function animateNum(to){
      var from = shown < 0 ? 0 : shown; shown = to;
      if (window.KG.reduce){ tot.textContent = to; return; }
      var t0 = null; function st(t){ if (!t0) t0 = t; var k = Math.min(1, (t - t0)/600); tot.textContent = Math.round(from + (to - from) * (1 - Math.pow(1-k, 3))); if (k < 1) requestAnimationFrame(st); } requestAnimationFrame(st);
    }
    boxes.forEach(function(b){ b.addEventListener("change", calc); });
    calc();
  }

  /* ---------- projects: filter + modal ---------- */
  var pg = $("#pgrid");
  if (pg){
    var chips = $$("#filter .chip"), cards = $$(".pcard", pg);
    chips.forEach(function(c){ c.addEventListener("click", function(){
      chips.forEach(function(x){ x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
      var f = c.dataset.f; cards.forEach(function(k){ var on = f === "הכל" || k.dataset.cat === f; k.classList.toggle("out", !on); k.tabIndex = on ? 0 : -1; });
    }); });
    var modal = $("#modal"), mba = $(".ba", modal), lastF = null;
    function openP(i){
      var p = window.PROJECTS[i]; if (!p) return;
      lastF = document.activeElement;
      $("#mt").textContent = p.t; $("#mc").innerHTML = '<span class="l"></span>' + p.c + " · פרויקט לדוגמה";
      $("#mw").textContent = p.w; $("#mcity").textContent = p.c; $("#mcat").textContent = p.cat; $("#md").textContent = p.d;
      modal.classList.add("on"); document.body.style.overflow = "hidden"; $(".x", modal).focus();
      mba.style.setProperty("--x", "50%"); setTimeout(function(){ mba.sweep && mba.sweep(); }, 450);
      history.replaceState(null, "", "#p" + i);
    }
    function closeP(){ modal.classList.remove("on"); document.body.style.overflow = ""; history.replaceState(null, "", location.pathname); if (lastF) lastF.focus(); }
    cards.forEach(function(k){ k.addEventListener("click", function(){ openP(+k.dataset.p); }); });
    $(".x", modal).addEventListener("click", closeP);
    modal.addEventListener("click", function(e){ if (e.target === modal) closeP(); });
    document.addEventListener("keydown", function(e){ if (e.key === "Escape" && modal.classList.contains("on")) closeP(); });
    var m = /^#p(\d)$/.exec(location.hash); if (m) setTimeout(function(){ openP(+m[1]); }, 300);
  }

  /* ---------- contact: form -> WhatsApp message ---------- */
  var lf = $("#lf");
  if (lf){
    var fn = $("#fn"), fc = $("#fc"), fw = $("#fw"), fx = $("#fx"), pv = $("#pv"), fe = $("#fe"), kinds = $$("#fk .chip");
    try { var est = JSON.parse(sessionStorage.getItem("kg-est") || "[]"); kinds.forEach(function(k){ if (est.some(function(e){ return k.textContent.indexOf(e.split(" ")[0]) > -1 || e.indexOf(k.textContent.split(" ")[0]) > -1; })) k.setAttribute("aria-pressed", "true"); }); } catch(e){}
    kinds.forEach(function(k){ k.addEventListener("click", function(){ k.setAttribute("aria-pressed", k.getAttribute("aria-pressed") === "true" ? "false" : "true"); render(); }); });
    function render(){
      var ks = kinds.filter(function(k){ return k.getAttribute("aria-pressed") === "true"; }).map(function(k){ return k.textContent; });
      var name = fn.value.trim();
      var txt = "היי רועי" + (name ? ", כאן " + name : "") + ".\n" +
        "רוצה הצעה ל" + (ks.length ? ks.join(", ") : "שיפוץ") + " ב" + fc.value + ".\n" +
        "מתי: " + fw.value + "." + (fx.value.trim() ? "\n" + fx.value.trim() : "");
      pv.textContent = txt; return txt;
    }
    [fn, fc, fw, fx].forEach(function(el){ el.addEventListener("input", render); el.addEventListener("change", render); });
    render();
    lf.addEventListener("submit", function(e){
      e.preventDefault();
      if (!fn.value.trim()){ fe.textContent = "כתבו שם, כדי שרועי ידע למי הוא עונה."; fn.focus(); return; }
      fe.textContent = "";
      window.KG.toast("זה אתר לדוגמה. באתר שלכם הכפתור הזה פותח את ההודעה בוואטסאפ שלכם, מוכנה לשליחה. <a href=\"#offer\">למחיר ותנאים</a>");
    });
    var day = new Date().getDay();
    $$("#hours div").forEach(function(r){ if (r.dataset.d.split(",").indexOf(String(day)) > -1) r.classList.add("now"); });
  }
})();
