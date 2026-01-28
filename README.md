# Bank Fintech Frontend

Документ для согласования с backend-разработчиком. Здесь описано,
что уже реализовано, какие контракты используются и что ожидать
от API.

## Стек и архитектура

- React + TypeScript + Vite
- Redux Toolkit + RTK Query
- Ant Design
- FSD-структура (app, pages, widgets, features, entities, shared)

## Быстрый запуск

```bash
npm install
npm run dev
```

## Переменные окружения

```env
VITE_API_BASE_URL=/api
VITE_MOCK_AUTH=true
```

- `VITE_API_BASE_URL` — базовый URL API (по умолчанию `/api`)
- `VITE_MOCK_AUTH=true` — включает мок‑сессию без бэкенда

## Реализовано (Спринт 1)

### Auth Module

- `LoginPage`, `RegisterPage` с версткой по макету
- Интеграция с Auth-Service
- Сохранение токенов и подстановка `Authorization` в RTK Query

### Основной Layout

- `MainLayout` + `Header` + `Sidebar`
- Навигация по ролям: `CLIENT`, `MANAGER`, `ADMIN`
- Protected Routes

### Профиль и заглушки

- `ProfilePage` (просмотр/редактирование)
- Заглушки и мок‑данные для разделов
- Модальное окно "Добавить продукт" с формой под Swagger

## Роуты приложения

- `/login`
- `/register`
- `/app` (dashboard)
- `/app/accounts`
- `/app/profile`
- Остальные страницы — заглушки

## Контракты API (ожидается)

### Auth-Service

`POST /api/auth/login`

```json
{
	"login": "string",
	"password": "string"
}
```

`POST /api/auth/register`

```json
{
	"username": "string",
	"email": "string",
	"phone": "string",
	"password": "string",
	"firstName": "string",
	"lastName": "string",
	"birthDate": "YYYY-MM-DD"
}
```

Ожидаемый ответ `AuthResponse`:

```json
{
	"accessToken": "string",
	"refreshToken": "string",
	"userInfo": {
		"id": 1,
		"username": "string",
		"email": "string",
		"phone": "string",
		"passwordHash": "string",
		"firstName": "string",
		"lastName": "string",
		"birthDate": "YYYY-MM-DD",
		"registrationDate": "YYYY-MM-DDTHH:mm:ss",
		"role": "CLIENT | MANAGER | ADMIN",
		"active": true
	}
}
```

### Users-Service

`PUT /api/users/{id}`

```json
{
	"email": "string",
	"phone": "string",
	"firstName": "string",
	"lastName": "string",
	"birthDate": "YYYY-MM-DD"
}
```

Ожидаемый ответ: `User` (как в AuthResponse).

### Product-Service

Swagger: `swagger_product.json`

`GET /api/products`

Query params: `page`, `size`, `sort` + фильтры `type`, `status`, `minRate`,
`maxRate`, `currency`, `name`

`GET /api/products/{id}`

`POST /api/products`

```json
{
	"code": "CRD-001",
	"name": "Кредит наличными",
	"description": "Описание продукта",
	"type": "CREDIT | DEPOSIT | INVESTMENT",
	"interestRate": 10.5,
	"minAmount": 50000,
	"maxAmount": 2000000,
	"currency": "RUB | USD | EUR",
	"active": true,
	"creditProduct": {
		"creditType": "CONSUMER | MORTGAGE | AUTO",
		"requiresCollateral": false,
		"repaymentSchedule": "ANNUITY | DIFFERENTIATED",
		"termMonths": 12,
		"earlyRepaymentFee": 0.5
	},
	"depositProduct": {
		"replenishable": true,
		"earlyWithdrawalAllowed": false,
		"earlyWithdrawalPenalty": 1,
		"termDays": 365,
		"minBalanceForInterest": 1000
	}
}
```

`PUT /api/products/{id}`

`PATCH /api/products/{id}/status`

```json
{
	"active": false
}
```

`DELETE /api/products/{id}`

`GET /api/products/types/{type}`

`GET /api/products/search`

`GET /api/products/active`

## Правила передачи токена

Токен берется из `localStorage` и добавляется в заголовок:

```
Authorization: Bearer <accessToken>
```

## Форматы данных

- Даты: `YYYY-MM-DD`
- Дата/время: `YYYY-MM-DDTHH:mm:ss`
- Суммы: число (decimal)

## Мок‑данные

Если `VITE_MOCK_AUTH=true`, то:
- создается мок‑пользователь
- токены ставятся как `mock-access-token`
- доступ к `/app` открыт без бэка
- "Добавить продукт" сохраняет payload локально (mock, без API)

## Что нужно подтвердить с backend

- Поле логина: `login` vs `username/email/phone`
- Форматы дат и таймзон
- Состав `AuthResponse` и `User`
- Наличие refresh‑эндпоинта и логика обновления токена
- Структура `ProductDetailDTO` и поля `creditDetails` / `depositDetails`
