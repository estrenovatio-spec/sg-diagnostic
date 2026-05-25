# Деплой на Vercel (пошагово для новичка)

Публичная ссылка будет вида: `https://ваш-проект.vercel.app`

---

## Что понадобится

1. Аккаунт **GitHub** — [github.com](https://github.com) (бесплатно)
2. Аккаунт **Vercel** — [vercel.com](https://vercel.com) (войти через GitHub)
3. Папка проекта: `sg-diagnostic`

---

## Шаг 1. Загрузить код на GitHub

GitHub — это «облако» для кода. Vercel скачивает проект оттуда.

### 1.1. Откройте Терминал

На Mac: **Программы → Терминал** (или терминал в Cursor).

### 1.2. Перейдите в папку проекта

```bash
cd "/Users/bhima/Downloads/апп/sg-diagnostic"
```

### 1.3. Инициализируйте Git и сделайте первый коммит

```bash
git init
git add .
git commit -m "Финансовая диагностика — первый релиз"
```

### 1.4. Создайте репозиторий на GitHub

1. Зайдите на [github.com/new](https://github.com/new)
2. **Repository name:** `sg-diagnostic` (или любое имя)
3. Выберите **Private** или **Public**
4. **Не** ставьте галочки «Add README» — репозиторий должен быть пустым
5. Нажмите **Create repository**

### 1.5. Привяжите проект и отправьте код

GitHub покажет команды. Подставьте **свой** логин вместо `ВАШ_ЛОГИН`:

```bash
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/sg-diagnostic.git
git push -u origin main
```

Вас могут спросить логин/пароль GitHub — используйте **Personal Access Token** (Settings → Developer settings → Tokens), если пароль не принимается.

---

## Шаг 2. Создать проект на Vercel

1. Откройте [vercel.com](https://vercel.com) → **Sign Up** / **Log In** → **Continue with GitHub**
2. Разрешите Vercel доступ к GitHub
3. Нажмите **Add New… → Project**
4. Найдите репозиторий **sg-diagnostic** → **Import**
5. **Root Directory:** оставьте `.` (корень репозитория)
6. **Framework Preset:** Next.js (определится сам)
7. **Пока не жмите Deploy** — сначала база и переменные (шаг 3)

---

## Шаг 3. Подключить базу данных (PostgreSQL)

Без базы анкета не сохранится.

1. В проекте Vercel откройте вкладку **Storage**
2. **Create Database → Postgres** (или **Neon** — тоже подходит)
3. Имя, например: `sg-diagnostic-db` → **Create**
4. Подключите БД к проекту: **Connect Project** → выберите ваш Next.js-проект
5. Vercel добавит переменные `POSTGRES_*` — они должны быть видны в **Settings → Environment Variables**

> Если при сборке ошибка `DATABASE_URL не задан` — БД не привязана к проекту или переменные не созданы. См. шаг 4 и таблицу ниже.

### Важно для Prisma (две переменные!)

В **Settings → Environment Variables** добавьте (значения — в карточке Storage → **.env.local** tab):

| Имя | Значение |
|-----|----------|
| `DATABASE_URL` | **`POSTGRES_PRISMA_URL`** (для работы сайта) |
| `DIRECT_URL` | **`POSTGRES_URL_NON_POOLING`** (для миграций при сборке) |

Без `DIRECT_URL` сборка часто падает с ошибкой `prisma migrate deploy`.

Если Storage уже подключён к проекту, скрипт сборки подставит `POSTGRES_*` сам — но **надёжнее** задать `DATABASE_URL` и `DIRECT_URL` вручную, как в таблице.

---

## Шаг 4. Переменные окружения

**Settings → Environment Variables** → добавьте для **Production** (и при желании Preview):

| Переменная | Обязательно | Что указать |
|------------|-------------|-------------|
| `DATABASE_URL` | ✅ | `POSTGRES_PRISMA_URL` из Storage |
| `DIRECT_URL` | ✅ | `POSTGRES_URL_NON_POOLING` из Storage |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Пока `https://ваш-проект.vercel.app` — **обновите после первого деплоя** на реальный URL |
| `RATE_LIMIT_SECRET` | ✅ | Любая длинная случайная строка (например 32+ символа) |
| `CRON_SECRET` | для cron | Ещё одна случайная строка |
| `OPENAI_API_KEY` | для AI-отчёта | Ключ с [platform.openai.com](https://platform.openai.com) |
| `NEXT_PUBLIC_PD_POLICY_URL` | опционально | `/privacy` или ссылка на политику |
| `NEXT_PUBLIC_BOOKING_URL` | опционально | Ссылка Calendly |
| `TELEGRAM_BOT_TOKEN` | опционально | Токен от @BotFather |
| `TELEGRAM_ADMIN_CHAT_ID` | опционально | ID чата для горячих лидов |
| `ADMIN_DASHBOARD_URL` | опционально | Тот же URL сайта на Vercel |

Без `OPENAI_API_KEY` отчёт всё равно работает (по правилам анкеты).

---

## Шаг 5. Первый деплой

1. **Deployments → Redeploy** или нажмите **Deploy** при импорте
2. Подождите 2–5 минут. Зелёная галочка = успех
3. Откройте ссылку **Visit** — это ваша публичная ссылка

### Если сборка упала (`prisma migrate deploy` / exit code 1)

1. **Building → View Logs** — прокрутите до красной строки
2. Частые причины:
   - не подключена БД в **Storage → Connect Project**
   - нет **`DIRECT_URL`** (`POSTGRES_URL_NON_POOLING`)
   - **`DATABASE_URL`** — не pooled URL, а обычный (нужен `POSTGRES_PRISMA_URL`)
3. Добавьте обе переменные → **Deployments → Redeploy**
4. Убедитесь, что код на GitHub обновлён (`git push`)

---

## Шаг 6. После деплоя

1. Скопируйте URL сайта (например `https://sg-diagnostic.vercel.app`)
2. Обновите переменную **`NEXT_PUBLIC_SITE_URL`** на этот URL
3. Обновите **`ADMIN_DASHBOARD_URL`** на тот же URL
4. Сделайте **Redeploy**, чтобы ссылки в Telegram/PDF были верными

Проверьте:

- `/` — главная
- `/diagnostic` — анкета
- `/privacy` — политика

---

## Шаг 7 (опционально). Свой домен

**Settings → Domains → Add** → введите домен (например `diagnostic.sgcaps.ru`) и следуйте инструкциям DNS у регистратора.

---

## Краткая схема

```
Ваш компьютер → GitHub → Vercel → PostgreSQL (Storage)
                      ↓
              https://....vercel.app  ← публичная ссылка
```

---

## Альтернатива без GitHub (CLI)

Если не хотите GitHub:

```bash
npm i -g vercel
cd "/Users/bhima/Downloads/апп/sg-diagnostic"
vercel login
vercel
```

Дальше в [vercel.com/dashboard](https://vercel.com/dashboard) всё равно нужно добавить Storage и переменные, как в шагах 3–4.

---

## Помощь

- [Документация Vercel + Next.js](https://vercel.com/docs/frameworks/nextjs)
- [Prisma на Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
