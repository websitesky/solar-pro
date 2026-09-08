/* ============================================================================
   SolarPro — логіка сторінки
   1. Підстановка даних із config.js
   2. Мобільне меню + липкий хедер
   3. Каруселі
   4. Квіз підбору (7 кроків)
   5. Кнопки «Замовити»
   6. Форми → Telegram / endpoint
   7. Модалка подяки
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.SITE_CONFIG || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* дістати значення за шляхом 'brand.phone' */
  function get(path) {
    return path.split('.').reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : '';
    }, CFG);
  }

  /* ==========================================================
     1. ПІДСТАНОВКА ДАНИХ
     ========================================================== */
  function applyConfig() {
    $$('[data-config]').forEach(function (el) {
      var value = get(el.getAttribute('data-config'));
      if (!value) return;
      el.textContent = value;

      if (el.tagName === 'A') {
        var path = el.getAttribute('data-config');
        if (path === 'brand.phone') el.href = get('brand.phoneHref') || 'tel:' + value.replace(/\D/g, '');
        if (path === 'brand.email') el.href = 'mailto:' + value;
      }
    });

    $$('[data-config-href]').forEach(function (el) {
      var value = get(el.getAttribute('data-config-href'));
      if (value) el.href = value;
    });

    var year = $('[data-year]');
    if (year) year.textContent = String(new Date().getFullYear());

    /* карта */
    var map = $('[data-map]');
    var query = get('brand.mapQuery') || get('brand.address');
    if (map && query) {
      map.src = 'https://www.google.com/maps?q=' + encodeURIComponent(query) + '&hl=uk&z=15&output=embed';
    }
  }

  /* ==========================================================
     2. МОБІЛЬНЕ МЕНЮ + ЛИПКИЙ ХЕДЕР
     ========================================================== */
  function initNav() {
    var nav = $('#mobile-nav');
    if (!nav) return;

    var openers = $$('.approved-menu, .sticky-header__menu');
    var closers = $$('.mobile-nav__close', nav).concat($$('.mobile-nav nav a', nav));

    function open() {
      nav.hidden = false;
      document.body.style.overflow = 'hidden';
      openers.forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    }

    function close() {
      nav.hidden = true;
      document.body.style.overflow = '';
      openers.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    }

    openers.forEach(function (b) { b.addEventListener('click', open); });
    closers.forEach(function (b) { b.addEventListener('click', close); });
    nav.addEventListener('click', function (e) { if (e.target === nav) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !nav.hidden) close(); });

    /* підменю «Каталог» у шторці */
    $$('.mobile-nav__toggle', nav).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var group = btn.closest('.mobile-nav__group');
        var isOpen = group.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });

    /* липкий хедер */
    var sticky = $('#sticky-header');
    var hero = $('.approved-hybrid-variant');
    if (!sticky || !hero) return;

    function onScroll() {
      var passed = window.scrollY > hero.offsetHeight - 80;
      sticky.classList.toggle('is-visible', passed);
      sticky.setAttribute('aria-hidden', passed ? 'false' : 'true');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ==========================================================
     2b. ВИПАДАЮЧЕ МЕНЮ «КАТАЛОГ»
     ========================================================== */
  function initDropdowns() {
    var drops = $$('.nav-drop');
    if (!drops.length) return;

    function closeAll(except) {
      drops.forEach(function (drop) {
        if (drop === except) return;
        drop.classList.remove('is-open');
        var toggle = $('.nav-drop__toggle', drop);
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    }

    drops.forEach(function (drop) {
      var toggle = $('.nav-drop__toggle', drop);
      if (!toggle) return;

      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = !drop.classList.contains('is-open');
        closeAll(drop);
        drop.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      /* клік по пункту меню — закриваємо */
      $$('.nav-drop__menu a', drop).forEach(function (link) {
        link.addEventListener('click', function () { closeAll(null); });
      });
    });

    document.addEventListener('click', function () { closeAll(null); });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      closeAll(null);
    });
  }

  /* ==========================================================
     3. КАРУСЕЛІ
     ========================================================== */
  function initCarousels() {
    $$('[data-carousel]').forEach(function (root) {
      var track = $('[data-carousel-track]', root);
      if (!track) return;

      var prevButtons = $$('[data-carousel-prev]', root);
      var nextButtons = $$('[data-carousel-next]', root);
      var dotsBox = $('[data-carousel-dots]', root);
      var controls = $('[data-carousel-controls]', root);
      var hint = root.parentNode ? $('[data-carousel-hint]', root.parentNode) : null;
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

      /* ширина однієї картки разом із відступом */
      function step() {
        var card = track.firstElementChild;
        if (!card) return track.clientWidth || 300;
        var gap = parseFloat(getComputedStyle(track).columnGap) || 24;
        return card.getBoundingClientRect().width + gap;
      }

      /* скільки карток видно одночасно */
      function perView() {
        if (!track.clientWidth) return 1;
        return Math.max(1, Math.round(track.clientWidth / step()));
      }

      /* точки рахуємо по картках, а не по «екранах» */
      function pageCount() {
        return Math.max(1, Math.ceil(track.children.length / perView()));
      }

      function unit() {
        return perView() * step();
      }

      function maxScroll() {
        return Math.max(0, track.scrollWidth - track.clientWidth);
      }

      function currentPage() {
        var u = unit();
        if (!u) return 0;
        return Math.min(pageCount() - 1, Math.max(0, Math.round(track.scrollLeft / u)));
      }

      function goToPage(index) {
        var left = Math.min(index * unit(), maxScroll());
        track.scrollTo({ left: left, behavior: reduced.matches ? 'auto' : 'smooth' });
        window.setTimeout(sync, 400);
      }

      function buildDots() {
        if (!dotsBox) return;
        var total = pageCount();

        /* один екран — нема чого гортати */
        if (controls) controls.hidden = total < 2;
        if (hint) hint.hidden = total < 2;

        if (dotsBox.children.length === total) return;
        dotsBox.innerHTML = '';

        for (var i = 0; i < total; i += 1) {
          (function (index) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel__dot';
            dot.setAttribute('aria-label', 'Показати групу ' + (index + 1) + ' з ' + total);
            dot.addEventListener('click', function () { goToPage(index); });
            dotsBox.appendChild(dot);
          })(i);
        }
      }

      function sync() {
        var max = track.scrollWidth - track.clientWidth - 2;
        prevButtons.forEach(function (b) { b.disabled = track.scrollLeft <= 2; });
        nextButtons.forEach(function (b) { b.disabled = track.scrollLeft >= max; });

        if (!dotsBox) return;
        var active = currentPage();
        $$('.carousel__dot', dotsBox).forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === active);
          dot.setAttribute('aria-current', i === active ? 'true' : 'false');
        });
      }

      function slide(direction) {
        track.scrollBy({ left: direction * step(), behavior: reduced.matches ? 'auto' : 'smooth' });
        window.setTimeout(sync, 400);
      }

      prevButtons.forEach(function (b) { b.addEventListener('click', function () { slide(-1); }); });
      nextButtons.forEach(function (b) { b.addEventListener('click', function () { slide(1); }); });
      track.addEventListener('scroll', sync, { passive: true });

      var resizeTimer;
      window.addEventListener('resize', function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () { buildDots(); sync(); }, 150);
      });

      buildDots();
      sync();
    });
  }

  /* ==========================================================
     4. КВІЗ
     ========================================================== */
  var QUESTIONS = [
    {
      q: 'Для чого вам потрібна система?',
      options: [
        { label: 'Резервне живлення під час відключення', goal: 'backup' },
        { label: 'Зменшення рахунків за електроенергію', goal: 'save' },
        { label: 'Резервне живлення та власна генерація', goal: 'both' },
        { label: 'Поки не знаю — потрібна допомога', goal: 'unsure' }
      ]
    },
    {
      q: 'Який у вас об’єкт?',
      options: [
        { label: 'Квартира', base: 3 },
        { label: 'Приватний будинок', base: 6 },
        { label: 'Магазин, офіс або кафе', base: 8 },
        { label: 'Виробництво чи великий об’єкт', base: 15 }
      ]
    },
    {
      q: 'Яка у вас мережа?',
      options: [
        { label: 'Однофазна, 220 В', phase: 'Однофазна 220 В' },
        { label: 'Трифазна, 380 В', phase: 'Трифазна 380 В' },
        { label: 'Не знаю — підкажіть', phase: 'Уточнимо на консультації' }
      ]
    },
    {
      q: 'Що має працювати під час відключення?',
      options: [
        { label: 'Мінімум: світло, роутер, холодильник', load: 0.6 },
        { label: 'Побут: + телевізор, пральна машина, котел', load: 1 },
        { label: 'Майже все, включно з бойлером і кондиціонером', load: 1.45 },
        { label: 'Обладнання бізнесу: каса, вітрини, освітлення', load: 1.25 }
      ]
    },
    {
      q: 'Скільки годин автономії потрібно?',
      options: [
        { label: 'До 4 годин — пережити типове відключення', hours: 4 },
        { label: '4–8 годин', hours: 8 },
        { label: '8–12 годин', hours: 12 },
        { label: 'Понад 12 годин — доба без світла', hours: 18 }
      ]
    },
    {
      q: 'Чи плануєте сонячні панелі?',
      options: [
        { label: 'Так, одразу разом із системою', pv: 'now' },
        { label: 'Так, але пізніше — потрібен запас', pv: 'later' },
        { label: 'Ні, потрібен лише резерв', pv: 'no' },
        { label: 'Панелі вже встановлені', pv: 'have' }
      ]
    },
    {
      q: 'Орієнтовний бюджет на систему?',
      options: [
        { label: 'До 1 500 $', budget: 1500 },
        { label: '1 500 – 3 000 $', budget: 3000 },
        { label: '3 000 – 6 000 $', budget: 6000 },
        { label: 'Понад 6 000 $', budget: 12000 },
        { label: 'Ще не визначив — порадьте', budget: 0 }
      ]
    }
  ];

  var INVERTERS = [
    { kw: 6, price: 780 },
    { kw: 8, price: 980 },
    { kw: 12, price: 1530 },
    { kw: 16, price: 1900 },
    { kw: 20, price: 2380 },
    { kw: 30, price: 3400 },
    { kw: 50, price: 5200 }
  ];

  function fmtMoney(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' $';
  }

  function calcResult(answers) {
    var base = answers[1] ? answers[1].base : 6;
    var load = answers[3] ? answers[3].load : 1;
    var hours = answers[4] ? answers[4].hours : 8;
    var pv = answers[5] ? answers[5].pv : 'no';
    var phase = answers[2] ? answers[2].phase : 'Уточнимо на консультації';
    var phaseKnown = phase.indexOf('фазна') > -1;

    /* потужність інвертора */
    var needKw = base * load;
    if (pv === 'now' || pv === 'later' || pv === 'have') needKw *= 1.2;
    var inverter = INVERTERS.find(function (i) { return i.kw >= needKw; }) || INVERTERS[INVERTERS.length - 1];

    /* ємність акумуляторів: середнє споживання під час відключення.
       Орієнтир — 6 кВт інвертор + 5 кВт·год АКБ дають 4–6 год побутового навантаження. */
    var avgKw = Math.max(0.35, base * 0.14 * load);
    var kwh = Math.ceil((avgKw * hours) / 5.12) * 5.12;
    kwh = Math.min(kwh, 40);
    var modules = Math.round(kwh / 5.12);
    var batteryPrice = modules * 790;

    var total = inverter.price + batteryPrice;
    if (pv === 'now') total += Math.round(inverter.kw * 210); /* масив панелей орієнтовно */

    return {
      inverter: inverter.kw + ' кВт' + (phaseKnown ? ' · ' + phase : ''),
      battery: String(Math.round(kwh * 10) / 10).replace('.', ',') + ' кВт·год · ' + modules +
        ' модул' + (modules === 1 ? 'ь' : (modules < 5 ? 'і' : 'ів')),
      hours: '≈ ' + Math.round((kwh * 0.9) / avgKw) + ' год',
      /* ціну клієнту не показуємо — вона йде тільки менеджеру в заявці */
      price: 'від ' + fmtMoney(total * 0.92) + ' до ' + fmtMoney(total * 1.12)
    };
  }

  function initQuiz() {
    var stage = $('[data-quiz-stage]');
    var result = $('[data-quiz-result]');
    if (!stage || !result) return;

    var elCurrent = $('[data-quiz-current]');
    var elTotal = $('[data-quiz-total]');
    var elBar = $('[data-quiz-bar]');
    var elQuestion = $('[data-quiz-question]');
    var elOptions = $('[data-quiz-options]');
    var btnNext = $('[data-quiz-next]');
    var btnBack = $('[data-quiz-back]');
    var btnRestart = $('[data-quiz-restart]');

    var index = 0;
    var answers = [];

    elTotal.textContent = String(QUESTIONS.length);

    function render() {
      var item = QUESTIONS[index];
      elCurrent.textContent = String(index + 1);
      elBar.style.width = ((index + 1) / QUESTIONS.length * 100) + '%';
      elQuestion.textContent = item.q;
      elOptions.innerHTML = '';

      item.options.forEach(function (opt, i) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz__option';
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', answers[index] === opt ? 'true' : 'false');
        btn.textContent = opt.label;
        btn.addEventListener('click', function () {
          answers[index] = opt;
          $$('.quiz__option', elOptions).forEach(function (b, bi) {
            b.setAttribute('aria-checked', bi === i ? 'true' : 'false');
          });
          btnNext.disabled = false;
        });
        elOptions.appendChild(btn);
      });

      btnNext.disabled = !answers[index];
      btnNext.textContent = index === QUESTIONS.length - 1 ? 'Показати результат' : 'Далі  →';
      btnBack.hidden = index === 0;
    }

    function showResult() {
      var r = calcResult(answers);
      stage.hidden = true;
      result.hidden = false;
      $('[data-result-inverter]').textContent = r.inverter;
      $('[data-result-battery]').textContent = r.battery;
      $('[data-result-hours]').textContent = r.hours;

      /* відповіді та розрахунок ідуть менеджеру разом із заявкою */
      var form = $('[data-lead-form]', result);
      if (form) {
        form.dataset.leadAnswers = QUESTIONS.map(function (q, i) {
          return (i + 1) + '. ' + q.q + ' — ' + (answers[i] ? answers[i].label : '—');
        }).join('\n') +
          '\n\nРозрахунок: інвертор ' + r.inverter + ', АКБ ' + r.battery +
          ', автономність ' + r.hours + '\nОрієнтовна вартість (не показується клієнту): ' + r.price;
      }
    }

    btnNext.addEventListener('click', function () {
      if (!answers[index]) return;
      if (index === QUESTIONS.length - 1) { showResult(); return; }
      index += 1;
      render();
    });

    btnBack.addEventListener('click', function () {
      if (index === 0) return;
      index -= 1;
      render();
    });

    btnRestart.addEventListener('click', function () {
      index = 0;
      answers = [];
      result.hidden = true;
      stage.hidden = false;
      render();
    });

    render();
  }

  /* ==========================================================
     5. КНОПКИ «ЗАМОВИТИ»
     ========================================================== */
  function initOrderButtons() {
    $$('[data-order]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var product = btn.getAttribute('data-order');
        var field = $('#c-message');
        var contacts = $('#contacts');
        if (field) {
          field.value = 'Хочу замовити: ' + product;
        }
        if (contacts) {
          contacts.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        window.setTimeout(function () {
          var name = $('#c-name');
          if (name) name.focus({ preventScroll: true });
        }, 600);
      });
    });
  }

  /* ==========================================================
     6. ФОРМИ
     ========================================================== */
  function validPhone(value) {
    var digits = value.replace(/\D/g, '');
    return digits.length >= 9;
  }

  function buildMessage(data) {
    var lines = [
      '🔔 Нова заявка з сайту ' + (get('brand.name') || 'SolarPro'),
      '',
      '👤 Ім’я: ' + data.name,
      '📞 Телефон: ' + data.phone
    ];
    if (data.message) lines.push('💬 Запит: ' + data.message);
    lines.push('📍 Форма: ' + data.source);
    if (data.answers) lines.push('', '📋 Відповіді квізу:', data.answers);
    lines.push('', '🕒 ' + new Date().toLocaleString('uk-UA'));
    return lines.join('\n');
  }

  function sendLead(data) {
    var lead = CFG.lead || {};

    if (lead.endpoint) {
      return fetch(lead.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return { sent: true };
      });
    }

    var tg = lead.telegram || {};
    if (tg.botToken && tg.chatId) {
      return fetch('https://api.telegram.org/bot' + tg.botToken + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tg.chatId, text: buildMessage(data) })
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return { sent: true };
      });
    }

    /* демо-режим: Telegram ще не налаштований */
    console.info('[SolarPro] Заявка (демо-режим, Telegram не налаштований):\n' + buildMessage(data));
    return Promise.resolve({ sent: false, demo: true });
  }

  function initForms() {
    $$('[data-lead-form]').forEach(function (form) {
      var status = $('[data-form-status]', form);
      var submit = form.querySelector('button[type="submit"]');

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var nameField = form.querySelector('input[name="name"]');
        var phoneField = form.querySelector('input[name="phone"]');
        var messageField = form.querySelector('[name="message"]');

        [nameField, phoneField].forEach(function (f) { if (f) f.removeAttribute('aria-invalid'); });
        if (status) { status.textContent = ''; status.removeAttribute('data-ok'); }

        if (!nameField.value.trim()) {
          nameField.setAttribute('aria-invalid', 'true');
          nameField.focus();
          if (status) status.textContent = 'Вкажіть, будь ласка, ваше ім’я.';
          return;
        }

        if (!validPhone(phoneField.value)) {
          phoneField.setAttribute('aria-invalid', 'true');
          phoneField.focus();
          if (status) status.textContent = 'Перевірте номер телефону — потрібно щонайменше 9 цифр.';
          return;
        }

        var data = {
          name: nameField.value.trim(),
          phone: phoneField.value.trim(),
          message: messageField ? messageField.value.trim() : '',
          source: form.getAttribute('data-lead-source') || 'Сайт',
          answers: form.dataset.leadAnswers || ''
        };

        if (submit) { submit.disabled = true; submit.dataset.label = submit.textContent; submit.textContent = 'Надсилаємо…'; }

        sendLead(data)
          .then(function () {
            form.reset();
            delete form.dataset.leadAnswers;
            openThanks();
          })
          .catch(function (err) {
            console.error('[SolarPro] Не вдалося надіслати заявку:', err);
            if (status) {
              status.textContent = 'Не вдалося надіслати. Зателефонуйте нам: ' + (get('brand.phone') || '');
            }
          })
          .then(function () {
            if (submit) { submit.disabled = false; submit.textContent = submit.dataset.label || 'Надіслати'; }
          });
      });
    });
  }

  /* ==========================================================
     7. МОДАЛКА ПОДЯКИ
     ========================================================== */
  var thanksModal;

  function openThanks() {
    if (!thanksModal) return;
    thanksModal.hidden = false;
    document.body.style.overflow = 'hidden';
    var closeBtn = $('.modal__close', thanksModal);
    if (closeBtn) closeBtn.focus();
  }

  function initThanks() {
    thanksModal = $('#thanks-modal');
    if (!thanksModal) return;

    var t = CFG.thanks || {};
    var title = $('[data-thanks-title]', thanksModal);
    var text = $('[data-thanks-text]', thanksModal);
    var extra = $('[data-thanks-extra]', thanksModal);
    var button = $('[data-thanks-button]', thanksModal);

    if (title && t.title) title.textContent = t.title;
    if (text && t.text) text.textContent = t.text;
    if (extra && t.extra) extra.textContent = t.extra;
    if (button) {
      button.href = get('social.telegramChannel') || get('social.telegram') || '#';
      if (t.buttonLabel) button.textContent = t.buttonLabel;
    }

    function close() {
      thanksModal.hidden = true;
      document.body.style.overflow = '';
    }

    $$('[data-modal-close]', thanksModal).forEach(function (el) { el.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !thanksModal.hidden) close();
    });
  }

  /* ==========================================================
     8. ПОЯВА БЛОКІВ ПІД ЧАС ПРОКРУТКИ
     ========================================================== */
  var REVEAL_SELECTOR = [
    '.cat-card',
    '.support__item',
    '.fact',
    '.advantages',
    '.review',
    '.help__form',
    '.contacts__map',
    '.contacts__form',
    '.catalog-grid .product'
  ].join(', ');

  function initReveal() {
    var items = $$(REVEAL_SELECTOR);
    if (!items.length) return;

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('reveal', 'is-visible'); });
      return;
    }

    items.forEach(function (el) { el.classList.add('reveal'); });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var siblings = Array.prototype.indexOf.call(entry.target.parentNode.children, entry.target);
        entry.target.style.transitionDelay = (Math.min(siblings, 5) * 80) + 'ms';
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.12 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ==========================================================
     СТАРТ
     ========================================================== */
  function init() {
    applyConfig();
    initNav();
    initDropdowns();
    initCarousels();
    initReveal();
    initQuiz();
    initOrderButtons();
    initThanks();
    initForms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
