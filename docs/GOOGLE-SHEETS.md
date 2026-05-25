# Google Таблица — лиды из анкеты

Каждая новая анкета на сайте может добавлять **строку в таблицу** (если настроен webhook).

---

## Код на GitHub (уже есть)

Репозиторий: [github.com/estrenovatio-spec/sg-diagnostic](https://github.com/estrenovatio-spec/sg-diagnostic)

Файлы:
- [src/lib/google-sheets.ts](https://github.com/estrenovatio-spec/sg-diagnostic/blob/main/src/lib/google-sheets.ts) — отправка в таблицу
- [src/app/diagnostic/actions.ts](https://github.com/estrenovatio-spec/sg-diagnostic/blob/main/src/app/diagnostic/actions.ts) — вызов после анкеты (строка ~101)

На GitHub: откройте репозиторий → нажмите `t` (поиск файла) → введите `google-sheets`.

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

### 1. Таблица (сначала таблица, потом скрипт!)

1. [Google Sheets](https://sheets.google.com) → **создайте таблицу** и откройте её.
2. **Расширения → Apps Script** — скрипт должен открыться **из этой таблицы** (в заголовке: «Apps Script» + имя вашей таблицы).

Если скрипт создали отдельно на [script.google.com](https://script.google.com) — `getActiveSpreadsheet()` не увидит вашу таблицу, строки «исчезают».

Первая строка — заголовки:

```
id | дата | ФИО | возраст | город | телефон | telegram | профессия | доход | долги | накопления | активы | боль | цели | бюджет | вопрос | квалификация | ссылка | utm
```

### 2. Apps Script

**Расширения → Apps Script**

1. Удалите всё из редактора (включая `function myFunction`).
2. Вставьте **только** этот код:

```javascript
/** Общая логика — одна строка в таблицу */
function appendLeadRow(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    data.id || "",
    data.createdAt || "",
    data.fullName || "",
    data.age || "",
    data.city || "",
    data.phone || "",
    data.telegram || "",
    data.profession || "",
    data.incomeLevel || "",
    data.hasDebts || "",
    data.hasSavings || "",
    data.assets || "",
    data.mainPainPoint || "",
    data.goals || "",
    data.advisorBudget || "",
    data.userQuestion || "",
    data.qualification || "",
    data.reportUrl || "",
    data.utmSource || "",
  ]);
}

/**
 * Вызывается САЙТОМ после анкеты. Не запускайте ▶ Выполнить в редакторе!
 * (будет ошибка postData — это нормально)
 */
function doPost(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return ContentService.createTextOutput(
      JSON.stringify({
        ok: false,
        error: "doPost вызван без данных. Запустите testAppend для проверки таблицы.",
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const data = JSON.parse(e.postData.contents);
  appendLeadRow(data);

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ▶ Выполнить ЭТУ функцию для проверки таблицы (в выпадающем списке сверху выберите testAppend)
 */
function testAppend() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  Logger.log("Таблица: " + ss.getUrl());
  Logger.log("Лист: " + sheet.getName());

  appendLeadRow({
    id: "test-id",
    createdAt: new Date().toISOString(),
    fullName: "Тест Тестов",
    age: 30,
    city: "Москва",
    phone: "",
    telegram: "",
    profession: "тест",
    incomeLevel: "",
    hasDebts: "",
    hasSavings: "",
    assets: "",
    mainPainPoint: "",
    goals: "",
    advisorBudget: "",
    userQuestion: "",
    qualification: "TEST",
    reportUrl: "https://example.com",
    utmSource: "",
  });

  SpreadsheetApp.flush();
}
```

3. **Сохранить** (дискета).

### 3. Развернуть как веб-приложение

1. **Развернуть** → **Новое развёртывание**
2. Тип: **Веб-приложение**
3. Запуск от: **Меня**
4. Кто имеет доступ: **Все** (Anyone)
5. **Развернуть** → скопировать **URL** (оканчивается на `/exec`)

### Проверка таблицы вручную (без doPost)

1. В редакторе Apps Script **сверху** в выпадающем списке функций выберите **`testAppend`** (не `doPost`, не `myFunction`).
2. Нажмите **▶ Выполнить**.
3. Первый раз: разрешите доступ к таблице.
4. В Google Таблице должна появиться строка «Тест Тестов».

Если нажать ▶ у **`doPost`** — будет ошибка `postData` — **так и должно быть**, это не поломка.

### testAppend выполнился, но строки нет?

1. **Выполнения** (иконка часов слева в Apps Script) → последний `testAppend` → статус **Completed** или ошибка?
2. **Журнал** (View → Logs / Журнал выполнения) — должны быть строки `Таблица: https://docs.google.com/...` — откройте **этот** URL в браузере.
3. Скрипт привязан к таблице? (шаг 1 выше)
4. Строка могла добавиться **внизу** — прокрутите лист вниз или `Ctrl+F` → «Тест Тестов».
5. Активен другой лист (вкладка внизу) — данные ушли на текущий активный лист.

### 4. Vercel

Переменная окружения:

| Key | Value |
|-----|--------|
| `GOOGLE_SHEETS_WEBHOOK_URL` | URL из шага 3 (`.../exec`) |

**Redeploy** проекта. В Vercel должна быть переменная `GOOGLE_SHEETS_WEBHOOK_URL`.

### 5. Проверка с сайта

Пройдите анкету на проде → новая строка в таблице (не testAppend).

---

## Если строка не появилась

- URL именно `/exec`, не `/dev`
- Новое развёртывание после правок скрипта
- `GOOGLE_SHEETS_WEBHOOK_URL` в Vercel + Redeploy
- Логи Vercel: `Google Sheets sync failed`

Данные в БД сохраняются в любом случае.
