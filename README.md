# SolarPro — сайт інверторів і сонячних панелей

Статичний сайт: чистий HTML + CSS + JS, без збірки. Відкривається подвійним кліком по `index.html`
(або через локальний сервер — тоді працює `<video>` і карта без обмежень).

## Структура

```
solar/
├── index.html        головна
├── kits.html         каталог: готові комплекти
├── inverters.html    каталог: гібридні інвертори
├── batteries.html    каталог: акумулятори LiFePO₄
├── panels.html       каталог: сонячні панелі
├── styles.css        стилі (перший екран узятий 1:1 з approved-hero.html)
├── script.js         квіз, каруселі, форми, модалка
├── products.js       ← ТУТ товари та ціни для сторінок каталогу
├── config.js         ← ТУТ міняєш телефон, email, адресу, Telegram
└── assets/
    ├── hero.mp4              відео першого екрана
    ├── hero-solar-home.jpg   постер відео
    ├── roof-array.png        фон секції квізу
    ├── house-system.png      фон CTA + фото в «Хто ми»
    ├── installer.png         фото в «Хто ми»
    ├── inverter.svg          графіка товару
    ├── battery.svg
    ├── kit.svg
    └── panel.svg
```

## Що змінити перед запуском

Усе в одному файлі — `config.js`:

- `brand` — назва, телефон, email, адреса, години роботи, запит для карти;
- `social` — Telegram, Viber, Facebook, Instagram, YouTube;
- `lead` — куди йдуть заявки;
- `thanks` — текст вікна подяки.

Значення підставляються на сторінку автоматично (телефон у хедері, у футері, в контактах тощо).

## Деплой

### Vercel

У корені лежить `vercel.json`. Він каже Vercel, що це звичайна статика без збірки:

```json
"framework": null, "buildCommand": null, "installCommand": null, "outputDirectory": "."
```

Без цього Vercel намагається знайти папку `public` і падає з
`No Output Directory named "public" found`.

Підключення: Vercel → Add New → Project → імпорт `websitesky/solar-pro` → Deploy.
Нічого в налаштуваннях змінювати не треба; якщо проєкт уже створений — Settings →
General → **Root Directory** має бути порожній (корінь репозиторію), Framework Preset —
**Other**, після чого Redeploy.

Ще `vercel.json` віддає файли з `assets/` із річним кешем, а на всі відповіді додає
`X-Content-Type-Options`, `Referrer-Policy` і `X-Frame-Options`.

### GitHub Pages

Settings → Pages → Source: **Deploy from a branch** → Branch `main`, папка `/ (root)`.
Файл `.nojekyll` уже в репозиторії, тому Jekyll нічого не чіпатиме.

## Заявки в Telegram

### ⚠️ Про безпеку

Токен бота, вписаний у `config.js`, **видно кожному відвідувачу сайту** — це звичайний JS у браузері.
Будь-хто зможе ним читати й слати повідомлення від імені вашого бота.

- Для тесту / показу замовнику — можна вписати токен прямо в `config.js`.
- Для реального сайту — залиште `botToken` порожнім і вкажіть `endpoint` (проксі на сервері).

Якщо ні токена, ні endpoint немає — сайт працює в **демо-режимі**: форма валідується,
показується вікно подяки, а текст заявки друкується в консоль браузера. Нічого не втрачається.

### Варіант А (тест): напряму

1. У Telegram напишіть [@BotFather](https://t.me/BotFather) → `/newbot` → отримайте токен.
2. Створіть групу або канал, додайте туди бота адміністратором.
3. Дізнайтесь `chat_id`: додайте в групу [@getmyid_bot](https://t.me/getmyid_bot) або відкрийте
   `https://api.telegram.org/bot<ТОКЕН>/getUpdates` після повідомлення в групі.
4. Впишіть у `config.js`:

```js
lead: {
  endpoint: '',
  telegram: { botToken: '1234567890:AAH...', chatId: '-1001234567890' }
}
```

### Варіант Б (продакшен): через Cloudflare Worker

Токен лишається на сервері, у браузер не потрапляє.

1. [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → Create Worker.
2. Вставте код:

```js
export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: cors });

    const d = await request.json();

    const text = [
      '🔔 Нова заявка з сайту',
      '',
      `👤 Ім'я: ${d.name || '—'}`,
      `📞 Телефон: ${d.phone || '—'}`,
      d.message ? `💬 Запит: ${d.message}` : '',
      `📍 Форма: ${d.source || '—'}`,
      d.answers ? `\n📋 Відповіді квізу:\n${d.answers}` : ''
    ].filter(Boolean).join('\n');

    const res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text })
    });

    return new Response(res.ok ? 'ok' : 'error', { status: res.ok ? 200 : 502, headers: cors });
  }
};
```

3. Settings → Variables → додайте секрети `BOT_TOKEN` і `CHAT_ID`.
4. У `config.js` впишіть адресу воркера:

```js
lead: { endpoint: 'https://ваш-worker.workers.dev', telegram: { botToken: '', chatId: '' } }
```

## Квіз

7 запитань у `script.js`, масив `QUESTIONS`. Логіка розрахунку — функція `calcResult`:
береться тип об'єкта (базова потужність), характер навантаження (множник), потрібна автономність
(ємність АКБ) і плани щодо панелей (запас по потужності). Ціни інверторів — масив `INVERTERS`.

Щоб змінити питання чи ціни — редагуйте ці два масиви, решта підлаштується сама.

## Товари й сторінки каталогу

Сайт багатосторінковий. На головній — блок категорій; кожна картка веде на свою сторінку:

| Категорія | Сторінка | Ключ у `products.js` |
|---|---|---|
| Готові комплекти | `kits.html` | `kits` |
| Інвертори | `inverters.html` | `inverters` |
| Акумулятори | `batteries.html` | `batteries` |
| Сонячні панелі | `panels.html` | `panels` |

Усі товари лежать в одному файлі `products.js`, у `window.CATALOG`. Сторінка знає свою
категорію через атрибут `data-catalog="inverters"` на сітці — картки будуються автоматично.

Щоб **додати товар** — допишіть об'єкт у потрібний масив `items`:

```js
{
  name: 'DEYE SUN-10K-SG04LP3-EU',
  meta: '10 кВт · трифазний · низьковольтний',
  specs: ['Номінальна потужність 10 кВт', 'Два MPPT', 'Для будинку з трифазним вводом'],
  price: 1420,
  oldPrice: 1500,   // необов'язково — покаже закреслену стару ціну
  badge: 'Знижка'   // необов'язково
}
```

Щоб **додати нову категорію** — новий ключ у `window.CATALOG`, копія однієї зі сторінок
каталогу зі зміненим `data-catalog`, і нова картка в блоці категорій на `index.html`.

Ціни та моделі — орієнтир із ринку DEYE станом на момент верстки; оновіть під свій прайс.
Кількість позицій і ціну «від» на картках категорій на головній прописано вручну —
не забудьте оновити, коли зміните каталог.

## Що ще варто зробити перед публікацією

- [ ] Замінити заглушки в `config.js` на реальні контакти
- [ ] Налаштувати Telegram (Варіант Б)
- [ ] Замінити ціни та моделі товарів на актуальні
- [ ] Додати реальні фото товарів замість SVG-ілюстрацій
- [ ] Додати сторінки «Політика конфіденційності» та «Оплата і доставка»
- [ ] Підключити аналітику (GA4 / Meta Pixel)
