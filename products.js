/* ============================================================================
   SolarPro — каталог товарів.
   Один масив на всі сторінки категорій. Ціни орієнтовні — оновлюйте під свій прайс.
   Щоб додати товар — просто допишіть об'єкт у потрібну категорію.
   ========================================================================== */

window.CATALOG = {
  kits: {
    slug: 'kits',
    title: 'Готові комплекти резервного живлення',
    lead: 'Інвертор і акумулятор, підібрані та перевірені на сумісність між собою. ' +
          'Кабелі, запобіжники та схема підключення вже в наборі — залишається виконати монтаж.',
    image: 'assets/kit.svg',
    items: [
      {
        name: 'Комплект «Квартира»',
        meta: 'Інвертор 6 кВт + АКБ 5,12 кВт·год',
        specs: [
          'DEYE SUN-6K-SG05LP1-EU-AM2-P, однофазний',
          'DEYE SE-G5.1 Pro-B, LiFePO₄',
          'Автономність ≈ 4–6 год побутового навантаження'
        ],
        price: 1570,
        badge: '⭐ Хіт продажів'
      },
      {
        name: 'Комплект «Будинок»',
        meta: 'Інвертор 8 кВт + АКБ 10,24 кВт·год',
        specs: [
          'DEYE SUN-8K-SG05LP1-EU-AM2, однофазний',
          'Два модулі SE-G5.1 Pro-B',
          'Автономність ≈ 8–12 год'
        ],
        price: 2560
      },
      {
        name: 'Комплект «Будинок + сонце»',
        meta: 'Інвертор 12 кВт + АКБ 16 кВт·год + 8 панелей',
        specs: [
          'DEYE SUN-12K-SG02LP1-EU-AM3-P',
          'DEYE SE-F16-C, 16 кВт·год',
          '8 × панелі 440 Вт, ≈ 3,5 кВт масиву'
        ],
        price: 4190,
        oldPrice: 4450,
        badge: 'Знижка'
      },
      {
        name: 'Комплект «Бізнес»',
        meta: 'Інвертор 20 кВт трифазний + АКБ 20,48 кВт·год',
        specs: [
          'DEYE SUN-20K-SG05LP3-EU, трифазний 380 В',
          'DEYE BOS-G, 20,48 кВт·год',
          'Для магазину, офісу або кафе'
        ],
        price: 4830
      }
    ]
  },

  inverters: {
    slug: 'inverters',
    title: 'Гібридні інвертори',
    lead: 'Серце системи: перемикає навантаження на акумулятори за мілісекунди, керує зарядом ' +
          'і працює з мережею, сонячними панелями та генератором. Від 6 до 50 кВт, одно- та трифазні.',
    image: 'assets/inverter.svg',
    items: [
      {
        name: 'DEYE SUN-6K-SG05LP1-EU-AM2-P',
        meta: '6 кВт · однофазний · низьковольтний',
        specs: ['Номінальна потужність 6 кВт', 'Два MPPT, до 8 кВт панелей', 'Найпопулярніший для квартири та невеликого дому'],
        price: 780,
        badge: '⭐ Хіт продажів'
      },
      {
        name: 'DEYE SUN-8K-SG05LP1-EU-AM2',
        meta: '8 кВт · однофазний · низьковольтний',
        specs: ['Номінальна потужність 8 кВт', 'Запас під бойлер і насосну групу', 'Два MPPT'],
        price: 980
      },
      {
        name: 'DEYE SUN-12K-SG02LP1-EU-AM3-P',
        meta: '12 кВт · однофазний · низьковольтний',
        specs: ['Номінальна потужність 12 кВт', 'Для великого будинку', 'Паралельна робота кількох інверторів'],
        price: 1530,
        oldPrice: 1550,
        badge: 'Знижка'
      },
      {
        name: 'DEYE SUN-16K-SG01LP1-EU',
        meta: '16 кВт · однофазний · низьковольтний',
        specs: ['Номінальна потужність 16 кВт', 'Високий пусковий струм', 'Для дому з електроопаленням'],
        price: 1900
      },
      {
        name: 'DEYE SUN-12K-SG04LP3-EU',
        meta: '12 кВт · трифазний · низьковольтний',
        specs: ['Трифазна мережа 380 В', 'Симетричний та несиметричний режими', 'Для будинку з трифазним вводом'],
        price: 1750
      },
      {
        name: 'DEYE SUN-20K-SG05LP3-EU',
        meta: '20 кВт · трифазний · низьковольтний',
        specs: ['Номінальна потужність 20 кВт', 'Для магазину, офісу, невеликого виробництва', 'Два MPPT'],
        price: 2380,
        oldPrice: 2450,
        badge: 'Знижка'
      },
      {
        name: 'DEYE SUN-30K-SG01HP3-EU-BM3',
        meta: '30 кВт · трифазний · високовольтний',
        specs: ['Під високовольтні батареї', 'Вищий ККД на великих потужностях', 'Для бізнес-об’єктів'],
        price: 3400
      },
      {
        name: 'DEYE SUN-50K-SG01HP3-EU-BM4',
        meta: '50 кВт · трифазний · високовольтний',
        specs: ['Максимальна потужність лінійки', 'Для виробництва та великих об’єктів', 'Розширюється паралельним підключенням'],
        price: 5200
      }
    ]
  },

  batteries: {
    slug: 'batteries',
    title: 'Акумулятори LiFePO₄',
    lead: 'Літій-залізо-фосфатні батареї — безпечні, не бояться глибокого розряду й служать понад ' +
          '6 000 циклів. Ємність нарощується модулями: можна почати з малого й додати пізніше.',
    image: 'assets/battery.svg',
    items: [
      {
        name: 'DEYE SE-G5.1 Pro-B',
        meta: '5,12 кВт·год · настінний',
        specs: ['Низька напруга 51,2 В', 'Компактний, монтується на стіну', 'Базовий модуль для квартири'],
        price: 790,
        badge: '⭐ Хіт продажів'
      },
      {
        name: 'DEYE SE-G5.3 Pro',
        meta: '5,32 кВт·год · настінний',
        specs: ['Трохи більша ємність за ті ж габарити', 'Вбудований BMS з дисплеєм', 'Паралельно до 16 модулів'],
        price: 860
      },
      {
        name: 'DEYE RW-M6.1',
        meta: '6,14 кВт·год · настінний',
        specs: ['Захист IP65', 'Тихе пасивне охолодження', 'Підходить для встановлення в котельні'],
        price: 950
      },
      {
        name: 'DEYE SE-F16-C',
        meta: '16 кВт·год · підлоговий',
        specs: ['Один корпус замість трьох модулів', 'Тривала автономність для дому', 'Простіший монтаж і менше кабелів'],
        price: 1900
      },
      {
        name: 'DEYE BOS-G',
        meta: '20,48 кВт·год · стійка',
        specs: ['Стійкове виконання', 'Для магазину або офісу', 'Розширюється додатковими полицями'],
        price: 2450
      },
      {
        name: 'DEYE HV BOS-G',
        meta: '30,72 кВт·год · високовольтна',
        specs: ['Під високовольтні інвертори 30–50 кВт', 'Менші втрати на струмі', 'Для виробництва'],
        price: 3600
      }
    ]
  },

  panels: {
    slug: 'panels',
    title: 'Сонячні панелі',
    lead: 'Панелі провідних світових виробників. Вдень заряджають акумулятори й зменшують ' +
          'споживання з мережі — тому система працює не лише як резерв, а й економить щомісяця.',
    image: 'assets/panel.svg',
    items: [
      {
        name: 'Longi Hi-MO 6 LR5-54HTH',
        meta: '435 Вт · монокристал · N-type',
        specs: ['ККД до 22,3%', 'Гарантія 25 років на продуктивність', 'Розмір 1722 × 1134 мм'],
        price: 78,
        badge: '⭐ Хіт продажів'
      },
      {
        name: 'Jinko Tiger Neo N-type',
        meta: '440 Вт · монокристал · N-type',
        specs: ['ККД до 22,5%', 'Низька деградація 0,4% на рік', 'Добре працює при розсіяному світлі'],
        price: 82
      },
      {
        name: 'JA Solar JAM72D40',
        meta: '570 Вт · двостороння (bifacial)',
        specs: ['Додаткова генерація з тильного боку', 'Для наземних і пласких дахів', 'Розмір 2278 × 1134 мм'],
        price: 105
      },
      {
        name: 'Trina Vertex S+',
        meta: '450 Вт · монокристал',
        specs: ['Компактний формат для скатних дахів', 'Скло-скло, підвищена міцність', 'Гарантія 30 років'],
        price: 88
      },
      {
        name: 'Risen Titan S',
        meta: '410 Вт · монокристал',
        specs: ['Бюджетний варіант із гарним ККД', 'Легша вага для старих дахів', 'Гарантія 25 років'],
        price: 72
      }
    ]
  }
};

/* ==========================================================================
   Рендер сітки товарів на сторінці категорії
   ========================================================================== */
(function () {
  'use strict';

  function money(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' $';
  }

  function card(item, image) {
    var el = document.createElement('article');
    el.className = 'product';

    var html = '';
    if (item.badge) {
      html += '<span class="product__badge' + (item.badge.indexOf('Хіт') > -1 ? ' product__badge--hit' : '') + '">' + item.badge + '</span>';
    }
    html += '<div class="product__media"><img src="' + image + '" alt="' + item.name + '" loading="lazy" width="320" height="260"></div>';
    html += '<h3 class="product__name">' + item.name + '</h3>';
    html += '<p class="product__meta">' + item.meta + '</p>';
    html += '<ul class="product__specs">' + item.specs.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>';
    html += '<p class="product__price">' + (item.oldPrice ? '<s>' + money(item.oldPrice) + '</s> ' : '') + money(item.price) + '</p>';
    html += '<button class="btn btn--primary btn--pill" type="button" data-order="' + item.name + ' — ' + money(item.price) + '">Замовити</button>';

    el.innerHTML = html;
    return el;
  }

  function render() {
    var grid = document.querySelector('[data-catalog]');
    if (!grid) return;

    var category = window.CATALOG[grid.getAttribute('data-catalog')];
    if (!category) return;

    var fragment = document.createDocumentFragment();
    category.items.forEach(function (item) { fragment.appendChild(card(item, category.image)); });
    grid.appendChild(fragment);

    var counter = document.querySelector('[data-catalog-count]');
    if (counter) counter.textContent = String(category.items.length);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
