# Подключение ИИ: OpenAI, DeepSeek, Qwen

Приложение использует **OpenAI-совместимый API** — меняется только провайдер в переменных окружения.

## Vercel: Settings → Environment Variables

После изменения — **Redeploy**.

---

## OpenAI (по умолчанию)

| Переменная | Значение |
|------------|----------|
| `AI_PROVIDER` | `openai` |
| `OPENAI_API_KEY` | ключ с [platform.openai.com](https://platform.openai.com) |
| `AI_MODEL` | `gpt-4o-mini` (опционально) |

---

## DeepSeek

1. Регистрация: [platform.deepseek.com](https://platform.deepseek.com)
2. API Keys → создать ключ
3. Пополнить баланс (оплата за токены, обычно дешевле OpenAI)

| Переменная | Значение |
|------------|----------|
| `AI_PROVIDER` | `deepseek` |
| `DEEPSEEK_API_KEY` | ваш ключ |
| `AI_MODEL` | `deepseek-chat` (или `deepseek-reasoner`) |

`AI_BASE_URL` не нужен — подставляется `https://api.deepseek.com`.

---

## Qwen (Alibaba DashScope)

1. [dashscope.aliyun.com](https://dashscope.aliyun.com) — аккаунт Alibaba Cloud
2. API Key в консоли DashScope
3. Включить биллинг / квоту

| Переменная | Значение |
|------------|----------|
| `AI_PROVIDER` | `qwen` |
| `DASHSCOPE_API_KEY` | ключ DashScope |
| `AI_MODEL` | `qwen-plus` или `qwen-turbo` |

По умолчанию endpoint: международный compatible-mode.  
Для Китая можно задать:  
`AI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1`

---

## Оплата

| Провайдер | Модель оплаты |
|-----------|----------------|
| OpenAI | Карта, pay-as-you-go, лимиты в кабинете |
| DeepSeek | Баланс на аккаунте, обычно **дешевле** GPT |
| Qwen | Квота/баланс в Alibaba Cloud |

Vercel за вызовы API **не берёт** — платите только провайдеру.

Один отчёт диагностики ≈ 1–3 тыс. токенов → копейки–рубли на mini/plus-моделях.

---

## Оплата из России

| Провайдер | Заметка |
|-----------|---------|
| **DeepSeek** | Часто проще с оплатой, чем OpenAI; карты зависят от правил платформы |
| **OpenAI** | Прямая оплата с РФ обычно недоступна |
| **Qwen (DashScope)** | Аккаунт Alibaba Cloud, оплата по правилам сервиса |

Без оплаты / без ключа API отчёт всё равно создаётся — по **правилам анкеты** (без ИИ).

---

## Проверка

Пройдите анкету на проде. В отчёте в БД поле `modelUsed` должно быть, например:

- `openai:gpt-4o-mini`
- `deepseek:deepseek-chat`
- `qwen:qwen-plus`

Если `fallback` — ключ не задан или ошибка API (смотрите **Vercel → Logs**).
