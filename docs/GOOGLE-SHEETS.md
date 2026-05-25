# Google Таблица — лиды из анкеты

Каждая отправленная анкета может автоматически добавлять **строку в Google Sheets**.

---

## Где сейчас лежат данные (без Таблицы)

Все ответы в **PostgreSQL** (Neon / Vercel Storage), таблицы `Lead` и `AiReport`.

### Способ A: Neon (если БД через Neon)

1. [console.neon.tech](https://console.neon.tech) → ваш проект  
2. **SQL Editor** → запрос:

```sql
SELECT id, "createdAt", "fullName", age, city, phone, telegram,
       profession, "incomeLevel", "hasSavings", qualification
FROM "Lead"
ORDER BY "createdAt" DESC;
```

### Способ B: Prisma Studio (с компьютера)

```bash
cd sg-diagnostic
# в .env должны быть DATABASE_URL и DIRECT_URL с продакшена (Vercel → Storage → .env)
npx prisma studio
```

Откроется браузер → таблица **Lead**.

### Способ C: Vercel

**Storage** → ваша БД → **Data** / **Open in Neon** (если есть кнопка).

---

## Подключить Google Таблицу (15 минут)

### 1. Создайте таблицу

[Google Sheets](https://sheets.google.com) → новая таблица, например «Лиды SG Diagnostic».

В **первой строке** заголовки (можно скопировать):

```
id | дата | ФИО | возраст | город | телефон | telegram | профессия | доход | долги | накопления | активы | боль | цели | бюджет | вопрос | квалификация | ссылка на отчёт | utm
```

### 2. Apps Script

**Расширения → Apps Script**, вставьте:

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
```

**Сохранить** → **Развернуть → Новое развёртывание → Тип: Веб-приложение**

- Запуск от: **Меня**  
- Доступ: **Все** (Anyone)  

Скопируйте **URL веб-приложения** (длинный, заканчивается на `/exec`).

### 3. Vercel

**Settings → Environment Variables** (или прямая ссылка `.../settings/environment-variables`):

| Key | Value |
|-----|--------|
| `GOOGLE_SHEETS_WEBHOOK_URL` | URL из шага 2 |

**Redeploy.**

### 4. Проверка

Пройдите анкету на сайте → в таблице должна появиться новая строка.

---

## Локально

В `.env`:

```
GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/...../exec"
```

---

## Если строка не появилась

- URL заканчивается на `/exec`, не `/dev`  
- В Apps Script развёртывание с доступом **Все**  
- Redeploy после добавления переменной  
- Логи Vercel: `Google Sheets sync failed`

Анкета клиенту всё равно сохранится в БД — Таблица опциональна.
