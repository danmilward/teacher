(function(){
  var THEMES = [
    {id:'paper',    label:'Paper'},
    {id:'white',    label:'Clean white'},
    {id:'terminal', label:'Terminal'},
    {id:'github',   label:'GitHub'}
  ];
  var PAGES = [
    {href:'index.html',           label:'Home'},
    {href:'story-card-game.html', label:'Story card game'},
    {href:'fathers-day.html',     label:"Writing for Father's Day"}
  ];
  var SOCIAL = [
    {href:'https://www.linkedin.com/in/danmilward', label:'LinkedIn'},
    {href:'https://x.com/danmilward',              label:'X (formerly Twitter)'},
    {href:'https://linktr.ee/danmilward',          label:'Linktree'}
  ];

  function currentTheme(){
    return document.documentElement.getAttribute('data-theme') || 'paper';
  }
  function setTheme(id){
    var root = document.documentElement;
    root.classList.add('theming');
    if (id === 'paper') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', id);
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
})();
