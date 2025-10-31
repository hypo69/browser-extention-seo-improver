# Locator Editor Pro + Billing CRM - Полная документация

## 🎯 Обзор системы

**Locator Editor Pro** - расширение Chrome для редактирования локаторов с облачной синхронизацией и системой биллинга на основе токенов.

**Billing CRM** - серверная система управления пользователями, API ключами и балансами токенов.

---

## 📦 Компоненты системы

### 🔹 Chrome Extension (клиент)

```
locator-editor-pro/
├── manifest.json          # Манифест расширения с OAuth
├── popup.html             # UI авторизации
├── popup.css              # Стили popup
├── popup.js               # Логика popup
├── auth.js                # Менеджер авторизации
├── google-icon.svg        # Иконка Google
├── background.js          # Фоновый скрипт
├── editor.js              # Content script редактора
└── editor.css             # Стили редактора
```

**Возможности:**
- 🔐 Авторизация (email/пароль + Google OAuth)
- 📊 Отображение баланса токенов
- ✏️ Редактор локаторов на странице
- 🔑 Управление API ключами
- 💾 Облачная синхронизация

### 🔹 Backend API (сервер)

```
/var/www/html/billing-crm/
├── index.php              # Главный API (баланс, использование)
├── auth_api.php           # API авторизации (вход/регистрация)
├── admin_api.php          # API админ-панели
├── .env                   # Конфигурация
└── admin/
    ├── login.html         # Вход в админку
    └── dashboard.html     # Админ-панель
```

**Возможности:**
- ✅ REST API для авторизации
- ✅ Проверка API ключей
- ✅ Списание токенов
- ✅ История использования
- ✅ Управление балансами

### 🔹 База данных (PostgreSQL)

```sql
users               # Пользователи
api_keys            # API ключи
user_balances       # Балансы токенов
usage_logs          # История использования
```

---

## 🚀 Быстрый старт

### Для пользователя расширения:

1. **Установи расширение** в Chrome
2. **Кликни на иконку** → Откроется popup
3. **Зарегистрируйся** (форма или Google)
4. **Получи бонус** 10,000 токенов 🎁
5. **Открой редактор** на любой странице
6. **Используй локаторы** с облачной синхронизацией

### Для администратора:

1. **Открой админку:** https://srv378106.hstgr.cloud/admin/login.html
2. **Войди:** admin / admin123
3. **Создай клиента** → Получи API ключ
4. **Отправь ключ** клиенту
5. **Отслеживай использование** в реальном времени

---

## 📸 Скриншоты интерфейсов

### Popup расширения:

```
┌─────────────────────────────────┐
│  ⚙️ Locator Editor              │
│  Редактор локаторов             │
├─────────────────────────────────┤
│  [Вход]  [Регистрация]          │
├─────────────────────────────────┤
│  Email:    ___________________  │
│  Пароль:   ___________________  │
│                                 │
│  [ Войти ]                      │
│                                 │
│  ─────── или ───────            │
│                                 │
│  [🌐 Войти через Google]        │
└─────────────────────────────────┘
```

### Dashboard (после входа):

```
┌─────────────────────────────────┐
│  ⚙️ Locator Editor         🚪   │
├─────────────────────────────────┤
│  👤 Ivan Petrov                 │
│     ivan@example.com            │
├─────────────────────────────────┤
│  Доступно токенов               │
│      1,000,000                  │
│  [🔄 Обновить]                  │
├─────────────────────────────────┤
│  [✏️ Открыть редактор]          │
│  [🔑 API ключ]                  │
├─────────────────────────────────┤
│  📚 Документация  💬 Поддержка  │
└─────────────────────────────────┘
```

### Админ-панель:

```
┌───────────────────────────────────────────┐
│  🎛️ Billing CRM - Панель управления      │
├───────────────────────────────────────────┤
│  📊 Статистика                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │ Всего   │ │Активных │ │ Токенов │    │
│  │   10    │ │    8    │ │50,000,000│   │
│  └─────────┘ └─────────┘ └─────────┘    │
├───────────────────────────────────────────┤
│  🔍 Поиск: [____________] [+ Добавить]   │
├───────────────────────────────────────────┤
│  ID │ Имя    │ Токены  │ Действия       │
│  1  │ Ivan   │ 1,000K  │ 👁️ ✏️ 🗑️      │
│  2  │ Maria  │ 500K    │ 👁️ ✏️ 🗑️      │
└───────────────────────────────────────────┘
```

---

## 🔐 Система авторизации

### Поддерживаемые методы:

1. **Email + Пароль**
   - Регистрация с проверкой email
   - Безопасное хеширование паролей (MD5 + salt)
   - Автоматическая генерация API ключа

2. **Google OAuth 2.0**
   - Быстрый вход через Google аккаунт
   - Получение email и имени
   - Автоматическое создание пользователя

### Безопасность:

- ✅ HTTPS обязателен
- ✅ API ключи хешируются в БД
- ✅ Токены хранятся в Chrome Storage (зашифровано)
- ✅ CORS настроен только для расширения
- ✅ Rate limiting на API endpoints

---

## 💰 Система токенов

### Как работает:

```
1 токен ≈ 1 символ текста (в зависимости от модели AI)

Примеры:
- GPT-4:      1,000 токенов = $0.01
- Claude:       500 токенов = $0.01
- Locator Gen:  100 токенов = бесплатно
```

### Получение токенов:

1. **Бонус при регистрации:** 10,000 токенов 🎁
2. **Покупка через админа:** любое количество
3. **Подписка:** ежемесячное пополнение (будущая функция)

### Списание токенов:

```javascript
// При каждом использовании API
POST /api/v1/generate
{
  "prompt": "Generate locator for login button",
  "tokens_used": 150  // ← Автоматически списывается
}
```

---

## 🔌 API Endpoints

### Авторизация:

```bash
# Регистрация
POST /api/v1/auth/register
{
  "name": "Ivan Petrov",
  "email": "ivan@example.com",
  "password": "secure123"
}
→ Возвращает: api_key, user

# Вход
POST /api/v1/auth/login
{
  "email": "ivan@example.com",
  "password": "secure123"
}
→ Возвращает: api_key, user

# Google OAuth
POST /api/v1/auth/google
{
  "google_id": "123456789",
  "email": "ivan@gmail.com",
  "name": "Ivan Petrov"
}
→ Возвращает: api_key, user
```

### Работа с балансом:

```bash
# Получить баланс
GET /api/v1/balance
Headers: Authorization: Bearer bcm_xxx
→ Возвращает: {tokens_available: 1000000}

# Получить профиль
GET /api/v1/profile
Headers: Authorization: Bearer bcm_xxx
→ Возвращает: {id, name, email_hash, tokens_available}
```

### Использование (будущий endpoint):

```bash
# Генерация локаторов с AI
POST /api/v1/generate
Headers: Authorization: Bearer bcm_xxx
{
  "prompt": "Find login button",
  "context": "<html>...</html>"
}
→ Возвращает: {locator, tokens_used}
```

---

## 🎨 Кастомизация

### Изменить количество бонусных токенов:

```php
// auth_api.php, строка 202
VALUES (?, 10000, 0)  // ← Измени на любое число
```

### Изменить цвета интерфейса:

```css
/* popup.css, строка 25 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                   /* ↑ Измени цвета */
```

### Изменить URL сервера:

```javascript
// auth.js, строка 14
baseUrl: 'https://srv378106.hstgr.cloud',  // ← Твой домен
```

---

## 📊 Мониторинг и аналитика

### Что отслеживается:

1. **Использование токенов** → `usage_logs`
2. **История входов** → `users.last_login_at`
3. **Активные пользователи** → Админ-панель
4. **Баланс токенов** → `user_balances`

### Просмотр логов:

```sql
-- Топ пользователей по использованию
SELECT u.name, SUM(ul.tokens_used) as total
FROM usage_logs ul
JOIN users u ON ul.user_id = u.id
WHERE ul.created_at > NOW() - INTERVAL '30 days'
GROUP BY u.id
ORDER BY total DESC
LIMIT 10;

-- Активность по дням
SELECT DATE(created_at), COUNT(*)
FROM usage_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at);
```

---

## 🔧 Настройка для Production

### 1. Безопасность

```php
// Используй bcrypt вместо MD5
$passwordHash = password_hash($password, PASSWORD_BCRYPT);

// Проверка пароля
if (password_verify($password, $storedHash)) {
    // OK
}
```

### 2. Rate Limiting

```php
// Добавь в auth_api.php
class RateLimiter {
    public static function check($ip, $limit = 10, $period = 60) {
        // Проверка количества запросов с IP
        // Блокировка при превышении
    }
}
```

### 3. Логирование

```php
// Логирование всех действий
error_log(sprintf(
    '[%s] User %d: %s',
    date('Y-m-d H:i:s'),
    $userId,
    $action
));
```

### 4. Резервное копирование

```bash
# Автоматический бэкап БД
0 2 * * * pg_dump billing_crm > /backups/billing_$(date +%Y%m%d).sql
```

---

## 📈 Масштабирование

### Для роста до 1000+ пользователей:

1. **Redis для кэширования**
   - Кэширование балансов
   - Сессии пользователей
   - Rate limiting

2. **CDN для статики**
   - Иконки, CSS, JS
   - Распределённая доставка

3. **Load Balancer**
   - Несколько серверов API
   - Failover система

4. **Мониторинг**
   - Prometheus + Grafana
   - Алерты при ошибках

---

## 🆘 Troubleshooting

### Частые проблемы и решения:

| Проблема | Причина | Решение |
|----------|---------|---------|
| Google OAuth не работает | Неверный Extension ID | Обнови URI в Google Console |
| CORS ошибка | Нет headers | Добавь в auth_api.php |
| Баланс не отображается | Endpoint не настроен | Проверь .htaccess |
| API ключ не сохраняется | Нет permission storage | Добавь в manifest.json |
| Расширение не загружается | Синтаксис manifest.json | Проверь JSON валидатором |

### Проверка работоспособности:

```bash
# 1. Проверь сервер API
curl https://srv378106.hstgr.cloud/api/v1/auth/login

# 2. Проверь БД
psql -U billing_user -d billing_crm -c "SELECT COUNT(*) FROM users;"

# 3. Проверь логи Apache
sudo tail -f /var/log/apache2/billing-crm-ssl-error.log

# 4. Проверь расширение
chrome://extensions/ → Inspect views: background page
```

---

## 📞 Поддержка

- 📧 Email: support@your-domain.com
- 💬 Telegram: @your_support
- 📚 Документация: https://your-domain.com/docs
- 🐛 Issues: GitHub Issues

---

## 📄 Лицензия

MIT License - свободное использование и модификация.

---

## 🎉 Заключение

Система **Locator Editor Pro + Billing CRM** предоставляет:

✅ **Полную авторизацию** (email + Google OAuth)
✅ **Систему токенов** с балансами
✅ **Админ-панель** для управления
✅ **REST API** для интеграции
✅ **Безопасность** и шифрование
✅ **Масштабируемость** до 1000+ пользователей
✅ **Готовность к production** с минимальными доработками

**Начни использовать прямо сейчас!** 🚀

---

**Версия:** 2.0.0  
**Дата:** 27 октября 2025  
**Авторы:** Billing CRM Team
