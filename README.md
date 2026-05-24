# SG Capital — Финансовая диагностика

Мини-диагностика клиента с AI-отчётом, квалификацией лида и уведомлениями в Telegram.

## Стек

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- PostgreSQL + Prisma
- OpenAI API (gpt-4o-mini)
- Telegram Bot API
- PostHog (опционально)

## Быстрый старт

```bash
cd sg-diagnostic
npm install
cp .env.example .env
# Укажите DATABASE_URL и при необходимости OPENAI_API_KEY, TELEGRAM_BOT_TOKEN
npx prisma db push
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) → **Начать диагностику**.

## Переменные окружения

См. `.env.example`. Без `OPENAI_API_KEY` отчёт генерируется по правилам квалификации (fallback). Без Telegram-бота уведомления пропускаются.

## Маршруты

| Путь | Описание |
|------|----------|
| `/` | Лендинг |
| `/diagnostic` | Пошаговая анкета (26 шагов) |
| `/diagnostic/report/[leadId]` | Персональный отчёт + CTA |
| `/api/generate-report` | Повторная генерация отчёта (POST) |
| `/api/report-pdf/[leadId]` | Скачивание PDF |
| `/api/cleanup-pending-leads` | Cron: очистка старых черновиков |

## Деплой (Vercel)

1. Подключите Vercel Postgres → `DATABASE_URL`
2. Добавьте секреты из `.env.example`
3. `vercel.json` уже настроен на `prisma generate && next build`
4. Для cron задайте `CRON_SECRET` и заголовок `Authorization: Bearer ...` в Vercel Cron

## 152-ФЗ

На последнем шаге анкеты — обязательные чекбоксы согласия и ссылка на политику (`NEXT_PUBLIC_PD_POLICY_URL`). Согласия сохраняются в полях `rulesAccepted` и `pdConsent` модели `Lead`.

## Лицензия

Проприетарный проект SG Capital.
