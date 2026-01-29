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
VITE_FORCE_ROLE=MANAGER
```

- `VITE_API_BASE_URL` — базовый URL API (по умолчанию `/api`)
- `VITE_MOCK_AUTH=true` — включает мок‑сессию без бэкенда
- `VITE_FORCE_ROLE=MANAGER` — временно форсит роль без localStorage

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
- Страница `TransfersPage` с формой и mock‑данными
- Страница `ProfileSettingsPage` (профиль и настройки)

## Роуты приложения

- `/login`
- `/register`
- `/app` (dashboard)
- `/app/accounts`
- `/app/transfers`
- `/app/cards`
- `/app/documents`
- `/app/applications`
- `/app/loan-payments`
- `/app/notifications`
- `/app/profile-settings`
- `/app/manager-dashboard`
- `/app/application-pipeline`
- `/app/applications/:applicationId`
- `/app/document-flow`
- `/app/products`
- `/app/system-monitoring`
- `/app/users`
- `/app/job-management`
- `/app/system-configuration`
- `/app/analytics-reports`
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

### Profile & Settings

`GET /api/v1/users/{id}`

`PUT /api/v1/users/{id}`

`POST /api/v1/auth/password/change`

`POST /api/v1/auth/verify/email`

`POST /api/v1/auth/verify/phone`

`GET /api/v1/users/{id}/audit`

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

### Transfers

`POST /api/v1/accounts/transfer`

`GET /api/v1/accounts/{id}/statement`

`POST /api/v1/accounts/{id}/deposit`

`POST /api/v1/accounts/{id}/withdraw`

`GET /api/v1/transfers/templates`

### Cards

`GET /api/v1/accounts/search?clientId=X&type=CHECKING`

`PATCH /api/v1/accounts/{id}/status`

`POST /api/v1/accounts`

`GET /api/v1/cards/types`

`POST /api/v1/accounts/{id}/limit`

### Documents

`GET /api/v1/documents/search`

`POST /api/v1/documents/upload`

`GET /api/v1/documents/{id}/download`

`DELETE /api/v1/documents/{id}`

`GET /api/v1/documents/{id}/download`

### Applications

`GET /api/v1/clients/{clientId}/applications`

`POST /api/v1/applications`

`GET /api/v1/applications/{applicationId}/documents`

`POST /api/v1/documents/upload`

`PATCH /api/v1/applications/{id}/cancel`

### Loan Payments

`GET /api/v1/accounts/{id}/payment-schedule`

`POST /api/v1/accounts/{id}/payments`

`GET /api/v1/accounts/{id}/statement?transactionType=LOAN_PAYMENT`

### Manager Dashboard

`GET /api/v1/analytics/real-time/dashboard`

`GET /api/v1/manager/applications?assigned=false`

`GET /api/v1/analytics/applications/stats`

`GET /api/v1/reports/daily`

`PATCH /api/v1/manager/applications/{id}/assign`

`GET /api/v1/analytics/team/activity`

Request/Response (добавлены под UI-кнопки панели менеджера):

`GET /api/v1/reports/daily`

Response:

```json
{
	"date": "YYYY-MM-DD",
	"totalApplications": 0,
	"approved": 0,
	"rejected": 0,
	"avgProcessingHours": 0
}
```

`PATCH /api/v1/manager/applications/{id}/assign`

Request:

```json
{
	"managerId": 0
}
```

Response:

```json
{
	"applicationId": 0,
	"assignedTo": 0,
	"status": "ASSIGNED"
}
```

`GET /api/v1/analytics/team/activity`

Response:

```json
[
	{
		"managerId": 0,
		"name": "string",
		"status": "ONLINE | REVIEWING | OFFLINE",
		"completed": 0,
		"progress": 0
	}
]
```

### Application Pipeline

`GET /api/v1/manager/applications`

`PATCH /api/v1/applications/{id}/status`

`POST /api/v1/manager/applications/bulk-status`

`GET /api/v1/composite/application-overview/{applicationId}`

`GET /api/v1/manager/applications?status={STATUS}&product={PRODUCT}&search={QUERY}&sort=createdAt,desc`

`GET /api/v1/manager/applications?status={STATUS}&product={PRODUCT}&search={QUERY}&sort=amount,desc`

### Application Details

`GET /api/v1/composite/application-overview/{applicationId}`

`GET /api/v1/scoring/history/{clientId}`

`GET /api/v1/applications/{applicationId}/documents`

`PATCH /api/v1/applications/{id}/status`

`POST /api/v1/notifications/send`

### Document Flow

`GET /api/v1/documents/search?status=UPLOADED`

`GET /api/v1/documents/{id}/download`

`PATCH /api/v1/documents/{id}/status`

`POST /api/v1/notifications/send`

### Product Management

`GET /api/v1/products`

`POST /api/v1/products`

`PUT /api/v1/products/{id}`

`PATCH /api/v1/products/{id}/status`

`DELETE /api/v1/products/{id}`

`GET /api/v1/products/{id}/audit`

### System Monitoring

`/actuator/health`

`GET /api/v1/analytics/operational/metrics`

`Prometheus monitoring endpoints`

### User Management

`GET /api/v1/users/search`

`POST /api/v1/auth/register`

`PUT /api/v1/users/{id}`

`POST /api/v1/auth/password/reset-request`

### Job Management

`GET /api/v1/jobs`

`POST /api/v1/jobs/schedule`

`POST /api/v1/jobs/execute`

`POST /api/v1/jobs/{id}/cancel`

`GET /api/v1/jobs/types`

### System Configuration

`GET /api/v1/configs`

`POST /api/v1/configs`

`PUT /api/v1/configs/{key}`

`DELETE /api/v1/configs/{key}`

`GET /api/v1/configs/refresh`

### Analytics & Reports

`/api/v1/analytics/*`

`POST /api/v1/reports/generate`

`GET /api/v1/reports`

`GET /api/v1/reports/{id}/download`

`POST /api/v1/reports/scheduled`

## Backend endpoints checklist

### Auth

`POST /api/v1/auth/login`

Request:

```json
{
	"login": "string",
	"password": "string"
}
```

Response:

```json
{
	"accessToken": "string",
	"refreshToken": "string",
	"userInfo": "User"
}
```

`POST /api/v1/auth/password/reset-request`

Request:

```json
{
	"login": "string"
}
```

Response:

```json
{
	"status": "OK"
}
```

`POST /api/v1/auth/refresh`

Request:

```json
{
	"refreshToken": "string"
}
```

Response:

```json
{
	"accessToken": "string",
	"refreshToken": "string"
}
```

`POST /api/v1/auth/register`

Request:

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

Response:

```json
{
	"accessToken": "string",
	"refreshToken": "string",
	"userInfo": "User"
}
```

### Dashboard

`GET /api/v1/composite/client-dashboard/{clientId}`

Response:

```json
{
	"clientId": 1,
	"totals": {},
	"accounts": [],
	"notifications": []
}
```

### Notifications

`GET /api/v1/notifications/history?recipientId=X&limit=5`

### Accounts

`PATCH /api/v1/accounts/{id}/status`

`POST /api/v1/accounts/{id}/close`

Response:

```json
[
	{
		"id": 1,
		"title": "string",
		"content": "string",
		"status": "PENDING | SENT | FAILED",
		"createdAt": "YYYY-MM-DDTHH:mm:ss"
	}
]
```

### Accounts

`GET /api/v1/clients/{clientId}/accounts`

Response:

```json
[
	{
		"id": 1,
		"accountNumber": "string",
		"type": "CHECKING | SAVINGS | CREDIT",
		"balance": 0,
		"currency": "RUB | USD | EUR",
		"status": "ACTIVE | BLOCKED | CLOSED"
	}
]
```

`POST /api/v1/accounts`

Request:

```json
{
	"type": "CHECKING | SAVINGS | CREDIT",
	"currency": "RUB | USD | EUR",
	"productId": 1
}
```

Response:

```json
{
	"id": 1,
	"accountNumber": "string",
	"status": "ACTIVE"
}
```

`GET /api/v1/accounts/{id}/statement`

Response:

```json
[
	{
		"id": 1,
		"type": "DEPOSIT | WITHDRAWAL | TRANSFER | FEE",
		"amount": 0,
		"currency": "RUB | USD | EUR",
		"createdAt": "YYYY-MM-DDTHH:mm:ss"
	}
]
```

`PATCH /api/v1/accounts/{id}/status`

Request:

```json
{
	"status": "ACTIVE | BLOCKED | CLOSED"
}
```

Response:

```json
{
	"id": 1,
	"status": "BLOCKED"
}
```

`POST /api/v1/accounts/{id}/close`

Response:

```json
{
	"id": 1,
	"status": "CLOSED"
}
```

`POST /api/v1/accounts/transfer`

Request:

```json
{
	"fromAccountId": 1,
	"toAccountId": 2,
	"amount": 1000,
	"currency": "RUB | USD | EUR",
	"description": "string"
}
```

Response:

```json
{
	"transactionId": "string",
	"status": "PENDING | COMPLETED"
}
```

`POST /api/v1/accounts/{id}/deposit`

Request:

```json
{
	"amount": 1000,
	"currency": "RUB | USD | EUR"
}
```

Response:

```json
{
	"transactionId": "string",
	"status": "COMPLETED"
}
```

`POST /api/v1/accounts/{id}/withdraw`

Request:

```json
{
	"amount": 1000,
	"currency": "RUB | USD | EUR"
}
```

Response:

```json
{
	"transactionId": "string",
	"status": "COMPLETED"
}
```

`GET /api/v1/accounts/search?clientId=X&type=CHECKING`

Response:

```json
[
	{
		"id": 1,
		"accountNumber": "string",
		"type": "CHECKING",
		"status": "ACTIVE"
	}
]
```

### Documents

`GET /api/v1/documents/search`

Response:

```json
[
	{
		"id": 1,
		"name": "string",
		"type": "STATEMENT | CERTIFICATE | AGREEMENT",
		"status": "READY | PROCESSING | FAILED",
		"createdAt": "YYYY-MM-DDTHH:mm:ss"
	}
]
```

`POST /api/v1/documents/upload`

Request: `multipart/form-data`

Response:

```json
{
	"id": 1,
	"status": "PROCESSING"
}
```

`GET /api/v1/documents/{id}/download`

Response: file stream

`DELETE /api/v1/documents/{id}`

Response:

```json
{
	"status": "DELETED"
}
```

### Applications

`GET /api/v1/clients/{clientId}/applications`

Response:

```json
[
	{
		"id": 1,
		"amount": 100000,
		"term": 12,
		"status": "NEW | PROCESSING | APPROVED | REJECTED",
		"createdAt": "YYYY-MM-DDTHH:mm:ss"
	}
]
```

`POST /api/v1/applications`

Request:

```json
{
	"amount": 100000,
	"term": 12,
	"currency": "RUB | USD | EUR",
	"productId": 1,
	"targetAccountId": 1
}
```

Response:

```json
{
	"id": 1,
	"status": "NEW"
}
```

`GET /api/v1/applications/{applicationId}/documents`

Response:

```json
[
	{
		"id": 1,
		"name": "string",
		"status": "READY | PROCESSING | FAILED"
	}
]
```

`PATCH /api/v1/applications/{id}/cancel`

Response:

```json
{
	"id": 1,
	"status": "CANCELLED"
}
```

### Loan Payments

`GET /api/v1/accounts/{id}/payment-schedule`

Response:

```json
[
	{
		"date": "YYYY-MM-DD",
		"amount": 0,
		"principal": 0,
		"interest": 0,
		"status": "PAID | PENDING | OVERDUE"
	}
]
```

`POST /api/v1/accounts/{id}/payments`

Request:

```json
{
	"amount": 1000
}
```

Response:

```json
{
	"status": "COMPLETED"
}
```

`GET /api/v1/accounts/{id}/statement?transactionType=LOAN_PAYMENT`

Response:

```json
[
	{
		"id": 1,
		"type": "LOAN_PAYMENT",
		"amount": 0,
		"createdAt": "YYYY-MM-DDTHH:mm:ss"
	}
]
```

### Profile & Settings

`GET /api/v1/users/{id}`

Response:

```json
{
	"id": 1,
	"username": "string",
	"email": "string",
	"phone": "string",
	"firstName": "string",
	"lastName": "string",
	"birthDate": "YYYY-MM-DD",
	"role": "CLIENT | MANAGER | ADMIN",
	"active": true
}
```

`PUT /api/v1/users/{id}`

Request:

```json
{
	"email": "string",
	"phone": "string",
	"firstName": "string",
	"lastName": "string",
	"birthDate": "YYYY-MM-DD"
}
```

Response:

```json
{
	"id": 1,
	"email": "string",
	"phone": "string",
	"firstName": "string",
	"lastName": "string"
}
```

`POST /api/v1/auth/password/change`

Request:

```json
{
	"currentPassword": "string",
	"newPassword": "string"
}
```

Response:

```json
{
	"status": "OK"
}
```

`POST /api/v1/auth/verify/email`

Request:

```json
{
	"email": "string"
}
```

Response:

```json
{
	"status": "OK"
}
```

`POST /api/v1/auth/verify/phone`

Request:

```json
{
	"phone": "string"
}
```

Response:

```json
{
	"status": "OK"
}
```

`GET /api/v1/users/{id}/audit`

Response:

```json
[
	{
		"id": 1,
		"action": "string",
		"createdAt": "YYYY-MM-DDTHH:mm:ss"
	}
]
```

## Backend alignment notes

- `GET /api/v1/accounts/{id}/statement` listed twice in provided list
- `PATCH /api/v1/accounts/{id}/status` listed twice in provided list
- `POST /api/v1/documents/upload` listed twice in provided list
- Frontend auth updated to `/api/v1/auth/*` per confirmation

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
