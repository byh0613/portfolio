/* ============================================================
   邴元昊 · 作品集   site.js
   横向翻页 + 屏内抽屉 + 等比适配
   约束：任何情况下不产生纵向滚动
   ============================================================ */
(function () {
  'use strict';

  var track = document.getElementById('track');
  var panes = Array.prototype.slice.call(document.querySelectorAll('.pane'));
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var dots = document.getElementById('dots');
  var seg = document.getElementById('pseg');
  var boat = document.getElementById('pboat');
  var label = document.getElementById('plabel');
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  var scrim = document.getElementById('scrim');
  var drawer = document.getElementById('drawer');
  var dno = document.getElementById('dno');
  var dt = document.getElementById('dt');
  var dbody = document.getElementById('dbody');
  var N = panes.length;
  var i = 0;
  var activeEl = null;
  var guardTimer = null;

  /* ---------------- 抽屉内容 ---------------- */
  var DATA = {
    tw1: {
      no: '02 · ① · 推文一',
      title: '共赴啤小鸡的圣诞晚宴',
      html:
        '<img src="assets/img/tweet/pg-christmas.jpg" alt="圣诞晚宴推文">' +
        '<div class="block"><div class="h">画面</div><p>绿色满版，顶部红色圆角块；左侧一只手绘「啤小鸡」——黄色小鸡、戴圣诞帽、抱着红心礼盒、翅膀有蓝色条纹。画面中间是大段右对齐短句，下方浮现黄底黑字标签条。</p></div>' +
        '<div class="block"><div class="h">文案</div><p>冬日的夜晚静谧中流淌着节日的暖意，<br>而啤小鸡正为它的圣诞晚宴忙得焦头烂额。<br>传说，每年都有人在圣诞晚宴上找到属于自己的奇迹，<br>神秘的礼物和快乐的惊喜总能在最意想不到的时刻降临。<br>但前提是需要你们——它最可靠的伙伴来协助完成任务！<br>现在，是时候开始我们的冒险了。</p></div>' +
        '<div class="block hi"><div class="h">为什么这么写</div><p>把「领奖」写成「受邀赴宴」，用户从被动接受方变成受邀的伙伴，转发意愿来自身份感而不是利益。长句右对齐制造停顿，读起来像邀请函。</p></div>'
    },
    tw2: {
      no: '02 · ① · 推文二',
      title: 'PGC 万圣新闻',
      html:
        '<img src="assets/img/tweet/pg-halloween.jpg" alt="万圣新闻推文">' +
        '<div class="block"><div class="h">画面</div><p>上半幅黑底 + 金色光柱聚光灯，四周飘落紫色叶片；下半幅切换成正紫 + 橙黄斜切色块。啤小鸡化身巫师——紫袍紫帽、手持扫帚、蓝绿魔法环，居中偏右。</p></div>' +
        '<div class="block"><div class="h">文案</div><p>欢迎收听 PGC 万圣新闻<br>下面播报一则头条重磅大新闻！<br>请注意查收<br>锵锵！<br>啤小鸡赴约万圣节狂欢<br>PIXIAOJI</p></div>' +
        '<div class="block hi"><div class="h">为什么这么写</div><p>用「新闻播报」当外壳，把活动信息伪装成头条，降低广告感。短句 + 感叹号 + 拟声词，语速快，匹配万圣节的情绪浓度。</p></div>'
    },
    tw3: {
      no: '02 · ① · 推文三',
      title: '“人随春好，春与人宜”春招分享会活动',
      html:
        '<img src="assets/img/tweet/pg-spring.png" alt="春招焦虑推文">' +
        '<div class="block"><div class="h">画面</div><p>米白背景，左上角一个出画的大浅绿圆形作视觉锚点，插画居中偏下。文案环绕插画散点布置，形成「人物被具体问题包围」的构图。中央是一个抱膝坐在地上的年轻人，穿连帽卫衣，神情困惑疲惫；头顶四周飘着三个问号气泡。</p></div>' +
        '<div class="block"><div class="h">三条痛点气泡</div><p>为春招 or 暑期实习而烦恼<br>众多求职者，竞争太激烈<br>网申规则，摸不透</p></div>' +
        '<div class="block hi"><div class="h">为什么这么写 + 诗意收束</div><p>先不卖活动，先说出对方此刻的处境。三个气泡是真实痛点，读者会在其中一条上认出自己。结尾转成诗：<br>「嗨！不要再想那出发的地方 / 风偷去了我们的桨 / 我们将在另一个春天靠岸！」</p></div>'
    },
    prompt: {
      no: '02 · ② · 附录',
      title: 'Shopee 质检 Prompt 原文',
      html:
        '<div class="block"><div class="h">用途</div><p>这套 Prompt 由 Gemini 执行，输出严格为单个数字：未通过硬伤判返回 <b>−1</b>，通过则返回两位小数的加权分。这样结果可以被程序直接读取并排序。</p></div>' +
        '<pre>Role: You are a professional E-commerce Operations Image Auditor. Your task is to filter images for technical defects and evaluate their aesthetic quality based on specific commercial criteria.\n\nPhase 1: Usability Check\nAssign a score of -1 ONLY if the following structural defects are detected:\n- Background Voids: pure black blocks (#000000), abrupt canvas splits, or unrendered "digital noise".\n- Solid White Background: flat pure white hex, lacking 3D environmental depth.\n- Product Text Infringement: packaging contains distinct, readable text or identifiable brand logos.\n- Badge Errors &amp; Typos: overlapping characters or spelling mistakes (DISKON S.D. is allowed).\n\nPhase 2: Aesthetic Scoring\nSubject Prominence &amp; Contrast (40%)\nLeft-Side Layout Readiness (40%)\nGeneral Composition &amp; Lighting (20%)\n\nScore = (Prominence x 0.4) + (LeftZone_Readiness x 0.4) + (General_Aesthetics x 0.2)\n\nOutput: if Phase 1 fails, output -1. Otherwise output the score rounded to 2 decimals. Output ONLY the number.</pre>' +
        '<div class="block hi"><div class="h">设计意图</div><p>「左侧留白」单独占 40% 权重，是因为运营后续要在左 1/3 改文案——把业务约束直接写进评分函数，审美标准才可执行。</p></div>'
    }
  };

  /* ---------------- 封面：海面落瓶 ---------------- */
  var sea = document.getElementById('coverSea');
  var dropLayer = document.getElementById('coverDrop');
  var coverEl = document.getElementById('cover');
  var enterBtn = document.getElementById('coverEnter');
  var BOTTLES = [
    'assets/img/bottles/star.png',
    'assets/img/bottles/coin.png',
    'assets/img/bottles/flower.png',
    'assets/img/bottles/heart.png',
    'assets/img/bottles/violet.png',
    'assets/img/bottles/sprout.png',
    'assets/img/bottles/space.png'
  ];
  var bi = 0, lastDrop = 0, live = [];

  function dropBottle(e) {
    if (!dropLayer) return;
    var now = Date.now();
    if (now - lastDrop < 165) return;
    var r = coverEl.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    /* 只在水面与沙滩这条带里响应，天空段落不落瓶 */
    if (y < r.height * 0.34) return;
    lastDrop = now;

    var img = new Image();
    img.src = BOTTLES[bi++ % BOTTLES.length];
    img.alt = '';
    var w = 46 + Math.random() * 26;
    img.style.left = x + 'px';
    img.style.top = '0px';
    img.style.width = w + 'px';
    img.style.setProperty('--fall', y + 'px');
    dropLayer.appendChild(img);
    live.push(img);
    /* 同一时刻最多 14 只，多了就清掉最老的 */
    if (live.length > 14) {
      var old = live.shift();
      if (old.parentNode) old.parentNode.removeChild(old);
    }
    img.addEventListener('animationend', function () {
      if (img.parentNode) img.parentNode.removeChild(img);
      var i = live.indexOf(img);
      if (i >= 0) live.splice(i, 1);
    });
  }

  /* 工牌：点一下翻面，鼠标移开后自动翻回正面 */
  var lyCard = document.getElementById('lyCard');
  if (lyCard) {
    var unflipTimer = 0;
    lyCard.addEventListener('click', function () {
      lyCard.classList.toggle('is-flipped');
      lyCard.setAttribute('aria-pressed', lyCard.classList.contains('is-flipped') ? 'true' : 'false');
      clearTimeout(unflipTimer);
      if (lyCard.classList.contains('is-flipped')) {
        unflipTimer = setTimeout(function () {
          lyCard.classList.remove('is-flipped');
          lyCard.setAttribute('aria-pressed', 'false');
        }, 7000);
      }
    });
  }

  if (coverEl) coverEl.addEventListener('mousemove', dropBottle);
  if (enterBtn) enterBtn.addEventListener('click', function () { setPane(1); });

  /* 目录：点任意一只瓶直达该模块首屏 */
  Array.prototype.forEach.call(document.querySelectorAll('[data-goto]'), function (b) {
    b.addEventListener('click', function () { setPane(+b.dataset.goto); });
  });

  /* ---------------- 导航 ---------------- */
  function buildDots() {
    for (var k = 0; k < N; k++) {
      var b = document.createElement('button');
      b.className = 'p-dot';
      b.setAttribute('aria-label', '第 ' + (k + 1) + ' 屏');
      b.dataset.k = k;
      b.addEventListener('click', goTo(k));
      dots.appendChild(b);
    }
  }
  var dotEls = [];

  function goTo(n) {
    return function () {
      setPane(n);
    };
  }

  function setPane(n) {
    i = Math.max(0, Math.min(N - 1, n));
    closeDrawer();
    track.style.transform = 'translateX(-' + i * 100 + '%)';
    var pct = ((i + 1) / N) * 100;
    seg.style.width = pct + '%';
    boat.style.left = 'calc(' + pct + '% - 13px)';
    label.textContent = pad(i + 1) + ' / ' + pad(N);
    prev.disabled = i === 0;
    next.disabled = i === N - 1;
    dotEls.forEach(function (d, k) { d.classList.toggle('on', k === i); });
    /* 给当前屏加 .on：屏内的一次性入场动效（牛皮纸展开）靠它触发。
       先摘再加，确保每次进入都重新播一遍，而不是只在首次 */
    panes.forEach(function (p, k) {
      if (k === i) {
        p.classList.remove('on');
        void p.offsetWidth;
        p.classList.add('on');
      } else {
        p.classList.remove('on');
      }
    });
    /* tab 高亮：反查当前屏属于哪一节 */
    var sec = sectionOf(i);
    tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === sec); });
    if (history.replaceState) {
      history.replaceState(null, '', '#' + (panes[i].id || 'p' + i));
    }
    /* 每屏进入后复测一次尺寸兜底。只在 load 时测会漏：
       01 经历屏的条目要等 .is-in 播完才回到最终位置，
       转场 620ms 之后才是真正的稳态 */
    clearTimeout(guardTimer);
    guardTimer = setTimeout(guard, 760);
  }

  function sectionOf(idx) {
    var s = panes[idx].dataset.sec;
    if (s !== undefined) return +s;
    /* 由 tab 的 data-sec 推断：取 <= idx 的最后一个 */
    var best = 0;
    tabs.forEach(function (t, k) {
      if (+t.dataset.sec <= idx) best = k;
    });
    return best;
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  /* ---------------- 抽屉 ---------------- */
  function openDrawer(id, el) {
    var d = DATA[id];
    if (!d) return;
    dno.textContent = d.no;
    dt.textContent = d.title;
    dbody.innerHTML = d.html;
    drawer.classList.add('on');
    drawer.setAttribute('aria-hidden', 'false');
    scrim.classList.add('on');
    if (activeEl) activeEl.classList.remove('on');
    activeEl = el || null;
    if (activeEl) activeEl.classList.add('on');
  }

  function closeDrawer() {
    drawer.classList.remove('on');
    drawer.setAttribute('aria-hidden', 'true');
    scrim.classList.remove('on');
    if (activeEl) { activeEl.classList.remove('on'); activeEl = null; }
  }

  /* ---------------- 绑定 ---------------- */
  buildDots();
  dotEls = Array.prototype.slice.call(dots.children);

  tabs.forEach(function (t) {
    t.addEventListener('click', function () { setPane(+t.dataset.sec); });
  });
  prev.addEventListener('click', function () { setPane(i - 1); });
  next.addEventListener('click', function () { setPane(i + 1); });
  document.getElementById('dx').addEventListener('click', closeDrawer);
  scrim.addEventListener('click', closeDrawer);

  /* 品牌名回第一屏 */
  document.querySelector('.brand').addEventListener('click', function (e) {
    e.preventDefault();
    setPane(0);
  });

  /* 抽屉触发 */
  Array.prototype.forEach.call(document.querySelectorAll('[data-detail]'), function (b) {
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      openDrawer(b.dataset.detail, b);
    });
  });

  /* 宝洁动作条 ↔ 现场图联动 */
  var acts = Array.prototype.slice.call(document.querySelectorAll('.act[data-ev]'));
  var evImg = document.getElementById('evimg');
  var evThumbs = Array.prototype.slice.call(document.querySelectorAll('.ev'));
  function pickEv(k) {
    if (!evImg) return;
    var t = evThumbs[k];
    if (t) {
      evImg.src = t.dataset.img;
      /* 文档截图是长图，用 contain 完整显示；现场照片保持 cover 满铺 */
      evImg.parentNode.classList.toggle('doc', /\.png$/.test(t.dataset.img));
    }
    acts.forEach(function (a, j) { a.classList.toggle('on', j === k); });
    evThumbs.forEach(function (t2, j) { t2.classList.toggle('on', j === k); });
  }
  acts.forEach(function (a, k) { a.addEventListener('click', function () { pickEv(k); }); });
  evThumbs.forEach(function (t, k) { t.addEventListener('click', function () { pickEv(k); }); });
  if (acts.length) pickEv(0);

  /* 键盘 */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeDrawer(); return; }
    if (drawer.classList.contains('on')) return;
    if (e.key === 'ArrowRight') { setPane(i + 1); }
    if (e.key === 'ArrowLeft') { setPane(i - 1); }
  });

  /* 横向滑动（触控板 / 鼠标滚轮） */
  var lock = 0;
  window.addEventListener('wheel', function (e) {
    if (drawer.classList.contains('on')) return;
    var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(d) < 16) return;
    if (Date.now() - lock < 620) return;
    lock = Date.now();
    setPane(d > 0 ? i + 1 : i - 1);
  }, { passive: true });

  /* 触屏 */
  var tx = 0, ty = 0, touching = false;
  window.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) return;
    tx = e.touches[0].clientX; ty = e.touches[0].clientY; touching = true;
  }, { passive: true });
  window.addEventListener('touchend', function (e) {
    if (!touching) return;
    touching = false;
    var t = e.changedTouches[0];
    var dx = t.clientX - tx, dy = t.clientY - ty;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    setPane(dx < 0 ? i + 1 : i - 1);
  }, { passive: true });

  /* ---------------- 等比适配 ----------------
     目标：任何视口都不出现纵向滚动。
     以 900px 内容高度为 1.0，小屏往下缩，下限 .56 */
  function baseScale() {
    var h = window.innerHeight - 60 - 40;
    return Math.min(1, Math.max(0.56, (h - 22) / 700));
  }
  function fit() {
    document.documentElement.style.setProperty('--s', baseScale().toFixed(3));
  }
  window.addEventListener('resize', fit);
  fit();

  /* 溢出兜底：从基准尺度往下试，找到第一档装得下的。
     两个坑：
     ① 必须连 .body 一起查——.body 是 overflow:hidden，内容超高时
        pane.scrollHeight 不变，只看 pane 会漏掉"最后一段被裁掉"。
     ② 测量期间要屏蔽入场动效。01 屏的条目带着 translateY(24px)，
        会被算进可滚动区域，导致明明装得下也判成溢出，
        而且旧的累减写法会一路缩到 0.56 再也回不来。 */
  function fits() {
    var bad = false;
    panes.forEach(function (p) {
      if (p.scrollHeight > p.clientHeight + 2) bad = true;
      var b = p.querySelector('.body');
      if (b && b.scrollHeight > b.clientHeight + 2) bad = true;
      /* 时间轴要单独查：它自己会溢出，但 .body 的 scrollHeight 未必跟着涨，
         只查 body 会漏掉"最后一段压到页脚线上"这种情况 */
      var tl = p.querySelector('.timeline');
      if (tl && tl.scrollHeight > tl.clientHeight + 2) bad = true;
    });
    return !bad;
  }
  function guard() {
    /* 测量期间屏蔽掉入场位移（见 .is-measuring），
       否则还在 translateY(24px) 状态的条目会被算进可滚动区域 */
    document.documentElement.classList.add('is-measuring');
    var s = baseScale();
    for (var k = 0; k < 24; k++) {
      document.documentElement.style.setProperty('--s', s.toFixed(3));
      if (fits()) break;
      if (s <= 0.56) break;
      s = Math.max(0.56, s - 0.02);
    }
    document.documentElement.classList.remove('is-measuring');
  }

  /* 浏览器原生锚点滚动会打乱状态，这里统一接管 */
  function paneFromHash() {
    if (!location.hash) return -1;
    var el = document.querySelector(location.hash);
    return el ? panes.indexOf(el) : -1;
  }
  window.addEventListener('hashchange', function () {
    var k = paneFromHash();
    if (k >= 0 && k !== i) setPane(k);
  });

  /* 启动 */
  var start = paneFromHash();
  setPane(start < 0 ? 0 : start);
  /* 防止浏览器把 overflow:hidden 的容器原生滚走 */
  document.querySelector('.viewport').scrollLeft = 0;
  window.addEventListener('load', function () { guard(); });
  setTimeout(guard, 400);

  /* ---------------- 01 经历屏入场动效 ----------------
     用 IntersectionObserver 触发，只播一次（播完 unobserve，翻回来不重播）。
     观察的是 class 而不是滚动位置：横向翻页时条目是随 .track 平移进视口的，
     observer 天然能感知到；而靠"setPane 里调用"会漏掉首屏不是 p1 的情况——
     条目就一直停在 translateY(24px) 的初始态，还被误算进可滚动区域。
     用户要求减少动态时直接全部显示，与 CSS 的 reduce 分支一致。 */
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var expRows = Array.prototype.slice.call(
    document.querySelectorAll('#p1 .timeline > li'));

  if (expRows.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      expRows.forEach(function (li) { li.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add('is-in');
          io.unobserve(en.target);   /* 只播一次 */
        });
      }, { threshold: .15 });
      expRows.forEach(function (li, k) {
        li.style.transitionDelay = (k * 80) + 'ms';
        io.observe(li);
      });
      /* 入场结束后重测一次：条目在 translateY(24px) 期间会被兜底判成溢出，
         把全站 --s 压低。播完复测，装得下就恢复基准尺度 */
      setTimeout(guard, 900);
    }
  }
})();
