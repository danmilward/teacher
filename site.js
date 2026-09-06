(function(){
  var THEMES = [
    {id:'terminal', label:'Terminal'},
    {id:'paper',    label:'Paper'},
    {id:'white',    label:'Clean white'},
    {id:'github',   label:'GitHub'}
  ];
  var PAGES = [
    {href:'index.html',           label:'Home'},
    {href:'story-card-game.html', label:'Story card game'},
    {href:'fathers-day.html',     label:"Writing for Father's Day"},
    {href:'quarter-past.html',    label:'Analog to Digital (First Worksheet)'},
    {href:'analog-to-digital.html', label:'Digital Time in Quarter Hours'},
    {href:'digital-to-analog.html', label:'Going from Digital to Analog'},
    {href:'oclock-matching.html',   label:'Time Matching Games'},
    {href:'tick-tock.html',         label:'Tick Tock Matching Game'}
  ];
  var SOCIAL = [
    {href:'https://www.linkedin.com/in/danmilward', label:'LinkedIn'},
    {href:'https://x.com/danmilward',              label:'X (formerly Twitter)'},
    {href:'https://linktr.ee/danmilward',          label:'Linktree'}
  ];

  function currentTheme(){
    return document.documentElement.getAttribute('data-theme') || 'terminal';
  }
  function setTheme(id){
    var root = document.documentElement;
    root.classList.add('theming');
    root.setAttribute('data-theme', id);
    try { localStorage.setItem('theme', id); } catch(e) {}
    setTimeout(function(){ root.classList.remove('theming'); }, 300);
    markTheme();
  }
  function markTheme(){
    var cur = currentTheme();
    document.querySelectorAll('.menu-panel button[data-theme]').forEach(function(b){
      b.classList.toggle('on', b.getAttribute('data-theme') === cur);
    });
  }

  function buildMenu(nav){
    var btn = document.createElement('button');
    btn.className = 'menu-btn';
    btn.setAttribute('aria-label', 'Open menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';

    var panel = document.createElement('div');
    panel.className = 'menu-panel';
    panel.hidden = true;

    var html = '<div class="label">Pages</div>';
    PAGES.forEach(function(p){ html += '<a href="' + p.href + '">' + p.label + '</a>'; });
    html += '<hr><div class="label">Links</div>';
    SOCIAL.forEach(function(p){ html += '<a href="' + p.href + '">' + p.label + '</a>'; });
    html += '<hr><div class="label">Theme</div>';
    THEMES.forEach(function(t){ html += '<button type="button" data-theme="' + t.id + '">' + t.label + '</button>'; });
    panel.innerHTML = html;

    nav.appendChild(btn);
    nav.appendChild(panel);

    function close(){ panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      var open = panel.hidden;
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
    });
    panel.addEventListener('click', function(e){
      var t = e.target.closest('button[data-theme]');
      if (t) { e.stopPropagation(); setTheme(t.getAttribute('data-theme')); }
    });
    document.addEventListener('click', function(e){ if (!panel.hidden && !panel.contains(e.target)) close(); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
    markTheme();
  }

  document.querySelectorAll('nav.menu').forEach(buildMenu);

  /* ---------- Screen shake on the profile photo ----------
     Trauma-based shake: each click adds trauma, shake strength is trauma squared,
     offsets come from smoothed noise so it feels like an impact, not a jitter,
     and it decays over time. Rapid clicks stack up to a cap. */
  var photo = document.querySelector('.byline img');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (photo && !reduce) {
    var target = document.querySelector('.wrap');
    var trauma = 0, raf = null, t = 0;
    var seed = [Math.random()*100, Math.random()*100, Math.random()*100];
    function noise(x, s){ // cheap smooth noise in [-1,1]
      return Math.sin(x*1.7 + s) * 0.55 + Math.sin(x*3.1 + s*1.3) * 0.3 + Math.sin(x*6.3 + s*0.7) * 0.15;
    }
    function frame(){
      t += 1;
      var shake = trauma * trauma;
      var dx = 22 * shake * noise(t*0.9, seed[0]);
      var dy = 22 * shake * noise(t*0.9, seed[1]);
      var rot = 3.5 * shake * noise(t*0.9, seed[2]);
      target.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) rotate(' + rot.toFixed(2) + 'deg)';
      trauma = Math.max(0, trauma - 0.024);
      if (trauma > 0) raf = requestAnimationFrame(frame);
      else { target.style.transform = ''; raf = null; }
    }
    photo.style.cursor = 'pointer';
    photo.setAttribute('title', 'Do not press');
    photo.addEventListener('click', function(){
      trauma = Math.min(1, trauma + 0.6);
      // squash and stretch on the photo itself
      photo.classList.remove('thud'); void photo.offsetWidth; photo.classList.add('thud');
      // impact flash
      var flash = document.createElement('div');
      flash.className = 'impact-flash';
      document.body.appendChild(flash);
      setTimeout(function(){ flash.remove(); }, 260);
      if (!raf) raf = requestAnimationFrame(frame);
    });
  }
})();
