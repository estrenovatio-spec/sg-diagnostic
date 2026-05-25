# Google Таблица — лиды из анкеты

Каждая новая анкета на сайте может добавлять **строку в таблицу** (если настроен webhook).

---

## ⚠️ Важно про Apps Script

**Не нажимайте «Выполнить» (▶) у функции `doPost`** — она не для ручного запуска.

Сообщение *«функция myFunction удалена»* появляется, если запускается **старая** функция из шаблона Google. Её нужно **удалить** и оставить только код ниже.

`doPost` срабатывает **только** когда сайт отправляет HTTP-запрос после анкеты.

---

## Где лежат данные без Таблицы

PostgreSQL (Neon / Vercel) → таблица **Lead**.  
См. SQL в Neon Console или `npx prisma studio`.

---

## Настройка Google Таблицы

### 1. Таблица

[Google Sheets](https://sheets.google.com) → новая таблица.

Первая строка — заголовки:

```
id | дата | ФИО | возраст | город | телефон | telegram | профессия | доход | долги | накопления | активы | боль | цели | бюджет | вопрос | квалификация | ссылка | utm
```

### 2. Apps Script

**Расширения → Apps Script**

1. Удалите всё из редактора (включая `function myFunction`).
2. Вставьте **только** этот код:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.id,
    data.createdAt,
    data.fullName,
    data.age,
    data.city,
    data.phone,
    data.telegram,
    data.profession,
    data.incomeLevel,
    data.hasDebts,
    data.hasSavings,
    data.assets,
    data.mainPainPoint,
    data.goals,
    data.advisorBudget,
    data.userQuestion,
    data.qualification,
    data.reportUrl,
    data.utmSource,
  ]);

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Только для проверки: Run → testAppend — появится тестовая строка */
function testAppend() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    "test-id",
    new Date().toISOString(),
    "Тест Тестов",
    30,
    "Москва",
    "",
    "",
    "тест",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "TEST",
    "https://example.com",
    "",
  ]);
}
```

3. **Сохранить** (дискета).

### 3. Развернуть как веб-приложение

1. **Развернуть** → **Новое развёртывание**
2. Тип: **Веб-приложение**
3. Запуск от: **Меня**
4. Кто имеет доступ: **Все** (Anyone)
5. **Развернуть** → скопировать **URL** (оканчивается на `/exec`)

Проверка таблицы вручную: в списке функций выберите **`testAppend`** → **Выполнить** → в таблице должна появиться строка «Тест Тестов».

### 4. Vercel

Переменная окружения:

| Key | Value |
|-----|--------|
| `GOOGLE_SHEETS_WEBHOOK_URL` | URL из шага 3 (`.../exec`) |

**Redeploy** проекта. Код с `appendLeadToGoogleSheet` должен быть на GitHub (`git push`).

### 5. Проверка с сайта

Пройдите анкету на проде → новая строка в таблице (не testAppend).

---

## Если строка не появилась

- URL именно `/exec`, не `/dev`
- Новое развёртывание после правок скрипта
- `GOOGLE_SHEETS_WEBHOOK_URL` в Vercel + Redeploy
- Логи Vercel: `Google Sheets sync failed`

Данные в БД сохраняются в любом случае.
