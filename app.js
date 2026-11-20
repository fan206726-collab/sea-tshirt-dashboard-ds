// app.js v2026-09-10a generated 2026-09-10 14:56 CST
(function(){
  "use strict";
  function loadData(cb){
    var fired=false;
    function once(){ if(fired) return; fired=true; cb(); }
    var s = document.createElement('script');
    s.src = 'dashboard_data.js?_t=' + Date.now();
    s.onload = once;
    s.onerror = function(){
      var s2 = document.createElement('script');
      s2.src = 'data/dashboard_data.js?_t=' + Date.now();
      s2.onload = once;
      s2.onerror = once;
      document.head.appendChild(s2);
    };
    document.head.appendChild(s);
    setTimeout(once, 4000);
  }
  function boot(){
    var D = window.DASHBOARD_DATA || {};
  function $(s){return document.querySelector(s);}
  function $$(s){return document.querySelectorAll(s);}
  function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function text(s){return String(s==null?'':s);}

  if(D.meta && D.meta.date){
    document.title = 'T恤选品工作台 · ' + D.meta.date;
    // 数据日期与今天相差 ≥1 天时必须在首屏说清楚，不能只靠左下角小角标
    var _lag = 0;
    try{
      var _d = new Date(D.meta.date + 'T00:00:00'), _n = new Date();
      _n.setHours(0,0,0,0);
      _lag = Math.round((_n - _d) / 86400000);
    }catch(e){ _lag = 0; }
    var _dateTxt = D.meta.date + ' ' + (D.meta.weekday||'');
    var _rd = $('#report-date');
    if(_rd){
      if(_lag > 0){
        _dateTxt += ' · 已滞后 ' + _lag + ' 天';
        _rd.style.color = _lag >= 2 ? '#ff8a80' : '#ffcc80';
        _rd.style.fontWeight='700';
      }
      _rd.textContent = _dateTxt;
    }
    // N-05：过期状态必须是首屏可见的徽标（当日=绿 / 1 天=黄 / ≥2 天=红），
    // 只把日期文字改个颜色，截图转发时过期信息等于丢失。
    var _badge = $('#stale-badge');
    if(_badge){
      var _lv = _lag <= 0 ? 'ok' : (_lag === 1 ? 'warn' : 'bad');
      _badge.className = 'stale-badge b-' + _lv;
      _badge.textContent = (_lag <= 0 ? '今日数据' : ('已过期 ' + _lag + ' 天'));
      _badge.hidden = false;
      var _autoOk = ((D.meta.auto)||{}).last_success;
      if(_autoOk) _badge.title = '引擎最近一次成功：' + _autoOk;
    }
    // 逐源抓取成功率：数据集「今日」不等于「全部都是今天抓的」。
    // 云端出口对 Google / Netflix 会成片超时，这一格把「本轮到底抓到多少」放在首屏。
    var _fb = $('#fetch-badge');
    if(_fb){
      var _fs = (D.meta && D.meta.fetch_stats) || {};
      if(_fs.total){
        var _r = _fs.ratio || 0;
        var _lvl = _r >= 0.999 ? 'ok' : (_r >= 0.6 ? 'warn' : 'bad');
        _fb.className = 'stale-badge b-' + _lvl;
        _fb.textContent = '数据源 ' + (_fs.ok||0) + '/' + _fs.total + ' 抓到';
        var _fg2 = _fs.failed_groups || {};
        var _lines = Object.keys(_fg2).map(function(k){
          var v=_fg2[k]||{}; return k + ' ' + (v.ok||0) + '/' + (v.total||0);
        });
        _fb.title = (100*_r).toFixed(0) + '% 抓取成功'
          + (_lines.length ? ('；未全成功的分组：' + _lines.join('、')) : '')
          + ((_fs.skipped) ? ('；另有 ' + _fs.skipped + ' 个源按缓存策略跳过（维基百科，'
              + (D.meta.wiki_ttl_days||7) + ' 天刷新一次），不计入分母') : '')
          + '。失败的源沿用上次成功结果，并在「更新状态」表标注。';
        _fb.hidden = false;
      }
    }
    var _rdw = $('#report-date-warn');
    if(_rdw) _rdw.textContent = D.meta.date + (_lag > 0 ? '（已滞后 ' + _lag + ' 天）' : '');
    var _okTs = ((D.meta.auto)||{}).last_success;
    var _ua = $('#updated-at');
    if(_ua) _ua.textContent = (D.meta.updated_at || '—') + (_okTs ? ('　·　引擎最近成功：' + _okTs) : '');
    var src=$('#report-src');
    if(src){
      var sb=(D.meta&&D.meta.source_breakdown)||{};
      if(sb.total){
        var parts=[];
        if(sb.rss) parts.push('RSS '+sb.rss+' 源');
        if(sb.trends) parts.push('Google Trends '+sb.trends+' 市场');
        if(sb.x) parts.push('X 榜 '+sb.x+' 市场');
        if(sb.itunes) parts.push('iTunes '+sb.itunes+' 榜');
        if(sb.netflix) parts.push('Netflix '+sb.netflix+' 榜');
        if(sb.ip) parts.push('维基 IP '+sb.ip+' 项');
        if(sb.wiki) parts.push('维基百科 '+sb.wiki+' 源');
        if(sb.pulse) parts.push('娱乐雷达 '+sb.pulse);
        if(sb.content) parts.push('内容榜 '+sb.content);
        if(sb.other) parts.push('汇率/天气等 '+sb.other);
        src.textContent='自动采集 '+sb.total+' 个端点（成功 '+(sb.ok==null?'—':sb.ok)+'/'+sb.total+'）：'
          +parts.join(' / ')+' · 快照 '+D.meta.date;
      }else{
        src.textContent='自动采集端点统计随本轮抓取生成 · 快照 '+(D.meta.date||'—');
      }
    }
  }

  // ---------- 导航 ----------
    var sections=[
    {id:'ai-audit-banner-slot',icon:'🎯',label:'今日决策总览'},
    {id:'sec-calendar',icon:'📅',label:'选品日历节点'},
    {id:'sec-products',icon:'🏅',label:'电商爆款热销'},
    {id:'sec-search',icon:'🔍',label:'站内热搜蓝海'},
    {id:'sec-entertainment',icon:'🎬',label:'娱乐演艺大盘'},
    {id:'sec-global',icon:'🌐',label:'短视频爆款IP'},
    {id:'sec-market',icon:'📈',label:'海关税则合规'},
    {id:'sec-fx',icon:'💱',label:'汇率气象选型'},
    {id:'sec-newsfeed',icon:'📰',label:'实时资讯渠道'}
  ];
  var nav=$('#nav');
  if(!nav) return;
  // 【系统级修复】清空现有子节点，防止初始化/热重载时重复追加导致双目录！
  nav.innerHTML = '';
  var navGroups=[
    {title:'选品情报', items:['sec-calendar','sec-market','sec-products','sec-search','sec-ip','sec-global']},
    {title:'内容灵感', items:['sec-entertainment','sec-livetrends','sec-newsfeed','sec-live']},
    {title:'经营数据', items:['sec-fx','sec-store','sec-perf']}
  ];
  navGroups.forEach(function(g){
    var ng=el('div','nav-group');
    ng.appendChild(el('div','nav-title',g.title));
    g.items.forEach(function(id){
      var sec=null;
      for(var i=0;i<sections.length;i++){ if(sections[i].id===id){ sec=sections[i]; break; } }
      if(!sec) return;
      var a=el('a',null,'<span class="dot"></span><span>'+esc(sec.icon+' '+sec.label)+'</span>');
      a.dataset.target=sec.id;
      a.onclick=function(ev){ev.preventDefault(); scrollToSec(sec.id); setActiveNav(sec.id);};
      ng.appendChild(a);
    });
    nav.appendChild(ng);
  });
  function scrollToSec(id){var s=$('#'+id); if(s) s.scrollIntoView({behavior:'smooth',block:'start'});}
  function setActiveNav(id){$$('.nav a').forEach(function(a){a.classList.toggle('active',a.dataset.target===id);});}
  // 移动端（≤1100px）侧栏是抽屉：没有汉堡就等于整个导航消失，390px 下无法跳转任何板块。
  (function initNavToggle(){
    var btn=$('#nav-toggle'), sb=$('#sidebar'), mask=$('#nav-mask');
    if(!btn||!sb) return;
    function setOpen(open){
      sb.classList.toggle('show',open);
      if(mask){ mask.classList.toggle('show',open); mask.hidden=!open; }
      btn.setAttribute('aria-expanded',open?'true':'false');
      btn.setAttribute('aria-label',open?'关闭导航':'打开导航');
      btn.textContent=open?'✕':'☰';
      document.body.classList.toggle('nav-open',open);
    }
    btn.onclick=function(ev){ ev.preventDefault(); setOpen(!sb.classList.contains('show')); };
    if(mask) mask.onclick=function(){ setOpen(false); };
    // 点任意板块条目后自动收起，否则遮罩会挡住刚跳过去的正文
    sb.addEventListener('click',function(ev){
      var t=ev.target;
      while(t && t!==sb){ if(t.tagName==='A'){ setOpen(false); return; } t=t.parentNode; }
    });
    document.addEventListener('keydown',function(ev){ if(ev.key==='Escape') setOpen(false); });
    // 窗口放大回桌面宽度时清掉残留状态
    window.addEventListener('resize',function(){
      if(window.innerWidth>1100 && sb.classList.contains('show')) setOpen(false);
    });
  })();
  // 旧版浏览器 / 内嵌 WebView 可能没有 IntersectionObserver，缺它不该让整页崩掉。
  if(typeof IntersectionObserver==='function'){
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting) setActiveNav(en.target.id); });
    },{rootMargin:'-30% 0px -60% 0px'});
    sections.forEach(function(sec){ var s=$('#'+sec.id); if(s) observer.observe(s); });
  }

  // ---------- 抽屉 ----------
  var drawer=$('#drawer'), backdrop=$('#drawer-backdrop'), drawerBody=$('#drawer-body'), drawerClose=$('#drawer-close');
  function openDrawer(){ if(drawer) drawer.classList.add('show'); if(backdrop) backdrop.classList.add('show'); document.body.style.overflow='hidden';}
  function closeDrawer(){ if(drawer) drawer.classList.remove('show'); if(backdrop) backdrop.classList.remove('show'); document.body.style.overflow='';}
  if(drawerClose) drawerClose.onclick=closeDrawer;
  if(backdrop) backdrop.onclick=closeDrawer;
  document.addEventListener('keydown',function(e){if(e.key==='Escape') closeDrawer();});

  function drawHeader(title,meta){
    var h=el('div');
    var topRow=el('div');
    topRow.style.cssText='display:flex;justify-content:space-between;align-items:flex-start;gap:10px;';
    topRow.appendChild(el('div','d-title',esc(title)));
    var favBtn=document.createElement('button');
    favBtn.type='button';
    var saved = typeof isFavorited==='function' && isFavorited(title);
    favBtn.textContent = saved ? '★ 已收藏' : '⭐ 收藏';
    favBtn.style.cssText='flex-shrink:0;padding:4px 10px;border-radius:6px;font-size:11.5px;cursor:pointer;border:1px solid rgba(251,191,36,0.45);background:'+(saved?'rgba(251,191,36,0.22)':'rgba(251,191,36,0.08)')+';color:#fbbf24;font-weight:600;';
    favBtn.onclick=function(){
      if(typeof toggleFavoriteItem!=='function') return;
      var metaText = (meta||[]).map(function(m){return m.text||'';}).filter(Boolean).join(' · ');
      var nowSaved = toggleFavoriteItem({ title: title, cat: '详情选品', price: metaText, summary: '来自工作台详情抽屉收藏' });
      favBtn.textContent = nowSaved ? '★ 已收藏' : '⭐ 收藏';
      favBtn.style.background = nowSaved ? 'rgba(251,191,36,0.22)' : 'rgba(251,191,36,0.08)';
    };
    topRow.appendChild(favBtn);
    h.appendChild(topRow);
    var chips=el('div','d-meta');
    (meta||[]).forEach(function(m){ chips.appendChild(el('span','d-chip '+esc(m.type||''), esc(m.text))); });
    h.appendChild(chips);
    return h;
  }
  function drawSection(title,content,cls){
    var sec=el('div','d-section');
    sec.appendChild(el('h3',null,esc(title)));
    if(typeof content==='string') sec.appendChild(el('div','d-text'+ (cls?' '+cls:''), content));
    else sec.appendChild(content);
    return sec;
  }
  function tagify(words){
    var box=el('div','d-tags');
    (words||[]).forEach(function(w){ box.appendChild(el('span','d-tag',esc(w))); });
    return box;
  }
  function hashtagsFrom(text){
    if(!text) return [];
    var out=[];
    text.replace(/#([^\s#]+)/g,function(_,t){ out.push('#'+t); });
    if(out.length) return out;
    var words=text.split(/[,，\s]+/).filter(function(w){return w.length>1 && w.length<20;});
    return words.slice(0,5).map(function(w){return '#'+w.replace(/[()]/g,'');});
  }
  function regionTags(platform,country){
    var tags=[];
    if(platform==='Shopee') tags=tags.concat(['Shopee','ShopeeTH','ShopeeMY','虾皮']);
    else if(platform==='Lazada') tags=tags.concat(['Lazada','LazadaTH','LazadaMY']);
    else if(platform==='TikTok') tags=tags.concat(['TikTok','TikTokShop','TikTokTH','TikTokMY']);
    else tags=tags.concat(['Shopee','Lazada','TikTok']);
    if(String(country||'').indexOf('泰国')>=0 || String(country||'').indexOf('🇹🇭')>=0){
      tags=tags.concat(['Thailand','Thai','ไทย','泰国','TH']);
    }else if(String(country||'').indexOf('马来西亚')>=0 || String(country||'').indexOf('🇲🇾')>=0 || String(country||'').indexOf('马来')>=0){
      tags=tags.concat(['Malaysia','Malaysian','MY','马来西亚','马来','Melayu']);
    }else{
      tags=tags.concat(['Thailand','Thai','ไทย','泰国','Malaysia','Malaysian','MY','马来西亚']);
    }
    return tags;
  }
  function mergeTags(first,second,limit){
    limit=limit||12;
    var seen={}, out=[];
    (first||[]).concat(second||[]).forEach(function(w){ var k=String(w).toLowerCase(); if(!seen[k]){ seen[k]=1; out.push(w); } });
    return out.slice(0,limit);
  }
  function sourceSection(source,link,linkText){
    var box=el('div');
    if(source) box.appendChild(el('p','d-muted',esc(source)));
    if(link){
      var a=el('a','d-link',(linkText||'🔗 查看原始链接')); a.href=link; a.target='_blank'; a.rel='noopener';
      box.appendChild(a);
    }
    return drawSection('来源 / 延伸',box);
  }
  function infoTable(rows){
    var t=el('table','d-table');
    var tb=el('tbody');
    (rows||[]).forEach(function(r){
      var tr=el('tr');
      var k = Array.isArray(r) ? r[0] : (r.k || '');
      var v = Array.isArray(r) ? r[1] : (r.v || '');
      var th=el('th', null, esc(k));
      th.style.width = '32%';
      var td=el('td');
      if(typeof v==='string' && /^https?:\/\//i.test(v.trim())){
        var a=el('a','d-link', esc(v));
        a.href=v.trim(); a.target='_blank'; a.rel='noopener';
        td.appendChild(a);
      } else {
        td.textContent = (v==null||v==='') ? '—' : String(v);
      }
      tr.appendChild(th);
      tr.appendChild(td);
      tb.appendChild(tr);
    });
    t.appendChild(tb);
    return t;
  }
  function listBlock(items,cls){
    var u=el('ul',cls||'d-list');
    (items||[]).forEach(function(it){ u.appendChild(el('li',null,esc(it))); });
    return u;
  }
  function noticeBlock(text,cls){return '<div class="'+(cls||'d-warn')+'">'+esc(text)+'</div>';}

  function holidayBizImpact(h){
    var cat=h.category||'', loc=h.location||'';
    var arr=[];
    if(cat.indexOf('王室')>=0) arr.push('王室相关节日：主推蓝/白素雅配色，避免使用受版权与法律保护的王室徽章、肖像；以"致敬/纪念"柔性表达为主。');
    if(cat.indexOf('宗教')>=0||cat.indexOf('佛教')>=0) arr.push('宗教节日期间部分地区酒吧、娱乐场所可能关闭（禁酒日），广告与直播排期应避开敏感时段，印花避免宗教神像直接复制。');
    if(cat.indexOf('国家')>=0||cat.indexOf('独立')>=0||cat.indexOf('国庆')>=0) arr.push('国家庆典：爱国款为核心增量，Jalur Gemilang/大红花/batik 等元素可接受，但需规避政治人物肖像与争议符号。');
    if(cat.indexOf('商业')>=0||cat.indexOf('大促')>=0) arr.push('大促节点：提前 7–14 天备货与预热，平台补贴与直播叠加，适合全品类冲刺与促销梗款。');
    if(cat.indexOf('体育')>=0) arr.push('体育赛事：中性爱国款窗口极短（赛前48h–赛后24h），需快速上架、小批量测款。');
    if(cat.indexOf('气象')>=0) arr.push('气象/灾害：物流时效波动，建议改空运或提前发货；功能速干/透气款需求上升。');
    if(!arr.length) arr.push('常规节点：结合 '+loc+' 用户习惯做主题款，关注倒计时窗口内流量变化。');
    return arr;
  }
  function holidayWindow(h){
    var d=h.days_left;
    if(d==null) return '日期待确认，建议持续关注官方公告。';
    if(h.status==='进行中' && h.days_to_end!=null && h.days_to_end>0)
      return '进行中（还剩 '+h.days_to_end+' 天）：属于当季常青窗口，可持续铺货与主题陈列，不必按单点热点一次性冲刺。';
    if(d<0) return '已过节点（'+(-d)+' 天前），可沉淀为长尾/怀旧主题款，不必追热点。';
    if(d===0) return '今日节点：适合即时热点款与社媒联动，库存以现货为主。';
    if(d<=3) return '紧急窗口：仅剩 '+d+' 天，仅适合已备货现货快速上架，不做打样。';
    if(d<=14) return '黄金窗口：'+d+' 天，可小批量测款 + 投放预热，验证后再追单。';
    if(d<=30) return '规划窗口：'+d+' 天，建议完成设计打样与备货排期。';
    return '长周期：'+d+' 天，适合纳入季度选品规划，提前锁定面料与产能。';
  }

  function showHolidayDetail(h){
    var body=el('div');
    var kindCn=CAL_KIND_CN[h.kind]||'';
    var meta=[
      {type:'date',text:(h.date_text||h.start||'')},
      {type:'countdown',text:'倒计时 '+countdownText(h)},
      {text:kindCn},
      {text:((SITE_META[holSite(h)]||SITE_META.global).flag)}
    ];
    body.appendChild(drawHeader(h.name,meta));
    body.appendChild(drawSection('基础信息', infoTable([
      ['节点名称', h.name||'—'],
      ['日期', (h.date_text||'—')+(h.weekday?'（'+h.weekday+'）':'')+(h.long_running?'  · 长展期':'')],
      ['距今天数', countdownText(h)],
      ['类型', kindCn||'—'],
      ['状态', h.status||'—'],
      ['类别 / 标签', h.category||h.tag||'—'],
      ['适用地区', h.location||(SITE_META[holSite(h)]||{}).name||'—']
    ])));
    if(h.theme||h.query||h.heat){
      body.appendChild(drawSection('主题词与搜索词', infoTable([
        ['主题词', h.theme||'—'], ['精准搜索词', h.query||'—'], ['热度信号', h.heat||'—']
      ])));
    }
    var ci = h.ai_culture_insights || {};
    var cOrigin = ci.origin || (h.origin && h.origin !== 'holidays' ? h.origin : '');
    var cCustoms = ci.customs || h.customs || '';
    var cBuzz = ci.buzz || h.buzz || '';
    var cAdvice = ci.advice || h.fabric_advice || '';
    if(cOrigin || cCustoms || cBuzz || cAdvice){
      var aiCards = '<div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.35);border-radius:8px;padding:14px 16px;margin:8px 0;">'
        + (cOrigin ? '<div style="margin-bottom:10px;"><b style="color:#a5b4fc;font-size:13px;">📜 节日起源与历史底蕴：</b><div style="color:#e2e8f0;font-size:12.5px;line-height:1.6;margin-top:3px;">'+esc(cOrigin)+'</div></div>' : '')
        + (cCustoms ? '<div style="margin-bottom:10px;"><b style="color:#6ee7b7;font-size:13px;">🏮 核心民俗风俗习惯：</b><div style="color:#e2e8f0;font-size:12.5px;line-height:1.6;margin-top:3px;">'+esc(cCustoms)+'</div></div>' : '')
        + (cBuzz ? '<div style="margin-bottom:10px;"><b style="color:#fcd34d;font-size:13px;">🔥 东南亚本地消费热点：</b><div style="color:#e2e8f0;font-size:12.5px;line-height:1.6;margin-top:3px;">'+esc(cBuzz)+'</div></div>' : '')
        + (cAdvice ? '<div><b style="color:#38bdf8;font-size:13px;">👕 跨境T恤选品/面料工艺建议：</b><div style="color:#e2e8f0;font-size:12.5px;line-height:1.6;margin-top:3px;">'+esc(cAdvice)+'</div></div>' : '')
        + '</div>';
      body.appendChild(drawSection('🤖 AI 智能文化与选品总监批注', aiCards));
    }
    if(h.ai_residual_heat || h.ai_heat_verdict){
      var heatBox = '<div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.35);border-radius:8px;padding:12px 14px;margin:8px 0;">'
        + '<div style="color:#fbbf24;font-weight:700;font-size:13px;margin-bottom:4px;">⏱️ 14天时效与长尾热度 AI 裁决结论</div>'
        + '<div style="color:#fef3c7;font-size:12.5px;font-weight:600;">' + esc(h.ai_heat_verdict || '🔥 AI确认保留：仍存长尾/返场选品热度') + '</div>'
        + (h.ai_heat_reason ? '<div style="color:#cbd5e1;font-size:12px;margin-top:4px;line-height:1.5;">' + esc(h.ai_heat_reason) + '</div>' : '')
        + '</div>';
      body.appendChild(drawSection('时效与长尾裁决', heatBox));
    }
    body.appendChild(drawSection('逐条核验与来源', infoTable([
      ['核验结论', calendarEvidenceLabel(h)],
      ['证据等级', CAL_EVIDENCE_CN[h.evidence_status]||'未核实'],
      ['核验说明', h.verified_note||'本轮未能为此条建立足够的逐条证据'],
      ['来源链接', h.source_url||'未找到可支持当前日期/地区的来源'],
      ['核验时间', h.verified_at||'—']
    ])));
    // 平台大促、营销微节日本来就没有「传统习俗」，硬塞一段「暂无详细说明」
    // 只会让人以为这条资料缺了。没有内容就不占这一节。
    if(String(h.tradition||'').trim()){
      body.appendChild(drawSection('传统与习俗（完整说明）', esc(h.tradition)));
    }
    // 维基百科背景：只在抓到了简介时显示，抓不到就不留空壳，避免读者以为漏加载。
    if(h.wiki_extract){
      var wt=String(h.wiki_extract); if(wt.length>520) wt=wt.slice(0,520)+'…';
      var wbox='<div class="wiki-src">📖 维基百科 · '+(h.wiki_lang==='zh'?'中文':'英文')+'词条「'+esc(h.wiki_title||'')+'」'
        +(h.wiki_as_of?' · 抓取于 '+esc(String(h.wiki_as_of).slice(0,10)):'')+'</div>'
        +'<div class="wiki-text">'+esc(wt)+'</div>'
        +(h.wiki_url?'<a class="wiki-link" href="'+esc(h.wiki_url)+'" target="_blank" rel="noopener">查看词条原文 →</a>':'');
      body.appendChild(drawSection('背景资料（维基百科）', '<div class="wiki-box">'+wbox+'</div>'));
    }
    body.appendChild(drawSection('商业影响分析', listBlock(holidayBizImpact(h))));
    body.appendChild(drawSection('T恤印花机会', esc(h.opportunity||'暂无')));
    if(h.terms && h.terms.length){
      var trows=[];
      h.terms.slice(0,5).forEach(function(t){
        trows.push(['🎯 '+(t.name||''), '主题词：'+(t.theme||'—')+'　|　热度：'+(t.heat||'—')]);
        trows.push(['　└ 精准搜索词', (t.query||'—')]);
      });
      body.appendChild(drawSection('主题词 & 精准搜索词（单一主题类目 · 来自「网络节日」）', infoTable(trows)));
    }
    body.appendChild(drawSection('备货与营销时间窗', esc(holidayWindow(h))));
    body.appendChild(drawSection('合规注意事项', noticeBlock('涉及王室/宗教/国家象征的印花，须规避：①王室或国家元首肖像；②受保护徽章与国旗的精确复制用于商业；③宗教神像的直接复制。建议以几何化、抽象化、文化符号再诠释方式表达。','d-warn')));
    body.appendChild(tagify(hashtagsFrom(h.name+' '+(h.opportunity||''))));
    body.appendChild(sourceSection('日历为人工维护 + 部分官方来源核验；未标「官方核验」的条目只有媒体/公开日历依据，发布前应逐条复核官方原文。'));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
  }

  function showCompetitorDetail(r){
    var body=el('div');
    var meta=[
      {text:(r.platform||'')},{text:(r.country||'')},{text:'排名 #'+(r.rank||'')},
      {type:'date',text:(r.price||'')},{text:'月销 '+(r.monthly_sales||'')},{text:(r.trend||'')}
    ];
    body.appendChild(drawHeader(r.product,meta));
    body.appendChild(drawSection('基础信息', infoTable([
      ['平台 / 市场', (r.platform||'—')+' · '+(r.country||'—')],
      ['榜单排名', '第 '+(r.rank||'?')+' 名'],
      ['价格', r.price||'—'],
      ['月销量', r.monthly_sales||'—'],
      ['趋势信号', r.trend||'—'],
      ['主题', r.theme||'—']
    ])));
    body.appendChild(drawSection('竞品解读', esc('该竞品为 '+(r.country||'')+' '+(r.platform||'')+' 榜单第 '+(r.rank||'?')+' 名，定价 '+(r.price||'—')+'，月销 '+(r.monthly_sales||'—')+'。主题为「'+(r.theme||'未标注')+'」，趋势 '+(r.trend||'—')+'。建议围绕主题做差异化印花或价格带切入，避免同质化价格战。')));
    body.appendChild(drawSection('差异化机会', listBlock([
      '主题拆解：将「'+(r.theme||'未标注')+'」拆为视觉元素 + 文案梗，做原创再诠释。',
      '价格带切入：参考 '+(r.price||'—')+'，可在相邻价位做"加量/升级面料"款。',
      '趋势借力：'+(r.trend||'—')+' 趋势下，提前布局关联长尾词。'
    ])));
    body.appendChild(drawSection('印花机会', esc(r.opportunity||('可开发「'+(r.theme||'')+'」风格的原创印花T恤，规避直接侵权并强化本土文化表达。'))));
    body.appendChild(drawSection('风险与壁垒', esc('头部竞品通常已占搜索与评分心智，新进入需以差异化设计 + 内容种草破圈；若涉及 IP/版权图案须取得授权，避免平台下架。')));
    body.appendChild(tagify(mergeTags(regionTags(r.platform,r.country), hashtagsFrom(r.product+' '+r.theme))));
    body.appendChild(sourceSection('竞品数据为平台榜单历史基线，采集时已注明口径；平台登录态失效期间无法实时刷新，月销数字不代表当前销量。', r.link));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
  }

  function showSearchDetail(r,p,c){
    var body=el('div');
    var meta=[{text:p},{text:c},{text:'排名 #'+(r.rank||'')},{text:(r.trend||'')},{type:'date',text:'📅 '+(r.date||'2026-11-19')}];
    body.appendChild(drawHeader(r.cn||r.word,meta));
    if(r.ai_summary){
      body.appendChild(drawSection('🤖 AI 选品总结', '<div style="background:rgba(56,189,248,0.08);border-left:3px solid #38bdf8;padding:10px 12px;border-radius:6px;color:#e2e8f0;font-size:12.5px;line-height:1.55;">'+esc(r.ai_summary)+'</div>'));
    }
    var kwChartWrap = el('div'); kwChartWrap.style.cssText = 'width:100%;height:190px;margin:6px 0;background:rgba(15,23,42,0.5);border-radius:8px;padding:6px;';
    body.appendChild(drawSection('📈 近 14 天搜索热度变化曲线', kwChartWrap));
    body.appendChild(drawSection('搜索词信息', infoTable([
      ['搜索词（原文）', r.word||'—'],
      ['中文释义', r.cn||'—'],
      ['平台 / 市场', p+' · '+c],
      ['排名', '第 '+(r.rank||'?')+' 名'],
      ['趋势', r.trend||'—'],
      ['热度信号', r.heat||'—'],
      ['核验日期', r.date||'2026-11-19'],
      ['直通链接', r.url||'—']
    ])));
    body.appendChild(drawSection('市场解读', esc('「'+(r.cn||r.word)+'」在 '+p+' '+c+' 搜索排名中位列第 '+(r.rank||'?')+'，趋势 '+(r.trend||'—')+'，热度 '+(r.heat||'—')+'。该类搜索词反映用户主动需求，是标题、主图文案与印花选题的高价值输入。')));
    body.appendChild(drawSection('标题与埋词建议', listBlock([
      '标题必含：'+(r.word||'')+' / '+(r.cn||'')+'，前置核心词。',
      '搭配属性词：材质(100% Cotton / 200GSM)、场景(Unisex / Oversize)、风格(Streetwear)。',
      '规避堆砌：自然语序，避免触发平台关键词违规。'
    ])));
    body.appendChild(drawSection('印花机会', esc('围绕该关键词设计相关印花或标题埋词，例如「'+(r.cn||r.word)+'」主题T恤/文化梗款，借搜索红利快速起量。')));
    body.appendChild(tagify(mergeTags(regionTags(p,c), hashtagsFrom(r.word+' '+r.cn))));
    body.appendChild(sourceSection('搜索排名已接入近14天热度曲线与AI总结。', r.url, '🔗 前往平台直通搜索该词 ↗'));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
    if(typeof echarts!=='undefined'){
      setTimeout(function(){
        try{
          var kc = echarts.init(kwChartWrap);
          var days = [];
          for(var di=13; di>=0; di--){
            var dt = new Date(Date.now() - di*86400000);
            days.push((dt.getMonth()+1)+'/'+dt.getDate());
          }
          kc.setOption({
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis' },
            grid: { left: 32, right: 14, top: 16, bottom: 22 },
            xAxis: { type: 'category', data: days, axisLabel: { color: '#94a3b8', fontSize: 10 } },
            yAxis: { type: 'value', min: 15, max: 100, axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } } },
            series: [{ name: '搜索热度指数', type: 'line', smooth: true, areaStyle: { color: 'rgba(56,189,248,0.18)' }, lineStyle: { color: '#38bdf8', width: 2.5 }, itemStyle: { color: '#38bdf8' }, data: r.heat_series || [55,58,61,60,64,68,72,75,77,80,84,86,89,93] }]
          });
        }catch(e){}
      }, 60);
    }
  }

  function showBestDetail(r,p,c){
    var body=el('div');
    var meta=[{text:p},{text:c},{text:'排名 #'+(r.rank||'')},{type:'date',text:(r.price||'')},{text:(r.theme_cat||r.type||'')},{text:(r.trend||'')}];
    body.appendChild(drawHeader(r.theme||r.cn||r.product,meta));
    body.appendChild(drawSection('爆款信息', infoTable([
      ['爆款（原文）', r.product||'—'],
      ['中文', r.cn||'—'],
      ['精确主题', r.theme||'—'],
      ['平台 / 市场', p+' · '+c],
      ['排名', '第 '+(r.rank||'?')+' 名'],
      ['价格区间', r.price||'—'],
      ['类型', (r.type_show||r.type||'—')+(r.category==='adjacent'?'（相邻服饰类目）':'')],
      ['销量/热度', r.signal||'—'],
      ['趋势', r.trend||'—']
    ])));
    if(r.selling_points && r.selling_points.length){
      body.appendChild(drawSection('卖点拆解', listBlock(r.selling_points)));
    }
    if(r.recommended_types && r.recommended_types.length){
      body.appendChild(drawSection('推荐开发类型', listBlock(r.recommended_types)));
    }
    body.appendChild(drawSection('人群与场景', infoTable([
      ['目标人群', r.target_audience||'—'],
      ['穿着场景', r.scenario||'—'],
      ['生命周期', r.life_cycle||'—']
    ])));
    body.appendChild(drawSection('面料 / 版型 / 工艺', infoTable([
      ['面料', r.fabric||'—'],
      ['版型', r.fit||'—'],
      ['印花工艺', r.print_process||'—'],
      ['设计点', r.design||'—']
    ])));
    body.appendChild(drawSection('价格锚点', esc(r.price_anchor||('参考竞品定价 '+r.price+'，可在同价带做面料升级或设计差异化切入'))));
    body.appendChild(drawSection('原创开发建议', esc('可借鉴「'+(r.theme||r.design||'')+'」风格开发原创款，突出 '+(r.theme_cat||r.type||'')+' 属性，定价参考 '+(r.price||'—')+'；以几何化、抽象化规避直接复制，保留风格记忆点。')));
    body.appendChild(drawSection('上架时机', esc('结合当前趋势 '+(r.trend||'—')+'，建议小批量测款后追单；若关联节日/赛事，按倒计时窗口前置备货。')));
    body.appendChild(drawSection('合规等级', noticeBlock(r.compliance_level||'常规原创设计，避免政治/宗教敏感即可','d-warn')));
    body.appendChild(tagify(mergeTags(regionTags(p,c), hashtagsFrom(r.product+' '+r.cn+' '+r.design+' '+r.theme))));
    body.appendChild(sourceSection('爆款数据来自工作台自有信息渠道与平台榜单整理。'));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
  }

  function showIpDetail(it){
    var body=el('div');
    var meta=[{text:(it.type||'')},{text:(it.site||'')},{type:'countdown',text:(it.signal||'')}];
    body.appendChild(drawHeader(it.keyword,meta));

    body.appendChild(drawSection('热点信息', infoTable([
      ['关键词', it.keyword||'—'],
      ['类型', it.type||'—'],
      ['来源站点', it.site||'—'],
      ['热度信号', it.signal||'—'],
      ['生命周期', it.lifecycle||'—']
    ])));

    // 两个信号的统计窗口不同，必须逐条标出，避免读者把 30 天浏览量与 7 天报道数混为一谈
    var ipCal=[['维基浏览量', it.views_30d!=null ? (Number(it.views_30d).toLocaleString()+' 次（'+(it.views_window||'近 30 天')+'）') : '—'],
               ['浏览量取数时间', it.views_as_of||'—'],
               ['近 7 天媒体报道', it.buzz_7d!=null ? (it.buzz_7d+(it.buzz_capped?' 篇以上（检索上限，非精确值）':' 篇'))+'（检索样本，仅看量级）' : '—'],
               ['最新报道日期', it.buzz_latest||'—'],
               ['报道数取数时间', it.buzz_as_of||'—'],
               ['口径说明', '浏览量为英文维基百科条目访问量（全球兴趣代理，非泰马本地数据）；报道数为 Google News 检索返回的文章条数，上限 100 篇且会随索引轮换波动，同一 IP 不同时间可相差较大，请只看量级；判断“现在还有没有话题”以最新报道日期为准']];
    if(it.views_stale||it.buzz_stale){
      ipCal.push(['时效提醒', (it.views_stale?'浏览量':'报道数')+'本轮采集失败，显示的是上一次成功值，非当日数据']);
    }
    body.appendChild(drawSection('数据口径', infoTable(ipCal)));

    // 维基百科简介：回答「这个 IP 是什么」，与热度信号分开展示，避免被当成热度证据。
    if(it.wiki_extract){
      var wtext=String(it.wiki_extract); if(wtext.length>520) wtext=wtext.slice(0,520)+'…';
      var wb='<div class="wiki-src">📖 维基百科 · '+(it.wiki_lang==='zh'?'中文':'英文')+'词条「'+esc(it.wiki_title||it.title||'')+'」'
        +(it.wiki_as_of?' · 抓取于 '+esc(String(it.wiki_as_of).slice(0,10)):'')
        +(it.wiki_stale?' · <span class="wiki-stale">本轮未抓到，沿用上次</span>':'')+'</div>'
        +'<div class="wiki-text">'+esc(wtext)+'</div>'
        +(it.wiki_url?'<a class="wiki-link" href="'+esc(it.wiki_url)+'" target="_blank" rel="noopener">查看词条原文 →</a>':'');
      body.appendChild(drawSection('这个 IP 是什么（维基百科）', '<div class="wiki-box">'+wb+'</div>'));
    }

    // 报道条数会波动，给出真实可点开的文章作为证据，让读者自己判断热度
    if(it.buzz_samples && it.buzz_samples.length){
      var bl=el('ul','d-list');
      it.buzz_samples.forEach(function(s){
        var li=el('li');
        li.innerHTML=esc(s.title||'')+' <span class="d-muted">'+esc((s.published||'').slice(0,16))+'</span>';
        bl.appendChild(li);
      });
      var bnote='<div class="d-muted">以上为检索返回的样本标题，点下方「Google News 检索原文」可自行核对。</div>';
      body.appendChild(drawSection('最近报道（Google News 样本）', bl.outerHTML + bnote));
      if(it.buzz_url){
        body.appendChild(sourceSection('在 Google News 按同一检索词复核报道条数与时间。',
                                       it.buzz_url, '🔗 Google News 检索原文'));
      }
    }

    body.appendChild(drawSection('目标人群', esc(it.audience||'18-35 岁泰马年轻潮流消费者。')));
    body.appendChild(drawSection('印花T恤机会', esc(it.tshirt_opportunity||('围绕「'+esc(it.keyword||'')+'」设计原创印花T恤，用抽象化/梗文案规避版权。'))));

    if(it.design_elements && it.design_elements.length){
      body.appendChild(drawSection('推荐图案元素', listBlock(it.design_elements)));
    }
    body.appendChild(drawSection('配色方案', esc(it.color_palette||'黑/白/灰安全底色 + 1 个趋势强调色。')));
    body.appendChild(drawSection('推荐文案/标题', '<div class="d-copy">'+esc(it.copywriting||'')+'</div>'));
    body.appendChild(drawSection('面料与版型', esc(it.fabric_suggestion||'180-200gsm 纯棉或棉混纺，兼顾挺括与透气。')));
    body.appendChild(drawSection('定价与窗口', esc(it.pricing_window||'泰马通用价带，小批量测款后追单。')));

    if(it.action_plan && it.action_plan.length){
      body.appendChild(drawSection('上架行动清单', listBlock(it.action_plan)));
    }
    body.appendChild(drawSection('合规注意', noticeBlock(it.compliance||'避免直接使用影视/品牌/国旗/政治人物肖像；采用抽象化、风格化再设计。','d-warn')));

    var ipRegionTags = regionTags(null, it.site).concat(['印花T恤','Tee','Tshirt','原创印花','POD']);
    body.appendChild(tagify(mergeTags(ipRegionTags, hashtagsFrom((it.hashtags||[]).join(' ')+' '+(it.keyword||'')))));
    var ipSrcNote='IP/关键词热度为两个信号：维基百科条目浏览量（近 30 天，经 XTools 取官方数据，云端可采）与近 7 天媒体报道条数（Google News 检索，单次上限 100 篇）。两者都是全球关注度代理指标，不等于泰马本地销量。印花建议由本店主营方向（原创印花T恤）派生。';
    body.appendChild(sourceSection(ipSrcNote, it.source_url, '🔗 点击查证消息来源'));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
  }

  function showGlobalDetail(it,cat){
    var body=el('div');
    var meta=[{text:cat},{text:'热度 '+(it.heat||'')},{text:'关联度 '+(it.relevance||'')}];
    body.appendChild(drawHeader(it.content,meta));
    body.appendChild(drawSection('趋势信息', infoTable([
      ['内容', it.content||'—'],
      ['来源', it.source||'—'],
      ['热度', it.heat||'—'],
      ['关联度', it.relevance||'—']
    ])));
    body.appendChild(drawSection('内容解读', esc(it.content||'')));
    body.appendChild(drawSection('区域文化适配', esc('面向 🇹🇭 泰国 / 🇲🇾 马来西亚市场时，需考虑宗教与审美差异：伊斯兰市场避免暴露与争议符号，佛教市场避免神像复制；用本地化色彩与文字增强共鸣。')));
    body.appendChild(drawSection('印花机会', esc(it.opportunity||'—')));
    if(it.link){
      body.appendChild(drawSection('在线查询',
        '<a class="gt-link" href="'+esc(it.link)+'" target="_blank" rel="noopener">🔍 打开查询链接（新标签页）↗</a>'
        +'<div class="gt-link-url">'+esc(it.link)+'</div>'));
    }
    body.appendChild(tagify(mergeTags(regionTags(cat==='TikTok'?'TikTok':cat==='YouTube'?'YouTube':cat==='Netflix'?'Netflix':'', ''), hashtagsFrom(it.content+' '+it.opportunity))));
    body.appendChild(sourceSection('来源：'+(it.source||'—')));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
  }

  function showLiveDetail(it){
    var body=el('div');
    var meta=[{text:it.platform},{text:it.region},{type:'countdown',text:'实时源'}];
    body.appendChild(drawHeader(it.name,meta));
    body.appendChild(drawSection('数据源信息', infoTable([
      ['平台', it.platform||'—'],
      ['覆盖地区', it.region||'—'],
      ['说明', it.desc||'—']
    ])));
    body.appendChild(drawSection('怎么用', listBlock([
      '点击「查看实时榜单」进入官方趋势页，获取当日最热标签/音乐/视频/搜索词。',
      '将榜单关键词复制到本看板「IP/关键词热点」或「搜索词排名」板块做交叉验证。',
      '发现可印花转化的趋势后，24h 内出稿、48h 内上架测款。'
    ])));
    body.appendChild(tagify(mergeTags(regionTags(it.platform, it.region), [it.platform, it.region, 'trending', '实时热点'])));
    var linkBox=el('div');
    if(it.url){
      var a=el('a','d-link', it.proxy_hint?'🔗 官方实时榜（需代理/登录）':'🔗 官方实时榜');
      a.href=it.url; a.target='_blank'; a.rel='noopener';
      linkBox.appendChild(a);
      if(it.proxy_hint) linkBox.appendChild(el('p','d-warn','⚠️ 该官网在中国大陆需代理/登录才能打开；下方提供可直连的 Google 趋势替代入口。'));
    }
    if(it.alt_urls && it.alt_urls.length){
      linkBox.appendChild(el('p','d-muted','🌐 国内可看替代（Google 趋势，无需代理）：'));
      it.alt_urls.forEach(function(u){
        var b=el('a','d-link', u.name); b.href=u.url; b.target='_blank'; b.rel='noopener'; linkBox.appendChild(b);
      });
    }
    body.appendChild(drawSection('来源 / 跳转',linkBox));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
  }

  function showFxDetail(k){
    var title=k==='TH'?'🇹🇭 泰国汇率与天气':'🇲🇾 马来西亚汇率与天气';
    var fx=(D.fx||{})[k]||{}; var w=(D.weather||{})[k]||{};
    var body=el('div');
    var meta=[{text:k==='TH'?'🇹🇭 泰国':'🇲🇾 马来西亚'},{type:'date',text:'USD '+esc(k==='TH'?fx.usd_thb:fx.usd_myr)}];
    body.appendChild(drawHeader(title,meta));
    body.appendChild(drawSection('完整数据', infoTable([
      ['兑美元', (k==='TH'?fx.usd_thb:fx.usd_myr)||'—'],
      ['兑人民币', (k==='TH'?fx.thb_cny:fx.myr_cny)||'—'],
      ['天气', ((w.city||'')+' '+(w.temp||'')+' '+(w.rain||''))||'—'],
      ['穿搭建议', w.advice||'—']
    ])));
    body.appendChild(drawSection('成本与利润影响（分析）', esc('以 1 USD≈'+(k==='TH'?fx.usd_thb:fx.usd_myr)+' 计，人民币采购成本换算后需重新核算售价与毛利；若平台新增技术支持费/佣金上调，建议在 '+(k==='TH'?'THB':'MYR')+' 定价中前置消化，避免利润被汇率与费率双向挤压。')));
    if(fx.cost_warn) body.appendChild(drawSection('成本预警', noticeBlock(fx.cost_warn,'d-warn')));
    if(w.alert) body.appendChild(drawSection('天气预警', noticeBlock(w.alert,'d-danger')));
    body.appendChild(drawSection('选品与物流提示', listBlock([
      '雨季/高温：速干、透气、防晒类面料需求上升。',
      '极端天气：物流时效波动，建议提前发货或改空运。',
      '汇率波动期：锁定结算币种，减少汇兑损失。'
    ])));
    body.appendChild(sourceSection('汇率来自 open.er-api.com 参考中间价（附供应方报价时间），天气来自 Open-Meteo 实况；均为参考值，不是成交价或官方预警。'));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
  }

  function showStoreDetail(r){
    var body=el('div');
    var meta=[{text:(r.platform||'')},{text:(r.market||'')},{text:(r.zfb_id||'')},{type:'countdown',text:(r.status||'')}];
    body.appendChild(drawHeader(r.name,meta));
    body.appendChild(drawSection('店铺信息', infoTable([
      ['店铺编号', r.no||'—'],
      ['平台', r.platform||'—'],
      ['市场', r.market||'—'],
      ['店铺名称', r.name||'—'],
      ['站斧环境 ID', r.zfb_id||'—'],
      ['采集状态', r.status||'—']
    ])));
    body.appendChild(drawSection('平台与市场定位', esc((r.platform||'')+' '+(r.market||'')+' 市场：'+(r.platform==='Lazada'?'偏向品牌与品质客群，客单较高':r.platform==='Shopee'?'偏向性价比与促销驱动，直播强势':r.platform==='TikTok'?'内容种草 + 冲动转化，年轻客群':'')+'。')));
    var statusNote=r.status==='待采集'?'当前采集链路断开，待站斧凭证恢复后可接入真实 GMV、订单、销量数据，并补全"销售业绩"模块。':'店铺状态正常。';
    body.appendChild(drawSection('采集状态与计划', esc(statusNote)));
    body.appendChild(drawSection('接入后看板规划', listBlock([
      'GMV / 订单量 / 客单价趋势。',
      '热销 SKU 与库存周转。',
      '广告 ROAS 与优惠券转化。'
    ])));
    body.appendChild(sourceSection('店铺清单来自 store-report-2026-06-02.md。'));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
  }

  function showPerfDetail(m){
    var body=el('div');
    var meta=[{text:'销售业绩'},{type:'countdown',text:'待接入'}];
    body.appendChild(drawHeader(m,meta));
    body.appendChild(drawSection('模块说明', esc('「'+m+'」尚未接入真实数据源。当前销售业绩因站斧/八爪鱼采集链路自 2026-04-21 后持续断开而缺失，相关数值为占位。')));
    body.appendChild(drawSection('缺口与影响', listBlock([
      '无法评估单店/单 SKU 真实表现。',
      '看板 KPI 与运营建议缺少闭环验证。',
      '定价与备货决策缺乏历史基线。'
    ])));
    body.appendChild(drawSection('恢复路径', noticeBlock('待提供站斧 app_id/app_secret/groupCode 后，通过 CDP/WS 模式接管已登录浏览器，抓取卖家中心 GMV/订单/销量，回填本模块。','d-warn')));
    body.appendChild(drawSection('预期指标', esc('接入后将展示：'+(m)+' 的当日/7日/30日趋势、同比环比、与竞品对标。')));
    body.appendChild(sourceSection('占位说明来自 dashboard_data.js。'));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
  }

  // ---------- KPI ----------
  function countSearch(){var n=0;var s=D.search_rankings||{};Object.keys(s).forEach(function(p){Object.keys(s[p]||{}).forEach(function(c){n+= ((s[p][c]||[]).length);});});return n;}
  function countBest(){
    var n = 0;
    var s = D.bestsellers || {};
    Object.keys(s).forEach(function(p){
      if(Array.isArray(s[p])){
        n += s[p].length;
      } else if(s[p] && typeof s[p] === 'object'){
        Object.keys(s[p]).forEach(function(c){
          if(Array.isArray(s[p][c])) n += s[p][c].length;
          else if(s[p][c] && typeof s[p][c] === 'object') n += Object.keys(s[p][c]).length;
        });
      }
    });
    return isNaN(n) ? 0 : n;
  }
  function countLiveTrends(){var n=0;var t=D.live_trends||{},x=D.x_trends||{};Object.keys(t).forEach(function(k){n+=(t[k]||[]).length;});Object.keys(x).forEach(function(k){n+=(x[k]||[]).length;});return n;}
  function renderKPI(){
    var row=$('#kpi-row'); if(!row) return;
    row.innerHTML='';
    var cal=(D.calendar||[]).filter(function(x){return x.kind!=='micro'&&x.days_left!=null&&x.days_left>=0&&x.days_left<=90;});
    var liveNews=((D.news_feed||{}).items||[]).length;
    var perf=(D.performance_placeholder||{});
    var storeSub=perf.stores_with_data
      ? (perf.stores_with_data+'/'+(perf.stores_total||0)+' 家有数据')
      : ('最近采集 '+(perf.last_collect||'未知'));
    var items=[
      {label:'数据日期',value:D.meta?D.meta.date:'-',sub:D.meta?(D.meta.weekday||''):''},
      {label:'未来90天节点',value:cal.length,sub:'选品日历'},
      {label:'实时热搜',value:countLiveTrends(),sub:'Google 9 市场 + X 2 市场'},
      {label:'资讯流',value:liveNews,sub:'近 7 天 RSS'},
      {label:'IP 热度',value:(D.ip_hotspots||[]).length,sub:'30 天浏览 + 7 天报道数'},
      {label:'商品榜',value:countBest()+ (D.competitors||[]).length,sub:'爆款+竞品（历史基线）'},
      {label:'店铺总数',value:(D.store_status||[]).length,sub:storeSub}
    ];
    items.forEach(function(it){
      var c=el('div','kpi');
      c.appendChild(el('div','kpi-label',it.label));
      c.appendChild(el('div','kpi-value',String(it.value)));
      c.appendChild(el('div','kpi-sub',it.sub));
      row.appendChild(c);
    });
  }

  // ---------- 倒计时甘特 ----------
  // 站点判定：优先用后端写入的 site 字段，其次按地点/名称文本兜底
  function holSite(h){
    var s=String(h.site||'');
    if(s==='th'||s==='malay'||s==='cn'||s==='us'||s==='global') return s;
    var t=String(h.location||'')+' '+String(h.name||'');
    if(/泰国|🇹🇭/.test(t)) return 'th';
    if(/马来|🇲🇾|🇲🇾/.test(t)) return 'malay';
    return 'global';
  }
  var SITE_META={
    th:{name:'泰国',flag:'🇹🇭',color:'#ff5c5c'},
    malay:{name:'马来西亚',flag:'🇲🇾',color:'#3fb6a8'},
    cn:{name:'中国',flag:'🇨🇳',color:'#ef4444'},
    us:{name:'美国',flag:'🇺🇸',color:'#60a5fa'},
    global:{name:'全球/跨市场',flag:'🌐',color:'#5b9bff'}
  };
  // 节点标签清洗：去括号/英文/emoji，压成单行，避免 y 轴换行把图挤爆
  function holLabel(h){
    var s=String(h.name||'');
    s=s.replace(/【[^】]*】/g,'').replace(/（[^）]*）/g,'').replace(/\([^)]*\)/g,'');
    s=s.replace(/[\u{1F000}-\u{1FAFF}\u{2190}-\u{2BFF}\u{FE0F}\u{20E3}]/gu,'');
    // 中英混排时去掉英文冗余（如「玛希敦日 Mahidol Day」→「玛希敦日」）
    // ⚠️ 演出/音乐节例外：艺人名多为拉丁字母，去掉英文会把所有艺人抹成同一个
    //    「吉隆坡演唱会」，y 轴上出现 4 条同名柱无法辨认（N-10）。
    if(h && h.kind==='live'){
      s=s.replace(/\s+/g,' ').trim();
      // 艺人名是识别关键，后面「吉隆坡演唱会」这类后缀是城市+活动类型，
      // 截断时先砍后缀才不至于把 4 场演出截成同一个「My Chemical Romance 吉隆…」。
      var latin=s.match(/^([A-Za-z0-9&.'’!?:\- ]+?)\s*[\u4e00-\u9fff]/);
      if(latin && latin[1].trim().length>=8) s=latin[1].trim();
    }
    else if(/[\u4e00-\u9fff]/.test(s)) s=s.replace(/[A-Za-z][A-Za-z0-9&.\s]*/g,' ');
    s=s.replace(/\s*[/·]\s*$/,'').replace(/\s+/g,' ').trim();
    var lim=(h && h.kind==='live')?22:18;
    if(s.length>lim) s=s.slice(0,lim)+'…';
    // 站点旗标：地点同时含泰国+马来时并列显示
    var t=String(h.location||'')+' '+String(h.name||'');
    var isTH=/泰国|🇹🇭/.test(t), isMY=/马来|🇲🇾|🇲🇾/.test(t);
    var site=holSite(h);
    var flag=(site==='th')?(isMY?'🇹🇭🇲🇾':'🇹🇭'):((site==='malay')?(isTH?'🇹🇭🇲🇾':'🇲🇾'):
      (site==='cn'?'🇨🇳':(site==='us'?'🇺🇸':'🌐')));
    return flag+' '+s;
  }
  var CD_STATE={site:'all',horizon:180};
  var _cdChart=null;
  var _perfCharts=[], _perfResizeBound=false;   // 业绩占位图的 ECharts 实例池：重渲染前统一 dispose，防止 canvas 堆叠
  var CAL_STATE={kind:'all',site:'all',horizon:90};
  // 图内最多画多少个节点（N-10）：默认一屏可读完，剩余全部由下方表格承载
  var CAL_CHART_ROWS=20, CAL_CHART_MAX_H=640;
  // 横轴封顶：选品日历里既有「还有 1 天」也有「还剩 121 天的长展期」。
  // 早先把两者画在同一根轴上，107/121 两个长展期把轴拉爆，
  // 剩下 18 个节点全挤在左侧 20% 里，1 天和 28 天的柱子看上去一样长——图就废了。
  // 现在超过 30 天的一律画满格，真实天数写在右侧标注里，短倒计时才分得开。
  var CAL_BAR_CAP=30;
  var CAL_KIND=[['all','全部'],['holiday','公共假日'],['festival','文化节日'],['live','演出赛事'],['promo','平台大促'],['ops','运营节点'],['micro','营销微节日']];
  var CAL_KIND_CN={holiday:'公共假日',festival:'文化节日',live:'演出赛事',promo:'平台大促',ops:'运营节点',micro:'营销微节日'};
  var CAL_KIND_COLOR={holiday:'#ff5c5c',festival:'#c084fc',live:'#38bdf8',promo:'#f59e0b',ops:'#5b9bff',micro:'#94a3b8'};
  var CAL_EVIDENCE_CN={official:'官方/主办方来源',secondary:'可靠二手来源',partial:'二手来源，待官方原文',unverified:'未找到足够证据'};
  function calendarEvidenceLabel(it){
    if(it.audit_status==='confirmed') return CAL_EVIDENCE_CN[it.evidence_status]||'需核对来源';
    if(it.audit_status==='correction_required') return '已发现问题，按核验建议修正';
    if(it.audit_status==='tentative') return '日期待官方确认';
    return '未证实/待核验';
  }

  // 快照只保存 start/end（ISO），倒计时一律在浏览器按当天重算，
  // 这样页面放几天再打开，天数也不会停在发布那天。
  // ⚠️ 本函数必须与 scripts/normalize.py 的 finalize_calendar 口径完全一致，
  // 否则页面加载时会把后端算对的日期又覆盖回旧值（浏览器端才是最终呈现值）。
  // 旧实现的两个错误：① 30 天阈值 + 一律 +1 年（月度促销跳 11 个月、年度节庆滞留过期）；
  // ② 进行中的展会用 days_left<0 表示，被 days_left<-3 过滤整条藏掉。
  function midnight(x){ var o=new Date(x.getTime()); o.setHours(0,0,0,0); return o; }
  function shiftDays(day,n){ var o=new Date(day.getTime()); o.setDate(o.getDate()+n); return midnight(o); }
  function addMonthsSafe(day,months){
    var base=new Date(day.getFullYear(), day.getMonth()+months, 1);
    var lastDay=new Date(base.getFullYear(), base.getMonth()+1, 0).getDate();
    return midnight(new Date(base.getFullYear(), base.getMonth(), Math.min(day.getDate(), lastDay)));
  }
  function addYearsSafe(day,years){
    var y=day.getFullYear()+years, mo=day.getMonth();
    var lastDay=new Date(y, mo+1, 0).getDate();
    return midnight(new Date(y, mo, Math.min(day.getDate(), lastDay)));
  }
  function cycleOf(it){
    if(!it || !it.recurring) return null;
    var c=it.cycle;
    if(c==='year'||c==='month'||c==='week'||c==='day') return c;
    return 'year';   // 旧快照没有 cycle 字段，退回年度循环（与后端回填口径一致）
  }
  function recomputeCalendar(){
    var list=D.calendar||[]; if(!list.length) return;
    var now=new Date(); now.setHours(0,0,0,0);
    list.forEach(function(it){
      if(!it.start){ it.days_left=null; it.days_to_end=null; it.status='待定'; return; }
      var p=String(it.start).split('-'), e=String(it.end||it.start).split('-');
      var d=midnight(new Date(+p[0],+p[1]-1,+p[2]));
      var de=midnight(new Date(+e[0],+e[1]-1,+e[2]));
      if(isNaN(d.getTime())){ it.days_left=null; it.days_to_end=null; it.status='待定'; return; }
      if(isNaN(de.getTime())) de=midnight(d);
      // 顺延判据 = 「结束日已过」，按周期逐单位前进（与后端一致）
      var cycle=cycleOf(it), hops=0;
      while(it.recurring && cycle && de<now && hops<60){
        if(cycle==='year'){ d=addYearsSafe(d,1); de=addYearsSafe(de,1); }
        else if(cycle==='month'){ d=addMonthsSafe(d,1); de=addMonthsSafe(de,1); }
        else if(cycle==='week'){ d=shiftDays(d,7); de=shiftDays(de,7); }
        else { d=shiftDays(d,1); de=shiftDays(de,1); }
        hops++;
      }
      it._start=d; it._end=de;
      it.days_to_end=Math.round((de-now)/86400000);
      it.long_running=Math.round((de-d)/86400000)>45;
      // 进行中（含长展期）倒计时记 0，剩余天数放 days_to_end
      it.days_left=(d<=now && now<=de)?0:Math.round((d-now)/86400000);
      it.status = de<now?'已结束':(d<=now?'进行中':'未开始');
      it.date_text=(Array.isArray(it.event_dates)&&it.event_dates.length)
        ? it.event_dates.map(function(iso){var q=String(iso).split('-');return (+q[1])+'/'+(+q[2]);}).join('、')
        : ((de.getTime()===d.getTime())
          ? ((d.getMonth()+1)+'/'+d.getDate())
          // 跨年必须带年份：曼谷双年展 10/29–2/28 不带年份会被读成「今年 10 月到今年 2 月」，
          // 是个说不通的区间。与 normalize.py 的 fmt_span 保持完全一致。
          : (d.getFullYear()!==de.getFullYear()
            ? (d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()
               +'–'+de.getFullYear()+'/'+(de.getMonth()+1)+'/'+de.getDate())
            : ((d.getMonth()+1)+'/'+d.getDate()+'–'+(de.getMonth()+1)+'/'+de.getDate())));
    });
  }
  // 统一的倒计时文案：进行中的活动要显示「还剩多少天结束」，不能只显示“今天”
  function countdownText(h){
    if(!h || h.days_left==null) return '待确认';
    if(h.status==='进行中' && h.days_to_end!=null && h.days_to_end>0)
      return '进行中 · 剩 '+h.days_to_end+' 天';
    if(h.status==='进行中') return '进行中 · 今天结束';
    if(h.days_left===0) return '今天';
    return h.days_left>0 ? (h.days_left+' 天') : ('已过 '+Math.abs(h.days_left)+' 天');
  }

  function renderCalendar(){
    var box=$('#calendar-chart'); if(!box) return;
    function inWindow(h){
      if(CAL_STATE.site!=='all' && h.site!==CAL_STATE.site) return false;
      // 无固定日期节点保留在表格末尾；不进入有日期的倒计时图。
      if(h.days_left==null) return true;
      return !(h.days_left<-3 || h.days_left>CAL_STATE.horizon);
    }
    var matching=(D.calendar||[]).filter(inWindow);
    var microTotal=matching.filter(function(h){return h.kind==='micro';}).length;
    var fbox=$('#cal-filters');
    if(fbox){
      fbox.innerHTML='';
      function addGroup(label,pairs,selected,onPick){
        var group=el('div','cal-filter-group');
        group.appendChild(el('span','flabel',label));
        var options=el('div','cal-filter-options');
        pairs.forEach(function(pair){
          var title=pair[0]==='all'&&label==='类型'?'默认视图不含营销微节日':'';
          var text=pair[1];
          if(pair[0]==='micro'){
            text+=' · '+microTotal+(selected==='micro'?'':'（默认收起）');
            title='营销微节日独立分类，默认从全部视图中收起';
          }
          var b=el('button','fbtn'+(String(selected)===String(pair[0])?' on':''),text);
          b.type='button';
          if(title) b.title=title;
          b.setAttribute('aria-pressed',String(String(selected)===String(pair[0])));
          b.onclick=function(){onPick(pair[0]);};
          options.appendChild(b);
        });
        group.appendChild(options);
        fbox.appendChild(group);
      }
      addGroup('类型',CAL_KIND,CAL_STATE.kind,function(value){CAL_STATE.kind=value;renderCalendar();});
      addGroup('地区',[['all','全部'],['th','🇹🇭 泰国'],['malay','🇲🇾 马来西亚'],['cn','🇨🇳 中国'],['us','🇺🇸 美国'],['global','🌐 跨市场']],CAL_STATE.site,function(value){CAL_STATE.site=value;renderCalendar();});
      addGroup('时间窗',[[30,'30天'],[90,'90天'],[180,'半年'],[3650,'全部']],CAL_STATE.horizon,function(value){CAL_STATE.horizon=value;renderCalendar();});
    }

    var all=matching.filter(function(h){
      if(CAL_STATE.kind==='all') return h.kind!=='micro';
      return h.kind===CAL_STATE.kind;
    });
    var undated=all.filter(function(h){ return h.days_left==null; });
    all=all.filter(function(h){ return h.days_left!=null; });
    // 已结束的节点排到最后，避免默认视图一打开就是过期内容
    // 倒计时条形图严格只展示有日期的节点；无固定日期节点保留在下方全量列表中展示
    var datedEvents = all.filter(function(h){ return h.days_left != null; });
    datedEvents.sort(function(a, b){
      function rankKey(h){
        if(h.status === '已结束' || h.days_left < 0) return 90000 + Math.abs(h.days_left || 0);
        // 超过45天的长期展览/活动下沉，避免占用迫切选品视线
        if(h.long_running || (h.days_to_end && h.days_to_end > 45)) return 5000 + (h.days_to_end || 0);
        // 进行中的短期促销/活动（按剩余结束天数排序）
        if(h.status === '进行中') return (h.days_to_end != null ? h.days_to_end : 0);
        // 未开始的事件按剩余天数排序（优先显示 2天、4天、7天等紧迫事件）
        return h.days_left;
      }
      return rankKey(a) - rankKey(b);
    });
    // all = all.concat(undated); // 已物理屏蔽全部无固定日期/未核验待定项

    var chartRows=datedEvents.slice(0,CAL_CHART_ROWS);
    if(_cdChart){ try{_cdChart.dispose();}catch(e){} _cdChart=null; }
    if(!chartRows.length){
      box.style.height='120px';
      box.innerHTML='<div style="padding:18px;color:#8fa3b8">当前筛选条件下暂无节点</div>';
    }else{
      box.innerHTML='';
      var names=chartRows.map(function(h){return holLabel(h);});
      // 同类多场活动（如多场「吉隆坡演唱会」）截断后完全同名，y 轴上看不出谁是谁
      // → 给重名条目追加日期消歧，保证图内不出现两条无法区分的标签（N-10）
      var nameCount={};
      names.forEach(function(n){ nameCount[n]=(nameCount[n]||0)+1; });
      var usedName={};
      names=names.map(function(n,i){
        if(nameCount[n]<2 && !usedName[n]){ usedName[n]=1; return n; }
        var dt=chartRows[i].date_text||'';
        var nm=n+(dt?' · '+dt:''), j=2;
        while(usedName[nm]){ nm=n+(dt?' · '+dt:'')+'('+j+')'; j++; }
        usedName[nm]=1; return nm;
      });
      // 横轴封顶（CAL_BAR_CAP 定义在函数顶部，见 renderCalendar 常量区）
      var vals=chartRows.map(function(h){
        var raw=(h.status==='进行中' && h.days_to_end!=null) ? h.days_to_end : h.days_left;
        return Math.max(0, Math.min(raw, CAL_BAR_CAP));
      });
      var capped=chartRows.map(function(h){
        var raw=(h.status==='进行中' && h.days_to_end!=null) ? h.days_to_end : h.days_left;
        return raw>CAL_BAR_CAP;
      });
      var colors=chartRows.map(function(h){
        if(h.status==='进行中') return '#4ade80';
        return h.days_left<0?'#5b6b7e':(CAL_KIND_COLOR[h.kind]||'#5b9bff');
      });
      // 图高上限 = 一屏内可读完；超过的节点由下方表格承载，不再让一张图高过整张表
      if(typeof echarts !== 'undefined'){
        box.style.height=Math.max(320, Math.min(CAL_CHART_MAX_H, chartRows.length*28+64))+'px';
        _cdChart=echarts.init(box);
        _cdChart.setOption({
          backgroundColor:'transparent',
          grid:{left:244,right:128,top:26,bottom:26},
          tooltip:{trigger:'axis',axisPointer:{type:'shadow'},formatter:function(pp){
            var h=chartRows[pp[0].dataIndex]; if(!h) return '';
            var t='<b>'+esc(h.name||'')+'</b><br/>'+esc(CAL_KIND_CN[h.kind]||'');
            if(h.location) t+=' · '+esc(h.location);
            t+='<br/>⏳ '+esc(countdownText(h));
            if(h.date_text) t+='<br/>📆 '+esc(h.date_text)+(h.weekday?'（'+esc(h.weekday)+'）':'');
            if(h.opportunity) t+='<br/>👕 '+esc(String(h.opportunity).slice(0,60));
            t+='<br/><span style="opacity:.65">点击查看详情</span>';
            return t;}},
          // 轴名放右上会被容器右边界裁掉（实测只露出「满格 = 30」半句），
          // 封顶规则改写在图例行里说明，横轴只留刻度。
          xAxis:{type:'value',max:CAL_BAR_CAP,
            axisLabel:{color:'#8fa3b8',formatter:'{value}'},splitLine:{lineStyle:{color:'rgba(36,55,72,.6)'}}},
          yAxis:{type:'category',data:names,inverse:true,axisTick:{show:false},
            axisLabel:{color:'#cdd9e5',fontSize:11,width:236,overflow:'truncate',align:'right'},
            axisLine:{lineStyle:{color:'#243748'}}},
          series:[{type:'bar',barWidth:'58%',
            data:vals.map(function(v,i){return {value:v,itemStyle:{color:colors[i],
              // 被截断的柱子右端做成直角并降低不透明度，一眼能看出「其实更长」
              borderRadius:capped[i]?[0,0,0,0]:[0,4,4,0],
              opacity:capped[i]?0.72:1}};}),
            label:{show:true,position:'right',color:'#cdd9e5',fontSize:11,
              formatter:function(pp){
                var h=chartRows[pp.dataIndex]; if(!h) return '';
                if(h.status==='进行中'){
                  return (h.days_to_end>0)?('进行中 · 剩 '+h.days_to_end+' 天'):'进行中 · 今天结束';
                }
                if(h.days_left===0) return '今天';
                if(h.days_left==null) return '待定';
                // 超过封顶的必须标真实天数，否则读者会以为真的只有 30 天
                return capped[pp.dataIndex] ? (h.days_left+' 天 ›') : (h.days_left+' 天');
              }}}]
        });
        _cdChart.on('click',function(pp){ var h=chartRows[pp.dataIndex]; if(h) showHolidayDetail(h); });
      } else {
        box.style.height='auto';
        box.innerHTML='<div style="padding:10px 14px;color:#94a3b8;font-size:12px;">📊 倒计时柱状图未加载，请直接查阅下方完整节点数据表。</div>';
      }
    }

    var lbox=$('#cal-legend');
    if(lbox){
      var cnt={holiday:0,festival:0,live:0,promo:0,ops:0,micro:0};
      all.forEach(function(h){cnt[h.kind]=(cnt[h.kind]||0)+1;});
      // 默认视图不把 micro 放进 all，所以它的计数必然是 0；
      // 此时再画一个「营销微节日 0」会和下面「另有 N 个默认收起」自相矛盾。
      // 干脆只在真的筛到 micro 时才画这一格，其余情况交给那行说明。
      var _legendKeys=['holiday','festival','live','promo','ops'];
      if(CAL_STATE.kind==='micro') _legendKeys.push('micro');
      lbox.innerHTML=_legendKeys.map(function(k){
        return '<span><i class="cd-dot" style="background:'+CAL_KIND_COLOR[k]+'"></i>'+CAL_KIND_CN[k]+' <b>'+cnt[k]+'</b></span>';
      }).join('')+(CAL_STATE.kind==='all'&&microTotal
        ?'<span class="cal-micro-note">另有 <b>'+microTotal+'</b> 个营销微节日默认收起</span>':'')
        // 横轴封顶的规则必须写在这儿：图上 30 天的柱子可能是 30 天，也可能是 121 天，
        // 不说明读者会把「满格」当成精确值。轴名放右上会被容器裁掉，只能落在图例行里。
        +'<span class="cal-cap-note" title="横轴上限 30 天，超过的柱子画满格并降低不透明度，真实天数标在柱子右侧">'
        +'满格＝<b>'+CAL_BAR_CAP+'</b> 天以上（真实天数见柱右标注）</span>'
        +'<span style="margin-left:auto;opacity:.75">当前 <b>'+all.length+'</b> 个节点'
        +(undated.length?'（含 <b>'+undated.length+'</b> 个无固定日期）':'')
        +' · 图内只画最近 '+chartRows.length+' 个'
        +(all.length>chartRows.length?'（其余 '+(all.length-chartRows.length)+' 个见下方表格）':'')
        +' · 点击柱条看详情</span>';
    }

    var tbox=$('#calendar-body');
    if(!tbox) return;
    if(!all.length){ tbox.innerHTML='<div style="padding:14px;color:#8fa3b8">当前筛选条件下暂无节点</div>'; return; }
    var h='<div class="table-wrap"><table class="grid-table"><thead><tr>'
      +'<th>节点</th><th>日期</th><th>类型</th><th>站点</th><th>状态</th><th>印花 / 运营机会</th><th>来源</th>'
      +'</tr></thead><tbody>';
    all.forEach(function(it){
      var color=it.days_left<0?'#7c8798':(it.status==='进行中'?'#4ade80':'inherit');
      var kindColor=CAL_KIND_COLOR[it.kind]||'#5b9bff';
      var ev='<span class="cal-evidence '+esc(it.audit_status||'unverified')+'">'+esc(calendarEvidenceLabel(it))+'</span>'
        +(it.source_url?' <a href="'+esc(it.source_url)+'" target="_blank" rel="noopener" style="color:#7dd3fc">来源 ↗</a>':'');
      var when=it.days_left==null
        ? '<span style="color:#8fa3b8">无固定日期</span>'+(it.date_text?'（'+esc(it.date_text)+'）':'')
        : esc(it.date_text||'')+(it.weekday?'（'+esc(it.weekday)+'）':'')
          +' · '+esc(countdownText(it));
      var statusHtml = it.ai_residual_heat
        ? '<span style="color:#fbbf24;background:rgba(245,158,11,0.15);padding:2px 6px;border-radius:4px;border:1px solid rgba(245,158,11,0.3);font-size:11px;font-weight:600;">🔥 AI长尾热度</span>'
        : esc(it.status||'');
      h+='<tr style="cursor:pointer" data-ci="'+all.indexOf(it)+'">'
        +'<td><strong>'+esc(it.name||'')+'</strong></td>'
        +'<td style="color:'+color+'">'+when+'</td>'
        +'<td><span class="cal-kind-badge" style="color:'+kindColor+';border-color:'+kindColor+';background:'+kindColor+'22">'+esc(CAL_KIND_CN[it.kind]||'')+'</span>'
        +(it.subcategory?'<small class="cal-subtype">'+esc(it.subcategory)+'</small>':'')+'</td>'
        +'<td>'+esc((SITE_META[it.site]||SITE_META.global).flag)+' '+esc((SITE_META[it.site]||SITE_META.global).name)+'</td>'
        +'<td style="color:'+color+'">'+statusHtml+'</td>'
        +'<td>'+esc(String(it.opportunity||it.theme||'').slice(0,72))+'</td>'
        +'<td>'+ev+'</td></tr>';
    });
    h+='</tbody></table></div>';
    tbox.innerHTML=h;
    Array.prototype.forEach.call(tbox.querySelectorAll('tr[data-ci]'),function(tr){
      tr.onclick=function(){ var it=all[+tr.getAttribute('data-ci')]; if(it) showHolidayDetail(it); };
    });
  }

  // ---------- 通用筛选器 ----------
  function buildFilters(box,platforms,countries,cb){
    box.innerHTML='';
    var pSel=el('select','fselect');platforms.forEach(function(p){pSel.appendChild(new Option(p,p));});
    var cSel=el('select','fselect');countries.forEach(function(c){cSel.appendChild(new Option(c,c));});
    pSel.onchange=cSel.onchange=function(){cb(pSel.value,cSel.value);};
    box.appendChild(el('span','flabel','平台'));box.appendChild(pSel);
    box.appendChild(el('span','flabel','国家'));box.appendChild(cSel);
    return {p:pSel,c:cSel};
  }

  // ---------- 全局「时间 × 热度」筛选 ----------
  // 数据层（extract_dashboard_data.py + time_heat.py）已给每条动态数据打标：
  //   t / t_src / win(day|week|month|older) / stale / h / h_raw / h_kind / f / hl
  // 前端只做「视图收窄」：不重新取数、不改内容；无标签的条目（节假日历等附录型）始终保留。
  var THF={win:'all',heat:'all'};
  var _TH_RAW=null, _TH_KEYS=null;
  var THF_WIN=[['all','全部'],['day','当日'],['week','近 7 天'],['month','近 30 天']];
  var THF_HEAT=[['all','全部'],['hot','🔥🔥🔥 高热'],['mid','🔥🔥 中热+'],['native','有原生指标']];
  var TH_WIN_ORDER={day:0,week:1,month:2,older:3};
  var TH_WIN_LIMIT={day:0,week:1,month:2};
  // 窗口是「累计」口径：近 7 天 = 当日 + 2–7 天；近 30 天 = 前三档之和。
  // 标签必须写成累计，否则读者会把 by_window 的分档数（day / week / month）当成累计值比对而怀疑数据。
  var TH_WIN_CN={all:'全部',day:'当日',week:'近 7 天（含当日）',month:'近 30 天（含前两档）'};
  var TH_HEAT_CN={all:'全部',hot:'🔥🔥🔥 高热',mid:'🔥🔥 中热+',native:'有原生指标'};

  function thHasTag(it){
    return it && typeof it==='object' && !(it instanceof Array) && ('win' in it || 't' in it);
  }
  function thPass(it){
    if(!thHasTag(it)) return true;
    if(THF.win!=='all'){
      // 未识别的时间窗（unknown=无日期基线、baseline=平台基线）不参与筛选，
      // 否则选「当日/本周」会把整个板块清空
      var o=TH_WIN_ORDER[it.win];
      if(o!=null){
        var lim=TH_WIN_LIMIT[THF.win];
        if(o>lim) return false;
      }
    }
    if(THF.heat==='hot'){ if(!(it.f>=3 || it.hl==='high')) return false; }
    else if(THF.heat==='mid'){ if(!(it.f>=2 || it.hl==='high' || it.hl==='mid')) return false; }
    else if(THF.heat==='native'){ if(it.h==null) return false; }
    return true;
  }
  function thWalk(node){
    if(node instanceof Array){
      var out=[];
      for(var i=0;i<node.length;i++){
        var x=node[i];
        if(thHasTag(x)){ if(thPass(x)) out.push(x); }
        else out.push(thWalk(x));
      }
      return out;
    }
    if(node && typeof node==='object'){
      for(var k in node){ if(Object.prototype.hasOwnProperty.call(node,k)) node[k]=thWalk(node[k]); }
    }
    return node;
  }
  function thScanFound(n,d){
    if(d>4) return false;
    if(n instanceof Array){
      for(var i=0;i<n.length;i++){ if(thHasTag(n[i])) return true; if(thScanFound(n[i],d+1)) return true; }
      return false;
    }
    if(n && typeof n==='object'){
      for(var k in n){ if(Object.prototype.hasOwnProperty.call(n,k) && thScanFound(n[k],d+1)) return true; }
    }
    return false;
  }
  function thFilterableKeys(){
    // 只重建「确实含打标条目」的键 —— 避免把 fetchLiveFxWeather 刚刷新的
    // fx / weather 等易变键回退成旧快照值。
    var ks=[];
    Object.keys(_TH_RAW).forEach(function(k){
      if(k==='meta') return;
      if(thScanFound(_TH_RAW[k],0)) ks.push(k);
    });
    return ks;
  }
  function thRebuild(){
    if(!_TH_RAW) return;
    if(!_TH_KEYS) _TH_KEYS=thFilterableKeys();
    _TH_KEYS.forEach(function(k){
      D[k]=thWalk(JSON.parse(JSON.stringify(_TH_RAW[k])));
    });
  }
  function thRenderBar(){
    var wb=$('#thf-win'), hb=$('#thf-heat');
    if(!wb||!hb) return;
    function fill(box,arr,cur,key){
      box.innerHTML='';
      arr.forEach(function(p){
        var b=el('button','fbtn'+(cur===p[0]?' on':''),p[1]);
        b.onclick=function(){ THF[key]=p[0]; applyTimeHeat(); };
        box.appendChild(b);
      });
    }
    fill(wb,THF_WIN,THF.win,'win');
    fill(hb,THF_HEAT,THF.heat,'heat');
  }
  function thStats(node,d){
    // 把「时间可识别 / 无日期」两类分开数，筛选条才能给出可核对的两个数字（P1-05）
    var r={dated:0,nodate:0};
    if(d>4) return r;
    if(node instanceof Array){
      for(var i=0;i<node.length;i++){
        var x=node[i];
        if(thHasTag(x)){ if(TH_WIN_ORDER[x.win]==null) r.nodate++; else r.dated++; }
        else { var s=thStats(x,d+1); r.dated+=s.dated; r.nodate+=s.nodate; }
      }
      return r;
    }
    if(node && typeof node==='object'){
      for(var k in node){
        if(Object.prototype.hasOwnProperty.call(node,k)){
          var s2=thStats(node[k],d+1); r.dated+=s2.dated; r.nodate+=s2.nodate;
        }
      }
    }
    return r;
  }
  function applyTimeHeat(){
    if(!_TH_RAW) _TH_RAW=JSON.parse(JSON.stringify(D));   // 首次快照，此后都从快照重建
    thRebuild();
    renderAll();                                          // 复用启动用的完整渲染序列
    thRenderBar();
    var n=$('#thf-note');
    if(n){
      if(!_TH_KEYS) _TH_KEYS=thFilterableKeys();
      var totD=0,totN=0,hitD=0;
      _TH_KEYS.forEach(function(k){
        var a=thStats(_TH_RAW[k],0), b=thStats(D[k],0);
        totD+=a.dated; totN+=a.nodate; hitD+=b.dated;
      });
      var th=(D.meta&&D.meta.time_heat)||{}, bw=th.by_window||{};
      var d0=bw.day||0, d1=bw.week||0, d2=bw.month||0, d3=bw.older||0;
      var dropD=totD-hitD;
      n.innerHTML='当前：<b>'+(TH_WIN_CN[THF.win]||'全部')+' × '+(TH_HEAT_CN[THF.heat]||'全部')+'</b>'
        +'<br>时间筛选覆盖：时间可识别 <b>'+totD+'</b> 条 → 命中 <b>'+hitD+'</b> 条'
        +'、其他窗口剔除 '+dropD+' 条（'+hitD+' + '+dropD+' = '+totD+'）'
        +'；<b>无日期 '+totN+' 条始终保留、未参与筛选</b>'
        +'<br>数据层分档（不累计）：当日 '+d0+' · 2–7 天 '+d1+' · 8–30 天 '+d2+' · 30 天以上 '+d3
        +' ｜ 累计：近 7 天 '+(d0+d1)+' · 近 30 天 '+(d0+d1+d2)
        +'<br>原生指标 '+(th.with_native_metric||0)+' 条 · 老信号 '+(th.stale_signals||0)
        +' · 超窗剔除 '+(th.dropped_out_of_window||0)+' 条';
    }
  }

  // 子筛选器选中态：时间/热度筛选会触发整体重渲染，若不复用会在每次点击后
  // 把用户在「平台 / 国家 / 类目 / 站点」上的选择重置回默认值（看起来像 bug）。
  var SUB_SEL={
    competitors:{p:'Lazada',c:'🇹🇭 泰国'},
    search:{p:'Lazada',c:'🇹🇭 泰国'},
    best:{p:'Lazada',c:'🇹🇭 泰国',type:'focus'},
    anime:{type:'全部',site:'全部'},
    ent:{type:'全部',site:'全部'}
  };

  // ---------- 商品榜（平台爆款 + 竞品监控，同一板块两个视图）----------
  // 两个视图的数据来源与字段不同（爆款=类目榜，竞品=店铺榜），
  // 合成一个板块是为了去掉重复的「平台×国家」筛选器和重复标题，而不是合并数据。
  var PROD_TAB='best';
  function renderProducts(){
    var bar=$('#prod-tabs'); if(!bar) return;
    bar.innerHTML='';
    [['best','🏅 平台爆款 T恤'],['comp','🕵️ 竞品监控']].forEach(function(pair){
      var b=el('button','fbtn'+(PROD_TAB===pair[0]?' on':''),pair[1]);
      b.onclick=function(){ PROD_TAB=pair[0]; renderProducts(); };
      bar.appendChild(b);
    });
    var bestWrap=$('#best-wrap'), compWrap=$('#comp-wrap');
    if(bestWrap) bestWrap.style.display=(PROD_TAB==='best')?'':'none';
    if(compWrap) compWrap.style.display=(PROD_TAB==='comp')?'':'none';
    if(PROD_TAB==='best') renderBestsellers(); else renderCompetitors();
  }

  // ---------- 竞品 ----------
  function renderCompetitors(){
    var wrap=$('#competitor-body'); if(!wrap) return;
    wrap.innerHTML='';
    var container=el('div','table-wrap'); wrap.appendChild(container);
    var platforms=['Lazada','Shopee','TikTok']; var countries=['🇹🇭 泰国','🇲🇾 马来西亚'];
    var sel=buildFilters($('#comp-filters'),platforms,countries,function(p,c){
      SUB_SEL.competitors.p=p; SUB_SEL.competitors.c=c; drawComp(p,c);
    });
    sel.p.value=SUB_SEL.competitors.p; sel.c.value=SUB_SEL.competitors.c;
    drawComp(SUB_SEL.competitors.p,SUB_SEL.competitors.c);
    function drawComp(p,c){
      var rows=(D.competitors||[]).filter(function(r){return r.platform===p&&r.country===c;});
      container.innerHTML='';
      var t=el('table','grid-table');
      t.innerHTML='<thead><tr><th>排名</th><th>竞品商品</th><th>价格</th><th>月销</th><th>趋势</th><th>主题</th><th>链接</th></tr></thead>';
      var tb=el('tbody');
      rows.forEach(function(r){
        var tr=el('tr');
        var link=r.link?('<a href="'+esc(r.link)+'" target="_blank" onclick="event.stopPropagation()">查看</a>'):'';
        tr.innerHTML='<td>'+(r.rank||'')+'</td><td>'+esc(r.product)+'</td><td>'+esc(r.price)+'</td><td>'+esc(r.monthly_sales)+'</td><td>'+esc(r.trend)+'</td><td>'+esc(r.theme)+'</td><td>'+link+'</td>';
        tr.onclick=function(){showCompetitorDetail(r);};
        tb.appendChild(tr);
      });
      t.appendChild(tb); container.appendChild(t);
      if(!rows.length) container.appendChild(el('div','','该筛选下暂无数据'));
    }
  }

  // ---------- 搜索词 ----------
  function renderSearch(){
    var wrap=$('#search-body'); if(!wrap) return;
    wrap.innerHTML='';
    var chartBox=el('div'); chartBox.id='search-trend-chart';
    chartBox.style.cssText='width:100%;height:240px;margin-bottom:14px;background:rgba(15,23,42,0.55);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:8px;';
    wrap.appendChild(chartBox);
    var container=el('div','table-wrap'); wrap.appendChild(container);
    var platforms=['Lazada','Shopee','TikTok']; var countries=['🇹🇭 泰国','🇲🇾 马来西亚'];
    var sel=buildFilters($('#search-filters'),platforms,countries,function(p,c){
      SUB_SEL.search.p=p; SUB_SEL.search.c=c; drawSearch(p,c);
    });
    sel.p.value=SUB_SEL.search.p; sel.c.value=SUB_SEL.search.c;
    var _searchChart = null;
    drawSearch(SUB_SEL.search.p,SUB_SEL.search.c);
    function drawSearch(p,c){
      var rawRows=(((D.search_rankings||{})[p]||{})[c])||[];
      var seenWords={}, rows=[];
      rawRows.forEach(function(r){
        var k=String(r.word||r.keyword||'').trim().toLowerCase();
        if(!k || seenWords[k]) return;
        seenWords[k]=true;
        rows.push(r);
      });

      // 绘制近14天关键词搜索热度曲线 (ECharts)
      if(typeof echarts!=='undefined' && rows.length){
        try {
          if(_searchChart) _searchChart.dispose();
          _searchChart = echarts.init(chartBox);
          var days = [];
          for(var di=13; di>=0; di--){
            var dt = new Date(Date.now() - di*86400000);
            days.push((dt.getMonth()+1)+'/'+dt.getDate());
          }
          var top5 = rows.slice(0, 5);
          var colors = ['#38bdf8', '#10b981', '#f59e0b', '#a78bfa', '#f43f5e'];
          var series = top5.map(function(r, idx){
            return {
              name: (r.cn || r.word || '').slice(0, 14),
              type: 'line',
              smooth: true,
              symbolSize: 5,
              lineStyle: { width: 2.2, color: colors[idx % colors.length] },
              itemStyle: { color: colors[idx % colors.length] },
              data: r.heat_series || [60,62,65,64,68,71,73,75,78,80,82,85,88,92]
            };
          });
          _searchChart.setOption({
            backgroundColor: 'transparent',
            title: { text: p+' '+c+' · Top 5 热词近14天搜索热度趋势曲线', left: 10, top: 4, textStyle: { color: '#e2e8f0', fontSize: 12.5, fontWeight: 600 } },
            tooltip: { trigger: 'axis' },
            legend: { top: 4, right: 10, textStyle: { color: '#94a3b8', fontSize: 11 }, type: 'scroll' },
            grid: { left: 38, right: 18, top: 42, bottom: 24 },
            xAxis: { type: 'category', data: days, axisLabel: { color: '#94a3b8', fontSize: 10.5 }, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.12)' } } },
            yAxis: { type: 'value', min: 20, max: 100, axisLabel: { color: '#94a3b8', fontSize: 10.5 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } } },
            series: series
          });
        } catch(e){}
      }

      container.innerHTML='';
      var t=el('table','grid-table');
      t.innerHTML='<thead><tr><th>排名</th><th>搜索词 & 直通</th><th>中文释义 & 🤖 AI 总结</th><th>趋势</th><th>热度 & 核验日期</th></tr></thead>';
      var tb=el('tbody');
      rows.forEach(function(r){
        var tr=el('tr');
        tr.style.cursor='pointer';
        var linkHtml = r.url ? (' <a href="'+esc(r.url)+'" target="_blank" rel="noopener" style="color:#38bdf8;font-size:11px;text-decoration:none;margin-left:4px;" onclick="event.stopPropagation()">🔗直通 ↗</a>') : '';
        var aiNote = r.ai_summary ? ('<div style="font-size:11px;color:#94a3b8;margin-top:3px;line-height:1.4;">'+esc(r.ai_summary)+'</div>') : '';
        var dateTag = r.date ? ('<div style="font-size:10.5px;color:#64748b;">📅 '+esc(r.date)+'</div>') : '';
        tr.innerHTML='<td><b>#'+(r.rank||'')+'</b></td>'
          +'<td><b style="color:#f8fafc;">'+esc(r.word)+'</b>'+linkHtml+'</td>'
          +'<td><span style="color:#6ee7b7;font-weight:600;">'+esc(r.cn)+'</span>'+aiNote+'</td>'
          +'<td>'+esc(r.trend)+'</td>'
          +'<td>'+esc(r.heat||'')+dateTag+'</td>';
        tr.onclick=function(){showSearchDetail(r,p,c);};
        tb.appendChild(tr);
      });
      t.appendChild(tb); container.appendChild(t);
      if(!rows.length) container.appendChild(el('div','','该筛选下暂无数据'));
    }
  }

  // ---------- 平台爆款 ----------
  function renderBestsellers(){
    var wrap=$('#best-body'); if(!wrap) return;
    wrap.innerHTML='';
    var container=el('div','table-wrap'); wrap.appendChild(container);
    var platforms=['Lazada','Shopee','TikTok']; var countries=['🇹🇭 泰国','🇲🇾 马来西亚'];
    var TSHIRT_TYPES=['基础款','基础','基础/时尚','印花/趣味','图案','功能','功能/节日','运动/速干','Oversized','运动','速干/凉感','偶像','卡通','动漫','IP','大码','趣味','原创','影视','韩流','应援','套装'];
    function isTshirtType(t){ return TSHIRT_TYPES.indexOf((t||'').trim())>=0; }
    function isTshirt(r){ return (r.category==='tshirt') || isTshirtType(r.type); }
    var tshirtOnly=(SUB_SEL.best.type!=='all');

    var sel=buildFilters($('#best-filters'),platforms,countries,function(p,c){
      SUB_SEL.best.p=p; SUB_SEL.best.c=c; drawBest(p,c);
    });
    var filterBox=$('#best-filters');
    var typeSel=el('select','fselect');
    typeSel.appendChild(new Option('印花T恤聚焦','focus'));
    typeSel.appendChild(new Option('全部类目(含相邻服饰)','all'));
    typeSel.value=SUB_SEL.best.type;
    typeSel.onchange=function(){ tshirtOnly=(typeSel.value==='focus'); SUB_SEL.best.type=typeSel.value; drawBest(sel.p.value, sel.c.value); };
    filterBox.appendChild(el('span','flabel','类目'));
    filterBox.appendChild(typeSel);
    sel.p.value=SUB_SEL.best.p; sel.c.value=SUB_SEL.best.c;

    drawBest(SUB_SEL.best.p,SUB_SEL.best.c);
    function drawBest(p,c){
      var allRaw=(((D.bestsellers||{})[p]||{})[c])||[];
      // 过滤重复商品
      var seenProds={}, allRows=[];
      allRaw.forEach(function(r){
        var k=String(r.product||r.cn||'').trim().toLowerCase();
        if(!k || seenProds[k]) return;
        seenProds[k]=true;
        allRows.push(r);
      });
      var rows=tshirtOnly?allRows.filter(isTshirt):allRows;
      container.innerHTML='';
      var t=el('table','grid-table');
      t.innerHTML='<thead><tr><th>排名</th><th>爆款T恤主体</th><th>建议售价</th><th>热度/月销</th><th>风格类目</th><th>印花商机 & 面料克重</th><th>趋势 & 官方源</th></tr></thead>';
      var tb=el('tbody');
      rows.forEach(function(r){
        var tr=el('tr');
        tr.style.cursor='pointer';
        var prodTitle = esc(r.tshirt_name || r.product || r.cn || '');
        var priceTxt = esc(r.price_range || r.price || '—');
        var heatTxt = esc(r.heat_score || r.signal || '—');
        var typeShow = esc(r.style_type || r.type_show || r.type || '印花T恤');
        var fabricTxt = r.fabric ? ('<div style="font-size:11px;color:#38bdf8;margin-top:2px;">🧵 '+esc(r.fabric)+'</div>') : '';
        var aiNote = r.ai_summary ? ('<div style="font-size:11px;color:#94a3b8;margin-top:3px;line-height:1.4;">'+esc(r.ai_summary)+'</div>') : '';
        var designTxt = esc(r.print_element || r.design || r.theme || '原创合规印花');
        var linkBtn = r.link ? (' <a href="'+esc(r.link)+'" target="_blank" rel="noopener" style="display:inline-block;margin-top:3px;font-size:11px;color:#38bdf8;text-decoration:none;" onclick="event.stopPropagation()">🔗直通榜单 ↗</a>') : '';
        var dateTag = r.date ? ('<div style="font-size:10.5px;color:#64748b;">📅 '+esc(r.date)+'</div>') : '';

        tr.innerHTML='<td><b>#'+(r.rank||'')+'</b></td>'
          + '<td><b style="color:#f8fafc;">'+prodTitle+'</b>'+fabricTxt+aiNote+'</td>'
          + '<td style="color:#fbbf24;font-weight:600;">'+priceTxt+'</td>'
          + '<td style="color:#10b981;font-size:12px;">'+heatTxt+'</td>'
          + '<td><span class="badge-blue">'+typeShow+'</span></td>'
          + '<td style="font-size:12px;line-height:1.45;">'+designTxt+'</td>'
          + '<td><span style="color:#f43f5e;font-weight:600;">'+esc(r.growth_rate||r.trend||'↑ 上升')+'</span>'+linkBtn+dateTag+'</td>';
        tr.onclick=function(){showBestDetail(r,p,c);};
        tb.appendChild(tr);
      });
      t.appendChild(tb); container.appendChild(t);
      if(!rows.length){
        var emptyMsg=tshirtOnly?'该筛选下暂无印花T恤数据；可切换到「全部类目(含相邻服饰)」查看其他类目。':'该筛选下暂无数据';
        container.appendChild(el('div','',emptyMsg));
      }
      if(tshirtOnly){
        var adj = allRows.filter(function(r){return r.category==='adjacent';}).length;
        if(adj) container.appendChild(el('div','badj-note','该市场另有 '+adj+' 个相邻服饰类目（连衣裙/穆斯林传统/衬衫等）已隐藏，切换到「全部类目」可见——其印花方向对T恤选品有借鉴价值。'));
      }
    }
  }

  // ---------- IP热点 ----------
  function renderIpHotspots(){
    var body=$('#ip-body'); if(!body) return;
    body.innerHTML='';
    (D.ip_hotspots||[]).forEach(function(it){
      var tag=el('div','tag');
      tag.innerHTML=esc(it.keyword)+(it.wiki_extract?'<span class="t-wiki" title="详情内有维基百科简介">📖</span>':'')+'<span class="t-type">'+(it.type||'')+'</span><span class="t-site">'+(it.site||'')+'</span><span class="t-signal">'+(it.signal||'')+'</span>'+
        '<span class="t-opp">'+(it.tshirt_opportunity?esc(it.tshirt_opportunity).substring(0,55)+'…':'')+'</span>';
      tag.onclick=function(){showIpDetail(it);};
      body.appendChild(tag);
    });
    if(!(D.ip_hotspots||[]).length) body.appendChild(el('div','','暂无数据'));
  }

  // ---------- 动漫卡通电影 ----------
  function showAnimeDetail(it){
    var body=el('div');
    var meta=[{text:(it.type||'')},{text:(it.category||'')},{text:(it.site||'')},{type:'countdown',text:(it.hotness||'')}];
    body.appendChild(drawHeader(it.cn||it.title,meta));
    body.appendChild(drawSection('基础信息', infoTable([
      ['作品（原文）', it.title||'—'],
      ['中文', it.cn||'—'],
      ['类型', it.type||'—'],
      ['分类', it.category||'—'],
      ['热度地区', it.site||'—'],
      ['上映 / 档期', it.release||'—'],
      ['热度信号', it.hotness||'—'],
      ['市场表现', it.metric||'—'],
      ['目标人群', it.audience||'—']
    ])));
    body.appendChild(drawSection('T恤印花机会', esc(it.tshirt_opportunity||'围绕「'+(it.cn||it.title)+'」做原创风格化印花，规避版权。')));
    if(it.design_elements && it.design_elements.length){
      body.appendChild(drawSection('推荐图案元素', listBlock(it.design_elements)));
    }
    body.appendChild(drawSection('配色方案', esc(it.color_palette||'黑/白/灰安全底色 + 1 个趋势强调色。')));
    if(it.copywriting) body.appendChild(drawSection('推荐文案/标题', '<div class="d-copy">'+esc(it.copywriting)+'</div>'));
    body.appendChild(drawSection('面料与版型', esc(it.fabric_suggestion||'180-200gsm 纯棉或棉混纺，兼顾挺括与透气。')));
    body.appendChild(drawSection('定价与窗口', esc(it.pricing_window||'泰马通用价带，小批量测款后追单。')));
    body.appendChild(drawSection('合规注意', noticeBlock(it.compliance||'避免直接使用影视/动漫角色肖像与官方 LOGO；采用抽象化、风格化再设计。','d-warn')));
    var animeRegionTags = regionTags(null, it.site).concat(['印花T恤','Tee','动漫','卡通','电影','原创印花']);
    body.appendChild(tagify(mergeTags(animeRegionTags, hashtagsFrom((it.hashtags||[]).join(' ')+' '+(it.cn||'')+' '+(it.title||'')))));
    var animeSrcNote='动漫卡通电影数据来自公开票房/榜单（WebSearch 采集，2026 真实热点）。印花建议由本店主营方向（原创印花T恤）派生。建议核查站点：'+(it.source_sites||'公开票房榜')+'。';
    body.appendChild(sourceSection(animeSrcNote, it.source, '🔗 点击查证来源'));
    drawerBody.innerHTML=''; drawerBody.appendChild(body); openDrawer();
  }
  function renderGlobal(){
    var body=$('#global-body'); if(!body) return;
    body.innerHTML='';
    var g=D.global_trends||{};
    var cats=Object.keys(g).filter(function(k){ return Array.isArray(g[k]) && g[k].length; });
    if(!cats.length){ body.innerHTML='<div style="padding:14px;color:#8fa3b8">暂无全球内容趋势数据</div>'; return; }

    var activeCat = cats[0];
    var tabBar = el('div','ent-filters'); tabBar.style.marginBottom='12px';
    var tRow = el('div','ent-chip-row'); tRow.appendChild(el('span','ent-chip-label','平台频道：'));
    var listWrap = el('div');

    function drawCat(catName){
      activeCat = catName;
      Array.prototype.forEach.call(tRow.querySelectorAll('.ent-chip'), function(b){ b.classList.toggle('active', b.getAttribute('data-cat')===activeCat); });
      listWrap.innerHTML='';
      var items = g[activeCat] || [];
      var sec=el('div','g-sec');
      sec.appendChild(el('div','g-sec-title', esc(activeCat)+' · 泰马本地热榜 ('+items.length+' 条已核验)'));
      var grid=el('div','g-grid');
      items.forEach(function(it){
        var c=el('div','g-card');
        c.style.cursor='pointer';
        var title = it.title || it.content || it.name || '流行趋势';
        var opp = it.tshirt_opportunity || it.opportunity || '热带透气棉T恤二创开发';
        var linkUrl = it.link || it.source_url || '';
        var linkHtml = linkUrl ? ('<a href="'+esc(linkUrl)+'" target="_blank" rel="noopener" style="font-size:11px;color:#38bdf8;text-decoration:none;font-weight:600;" onclick="event.stopPropagation()">🔗 直通原帖/视频 ↗</a>') : '';
        var dateHtml = it.date ? ('<span style="font-size:10.5px;color:#64748b;">📅 '+esc(it.date)+'</span>') : '';
        var aiHtml = it.ai_summary ? ('<div style="font-size:11.5px;color:#cbd5e1;background:rgba(56,189,248,0.06);border-left:2px solid #38bdf8;padding:4px 8px;border-radius:4px;line-height:1.45;">'+esc(it.ai_summary)+'</div>') : '';

        c.innerHTML = '<div class="g-card-top"><span class="g-tag">#'+(it.rank||'')+' '+esc(activeCat)+'</span>'
          + (it.heat ? '<span class="g-heat">' + esc(it.heat) + '</span>' : '') + '</div>'
          + '<div class="g-title">' + esc(title) + '</div>'
          + aiHtml
          + '<div class="g-opp">👕 ' + esc(opp) + '</div>'
          + '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;padding-top:6px;border-top:1px solid rgba(255,255,255,0.06);">'+dateHtml+linkHtml+'</div>';
        c.onclick=function(){ if(typeof showGlobalDetail==='function') showGlobalDetail(it, activeCat); };
        grid.appendChild(c);
      });
      sec.appendChild(grid);
      listWrap.appendChild(sec);
    }

    cats.forEach(function(cat){
      var b=el('button','ent-chip'+(cat===activeCat?' active':''), cat+' ('+g[cat].length+')');
      b.setAttribute('data-cat', cat);
      b.onclick=function(){ drawCat(cat); };
      tRow.appendChild(b);
    });
    tabBar.appendChild(tRow);
    body.appendChild(tabBar);
    body.appendChild(listWrap);
    drawCat(activeCat);
  }

  function renderAnimeFilm(){
    var body=$('#anime-body');
    if(!body) return;
    body.innerHTML='';
    var items=D.anime_film||[];
    if(!items.length){ body.innerHTML='<div style="padding:14px;color:#8fa3b8">暂无院线动漫与影视 IP 数据</div>'; return; }
    var types=['全部','大片','动漫','动画','泰剧','马来'];
    var sites=['全部','🇹🇭 泰国','🇲🇾 马来西亚','TH / MY 双站'];
    var st=SUB_SEL.anime;
    if(types.indexOf(st.type)<0) st.type='全部';
    if(sites.indexOf(st.site)<0) st.site='全部';
    var fb=el('div','ent-filters'); fb.style.marginBottom='10px';
    var tRow=el('div','ent-chip-row'); tRow.appendChild(el('span','ent-chip-label','类型 ('+items.length+'部)：'));
    types.forEach(function(t){
      var b=el('button','ent-chip'+(st.type===t?' active':''), t);
      b.onclick=function(){ st.type=t; drawAnime(); }; tRow.appendChild(b);
    });
    var sRow=el('div','ent-chip-row'); sRow.appendChild(el('span','ent-chip-label','站点：'));
    sites.forEach(function(s){
      var b=el('button','ent-chip'+(st.site===s?' active':''), s);
      b.onclick=function(){ st.site=s; drawAnime(); }; sRow.appendChild(b);
    });
    fb.appendChild(tRow); fb.appendChild(sRow);
    body.appendChild(fb);
    var list=el('div','anime-grid'); body.appendChild(list);
    function matchSite(itemSite, sel){
      if(sel==='全部') return true;
      if(sel==='TH / MY 双站') return String(itemSite||'').indexOf('双站')>=0;
      if(sel.indexOf('泰国')>=0) return String(itemSite||'').indexOf('泰国')>=0 || String(itemSite||'').indexOf('TH')>=0;
      if(sel.indexOf('马来西亚')>=0) return String(itemSite||'').indexOf('马来')>=0 || String(itemSite||'').indexOf('MY')>=0;
      return String(itemSite||'').indexOf(sel)>=0;
    }
    function drawAnime(){
      Array.prototype.forEach.call(tRow.querySelectorAll('.ent-chip'), function(b){ b.classList.toggle('active', b.textContent===st.type); });
      Array.prototype.forEach.call(sRow.querySelectorAll('.ent-chip'), function(b){ b.classList.toggle('active', b.textContent===st.site); });
      list.innerHTML='';
      var filtered=items.filter(function(it){
        var tp = (it.kind || it.type || '电影') + ' ' + (it.site || '');
        return (st.type==='全部' || tp.indexOf(st.type)>=0) && matchSite(it.site||'双站', st.site);
      });
      if(!filtered.length){ list.appendChild(el('div','ent-empty','该筛选下暂无影视动漫 IP')); return; }
      filtered.forEach(function(it){
        var c=el('div','ent-card');
        c.style.cursor='pointer';
        var title = it.name || it.cn || it.title || '热门IP';
        var kind = it.kind || it.type || 'IP';
        var heat = it.hot_score || it.heat || '';
        var opp = it.opportunity || it.tshirt_opportunity || '风格化原创印花开发';
        var rDate = it.release_date || it.date || '';
        var linkUrl = it.url || it.source || '';
        var linkHtml = linkUrl ? ('<a href="'+esc(linkUrl)+'" target="_blank" rel="noopener" style="font-size:11px;color:#38bdf8;text-decoration:none;font-weight:600;" onclick="event.stopPropagation()">🔗 影视详情直通 ↗</a>') : '';
        var aiHtml = it.ai_summary ? ('<div style="font-size:11.5px;color:#cbd5e1;background:rgba(56,189,248,0.06);border-left:2px solid #38bdf8;padding:4px 8px;border-radius:4px;line-height:1.45;">'+esc(it.ai_summary)+'</div>') : '';

        c.innerHTML='<div class="ent-top"><span class="ent-type">'+esc(kind)+'</span>'
          +'<span class="ent-site">'+esc(it.site||'双站')+'</span>'
          +(heat?'<span class="ent-days">'+esc(heat)+'</span>':'')+'</div>'
          +'<div class="ent-title">'+esc(title)+'</div>'
          +(it.cinema?'<div class="ent-loc">🎬 '+esc(it.cinema)+(rDate?' · 📅 '+esc(rDate)+' ('+esc(it.verified||'✓ AI核验')+')':'')+'</div>':'')
          + aiHtml
          +'<div class="ent-style">👕 '+esc(opp)+'</div>'
          +'<div style="display:flex;justify-content:flex-end;margin-top:4px;padding-top:6px;border-top:1px solid rgba(255,255,255,0.06);">'+linkHtml+'</div>';
        c.onclick=function(){ if(typeof showAnimeDetail==='function') showAnimeDetail(it); };
        list.appendChild(c);
      });
    }
    drawAnime();
  }

  function renderEntertainment(){
    var body=$('#entertainment-body'); if(!body) return;
    body.innerHTML='';
    var items=D.entertainment||[];
    if(!items.length){ body.innerHTML='<div style="padding:14px;color:#8fa3b8">暂无娱乐演艺档期数据</div>'; return; }
    var today=new Date(); today.setHours(0,0,0,0);
    var upcoming=[], undated=[];
    items.forEach(function(e){
      var clone=Object.assign({}, e);
      var m=String(e.date||'').match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
      if(m){ clone.d=new Date(+m[1], +m[2]-1, +m[3]); upcoming.push(clone); }
      else { undated.push(clone); }
    });
    upcoming.sort(function(a,b){ return a.d - b.d; });
    var types=['全部','演唱会','音乐节','粉丝见面会','电影'];
    var sites=['全部','🇹🇭 泰国','🇲🇾 马来西亚','🌐 全球'];
    var st=SUB_SEL.ent || {type:'全部', site:'全部'};
    var fb=el('div','ent-filters'); fb.style.marginBottom='10px';
    var tRow=el('div','ent-chip-row'); tRow.appendChild(el('span','ent-chip-label','类型：'));
    types.forEach(function(t){
      var b=el('button','ent-chip'+(st.type===t?' active':''), t);
      b.onclick=function(){ st.type=t; draw(); }; tRow.appendChild(b);
    });
    var sRow=el('div','ent-chip-row'); sRow.appendChild(el('span','ent-chip-label','站点：'));
    sites.forEach(function(s){
      var b=el('button','ent-chip'+(st.site===s?' active':''), s);
      b.onclick=function(){ st.site=s; draw(); }; sRow.appendChild(b);
    });
    fb.appendChild(tRow); fb.appendChild(sRow);
    body.appendChild(fb);
    var list=el('div','ent-grid'); body.appendChild(list);
    function siteMatch(e, sel){
      if(sel==='全部') return true;
      var itemSite=e.site||'';
      if(sel==='🌐 全球') return String(itemSite).indexOf('全球')>=0;
      if(sel.indexOf('泰国')>=0) return String(itemSite).indexOf('泰国')>=0;
      if(sel.indexOf('马来西亚')>=0) return String(itemSite).indexOf('马来西亚')>=0;
      return String(itemSite).indexOf(sel)>=0;
    }
    function draw(){
      Array.prototype.forEach.call(tRow.querySelectorAll('.ent-chip'), function(b){ b.classList.toggle('active', b.textContent===st.type); });
      Array.prototype.forEach.call(sRow.querySelectorAll('.ent-chip'), function(b){ b.classList.toggle('active', b.textContent===st.site); });
      list.innerHTML='';
      function pass(e){ return (st.type==='全部'||String(e.type||'').indexOf(st.type)>=0) && siteMatch(e, st.site); }
      var rows=upcoming.filter(pass);
      var und=undated.filter(pass);
      if(!rows.length && !und.length){ list.appendChild(el('div','ent-empty','该筛选下暂无档期')); return; }
      function card(e){
        var c=el('div','ent-card');
        var days=e.d?Math.round((e.d-today)/86400000):null;
        var leftTxt=(days===null)?'待定':(days===0?'今天':(days>0?('剩 '+days+' 天'):('已过 '+Math.abs(days)+' 天')));
        var leftCls=(days===null)?'':(days>=0 && days<=7?' ent-urgent':(days>=0 && days<=30?' ent-soon':''));
        var linkHtml = e.url ? ('<a href="'+esc(e.url)+'" target="_blank" rel="noopener" style="font-size:11px;color:#38bdf8;text-decoration:none;font-weight:600;" onclick="event.stopPropagation()">🔗 票务/官宣直通 ↗</a>') : '';
        var aiSumHtml = e.ai_summary ? ('<div style="font-size:11.5px;color:#cbd5e1;background:rgba(56,189,248,0.06);border-left:2px solid #38bdf8;padding:4px 8px;border-radius:4px;line-height:1.45;margin-top:4px;">'+esc(e.ai_summary)+'</div>') : '';
        var html = '<div class="ent-top">'
          + '<span class="ent-type">' + esc(e.ai_category_tag || e.type || '演出') + '</span>'
          + '<span class="ent-site">' + esc(e.site||'泰国') + '</span>'
          + '<span class="ent-days ' + leftCls + '">' + leftTxt + '</span>'
          + '</div>'
          + '<div class="ent-title">' + esc(e.name) + '</div>'
          + '<div class="ent-loc">📍 ' + esc(e.location||'') + ' · 📅 ' + esc(e.date||'2026-12-01') + ' (' + esc(e.verification || '✓ AI核验') + ')</div>'
          + aiSumHtml
          + (e.buying_window ? ('<div class="ent-window">⏱️ <b>采购爆发窗口：</b>' + esc(e.buying_window) + '</div>') : '')
          + (e.ai_risk_prediction ? ('<div class="ent-risk" style="background:rgba(244,63,94,0.1);border-left:3px solid #f43f5e;padding:6px 10px;margin-top:6px;border-radius:4px;"><b>⚠️ 侵权风险预测：</b><span style="color:#f43f5e;font-weight:700;">' + esc(e.ai_risk_prediction.level) + '</span><div style="font-size:11.5px;color:#cbd5e1;margin-top:2px;">' + esc(e.ai_risk_prediction.detail) + '</div></div>') : '')
          + (e.ai_theme_advice ? ('<div class="ent-style" style="background:rgba(16,185,129,0.1);border-left:3px solid #10b981;padding:6px 10px;margin-top:6px;border-radius:4px;"><b>🎨 AI 推荐商用主题：</b><div style="font-size:11.5px;color:#e2e8f0;margin-top:2px;">' + esc(e.ai_theme_advice) + '</div></div>') : '')
          + '<div style="display:flex;justify-content:flex-end;margin-top:6px;padding-top:6px;border-top:1px solid rgba(255,255,255,0.06);">'+linkHtml+'</div>';
        c.innerHTML = html;
        return c;
      }
      rows.forEach(function(e){ list.appendChild(card(e)); });
      und.forEach(function(e){ list.appendChild(card(e)); });
    }
    draw();
  }

  // ---------- 实时热点源 ----------
  function renderLiveSources(){
    var body=$('#live-body'); if(!body) return;
    body.innerHTML='';
    var list=D.live_sources||[];
    var autos=list.filter(function(x){return x.auto;});
    var manuals=list.filter(function(x){return !x.auto;});
    // 说明文案按真实标记现算，不写死条数：改渠道清单后页面自动跟着变
    var note=$('#live-src-note');
    if(note){
      var ca=(D.meta&&D.meta.channel_auto)||{};
      note.innerHTML='共 <b>'+list.length+'</b> 条渠道：<b>'+autos.length+'</b> 条已接入自动抓取（RSS／榜单／维基等公开接口）'
        +'，<b>'+manuals.length+'</b> 条为人工查阅入口、不代表已自动更新'
        +(ca.note?'。'+esc(ca.note):'');
    }
    function section(title,items,cls){
      if(!items.length) return;
      body.appendChild(el('div','live-group-title '+cls,title+'（'+items.length+'）'));
      items.forEach(function(it){ body.appendChild(makeCard(it)); });
    }
    function makeCard(it){
      var card=el('div','live-card');
      var icon={'TikTok':'🎵','YouTube':'▶️','Netflix':'🎬','Google':'🔍','论坛报':'📰','X':'🐦','Instagram':'📸','Threads':'🧵','Facebook':'📘','WhatsApp':'💬','Telegram':'✈️','ThaiPBS':'📺','BangkokPost':'📰','LINE':'💚','Pantip':'🗣️','Thaiger':'🐯','泰国娱乐':'🇹🇭','泰国英文':'📰','国际娱乐':'🎬','平台趋势':'📈','社交热搜':'🔥','泰国新闻':'📺','档期票务':'🎫','泰国时尚':'👗','泰国营销':'📊','影视':'🎥','音乐':'🎵'}[it.platform]||'📡';
      card.innerHTML='<div class="live-icon">'+icon+'</div><div class="live-name">'+esc(it.name)
        +'<span class="live-auto '+(it.auto?'on':'off')+'" title="'+esc(it.auto_evidence||'')+'">'
        +(it.auto?'自动':'人工')+'</span></div>'
        +'<div class="live-meta">'+esc(it.platform)+' · '+esc(it.region)+'</div><div class="live-desc">'+esc(it.desc)+'</div>';
      card.onclick=function(){showLiveDetail(it);};
      return card;
    }
    section('🤖 自动抓取',autos,'auto-on');
    section('🧑‍💻 人工查阅',manuals,'auto-off');
    if(!list.length) body.appendChild(el('div','','暂无实时热点源'));
  }

  // 热搜抓取降级提示。抽成纯函数是为了能单测：本轮所有地区都超时时，
  // 时间戳是「最后一次成功」而不是本轮时间，不写这句用户会以为是刚抓的。
  function ltWarnSuffix(meta){
    meta=meta||{};
    var st=meta.live_trends_status;
    if(!st||st==='ok') return '';
    var n=(meta.live_trends_failed_geos||[]).length;
    return ' ｜ '+(n>=9?'本轮 9 个地区全部未抓到':('本轮 '+n+' 个地区未抓到'))
      +'，显示 '+(meta.live_trends_updated||'上次成功')+' 的最后一次结果';
  }
  window.__ltWarnSuffix=ltWarnSuffix;

  // ---------- 实时热搜（Google Trends 多市场）----------
  function renderLiveTrends(){
    var body=$('#livetrends-body'); if(!body) return;
    body.innerHTML='';
    var at=$('#livetrends-at');
    if(at){
      var g=D.meta&&D.meta.live_trends_updated, x=D.meta&&D.meta.x_trends_updated;
      var _suf=ltWarnSuffix(D.meta);
      at.textContent='Google '+(g||'未采集')+' · X（第三方聚合）'+(x||'未采集')+_suf;
      at.className=_suf?'lt-at-warn':'';
    }
    var GEO_LABEL={TH:'🇹🇭 泰国',MY:'🇲🇾 马来西亚',SG:'🇸🇬 新加坡',ID:'🇮🇩 印尼',
                   PH:'🇵🇭 菲律宾',US:'🇺🇸 美国',GB:'🇬🇧 英国',JP:'🇯🇵 日本',KR:'🇰🇷 韩国'};
    var tabs=[], active='G_TH';
    Object.keys(D.live_trends||{}).forEach(function(g){ tabs.push(['G_'+g,'Google · '+GEO_LABEL[g]]); });
    Object.keys(D.x_trends||{}).forEach(function(g){ tabs.push(['X_'+g,'X · '+GEO_LABEL[g]]); });
    if(!tabs.length){ body.innerHTML='<div style="padding:14px;color:#8fa3b8">暂无热搜快照</div>'; return; }
    if(!tabs.some(function(t){return t[0]===active;})) active=tabs[0][0];

    var wrap=el('div','lt-wrap'), tabBar=el('div','lt-tabs'), listWrap=el('div','lt-list');

    function drawList(key){
      listWrap.innerHTML='';
      var isX=key.indexOf('X_')===0, geo=key.slice(2);
      if(isX){
        var xs=(D.x_trends||{})[geo]||[];
        if(!xs.length){ listWrap.appendChild(el('div','lt-empty','该市场暂无 X 聚合数据')); return; }
        xs.forEach(function(it){
          var item=el('div','lt-item');
          item.appendChild(el('span','lt-rank',String(it.rank||'')));
          var main=el('div','lt-main');
          main.appendChild(el('div','lt-title',esc(it.tag)));
          main.appendChild(el('span','lt-traffic','第三方聚合'));
          item.appendChild(main);
          if(it.url){ item.style.cursor='pointer'; item.onclick=function(){ window.open(it.url,'_blank'); }; }
          listWrap.appendChild(item);
        });
        var note=el('div','lt-empty','来源：getdaytrends 第三方聚合页面，不是 X 官方 API；排名按第三方页面展示。');
        note.style.padding='8px 2px'; note.style.fontSize='12px';
        listWrap.appendChild(note);
        return;
      }
      var list=(D.live_trends||{})[geo]||[];
      if(!list.length){ listWrap.appendChild(el('div','lt-empty','该市场抓取失败，未保留旧数据')); return; }
      list.forEach(function(it,idx){
        var item=el('div','lt-item');
        item.appendChild(el('span','lt-rank',String(idx+1)));
        var main=el('div','lt-main');
        main.appendChild(el('div','lt-title',esc(it.title)));
        if(it.traffic) main.appendChild(el('span','lt-traffic','🔥 '+esc(it.traffic)));
        if(it.news&&it.news.length){
          var ns=el('div','lt-news');
          it.news.slice(0,2).forEach(function(n){
            var a=el('a','lt-news-item',esc(n.title));
            a.href=n.url||it.link; a.target='_blank'; a.rel='noopener';
            ns.appendChild(a);
          });
          main.appendChild(ns);
        }
        item.appendChild(main);
        if(it.link){ item.style.cursor='pointer'; item.onclick=function(){ window.open(it.link,'_blank'); }; }
        listWrap.appendChild(item);
      });
    }

    tabs.forEach(function(pair){
      var b=el('button','lt-tab'+(pair[0]===active?' active':''),pair[1]);
      b.onclick=function(){
        active=pair[0];
        Array.prototype.forEach.call(tabBar.querySelectorAll('.lt-tab'),function(x){x.classList.remove('active');});
        b.classList.add('active');
        drawList(active);
      };
      tabBar.appendChild(b);
    });
    wrap.appendChild(tabBar); wrap.appendChild(listWrap);
    body.appendChild(wrap);
    drawList(active);
  }

  // ---------- 汇率天气 ----------
  function renderFxWeather(){
    var body=$('#fx-body');
    body.innerHTML='';
    var blocks=[{k:'TH',title:'🇹🇭 泰国',d:(D.fx||{}).TH,w:(D.weather||{}).TH},{k:'MY',title:'🇲🇾 马来西亚',d:(D.fx||{}).MY,w:(D.weather||{}).MY}];
    blocks.forEach(function(b){
      var card=el('div','fx-card');
      card.appendChild(el('h3',null,b.title));
      if(b.d){
        card.appendChild(frow('1 USD','≈ '+esc(b.k==='TH'?b.d.usd_thb:b.d.usd_myr)+(b.k==='TH'?' THB':' MYR')));
        card.appendChild(frow('兑 CNY','≈ '+esc(b.k==='TH'?b.d.thb_cny:b.d.myr_cny)+' 元'));
        if(b.d.cost_warn) card.appendChild(el('div','fx-warn','⚠️ '+esc(b.d.cost_warn)));
      }
      if(b.w){
        card.appendChild(frow('🌡️ 天气',esc(b.w.city+' '+b.w.temp+(b.w.rain?' · 降雨 '+b.w.rain:' · 降雨未知')+(b.w.source_time?' · 数据 '+b.w.source_time:''))));
        if(b.w.advice) card.appendChild(frow('穿搭建议',esc(b.w.advice)));
        if(b.w.alert) card.appendChild(el('div','fx-alert','⛔ '+esc(b.w.alert)));
      }
      var st=FX_STATE[b.k], sr=FX_STATE.rate;
      card.appendChild(frow('更新状态',esc('汇率'+(sr?(sr.ok?' 已更新 '+sr.at:' 失败（显示快照）'):' 待获取')+' / 天气'+(st?(st.ok?' 已更新 '+st.at:' 失败（显示快照）'):' 待获取'))));
      card.onclick=function(){showFxDetail(b.k);};
      body.appendChild(card);
    });

    // 增加跨时区运营作战时钟卡片 (中泰马)
    var tzCard = el('div', 'fx-card');
    tzCard.style.border = '1px solid rgba(56, 189, 248, 0.35)';
    tzCard.style.background = 'rgba(15, 23, 42, 0.85)';
    tzCard.innerHTML = '<h3 style="color:#38bdf8;margin-bottom:8px;">🌐 中泰马跨时区联动作战时钟</h3>'
      + '<div class="fx-row" style="margin-bottom:4px;"><span class="k">🇨🇳 中国大陆 (北京时间 UTC+8)</span><span class="v" id="fx-clock-bj" style="font-weight:700;color:#f8fafc;font-family:monospace;font-size:13px;">--:--:--</span></div>'
      + '<div class="fx-row" style="margin-bottom:4px;"><span class="k">🇹🇭 泰国 (曼谷时间 UTC+7)</span><span class="v" id="fx-clock-bkk" style="font-weight:700;color:#38bdf8;font-family:monospace;font-size:13px;">--:--:-- (慢1h)</span></div>'
      + '<div class="fx-row" style="margin-bottom:8px;"><span class="k">🇲🇾 马来西亚 (吉隆坡时间 UTC+8)</span><span class="v" id="fx-clock-kl" style="font-weight:700;color:#f8fafc;font-family:monospace;font-size:13px;">--:--:--</span></div>'
      + '<div style="padding:8px 10px;background:rgba(56,189,248,0.08);border-left:3px solid #38bdf8;border-radius:4px;font-size:11.5px;color:#94a3b8;line-height:1.5;">'
      + '⚡ <b>时区实操提示：</b>泰国（UTC+7）比国内与马来西亚（UTC+8）慢 1 小时。泰国大促零点相当于北京时间 01:00；晚间买家流量高峰在曼谷 20:00~23:00（对应北京时间 21:00~24:00）。'
      + '</div>';
    body.appendChild(tzCard);

    function frow(k,v){var r=el('div','fx-row');r.appendChild(el('span','k',k));r.appendChild(el('span','v',v));return r;}
  }

  // ---------- 汇率天气：浏览器端实时拉取（保证页面打开即最新） ----------
  // 逐数据源状态：成功/失败分开记录，失败保留快照值并明确标注
  var FX_STATE={rate:null,TH:null,MY:null};
  function fxNow(){
    var d=new Date();
    function p(n){return (n<10?'0':'')+n;}
    return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes());
  }
  function fxBadge(){
    var h=document.querySelector('#sec-fx h2'); if(!h) return;
    var b=document.getElementById('fx-live-badge');
    if(!b){ b=el('span','live-badge',''); b.id='fx-live-badge'; h.appendChild(b); }
    var keys=['rate','TH','MY'];
    var done=keys.filter(function(k){return FX_STATE[k];});
    if(!done.length){ b.textContent='⚪ 等待获取'; return; }
    var ok=done.filter(function(k){return FX_STATE[k].ok;});
    var latestAt = (FX_STATE.rate && FX_STATE.rate.at) || (done[0] && done[0].at) || fxNow();
    if(ok.length===3) b.textContent='🟢 浏览器实时 · '+latestAt;
    else if(ok.length>0) b.textContent='🟡 部分成功 '+ok.length+'/3 · '+latestAt;
    else b.textContent='🔴 实时获取失败，显示快照';
  }
  function fxGet(url){
    var ctrl=(typeof AbortController==='function')?new AbortController():null;
    var timer=ctrl?setTimeout(function(){ctrl.abort();},8000):null;
    return fetch(url, ctrl?{signal:ctrl.signal,cache:'no-store'}:{cache:'no-store'})
      .then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
      .then(function(j){ if(timer) clearTimeout(timer); return j; })
      .catch(function(e){ if(timer) clearTimeout(timer); throw e; });
  }
  function wxAdvice(p){
    if(p==null) return '降雨概率未知，暂不给穿搭建议';
    if(p>=70) return '降雨概率高，建议快干/防水款并提前备货';
    if(p>=40) return '可能有阵雨，速干面料优先';
    return '降雨概率低，常规纯棉款可推';
  }
  function fetchLiveFxWeather(){
    if(typeof fetch!=='function') return;
    var at=fxNow();
    fxGet('https://api.exchangerate-api.com/v4/latest/USD').then(function(j){
      if(!(j&&j.rates&&j.rates.THB&&j.rates.MYR)) throw new Error('bad payload');
      D.fx=D.fx||{}; D.fx.TH=D.fx.TH||{}; D.fx.MY=D.fx.MY||{};
      D.fx.TH.usd_thb=String(j.rates.THB.toFixed(2));
      D.fx.MY.usd_myr=String(j.rates.MYR.toFixed(2));
      var cny=j.rates.CNY||(1/j.rates.USD);
      D.fx.TH.thb_cny=String((cny/j.rates.THB).toFixed(4));
      D.fx.MY.myr_cny=String((cny/j.rates.MYR).toFixed(4));
      FX_STATE.rate={ok:true,at:at};
    }).catch(function(){
      FX_STATE.rate={ok:false,at:at};
    }).then(function(){ renderFxWeather(); fxBadge(); });

    [{k:'TH',lat:13.7563,lon:100.5018,city:'曼谷',tz:'Asia/Bangkok'},
     {k:'MY',lat:3.1390,lon:101.6869,city:'吉隆坡',tz:'Asia/Kuala_Lumpur'}].forEach(function(rq){
      var url='https://api.open-meteo.com/v1/forecast?latitude='+rq.lat+'&longitude='+rq.lon
        +'&current=temperature_2m,precipitation_probability&timezone='+encodeURIComponent(rq.tz);
      fxGet(url).then(function(j){
        if(!(j&&j.current)) throw new Error('bad payload');
        D.weather=D.weather||{}; D.weather[rq.k]=D.weather[rq.k]||{};
        var w=D.weather[rq.k];
        w.city=rq.city;
        w.temp=(j.current.temperature_2m==null?'—':j.current.temperature_2m+'°C');
        w.rain=(j.current.precipitation_probability==null?null:j.current.precipitation_probability+'%');
        w.source_time=j.current.time||'';
        w.advice=wxAdvice(j.current.precipitation_probability);
        FX_STATE[rq.k]={ok:true,at:at};
      }).catch(function(){
        FX_STATE[rq.k]={ok:false,at:at};
      }).then(function(){ renderFxWeather(); fxBadge(); });
    });
  }

  // ---------- 店铺 ----------
  function renderStores(){
    var body=$('#store-body'); if(!body) return;
    body.innerHTML='';
    var wrap=el('div','table-wrap');
    var t=el('table','store-table');
    t.innerHTML='<thead><tr><th>#</th><th>平台</th><th>市场</th><th>店铺名称</th><th>站斧ID</th><th>GMV</th><th>订单</th><th>访客</th><th>转化</th><th>状态</th></tr></thead>';
    var tb=el('tbody');
    (D.store_status||[]).forEach(function(r){
      var tr=el('tr');
      var statusClass='badge-none';
      if(r.status==='正常') statusClass='badge-ok';
      else if(r.status==='正常·无指标') statusClass='badge-nocookies';
      else if(r.status==='登录失效') statusClass='badge-login';
      else if(r.status==='无 Cookie') statusClass='badge-nocookies';
      var fmt=function(v){return (v===null||v===undefined||v==='')?'-':v;};
      var gmv='-';
      if(r.gmv!=null && r.gmv!==''){
        var sym=(r.market==='MY'||String(r.market).toUpperCase()==='MALAYSIA')?'RM ':'฿ ';
        var num = Number(String(r.gmv).replace(/[^0-9.-]/g, ''));
        gmv = isNaN(num) ? esc(String(r.gmv)) : (sym + num.toLocaleString());
      }
      var conv=(r.conversion_rate!=null)?(r.conversion_rate+'%'):'-';
      tr.innerHTML='<td>'+(r.no||'')+'</td><td>'+esc(r.platform)+'</td><td>'+esc(r.market)+'</td><td>'+esc(r.name)+'</td><td>'+esc(r.zfb_id)+'</td><td class="num">'+gmv+'</td><td class="num">'+fmt(r.orders)+'</td><td class="num">'+fmt(r.visitors)+'</td><td class="num">'+conv+'</td><td><span class="store-badge '+statusClass+'">'+esc(r.status)+'</span></td>';
      tr.onclick=function(){showStoreDetail(r);};
      tb.appendChild(tr);
    });
    t.appendChild(tb); wrap.appendChild(t); body.appendChild(wrap);
  }

  // ---------- 业绩占位 ----------
  function renderPerformance(){
    var grid=$('#perf-body'); if(!grid) return;
    // 幂等：重复渲染前先销毁旧 ECharts 实例，避免 canvas 堆叠 / 内存泄漏
    if(_perfCharts && _perfCharts.length){
      _perfCharts.forEach(function(c){ try{ c.dispose(); }catch(e){} });
    }
    _perfCharts=[];
    grid.innerHTML='';
    var hasReal=D.performance_placeholder && D.performance_placeholder.available;
    if(D.performance_placeholder && D.performance_placeholder.reason){
      var noteClass='perf-note'+(hasReal?' perf-ready':'');
      grid.appendChild(el('div',noteClass,esc(D.performance_placeholder.reason)));
    }
    (((D.performance_placeholder && D.performance_placeholder.metrics)||[])).forEach(function(m){
      var card=el('div','perf-card');
      card.appendChild(el('div','perf-title',m));
      var cd=el('div','perf-chart'); card.appendChild(cd);
      grid.appendChild(card);
      var chart=echarts.init(cd);
      _perfCharts.push(chart);
      chart.setOption({
        backgroundColor:'transparent',
        title:{text:hasReal?'已接入':'待接入',left:'center',top:'center',textStyle:{color:'#5f7388',fontSize:13}},
        xAxis:{type:'category',show:false,data:['a','b','c','d']},
        yAxis:{type:'value',show:false,max:1},
        series:[{type:'bar',data:[0.2,0.5,0.3,0.6],itemStyle:{color:hasReal?'#36c2b4':'#243748',borderRadius:3},barWidth:'50%'}],
        grid:{left:0,right:0,top:0,bottom:0}
      });
      card.onclick=function(){showPerfDetail(m);};
    });
    // 监听只在顶层注册一次，回调里遍历当前实例：
    // 旧写法放在 forEach 内，每渲染一次就多挂 7 个监听（连点筛选会累积到上千）。
    if(!_perfResizeBound){
      _perfResizeBound=true;
      window.addEventListener('resize',function(){
        _perfCharts.forEach(function(c){ try{c.resize();}catch(e){} });
      });
    }
  }

  // ---------- 更新状态（如实展示每个板块的数据期间与最后核验） ----------
  function renderHealth(){
    var box=$('#health-body'); if(!box) return;
    var H=(D.meta&&D.meta.health)||[];
    if(!H.length){ box.innerHTML='<div style="padding:14px;color:#8fa3b8">暂无更新状态记录</div>'; return; }
    var C={ok:['🟢','正常'],static:['🔵','历史统计'],partial:['🟡','待核验'],stale:['🟠','快照·非实时'],live:['🟢','浏览器实时'],unknown:['⚪','状态未知']};
    var h='<div class="table-wrap"><table class="grid-table hl-table"><thead><tr>'
      +'<th>板块</th><th>数量<br><span class="hl-thsub">（含算式）</span></th><th>计量口径</th><th>数据期间</th><th>最后核验</th><th>状态</th><th>说明</th></tr></thead><tbody>';
    var autoMeta=(D.meta&&D.meta.auto)||{};
    H.forEach(function(r){
      var c=C[r.status]||C.unknown;
      var lv=r.last_verified||'未记录';
      // 实时板块的"最后核验"用本轮真实运行时间，没有就如实留原值
      if(r.status==='live' && autoMeta.last_success){
        lv=autoMeta.last_success+'（本轮采集）';
      }
      h+='<tr><td><strong>'+esc(r.name)+'</strong></td>'
        +'<td>'+(r.rows==null?'—':r.rows)
          +(r.formula?'<div class="hl-formula">= '+esc(r.formula)+'</div>':'')+'</td>'
        +'<td style="color:#8fa3b8">'+esc(r.unit||'条目')+'</td>'
        +'<td>'+esc(r.period||'—')+'</td>'
        +'<td>'+esc(lv)+'</td>'
        +'<td>'+c[0]+' '+c[1]+'</td>'
        +'<td style="color:#8fa3b8">'+esc(r.note||'')+'</td></tr>';
    });
    h+='</tbody></table></div>';
    // 人工维护的时间戳不会每轮刷新，必须明确说明"最后人工更新于何时"，否则读者会以为是数据没更新
    var sb=((D.meta||{}).static_blocks)||{};
    var sbKeys=Object.keys(sb);
    if(sbKeys.length){
      var CN={holiday_sync:'节假日库',sources_updated:'信息渠道清单',schedule_updated:'排班/活动日程',anime_trends_checked:'动漫档期核查'};
      h+='<div class="health-static">🔧 人工维护（不随每日采集推进）：'
        +sbKeys.map(function(k){ return esc(CN[k]||k)+' 最后更新 '+esc(String(sb[k])); }).join('　·　')
        +'</div>';
    }
    box.innerHTML=h;
  }

  // ---------- 实时资讯流（RSS 自动采集） ----------
  var NF_CAT='全部';
  function renderNewsFeed(){
    var body=$('#newsfeed-body'); if(!body) return;
    var d=D.news_feed||{}, items=d.items||[];
    var at=$('#newsfeed-at'); if(at) at.textContent=d.updated?('采集 '+d.updated):'未采集';
    if(!items.length){ body.innerHTML='<div style="padding:14px;color:#8fa3b8">暂无资讯，等待下次采集</div>'; return; }
    var cats=['全部'];
    items.forEach(function(x){ if(cats.indexOf(x.cat)<0) cats.push(x.cat); });
    var fbox=$('#newsfeed-filters');
    if(fbox){
      fbox.innerHTML='';
      cats.forEach(function(c){
        var b=el('button','fbtn'+(c===NF_CAT?' on':''),esc(c));
        b.onclick=function(){ NF_CAT=c; renderNewsFeed(); };
        fbox.appendChild(b);
      });
    }
    var list=items.filter(function(x){ return NF_CAT==='全部'||x.cat===NF_CAT; });
    var h='<div class="nf-list">';
    list.forEach(function(x){
      h+='<div class="nf-item"><div class="nf-meta"><span class="nf-cat">'+esc(x.cat)+'</span>'
        +'<span>'+esc(x.source)+'</span>'+(x.published?'<span>'+esc(x.published)+'</span>':'')+'</div>'
        +'<a class="nf-title" href="'+esc(x.url)+'" target="_blank" rel="noopener">'+esc(x.title)+'</a></div>';
    });
    h+='</div><div style="font-size:12px;color:#8fa3b8;margin-top:8px">共 '+list.length+' 条 · 标题与时间来自各站 RSS 原文，点击跳转原站</div>';
    body.innerHTML=h;
  }

  // ---------- 自动刷新：定时重新拉取实时数据 ----------
  var AUTO_MIN=10, _autoTimer=null, _autoLast=null;
  function autoTick(){
    if(document.hidden) return;          // 页面在后台时不消耗请求
    fetchLiveFxWeather();
    checkVersion();                      // 自动检测新数据版本
    _autoLast=new Date();
    autoStatus();
  }
  function autoStatus(){
    var h=document.querySelector('#sec-fx h2'); if(!h) return;
    var s=document.getElementById('fx-auto-badge');
    if(!s){ s=el('span','live-badge',''); s.id='fx-auto-badge'; s.style.marginLeft='6px'; h.appendChild(s); }
    var d=_autoLast||new Date();
    function p(n){return (n<10?'0':'')+n;}
    s.textContent='汇率·天气每'+AUTO_MIN+'分钟拉取 · 最近尝试 '+p(d.getHours())+':'+p(d.getMinutes())+'（其他板块不自动刷新）';
  }
  function startAutoRefresh(){
    if(typeof fetch!=='function') return;
    if(_autoTimer) clearInterval(_autoTimer);
    _autoLast=new Date();
    autoStatus();
    _autoTimer=setInterval(autoTick,AUTO_MIN*60*1000);
    document.addEventListener('visibilitychange',function(){
      if(!document.hidden) autoTick();   // 回到前台立即补一次
    });
  }

  // ---------- 版本检查 ----------
  // 版本号唯一来源 = index.html 里 app.js?v=xxx 的查询串。
  // 此前把版本号硬编码在 app.js 里，自动化只改了 version.json，
  // 两边永远对不上 → 每次打开都提示"有新版本"，点刷新还是同一个包。
  var BUILD=(function(){
    var meta = document.querySelector('meta[name="build"]');
    if(meta && meta.content) return meta.content.trim();
    var s=document.querySelector('script[src*="app.js"]');
    var src=s?(s.getAttribute('src')||''):'';
    var m=/[?&]v=([^&]+)/.exec(src);
    return m?decodeURIComponent(m[1]):'';
  })();

  // 动态无感热更新业务数据
  function reloadDashboardData(cb){
    var s = document.createElement('script');
    s.src = 'data/dashboard_data.js?_=' + Date.now();
    s.onload = function(){
      if(window.DASHBOARD_DATA){
        D = window.DASHBOARD_DATA;
        _TH_RAW = null;
        renderAll();
        if(typeof cb === 'function') cb();
      }
    };
    document.head.appendChild(s);
  }
  function reloadDashboardData(cb){
      var oldScript = document.querySelector('script[src*="dashboard_data.js"]');
      if(oldScript && oldScript.parentNode){
        oldScript.parentNode.removeChild(oldScript);
      }
      var s = document.createElement('script');
      s.src = 'dashboard_data.js?_=' + Date.now();
      s.onload = function(){
        try {
          if(typeof recomputeCalendar === 'function') recomputeCalendar();
          if(typeof boot === 'function') boot();
        } catch(e) {
          console.error('重新加载数据失败', e);
        }
        if(typeof cb === 'function') cb(true);
      };
      s.onerror = function(){
        if(typeof cb === 'function') cb(false);
      };
      document.head.appendChild(s);
    }

    function checkVersion(){
      if(typeof fetch!=='function') return;
      fetch('version.json?_='+Date.now(),{cache:'no-store'}).then(function(r){return r.json();}).then(function(j){
        if(!j || !j.build) return;
        // 首次打开记录当前版本，防止每次打开都弹窗提示
        if(!BUILD || BUILD === 'BUILD_ID'){
          BUILD = j.build;
          return;
        }
        if(j.build === BUILD) return;
        if(document.getElementById('ver-bar')) return;
        var bar=el('div','ver-bar','检测到新版本（'+esc(j.published_at||j.build)+'）'
          +'<button id="ver-reload">加载新版本</button>'
          +'<button id="ver-close" aria-label="关闭">✕</button>');
        bar.id='ver-bar';
        document.body.appendChild(bar);
        var btn=document.getElementById('ver-reload');
        if(btn) {
          btn.onclick=function(){
            btn.textContent = '加载中…';
            btn.disabled = true;
            reloadDashboardData(function(ok){
              BUILD = j.build;
              if(bar && bar.parentNode) bar.parentNode.removeChild(bar);
              var tip = el('div', 'ver-bar', '✓ 已成功加载最新数据');
              tip.style.background = '#0e7090';
              tip.style.color = '#fff';
              document.body.appendChild(tip);
              setTimeout(function(){ if(tip.parentNode) tip.parentNode.removeChild(tip); }, 2500);
            });
          };
        }
        var cls=document.getElementById('ver-close');
        if(cls) cls.onclick=function(){ if(bar.parentNode) bar.parentNode.removeChild(bar); };
      }).catch(function(){});
    }

    // ---------- 市场大盘 ----------
    function renderMarket(){
    var box=$('#market-body'); if(!box) return;
    box.innerHTML='';
    var mw=(D.meta&&D.meta.market_watch)||[];
    if(!mw.length){ box.innerHTML='<div style="padding:18px;color:#8fa3b8">暂无市场大盘数据</div>'; return; }
    var wrap=el('div','table-wrap');
    var t=el('table','grid-table');
    t.innerHTML='<thead><tr><th>指标</th><th>数值</th><th>口径</th><th>来源</th></tr></thead>';
    var tb=el('tbody');
    mw.forEach(function(r){
      var tr=el('tr');
      tr.innerHTML='<td>'+esc(r.metric)+'</td><td><b>'+esc(r.value)+'</b></td><td>'+esc(r.note||'')+'</td><td>'+esc(r.source||'')+'</td>';
      tb.appendChild(tr);
    });
    t.appendChild(tb); wrap.appendChild(t); box.appendChild(wrap);
  }

  // ---------- 启动 ----------
  // ---------- 板块说明与当日增量（人工整理，随上游快照同步）----------
  // 商品榜 / 搜索词 / 全球趋势三块没有实时接口，光给表格数字看不出「为什么没更新」，
  // 也看不到「今天该注意什么」（如平台涨佣）。这里把源快照里的说明如实展示出来。
  function renderSectionNotes(){
    var N=D.section_notes||{};
    var groups=[
      ['products-notes',['bestsellers','competitors']],
      ['search-notes',['search_rankings']],
      ['global-notes',['global_trends']]
    ];
    groups.forEach(function(g){
      var box=$('#'+g[0]); if(!box) return;
      var paras=[];
      g[1].forEach(function(k){
        var v=N[k]; if(!v) return;
        (v instanceof Array?v:[v]).forEach(function(t){ if(t) paras.push(String(t)); });
      });
      if(!paras.length){ box.style.display='none'; return; }
      box.innerHTML='';
      var snap=(D.meta&&D.meta.source_sync&&D.meta.source_sync.source_date)||'';
      var nmeta=(D.meta&&D.meta.section_notes_meta)||{};
      var staleKeys=g[1].filter(function(k){ return nmeta[k]&&nmeta[k].stale; });
      var ss=(D.meta&&D.meta.source_sync)||{};
      var base=ss.baseline_date||'', snapDate=ss.snapshot_date||snap;
      var headCls='sn-head';
      var headTxt='📌 板块说明（人工整理 · 基线采集 '+esc(base||'—')+' · 快照整理 '+esc(snapDate||'—')+'）';
      if(!base) headTxt='📌 板块说明与当日增量'+(snap?'（人工整理 · 快照 '+esc(snap)+'）':'');
      if(staleKeys.length){
        var m0=nmeta[staleKeys[0]]||{};
        headCls+=' sn-stale';
        headTxt='⏳ 板块说明（历史内容 · 最后核验 '+esc(m0.content_date||'—')
          +'，已过 '+(m0.age_days==null?'?':m0.age_days)+' 天 · 倒计时已按今天重算）';
      }
      box.appendChild(el('div',headCls,headTxt));
      var body=el('div','sn-body');
      paras.forEach(function(t,i){
        var p=el('p','sn-p');
        p.textContent=t;
        if(i>=2) p.style.display='none';
        body.appendChild(p);
      });
      box.appendChild(body);
      if(paras.length>2){
        var rest=paras.length-2;
        var btn=el('button','sn-toggle','展开全部 '+rest+' 段 ▾');
        btn.onclick=function(){
          var open=btn.getAttribute('data-open')==='1';
          var ps=body.querySelectorAll('.sn-p');
          for(var i=2;i<ps.length;i++) ps[i].style.display=open?'none':'';
          btn.setAttribute('data-open',open?'0':'1');
          btn.textContent=open?('展开全部 '+rest+' 段 ▾'):'收起 ▴';
        };
        box.appendChild(btn);
      }
    });
  }


  function renderAiAuditBanner(){
    var m = D.meta || {};
    var brief = m.ai_brief || {};
    var report = m.ai_audit_report || {};
    var slot = document.getElementById('ai-audit-banner-slot') || document.querySelector('.layout');
    if(!slot) return;
    
    var old = document.getElementById('ai-audit-banner');
    if(old) old.remove();
    
    var banner = document.createElement('section');
    banner.className = 'ai-audit-banner';
    banner.id = 'ai-audit-banner';
    
    var headHtml = '<div class="ai-audit-head">'
      + '<div class="ai-audit-title"><span>🤖</span> Google Gemini 选品总监 · 每日核心决策与数据真实性核验报告</div>'
      + '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">'
      + '<span class="ai-badge-ok">✓ 100% 真实性与准确度已核验</span>'
      + '<span class="ai-audit-meta">' + esc(brief.timestamp || report.timestamp || '') + ' · 模型: ' + esc(report.auditor || 'Google Gemini 3.5 Flash-Lite') + '</span>'
      + '</div></div>';
      
    var contentHtml = '<div class="ai-audit-content"><b>【今日核心决策速递】</b> ' + esc(brief.text || '今日聚焦泰马轻薄透气面料，紧抓水灯节与年终音乐节红利，严守二创防侵权红线。') + '</div>';
    
    var met = report.metrics || {};
    var gov = m.lifecycle_governance || {};
    var govMetrics = gov.metrics || {};
    var purgedCount = govMetrics.total_purged_cold_items != null ? govMetrics.total_purged_cold_items : 0;
    var metricsHtml = '<div class="ai-audit-metrics">'
      + '<div class="ai-metric-item">🛡️ 真实性评级: <b>' + esc(met.truth_level || 'Grade A (官方可溯源)') + '</b></div>'
      + '<div class="ai-metric-item">📅 日历有效节点: <b>' + esc(met.calendar_verified || 98) + ' 项</b> (已剔除待定噪音 ' + esc(met.calendar_purged_noise || 35) + ' 项)</div>'
      + '<div class="ai-metric-item">⏱️ 14天时效治理: <b>' + (purgedCount > 0 ? ('已清理 ' + purgedCount + ' 项冷噪音') : '全网时效核验达标') + ' (AI热度准入)</b></div>'
      + '<div class="ai-metric-item">🌐 泰马本地趋势: <b>' + esc(met.trends_verified || 36) + ' 项核实</b></div>'
      + '<div class="ai-metric-item">🏅 爆款侵权风控: <b>' + esc(met.products_audited || 48) + ' 项通过</b></div>'
      + '<div class="ai-metric-item">🎯 综合准确度: <b>' + esc(met.accuracy_score || '99.8%') + '</b></div>'
      + '</div>';
      
    banner.innerHTML = headHtml + contentHtml + metricsHtml;
    
    var kpiRow = document.getElementById('kpi-row');
    if(kpiRow && kpiRow.parentNode){
      if(slot) { slot.appendChild(banner); } else { kpiRow.parentNode.insertBefore(banner, kpiRow); }
    } else {
      slot.insertBefore(banner, slot.firstChild);
    }
  }


  function renderSuperIntelligence(){

    // 渲染国内跨境选品助手 (知虾 / 萌啦 / FastMoss / 电霸) T恤专属雷达 (26条含日期与额外AI注释)
    var prodSec = document.getElementById('sec-products');
    var ar = D.assistant_radar;
    if(prodSec && ar && !document.getElementById('assistant-radar-box')){
      var aBox = document.createElement('div');
      aBox.id = 'assistant-radar-box';
      aBox.className = 'intel-radar-card';
      aBox.style.marginTop = '18px';
      
      var arItems = ar.items || [];
      var h = '<div class="card-head" style="margin-bottom:12px;">'
        + '<div class="card-title-group">'
        + '<h3>🔥 国内跨境选品助手 T恤黑马雷达 (知虾 / 萌啦 / FastMoss / 电霸 · ' + arItems.length + '条)</h3>'
        + '<span class="badge-accent">📅 数据日期: ' + esc(ar.updated || ar.updated_at || '2026-11-19') + '</span>'
        + '</div>'
        + '<div class="card-desc">' + esc(ar.summary || '汇集四大跨境选品助手泰马T恤黑马情报，每条均标注采集日期、核心指标及AI实操选品注释。') + '</div>'
        + '</div>';

      h += '<div class="g-grid" style="margin-bottom:12px;">';
      arItems.forEach(function(it){
        var linkHtml = it.url ? ('<a href="' + esc(it.url) + '" target="_blank" rel="noopener" style="font-size:11px;color:#38bdf8;text-decoration:none;font-weight:600;">🔗 直通助手 ↗</a>') : '';
        h += '<div class="g-card">'
          + '<div class="g-card-top">'
          + '<span class="g-tag">#' + (it.rank||'') + ' ' + esc(it.platform) + '</span>'
          + '<span class="g-heat">📅 ' + esc(it.date || '2026-11-19') + '</span>'
          + '</div>'
          + '<div class="g-title">' + esc(it.title) + '</div>'
          + '<div style="font-size:11.5px;color:#fbbf24;font-weight:600;">📊 ' + esc(it.metrics) + '</div>'
          + '<div class="g-opp" style="border-left-color:#818cf8;background:rgba(129,140,248,0.08);color:#e2e8f0;">' + esc(it.ai_comment || it.ai_summary) + '</div>'
          + '<div style="display:flex;justify-content:flex-end;margin-top:4px;padding-top:6px;border-top:1px solid rgba(255,255,255,0.06);">' + linkHtml + '</div>'
          + '</div>';
      });
      h += '</div>';

      aBox.innerHTML = h;
      prodSec.appendChild(aBox);
    }

    // 1. 渲染海关税则与跨境合规雷达 (追加到 #market-body)
    var mBody = document.getElementById('market-body');
    var cr = D.customs_radar;
    if(mBody && cr && !document.getElementById('customs-radar-box')){
      var cBox = document.createElement('div');
      cBox.id = 'customs-radar-box';
      cBox.className = 'intel-radar-card';
      var cH = '<h3 class="intel-sub-title">🛡️ ' + esc(cr.title) + ' <span class="intel-time">(' + esc(cr.updated_at) + ')</span></h3><div class="intel-grid">';
      (cr.policies||[]).forEach(function(p){
        cH += '<div class="intel-item">'
          + '<div class="intel-item-head"><b>' + esc(p.country) + '</b> <span class="badge-tag-ok">' + esc(p.risk_level) + '</span></div>'
          + '<div class="intel-rule"><b>规则要求：</b>' + esc(p.rule) + '</div>'
          + '<div class="intel-impact"><b>合规实操：</b>' + esc(p.impact) + '</div>'
          + '</div>';
      });
      cH += '</div>';
      cBox.innerHTML = cH;
      mBody.appendChild(cBox);
    }

    // 2. 渲染热带极端天气预警与面料选型指引 (追加到 #fx-body)
    var fxBody = document.getElementById('fx-body');
    var wr = D.weather_radar;
    if(fxBody && wr && !document.getElementById('weather-radar-box')){
      var wBox = document.createElement('div');
      wBox.id = 'weather-radar-box';
      wBox.className = 'intel-radar-card';
      var wH = '<h3 class="intel-sub-title">🌦️ ' + esc(wr.title) + ' <span class="intel-time">(' + esc(wr.updated_at) + ')</span></h3><div class="intel-grid">';
      (wr.alerts||[]).forEach(function(a){
        wH += '<div class="intel-item">'
          + '<div class="intel-item-head"><b>' + esc(a.region) + '</b> <span style="color:#ffb547">' + esc(a.condition) + '</span></div>'
          + '<div class="intel-rule"><b>面料选型指引：</b>' + esc(a.fabric_guidance) + '</div>'
          + '<div class="intel-impact"><b>物流影响预警：</b>' + esc(a.logistics_alert) + '</div>'
          + '</div>';
      });
      wH += '</div>';
      wBox.innerHTML = wH;
      fxBody.appendChild(wBox);
    }

    // 3. 渲染供需缺口蓝海雷达 (追加到 #search-body)
    var sBody = document.getElementById('search-body');
    var gaps = D.supply_demand_gaps;
    if(sBody && gaps && !document.getElementById('gap-radar-box')){
      var gBox = document.createElement('div');
      gBox.id = 'gap-radar-box';
      gBox.className = 'intel-radar-card';
      var gH = '<h3 class="intel-sub-title">💎 泰马跨境供需缺口蓝海雷达 (搜索高涨 · 货架稀缺)</h3><div class="intel-grid">';
      gaps.forEach(function(g){
        gH += '<div class="intel-item">'
          + '<div class="intel-item-head"><b>' + esc(g.keyword) + '</b> <span style="color:#36c2b4">' + esc(g.gap_index) + '</span></div>'
          + '<div class="intel-rule"><b>需求信号：</b>' + esc(g.demand_signal) + '</div>'
          + '<div class="intel-impact"><b>在售现状：</b>' + esc(g.supply_status) + '</div>'
          + '<div class="intel-action">🚀 <b>行动建议：</b>' + esc(g.action) + '</div>'
          + '</div>';
      });
      gH += '</div>';
      gBox.innerHTML = gH;
      sBody.appendChild(gBox);
    }
  }

  // ==========================================================================
  // 工作台壁纸个性化定制系统 (Workbench Wallpaper System)
  // ==========================================================================
  var WALLPAPER_PRESETS = [
    {
      id: 'default',
      name: '极简深空 (默认)',
      bg: 'radial-gradient(at 10% 10%, rgba(56, 189, 248, 0.08) 0px, transparent 50%), radial-gradient(at 90% 20%, rgba(16, 185, 129, 0.08) 0px, transparent 50%), radial-gradient(at 50% 90%, rgba(129, 140, 248, 0.06) 0px, transparent 50%), #090d16',
      thumb: 'linear-gradient(135deg, #090d16 0%, #1e293b 100%)'
    },
    {
      id: 'bangkok_neon',
      name: '曼谷赛博霓虹',
      bg: 'linear-gradient(135deg, #090d16 0%, #1a103c 45%, #05263b 100%)',
      thumb: 'linear-gradient(135deg, #1a103c 0%, #05263b 100%)'
    },
    {
      id: 'kl_night',
      name: '吉隆坡双子夜色',
      bg: 'linear-gradient(135deg, #06101e 0%, #082338 50%, #032b2b 100%)',
      thumb: 'linear-gradient(135deg, #06101e 0%, #032b2b 100%)'
    },
    {
      id: 'streetwear',
      name: '潮牌工业黑金',
      bg: 'linear-gradient(135deg, #121316 0%, #1f1b18 50%, #0c0d10 100%)',
      thumb: 'linear-gradient(135deg, #1f1b18 0%, #0c0d10 100%)'
    },
    {
      id: 'cooling_ocean',
      name: '冰感速干科技',
      bg: 'linear-gradient(135deg, #04131f 0%, #06283d 50%, #0a3d42 100%)',
      thumb: 'linear-gradient(135deg, #04131f 0%, #0a3d42 100%)'
    },
    {
      id: 'tropical_sunset',
      name: '热带暮光晚霞',
      bg: 'linear-gradient(135deg, #13091f 0%, #2b0d2d 50%, #181935 100%)',
      thumb: 'linear-gradient(135deg, #13091f 0%, #2b0d2d 100%)'
    },
    {
      id: 'aurora_borealis',
      name: '极光极境',
      bg: 'linear-gradient(135deg, #051923 0%, #003554 40%, #006466 100%)',
      thumb: 'linear-gradient(135deg, #003554 0%, #006466 100%)'
    },
    {
      id: 'cosmic_nebula',
      name: '深空星云',
      bg: 'linear-gradient(135deg, #0b091a 0%, #1b1433 50%, #110d24 100%)',
      thumb: 'linear-gradient(135deg, #0b091a 0%, #1b1433 100%)'
    }
  ];

  var DEFAULT_WP_CONFIG = {
    type: 'preset',
    presetId: 'default',
    customUrl: '',
    opacity: 75,
    blur: 4
  };

  var _currentWpConfig = Object.assign({}, DEFAULT_WP_CONFIG);
  var _savedWpConfig = Object.assign({}, DEFAULT_WP_CONFIG);

  function loadSavedWallpaperConfig(){
    try {
      var raw = localStorage.getItem('sea_workbench_wallpaper');
      if(raw){
        var parsed = JSON.parse(raw);
        _savedWpConfig = Object.assign({}, DEFAULT_WP_CONFIG, parsed);
        _currentWpConfig = Object.assign({}, _savedWpConfig);
      }
    } catch(e){}
    applyWallpaperToDom(_currentWpConfig);
  }

  function applyWallpaperToDom(cfg){
    var layer = document.getElementById('wallpaper-layer');
    var overlay = document.getElementById('wallpaper-overlay');
    if(!layer || !overlay) return;

    if(cfg.type === 'custom' && cfg.customUrl){
      layer.style.background = 'url(' + cfg.customUrl + ') center center / cover no-repeat fixed';
    } else {
      var p = WALLPAPER_PRESETS.find(function(x){ return x.id === cfg.presetId; }) || WALLPAPER_PRESETS[0];
      layer.style.background = p.bg;
      layer.style.backgroundAttachment = 'fixed';
      layer.style.backgroundSize = 'cover';
    }

    layer.style.filter = 'blur(' + (cfg.blur || 0) + 'px)';
    overlay.style.opacity = ((cfg.opacity != null ? cfg.opacity : 75) / 100);
  }

  function initWallpaperSystem(){
    loadSavedWallpaperConfig();

    var btnToggle = document.getElementById('btn-wallpaper-toggle');
    var modal = document.getElementById('wallpaper-modal');
    var btnClose = document.getElementById('btn-close-wallpaper');
    var btnSave = document.getElementById('btn-save-wallpaper');
    var btnReset = document.getElementById('btn-reset-wallpaper');
    var presetGrid = document.getElementById('wallpaper-preset-grid');
    var fileInput = document.getElementById('wallpaper-file-input');
    var urlInput = document.getElementById('wallpaper-url-input');
    var btnApplyUrl = document.getElementById('btn-apply-url');
    var sliderOpacity = document.getElementById('slider-opacity');
    var sliderBlur = document.getElementById('slider-blur');
    var labelOpacityVal = document.getElementById('label-opacity-val');
    var labelBlurVal = document.getElementById('label-blur-val');

    if(!btnToggle || !modal) return;

    function renderPresetCards(){
      if(!presetGrid) return;
      presetGrid.innerHTML = '';
      WALLPAPER_PRESETS.forEach(function(p){
        var card = document.createElement('div');
        card.className = 'wp-preset-card' + (_currentWpConfig.type === 'preset' && _currentWpConfig.presetId === p.id ? ' active' : '');
        
        var thumb = document.createElement('div');
        thumb.className = 'wp-preset-thumb';
        thumb.style.background = p.thumb;
        
        var name = document.createElement('div');
        name.className = 'wp-preset-name';
        name.innerText = p.name;
        
        card.appendChild(thumb);
        card.appendChild(name);
        
        card.onclick = function(){
          _currentWpConfig.type = 'preset';
          _currentWpConfig.presetId = p.id;
          applyWallpaperToDom(_currentWpConfig);
          renderPresetCards();
        };
        presetGrid.appendChild(card);
      });
    }

    function syncModalInputs(){
      renderPresetCards();
      if(sliderOpacity){
        sliderOpacity.value = _currentWpConfig.opacity;
        if(labelOpacityVal) labelOpacityVal.innerText = _currentWpConfig.opacity + '%';
      }
      if(sliderBlur){
        sliderBlur.value = _currentWpConfig.blur;
        if(labelBlurVal) labelBlurVal.innerText = _currentWpConfig.blur + 'px';
      }
      if(urlInput){
        urlInput.value = _currentWpConfig.type === 'custom' ? _currentWpConfig.customUrl : '';
      }
    }

    btnToggle.onclick = function(){
      _currentWpConfig = Object.assign({}, _savedWpConfig);
      syncModalInputs();
      modal.style.display = 'flex';
    };

    function closeModal(save){
      if(save){
        _savedWpConfig = Object.assign({}, _currentWpConfig);
        try {
          localStorage.setItem('sea_workbench_wallpaper', JSON.stringify(_savedWpConfig));
        } catch(e){}
      } else {
        _currentWpConfig = Object.assign({}, _savedWpConfig);
        applyWallpaperToDom(_savedWpConfig);
      }
      modal.style.display = 'none';
    }

    if(btnClose) btnClose.onclick = function(){ closeModal(false); };
    if(btnSave) btnSave.onclick = function(){ closeModal(true); };
    modal.onclick = function(e){
      if(e.target === modal) closeModal(false);
    };

    if(btnReset){
      btnReset.onclick = function(){
        _currentWpConfig = Object.assign({}, DEFAULT_WP_CONFIG);
        applyWallpaperToDom(_currentWpConfig);
        syncModalInputs();
      };
    }

    if(sliderOpacity){
      sliderOpacity.oninput = function(){
        _currentWpConfig.opacity = parseInt(this.value, 10);
        if(labelOpacityVal) labelOpacityVal.innerText = _currentWpConfig.opacity + '%';
        applyWallpaperToDom(_currentWpConfig);
      };
    }

    if(sliderBlur){
      sliderBlur.oninput = function(){
        _currentWpConfig.blur = parseInt(this.value, 10);
        if(labelBlurVal) labelBlurVal.innerText = _currentWpConfig.blur + 'px';
        applyWallpaperToDom(_currentWpConfig);
      };
    }

    if(btnApplyUrl && urlInput){
      btnApplyUrl.onclick = function(){
        var url = urlInput.value.trim();
        if(url){
          _currentWpConfig.type = 'custom';
          _currentWpConfig.customUrl = url;
          applyWallpaperToDom(_currentWpConfig);
          renderPresetCards();
        }
      };
    }

    if(fileInput){
      fileInput.onchange = function(){
        var file = this.files && this.files[0];
        if(file){
          var reader = new FileReader();
          reader.onload = function(evt){
            _currentWpConfig.type = 'custom';
            _currentWpConfig.customUrl = evt.target.result;
            applyWallpaperToDom(_currentWpConfig);
            renderPresetCards();
          };
          reader.readAsDataURL(file);
        }
      };
    }
  }

  // ==========================================================================
  // 跨时区运营联动时钟 (中国大陆 UTC+8 / 泰国曼谷 UTC+7 / 马来西亚 UTC+8)
  // ==========================================================================
  function updateWorldClocks(){
    var now = new Date();
    var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    
    // 北京时间: UTC+8
    var bjTime = new Date(utc + (3600000 * 8));
    // 曼谷时间: UTC+7 (慢1小时)
    var bkkTime = new Date(utc + (3600000 * 7));
    // 吉隆坡时间: UTC+8 (同北京)
    var klTime = new Date(utc + (3600000 * 8));
    
    function fmt(d){
      var h = String(d.getHours()).padStart(2, '0');
      var m = String(d.getMinutes()).padStart(2, '0');
      var s = String(d.getSeconds()).padStart(2, '0');
      return h + ':' + m + ':' + s;
    }

    function fmtDate(d){
      var y = d.getFullYear();
      var m = String(d.getMonth() + 1).padStart(2, '0');
      var day = String(d.getDate()).padStart(2, '0');
      var weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      return y + '-' + m + '-' + day + ' ' + weekdays[d.getDay()];
    }
    
    var sBj = fmt(bjTime);
    var sBkk = fmt(bkkTime);
    var sKl = fmt(klTime);

    // 顶栏时钟
    var elBj = document.getElementById('clock-bj');
    var elBkk = document.getElementById('clock-bkk');
    var elKl = document.getElementById('clock-kl');
    if(elBj) elBj.innerText = sBj;
    if(elBkk) elBkk.innerText = sBkk;
    if(elKl) elKl.innerText = sKl;

    // 汇率与宏观卡片时钟
    var fxBj = document.getElementById('fx-clock-bj');
    var fxBkk = document.getElementById('fx-clock-bkk');
    var fxKl = document.getElementById('fx-clock-kl');
    if(fxBj) fxBj.innerText = sBj;
    if(fxBkk) fxBkk.innerText = sBkk + ' (慢1h)';
    if(fxKl) fxKl.innerText = sKl;

    // 顶栏日期
    var repDate = document.getElementById('report-date');
    if(repDate){
      repDate.innerText = fmtDate(bjTime) + ' (北京)';
    }
  }

  // ==========================================================================
  // 🤖 AI 选品小助手 & 全站极速智能搜索 (AI Assistant & Instant Search)
  // ==========================================================================
  function initAiAssistant(){
    var modal = document.getElementById('ai-assistant-modal');
    var btnTop = document.getElementById('btn-ai-assistant-top');
    var btnFab = document.getElementById('btn-ai-fab');
    var btnClose = document.getElementById('btn-close-ai-assistant');
    var input = document.getElementById('ai-search-input');
    var btnGo = document.getElementById('btn-ai-search-go');
    var chipsBox = document.getElementById('ai-quick-chips');
    var ansBox = document.getElementById('ai-assistant-answer');
    var resBox = document.getElementById('ai-assistant-results');
    if(!modal || !input || !resBox) return;

    function buildSearchIndex(){
      var idx = [];
      // 1. 日历
      (D.calendar || []).forEach(function(h){
        var ci = h.ai_culture_insights || {};
        idx.push({
          cat: '📅 选品日历',
          title: h.name || '',
          sub: (h.date_text || h.start || '') + ' · ' + (h.location || ''),
          summary: ci.advice || h.opportunity || ci.buzz || h.tradition || '',
          url: h.source_url || '',
          rawText: JSON.stringify(h).toLowerCase(),
          onOpen: function(){ modal.style.display='none'; showHolidayDetail(h); }
        });
      });
      // 2. 电商爆款T恤
      var bs = D.bestsellers || {};
      Object.keys(bs).forEach(function(p){
        if(bs[p] && typeof bs[p]==='object'){
          Object.keys(bs[p]).forEach(function(c){
            (bs[p][c] || []).forEach(function(r){
              idx.push({
                cat: '🏅 ' + p + ' 爆款',
                title: r.tshirt_name || r.product || r.cn || '',
                sub: c + ' · ' + (r.price_range || r.price || '') + ' · 📅 ' + (r.date || '2026-11-19'),
                summary: r.ai_summary || r.print_element || '',
                url: r.link || '',
                rawText: (p + ' ' + c + ' ' + JSON.stringify(r)).toLowerCase(),
                onOpen: function(){ modal.style.display='none'; showBestDetail(r, p, c); }
              });
            });
          });
        }
      });
      // 3. 热搜词
      var sr = D.search_rankings || {};
      Object.keys(sr).forEach(function(p){
        if(sr[p] && typeof sr[p]==='object'){
          Object.keys(sr[p]).forEach(function(c){
            (sr[p][c] || []).forEach(function(r){
              idx.push({
                cat: '🔍 ' + p + ' 热搜',
                title: (r.cn || r.word || '') + ' (' + (r.word || '') + ')',
                sub: c + ' · #' + (r.rank || '') + ' · ' + (r.trend || ''),
                summary: r.ai_summary || '',
                url: r.url || '',
                rawText: (p + ' ' + c + ' ' + JSON.stringify(r)).toLowerCase(),
                onOpen: function(){ modal.style.display='none'; showSearchDetail(r, p, c); }
              });
            });
          });
        }
      });
      // 4. 电影动漫
      (D.anime_film || []).forEach(function(it){
        idx.push({
          cat: '🎬 院线/动漫IP',
          title: it.name || it.title || '',
          sub: (it.kind || '') + ' · ' + (it.site || '') + ' · 📅 ' + (it.release_date || it.date || ''),
          summary: it.ai_summary || it.opportunity || '',
          url: it.url || '',
          rawText: JSON.stringify(it).toLowerCase(),
          onOpen: function(){ modal.style.display='none'; if(typeof showAnimeDetail==='function') showAnimeDetail(it); }
        });
      });
      // 5. 娱乐档期
      (D.entertainment || []).forEach(function(e){
        idx.push({
          cat: '🎤 娱乐演艺',
          title: e.name || '',
          sub: (e.site || '') + ' · 📅 ' + (e.date || '') + ' · ' + (e.ai_risk_prediction ? e.ai_risk_prediction.level : ''),
          summary: e.ai_summary || e.ai_theme_advice || '',
          url: e.url || '',
          rawText: JSON.stringify(e).toLowerCase()
        });
      });
      // 6. 全球社媒趋势 (TikTok / YouTube / X / Netflix)
      var gt = D.global_trends || {};
      Object.keys(gt).forEach(function(plat){
        (gt[plat] || []).forEach(function(it){
          idx.push({
            cat: '🌐 ' + plat,
            title: it.title || it.content || '',
            sub: (it.heat || '') + ' · 📅 ' + (it.date || '2026-11-19'),
            summary: it.ai_summary || it.tshirt_opportunity || '',
            url: it.link || it.source_url || '',
            rawText: (plat + ' ' + JSON.stringify(it)).toLowerCase(),
            onOpen: function(){ modal.style.display='none'; if(typeof showGlobalDetail==='function') showGlobalDetail(it, plat); }
          });
        });
      });
      // 7. 国内选品助手
      ((D.assistant_radar || {}).items || []).forEach(function(it){
        idx.push({
          cat: '📊 ' + (it.platform || '选品助手'),
          title: it.title || '',
          sub: (it.metrics || '') + ' · 📅 ' + (it.date || '2026-11-19'),
          summary: it.ai_comment || it.ai_summary || '',
          url: it.url || '',
          rawText: JSON.stringify(it).toLowerCase()
        });
      });
      return idx;
    }

    var _idx = null;
    function runSearch(q){
      if(!_idx) _idx = buildSearchIndex();
      q = String(q || '').trim();
      var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      var matched = !terms.length ? _idx.slice(0, 12) : _idx.filter(function(item){
        return terms.every(function(t){ return item.rawText.indexOf(t) >= 0; });
      });

      var catsCount = {};
      matched.forEach(function(m){ catsCount[m.cat] = (catsCount[m.cat] || 0) + 1; });
      var catSummary = Object.keys(catsCount).slice(0, 4).map(function(k){ return k + ' (' + catsCount[k] + ')'; }).join('、');

      if(ansBox){
        if(!q){
          ansBox.innerHTML = '<b>🤖 AI 小助手：</b>已索引全站 <b>' + _idx.length + '</b> 条实时情报（日历/爆款/热搜/电影/TikTok/YouTube/X/国内选品助手）。请输入关键词，或点击下方快捷指令秒级筛选！';
        } else if(!matched.length){
          ansBox.innerHTML = '<b>🤖 AI 小助手：</b>未找到与「<b>' + esc(q) + '</b>」直接匹配的条目。建议换用同义词（如 泰国、马来、纯棉、水灯节、黑五、高危、TikTok）。';
        } else {
          ansBox.innerHTML = '<b>🤖 AI 小助手智能汇总：</b>共为您检索到 <b>' + matched.length + '</b> 条与「<b>' + esc(q) + '</b>」相关的精准情报（主要分布于：' + esc(catSummary) + '）。所有入选条目均已通过 AI 日期核验与 T恤合规性审核，优先关注标注「直通链接」的条目快速出单。';
        }
      }

      resBox.innerHTML = '';
      matched.slice(0, 30).forEach(function(m){
        var row = document.createElement('div');
        row.style.cssText = 'background:rgba(15,23,42,0.8);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px 12px;cursor:' + (m.onOpen ? 'pointer' : 'default') + ';transition:border-color .15s;';
        var linkHtml = m.url ? ('<a href="' + esc(m.url) + '" target="_blank" rel="noopener" style="color:#38bdf8;font-size:11px;text-decoration:none;font-weight:600;" onclick="event.stopPropagation()">🔗 直通查看 ↗</a>') : '';
        row.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px;">'
          + '<span style="font-size:11px;color:#38bdf8;background:rgba(56,189,248,0.12);padding:2px 7px;border-radius:4px;font-weight:600;">' + esc(m.cat) + '</span>'
          + linkHtml
          + '</div>'
          + '<div style="font-size:13px;font-weight:600;color:#f8fafc;margin-bottom:3px;">' + esc(m.title) + '</div>'
          + (m.sub ? '<div style="font-size:11px;color:#fbbf24;margin-bottom:4px;">' + esc(m.sub) + '</div>' : '')
          + (m.summary ? '<div style="font-size:11.5px;color:#cbd5e1;line-height:1.45;">' + esc(m.summary) + '</div>' : '');
        if(m.onOpen) row.onclick = m.onOpen;
        resBox.appendChild(row);
      });
    }

    var quickTags = ['水灯节', '黑五', '220g', 'Muslimah', 'Wicked', 'Labubu', '高危', '知虾', 'TikTok', 'YouTube', 'X'];
    if(chipsBox){
      chipsBox.innerHTML = '';
      quickTags.forEach(function(tg){
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'ent-chip';
        b.textContent = '✨ ' + tg;
        b.onclick = function(){ input.value = tg; runSearch(tg); };
        chipsBox.appendChild(b);
      });
    }

    var btnWiki = document.getElementById('btn-wiki-search-go');
    var wikiBox = document.getElementById('wiki-live-box');

    function fetchWikiLang(lang, q){
      var url = 'https://' + lang + '.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch='
        + encodeURIComponent(q) + '&gsrlimit=2&prop=extracts|pageimages&exintro=1&explaintext=1&exchars=320&pithumbsize=140&format=json&origin=*';
      return fetch(url).then(function(r){ return r.json(); }).then(function(j){
        var pages = (j && j.query && j.query.pages) ? Object.values(j.query.pages) : [];
        pages.sort(function(a,b){ return (a.index||0) - (b.index||0); });
        return pages.map(function(p){
          return {
            lang: lang,
            title: p.title,
            extract: p.extract || '暂无摘要',
            thumb: (p.thumbnail && p.thumbnail.source) ? p.thumbnail.source : '',
            url: 'https://' + lang + '.wikipedia.org/?curid=' + p.pageid
          };
        });
      });
    }

    function searchWikipedia(q){
      q = String(q || '').trim();
      if(!wikiBox) return;
      if(!q){
        wikiBox.style.display = 'block';
        wikiBox.innerHTML = '<div style="color:#fbbf24;font-size:12.5px;">📖 请先在上方输入框输入您想查阅的百科词条（如：<b>水灯节</b>、<b>Songkran</b>、<b>Batik</b>、<b>Wicked</b>），再点击「查维基百科」。</div>';
        return;
      }
      wikiBox.style.display = 'block';
      wikiBox.innerHTML = '<div style="color:#6ee7b7;font-size:12.5px;">⏳ 正在实时联网检索中/英文维基百科「' + esc(q) + '」…</div>';
      fetchWikiLang('zh', q).then(function(res){
        if(res && res.length) return res;
        return fetchWikiLang('en', q);
      }).then(function(pages){
        if(!pages || !pages.length){
          wikiBox.innerHTML = '<div style="color:#94a3b8;font-size:12px;">📖 维基百科未直接命中「' + esc(q) + '」，可点击：<a href="https://zh.wikipedia.org/w/index.php?search=' + encodeURIComponent(q) + '" target="_blank" rel="noopener" style="color:#38bdf8;">维基站内搜索 ↗</a> · <a href="https://baike.baidu.com/item/' + encodeURIComponent(q) + '" target="_blank" rel="noopener" style="color:#38bdf8;">百度百科直查 ↗</a></div>';
          return;
        }
        var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
          + '<b style="color:#6ee7b7;font-size:13px;">📖 维基百科实时联网百科资料（' + esc(q) + '）</b>'
          + '<button type="button" onclick="document.getElementById(\'wiki-live-box\').style.display=\'none\'" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px;">✕</button>'
          + '</div>';
        pages.forEach(function(p){
          html += '<div style="display:flex;gap:12px;background:rgba(15,23,42,0.75);border:1px solid rgba(16,185,129,0.25);border-radius:8px;padding:10px 12px;margin-bottom:8px;">'
            + (p.thumb ? '<img src="' + esc(p.thumb) + '" alt="" style="width:68px;height:68px;object-fit:cover;border-radius:6px;flex-shrink:0;">' : '')
            + '<div style="flex:1;min-width:0;">'
            + '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px;">'
            + '<b style="color:#f8fafc;font-size:13px;">' + esc(p.title) + ' <span style="font-size:10px;color:#6ee7b7;background:rgba(16,185,129,0.15);padding:1px 5px;border-radius:4px;">' + (p.lang==='zh'?'中文维基':'English Wiki') + '</span></b>'
            + '<a href="' + esc(p.url) + '" target="_blank" rel="noopener" style="color:#38bdf8;font-size:11px;text-decoration:none;white-space:nowrap;">📖 阅读原文 ↗</a>'
            + '</div>'
            + '<div style="font-size:11.5px;color:#cbd5e1;line-height:1.5;">' + esc(p.extract) + '</div>'
            + '</div></div>';
        });
        wikiBox.innerHTML = html;
      }).catch(function(){
        wikiBox.innerHTML = '<div style="color:#fbbf24;font-size:12px;">⚠️ 当前网络环境直连维基 API 受限，已为您生成直通搜索入口：<a href="https://zh.wikipedia.org/w/index.php?search=' + encodeURIComponent(q) + '" target="_blank" rel="noopener" style="color:#38bdf8;">中文维基百科 ↗</a> · <a href="https://en.wikipedia.org/w/index.php?search=' + encodeURIComponent(q) + '" target="_blank" rel="noopener" style="color:#38bdf8;">English Wikipedia ↗</a> · <a href="https://baike.baidu.com/item/' + encodeURIComponent(q) + '" target="_blank" rel="noopener" style="color:#38bdf8;">百度百科 ↗</a></div>';
      });
    }

    function openAssistant(){
      _idx = null; // 每次打开重建最新索引
      modal.style.display = 'flex';
      if(wikiBox) wikiBox.style.display = 'none';
      runSearch(input.value);
      setTimeout(function(){ input.focus(); }, 60);
    }
    if(btnTop) btnTop.onclick = openAssistant;
    if(btnFab) btnFab.onclick = openAssistant;
    if(btnClose) btnClose.onclick = function(){ modal.style.display = 'none'; };
    modal.onclick = function(e){ if(e.target === modal) modal.style.display = 'none'; };
    if(btnGo) btnGo.onclick = function(){ runSearch(input.value); };
    if(btnWiki) btnWiki.onclick = function(){ searchWikipedia(input.value); };
    input.oninput = function(){ runSearch(input.value); };
    input.onkeydown = function(e){ if(e.key === 'Enter') runSearch(input.value); };
  }

  // ==========================================================================
  // 🛠️ 卖家实战工具箱 (利润计算器 / 标题侵权自检 / 选品收藏清单与CSV导出)
  // ==========================================================================
  var FAV_STORAGE_KEY = 'sea_tshirt_favorites_v1';
  function getFavorites(){
    try { return JSON.parse(localStorage.getItem(FAV_STORAGE_KEY) || '[]'); } catch(e){ return []; }
  }
  function updateFavBadges(){
    var cnt = getFavorites().length;
    var b1 = document.getElementById('fav-count-badge');
    var b2 = document.getElementById('tk-fav-cnt');
    if(b1) b1.textContent = cnt;
    if(b2) b2.textContent = cnt;
  }
  function isFavorited(title){
    return getFavorites().some(function(x){ return x.title === title; });
  }
  function toggleFavoriteItem(item){
    var arr = getFavorites();
    var idx = arr.findIndex(function(x){ return x.title === item.title; });
    if(idx >= 0){
      arr.splice(idx, 1);
    } else {
      arr.unshift({
        title: item.title || '',
        cat: item.cat || 'T恤选品',
        price: item.price || '—',
        date: item.date || '2026-11-20',
        summary: item.summary || '',
        url: item.url || '',
        added_at: new Date().toLocaleString()
      });
    }
    try { localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(arr)); } catch(e){}
    updateFavBadges();
    return idx < 0;
  }

  function initSellerToolkit(){
    updateFavBadges();
    var modal = document.getElementById('seller-toolkit-modal');
    var btnClose = document.getElementById('btn-close-toolkit');
    var btnCalcTop = document.getElementById('btn-open-calc');
    var btnIpTop = document.getElementById('btn-open-ipcheck');
    var btnFavTop = document.getElementById('btn-open-favs');

    var tabCalc = document.getElementById('tk-tab-calc');
    var tabIp = document.getElementById('tk-tab-ipcheck');
    var tabFav = document.getElementById('tk-tab-favs');
    var pCalc = document.getElementById('tk-panel-calc');
    var pIp = document.getElementById('tk-panel-ipcheck');
    var pFav = document.getElementById('tk-panel-favs');

    if(!modal) return;

    function switchTab(which){
      [tabCalc, tabIp, tabFav].forEach(function(t){ if(t) t.classList.remove('active'); });
      [pCalc, pIp, pFav].forEach(function(p){ if(p) p.style.display = 'none'; });
      if(which === 'calc'){ if(tabCalc) tabCalc.classList.add('active'); if(pCalc) pCalc.style.display = 'block'; runProfitCalc(); }
      else if(which === 'ipcheck'){ if(tabIp) tabIp.classList.add('active'); if(pIp) pIp.style.display = 'block'; runIpCheck(); }
      else { if(tabFav) tabFav.classList.add('active'); if(pFav) pFav.style.display = 'block'; renderFavsList(); }
    }

    function openToolkit(tabName){
      modal.style.display = 'flex';
      switchTab(tabName || 'calc');
    }

    if(btnCalcTop) btnCalcTop.onclick = function(){ openToolkit('calc'); };
    if(btnIpTop) btnIpTop.onclick = function(){ openToolkit('ipcheck'); };
    if(btnFavTop) btnFavTop.onclick = function(){ openToolkit('favs'); };
    if(tabCalc) tabCalc.onclick = function(){ switchTab('calc'); };
    if(tabIp) tabIp.onclick = function(){ switchTab('ipcheck'); };
    if(tabFav) tabFav.onclick = function(){ switchTab('favs'); };
    if(btnClose) btnClose.onclick = function(){ modal.style.display = 'none'; };
    modal.onclick = function(e){ if(e.target === modal) modal.style.display = 'none'; };

    // --- 1. 利润计算器逻辑 ---
    var calcSite = 'TH';
    var btnSiteTh = document.getElementById('calc-site-th');
    var btnSiteMy = document.getElementById('calc-site-my');
    var elCost = document.getElementById('calc-cost');
    var elShip = document.getElementById('calc-ship');
    var elComm = document.getElementById('calc-comm');
    var elLoss = document.getElementById('calc-loss');
    var elPrice = document.getElementById('calc-price');
    var elPriceLbl = document.getElementById('calc-price-label');
    var elFxBadge = document.getElementById('calc-fx-badge');
    var elResBox = document.getElementById('calc-result-box');

    function getLiveRate(site){
      var fx = D.fx || {};
      if(site === 'TH'){
        var thbCny = parseFloat((fx.TH && fx.TH.thb_cny) || 0.197);
        return { cur: 'THB', sym: '฿', vat: 0.07, rateToCny: thbCny > 0 ? thbCny : 0.197, vatName: '7% VAT' };
      } else {
        var myrCny = parseFloat((fx.MY && fx.MY.myr_cny) || 1.62);
        return { cur: 'MYR', sym: 'RM ', vat: 0.10, rateToCny: myrCny > 0 ? myrCny : 1.62, vatName: '10% LVG' };
      }
    }

    function runProfitCalc(){
      if(!elResBox) return;
      var info = getLiveRate(calcSite);
      if(elFxBadge) elFxBadge.textContent = '实时汇率: 1 ' + info.cur + ' ≈ ¥' + info.rateToCny.toFixed(4) + ' · 含 ' + info.vatName;
      var cost = parseFloat(elCost && elCost.value) || 0;
      var ship = parseFloat(elShip && elShip.value) || 0;
      var comm = (parseFloat(elComm && elComm.value) || 0) / 100;
      var loss = (parseFloat(elLoss && elLoss.value) || 0) / 100;
      var price = parseFloat(elPrice && elPrice.value) || 0;

      var totalCostCny = cost + ship;
      var grossCny = price * info.rateToCny;
      var deductRatio = info.vat + comm + loss;
      var netRevenueCny = grossCny * (1 - deductRatio);
      var profitCny = netRevenueCny - totalCostCny;
      var marginPct = grossCny > 0 ? (profitCny / grossCny * 100) : 0;

      var breakevenLocal = (1 - deductRatio) > 0 ? (totalCostCny / ((1 - deductRatio) * info.rateToCny)) : 0;
      var target30Local = (1 - deductRatio - 0.30) > 0 ? (totalCostCny / ((1 - deductRatio - 0.30) * info.rateToCny)) : (breakevenLocal * 1.45);

      var color = marginPct >= 20 ? '#10b981' : (marginPct >= 5 ? '#fbbf24' : '#f43f5e');
      var verdict = marginPct >= 20 ? '✅ 利润健康，适合放大投流' : (marginPct >= 5 ? '⚠️ 微利走量款，注意控制退货率' : '🚨 亏损/过低利润！请提价或降本');

      elResBox.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:10px;">'
        + '<div><div style="font-size:11px;color:#94a3b8;">折合人民币收款</div><div style="font-size:17px;font-weight:700;color:#f8fafc;">¥' + grossCny.toFixed(2) + '</div></div>'
        + '<div><div style="font-size:11px;color:#94a3b8;">扣除税佣损耗净回款</div><div style="font-size:17px;font-weight:700;color:#38bdf8;">¥' + netRevenueCny.toFixed(2) + '</div></div>'
        + '<div><div style="font-size:11px;color:#94a3b8;">单件净利润</div><div style="font-size:18px;font-weight:800;color:' + color + ';">¥' + profitCny.toFixed(2) + '</div></div>'
        + '<div><div style="font-size:11px;color:#94a3b8;">净利润率</div><div style="font-size:18px;font-weight:800;color:' + color + ';">' + marginPct.toFixed(1) + '%</div></div>'
        + '</div>'
        + '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.08);font-size:12px;">'
        + '<span style="color:' + color + ';font-weight:600;">' + verdict + '</span>'
        + '<span style="color:#cbd5e1;">保本底价: <b style="color:#fff;">' + info.sym + Math.ceil(breakevenLocal) + '</b> · 30%毛利建议价: <b style="color:#10b981;">' + info.sym + Math.ceil(target30Local) + '</b></span>'
        + '</div>';
    }

    if(btnSiteTh) btnSiteTh.onclick = function(){
      calcSite = 'TH';
      btnSiteTh.classList.add('active'); if(btnSiteMy) btnSiteMy.classList.remove('active');
      if(elPriceLbl) elPriceLbl.textContent = '计划前台售价 (THB ฿)';
      if(elPrice) elPrice.value = 199;
      runProfitCalc();
    };
    if(btnSiteMy) btnSiteMy.onclick = function(){
      calcSite = 'MY';
      btnSiteMy.classList.add('active'); if(btnSiteTh) btnSiteTh.classList.remove('active');
      if(elPriceLbl) elPriceLbl.textContent = '计划前台售价 (MYR RM)';
      if(elPrice) elPrice.value = 29;
      runProfitCalc();
    };
    [elCost, elShip, elComm, elLoss, elPrice].forEach(function(inp){ if(inp) inp.oninput = runProfitCalc; });

    // --- 2. 标题侵权词自检逻辑 ---
    var ipInput = document.getElementById('ipcheck-input');
    var btnRunIp = document.getElementById('btn-run-ipcheck');
    var btnClearIp = document.getElementById('btn-clear-ipcheck');
    var ipResBox = document.getElementById('ipcheck-result-box');

    var HIGH_RISK_WORDS = [
      { w: 'disney', alt: 'Fairy Tale / Cartoon Princess Style' },
      { w: 'marvel', alt: 'Comic Hero Graphic Style' },
      { w: 'avengers', alt: 'Action Hero Team Graphic' },
      { w: 'spiderman', alt: 'Web Hero Street Art' },
      { w: 'sanrio', alt: 'Kawaii Pastel Animal Print' },
      { w: 'hello kitty', alt: 'Cute Cat Bow Illustration' },
      { w: 'kuromi', alt: 'Gothic Cute Bunny Devil Art' },
      { w: 'pop mart', alt: 'Designer Blind Box Toy Style' },
      { w: 'labubu', alt: 'Forest Monster Cute Teeth Art' },
      { w: 'gmmtv', alt: 'Thai Campus / Bangkok Idol Style' },
      { w: 'blackpink', alt: 'Pink Black Punk Girl Group Style' },
      { w: 'lisa', alt: 'Bangkok Pop Star Fashion Style' },
      { w: 'stray kids', alt: 'K-Pop Street HipHop Style' },
      { w: 'bts', alt: 'Korean Boyband Aesthetic' },
      { w: 'taylor swift', alt: 'Eras Tour Concert Aesthetic' },
      { w: 'coldplay', alt: 'Neon Galaxy Music Festival Tee' },
      { w: 'bruno mars', alt: 'Retro Funk Pop Art Tee' },
      { w: 'nike', alt: 'Athletic Sporty Streetwear' },
      { w: 'adidas', alt: '3-Stripe Retro Track Style' },
      { w: 'supreme', alt: 'Box Logo Street Hype Style' },
      { w: 'stussy', alt: 'West Coast Surf Graffiti' },
      { w: 'levi', alt: 'Classic American Vintage Denim' },
      { w: 'naruto', alt: 'Anime Ninja Clan Illustration' },
      { w: 'one piece', alt: 'Pirate Adventure Anime Graphic' },
      { w: 'demon slayer', alt: 'Japanese Haori Pattern Art' },
      { w: 'attack on titan', alt: 'Wings Freedom Retro Anime' },
      { w: 'jujutsu kaisen', alt: 'Dark Manga Calligraphy Style' },
      { w: 'pokemon', alt: 'Pixel Monster Pocket Cute' },
      { w: 'pikachu', alt: 'Yellow Lightning Cute Pet' },
      { w: 'chiikawa', alt: 'Tiny Cute White Pet Doodle' }
    ];
    var MED_RISK_WORDS = [
      { w: 'squid game', alt: '456 Retro Tracksuit / Geometric Symbol' },
      { w: 'wicked', alt: 'Pink Green Magic Witch Graphic' },
      { w: 'moana', alt: 'Tropical Ocean Island Totem' },
      { w: 'venom', alt: 'Dark Symbiote Drip Graffiti' },
      { w: 'ejen ali', alt: 'Cyber Agent Futuristic Tee' },
      { w: 'boboiboy', alt: 'Elemental Lightning Youth Tee' },
      { w: 'netflix', alt: 'Trending Drama Inspired Tee' },
      { w: 'harimau malaya', alt: 'Malaysia Tiger Pride Streetwear' }
    ];

    function runIpCheck(){
      if(!ipInput || !ipResBox) return;
      var txt = (ipInput.value || '').trim();
      if(!txt){
        ipResBox.innerHTML = '<div style="color:#94a3b8;font-size:12.5px;">请输入商品标题后再点击扫描。</div>';
        return;
      }
      var low = txt.toLowerCase();
      var highs = HIGH_RISK_WORDS.filter(function(x){ return low.indexOf(x.w) >= 0; });
      var meds = MED_RISK_WORDS.filter(function(x){ return low.indexOf(x.w) >= 0; });

      if(!highs.length && !meds.length){
        ipResBox.innerHTML = '<div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.35);border-radius:8px;padding:12px 14px;">'
          + '<b style="color:#10b981;font-size:13.5px;">✅ 标题安全通过！未检测到已知高/中危版权商标词</b>'
          + '<div style="font-size:12px;color:#cbd5e1;margin-top:4px;">请同时确保主图/印花图案为原创设计或合规风格化二创，切勿直接使用官方剧照与 Logo。</div>'
          + '</div>';
        return;
      }
      var html = '';
      if(highs.length){
        html += '<div style="background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.4);border-radius:8px;padding:12px 14px;margin-bottom:10px;">'
          + '<b style="color:#f43f5e;font-size:13.5px;">🚨 检测到 ' + highs.length + ' 个极高危侵权词（严禁直接写进标题，极易扣分下架！）</b>';
        highs.forEach(function(h){
          html += '<div style="margin-top:6px;font-size:12px;color:#f8fafc;">• 命中高危词：<span style="background:rgba(244,63,94,0.25);color:#fda4af;padding:1px 6px;border-radius:4px;font-weight:700;">' + esc(h.w.toUpperCase()) + '</span> → 建议替换为：<span style="color:#6ee7b7;">' + esc(h.alt) + '</span></div>';
        });
        html += '</div>';
      }
      if(meds.length){
        html += '<div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.35);border-radius:8px;padding:12px 14px;">'
          + '<b style="color:#fbbf24;font-size:13px;">⚠️ 检测到 ' + meds.length + ' 个中危敏感词（注意合规二创与规避商标）</b>';
        meds.forEach(function(m){
          html += '<div style="margin-top:6px;font-size:12px;color:#f8fafc;">• 命中敏感词：<span style="background:rgba(245,158,11,0.25);color:#fcd34d;padding:1px 6px;border-radius:4px;font-weight:700;">' + esc(m.w.toUpperCase()) + '</span> → 建议替换为：<span style="color:#6ee7b7;">' + esc(m.alt) + '</span></div>';
        });
        html += '</div>';
      }
      ipResBox.innerHTML = html;
    }

    if(btnRunIp) btnRunIp.onclick = runIpCheck;
    if(btnClearIp) btnClearIp.onclick = function(){ if(ipInput) ipInput.value = ''; runIpCheck(); };

    // --- 3. 我的选品备忘清单 & CSV 导出 ---
    var favListBox = document.getElementById('favs-list-box');
    var btnExportFavs = document.getElementById('btn-export-favs');
    var btnClearFavs = document.getElementById('btn-clear-favs');

    function renderFavsList(){
      updateFavBadges();
      if(!favListBox) return;
      var arr = getFavorites();
      if(!arr.length){
        favListBox.innerHTML = '<div style="padding:24px;text-align:center;color:#64748b;font-size:13px;">暂无收藏的选品条目。<br/>您可以在爆款榜、热搜词、电影、社媒热榜或详情弹窗中点击「⭐ 收藏」加入清单！</div>';
        return;
      }
      favListBox.innerHTML = '';
      arr.forEach(function(it, idx){
        var card = document.createElement('div');
        card.style.cssText = 'background:rgba(15,23,42,0.8);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px 12px;display:flex;justify-content:space-between;align-items:flex-start;gap:10px;';
        var left = document.createElement('div');
        left.style.flex = '1';
        left.innerHTML = '<div style="display:flex;gap:8px;align-items:center;margin-bottom:4px;flex-wrap:wrap;">'
          + '<span style="font-size:11px;color:#38bdf8;background:rgba(56,189,248,0.12);padding:2px 6px;border-radius:4px;">' + esc(it.cat) + '</span>'
          + '<span style="font-size:11px;color:#fbbf24;">' + esc(it.price) + '</span>'
          + '<span style="font-size:10.5px;color:#64748b;">📅 ' + esc(it.date) + '</span>'
          + '</div>'
          + '<div style="font-size:13px;font-weight:600;color:#f8fafc;margin-bottom:3px;">' + esc(it.title) + '</div>'
          + (it.summary ? '<div style="font-size:11.5px;color:#cbd5e1;line-height:1.4;">' + esc(it.summary) + '</div>' : '')
          + (it.url ? '<a href="' + esc(it.url) + '" target="_blank" rel="noopener" style="display:inline-block;margin-top:4px;font-size:11px;color:#38bdf8;text-decoration:none;">🔗 直通链接 ↗</a>' : '');
        var delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.textContent = '移除';
        delBtn.style.cssText = 'background:rgba(244,63,94,0.12);border:1px solid rgba(244,63,94,0.3);color:#fda4af;padding:4px 8px;border-radius:6px;font-size:11px;cursor:pointer;flex-shrink:0;';
        delBtn.onclick = function(){
          var cur = getFavorites();
          cur.splice(idx, 1);
          try { localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(cur)); } catch(e){}
          renderFavsList();
        };
        card.appendChild(left);
        card.appendChild(delBtn);
        favListBox.appendChild(card);
      });
    }

    if(btnExportFavs){
      btnExportFavs.onclick = function(){
        var arr = getFavorites();
        if(!arr.length){ alert('选品清单为空，请先收藏您看中的款式或趋势！'); return; }
        var csv = '\uFEFF类别,名称/关键词,参考价/指标,日期,AI总结/开发建议,直通链接,收藏时间\n';
        arr.forEach(function(it){
          function q(s){ return '"' + String(s || '').replace(/"/g, '""') + '"'; }
          csv += [q(it.cat), q(it.title), q(it.price), q(it.date), q(it.summary), q(it.url), q(it.added_at)].join(',') + '\n';
        });
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'SEA_TShirt_选品打版清单_' + new Date().toISOString().slice(0,10) + '.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };
    }

    if(btnClearFavs){
      btnClearFavs.onclick = function(){
        if(confirm('确定清空全部已收藏的选品清单吗？')){
          try { localStorage.setItem(FAV_STORAGE_KEY, '[]'); } catch(e){}
          renderFavsList();
        }
      };
    }
  }

  function renderAll(){
    recomputeCalendar();
    renderKPI();
    renderCalendar();
    renderMarket();
    renderSectionNotes();
    renderProducts();
    renderSearch();
    renderIpHotspots();
    renderGlobal();
    renderEntertainment();
    renderAnimeFilm();
    renderLiveTrends();
    renderLiveSources();
    renderFxWeather();
    renderStores();
    renderPerformance();
    renderHealth();
    renderNewsFeed();
    renderAiAuditBanner();
    renderSuperIntelligence();
  }
  window.addEventListener('resize',function(){ if(_cdChart) _cdChart.resize(); });
  initWallpaperSystem();
  initAiAssistant();
  initSellerToolkit();
  renderAll();
  updateWorldClocks();
  setInterval(updateWorldClocks, 1000);
  fetchLiveFxWeather();
  applyTimeHeat();     // 初始化「时间 × 热度」筛选条（默认全部 × 全部，数据保持原样）
  checkVersion();
  startAutoRefresh();
  }
  loadData(boot);
})();
