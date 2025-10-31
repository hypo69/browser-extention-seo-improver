# Locator Editor Pro - Установка и настройка авторизации

## 📦 Что создано

### Файлы расширения:
1. **popup.html** - Интерфейс с формами входа/регистрации
2. **popup.css** - Стили для popup
3. **popup-new.js** - Логика управления авторизацией
4. **auth.js** - Модуль работы с API и Google OAuth
5. **manifest.json** - Манифест с правами для OAuth
6. **google-icon.svg** - Иконка Google

### Файлы сервера:
7. **auth_api.php** - Backend API для авторизации

---

## 🚀 Установка (пошагово)

### Часть 1: Настройка Google OAuth

#### Шаг 1: Создай проект в Google Cloud Console

1. Открой [Google Cloud Console](https://console.cloud.google.com/)
2. Нажми "Создать проект"
3. Введи название: "Locator Editor Pro"
4. Нажми "Создать"

#### Шаг 2: Включи Google+ API

1. В меню слева: "API и сервисы" → "Библиотека"
2. Найди "Google+ API"
3. Нажми "Включить"

#### Шаг 3: Создай учётные данные OAuth

1. В меню слева: "API и сервисы" → "Учётные данные"
2. Нажми "Создать учётные данные" → "Идентификатор клиента OAuth"
3. Тип приложения: "Веб-приложение"
4. Название: "Locator Editor Extension"
5. Разрешенные источники JavaScript:
   ```
   chrome-extension://YOUR_EXTENSION_ID
   ```
6. Разрешенные URI перенаправления:
   ```
   https://YOUR_EXTENSION_ID.chromiumapp.org/
   ```
7. Нажми "Создать"
8. **Скопируй Client ID** (понадобится для manifest.json)

**Примечание:** Extension ID можно узнать после первой загрузки расширения в Chrome.

#### Шаг 4: Обнови manifest.json

Открой `manifest.json` и замени:

```json
"oauth2": {
  "client_id": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
  ...
}
```

На свой реальный Client ID.

---

### Часть 2: Установка файлов на сервер

#### Шаг 1: Загрузи auth_api.php

```bash
# Загрузи файл на сервер
scp auth_api.php user@srv378106.hstgr.cloud:/var/www/html/billing-crm/

# Установи права
ssh user@srv378106.hstgr.cloud
cd /var/www/html/billing-crm/
sudo chown www-data:www-data auth_api.php
sudo chmod 644 auth_api.php
```

#### Шаг 2: Настрой Apache для auth endpoints

Создай файл `/var/www/html/billing-crm/.htaccess` (если ещё нет):

```apache
RewriteEngine On

# Auth API
RewriteRule ^api/v1/auth/login$ auth_api.php [L]
RewriteRule ^api/v1/auth/register$ auth_api.php [L]
RewriteRule ^api/v1/auth/google$ auth_api.php [L]
RewriteRule ^api/v1/profile$ auth_api.php [L]

# Остальные правила...
```

Или добавь в VirtualHost:

```apache
<VirtualHost *:443>
    ...
    
    # Auth API routes
    RewriteRule ^/api/v1/auth/login /var/www/html/billing-crm/auth_api.php [L]
    RewriteRule ^/api/v1/auth/register /var/www/html/billing-crm/auth_api.php [L]
    RewriteRule ^/api/v1/auth/google /var/www/html/billing-crm/auth_api.php [L]
    RewriteRule ^/api/v1/profile /var/www/html/billing-crm/auth_api.php [L]
</VirtualHost>
```

Перезагрузи Apache:

```bash
sudo systemctl restart apache2
```

#### Шаг 3: Протестируй endpoints

```bash
# Тест регистрации
curl -X POST https://srv378106.hstgr.cloud/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'

# Должен вернуть API ключ
```

---

### Часть 3: Установка расширения в Chrome

#### Шаг 1: Подготовь файлы расширения

Создай директорию проекта:

```
locator-editor-pro/
├── manifest.json
├── popup.html
├── popup.css
├── popup-new.js (переименуй в popup.js)
├── auth.js
├── google-icon.svg
├── background.js (твой существующий)
├── editor.js (твой существующий)
├── editor.css (твой существующий)
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

#### Шаг 2: Настрой auth.js

Открой `auth.js` и обнови `API_CONFIG`:

```javascript
const API_CONFIG = {
    baseUrl: 'https://srv378106.hstgr.cloud',  // Твой сервер
    endpoints: {
        login: '/api/v1/auth/login',
        register: '/api/v1/auth/register',
        balance: '/api/v1/balance',
        profile: '/api/v1/profile'
    },
    googleOAuth: {
        clientId: 'YOUR_REAL_CLIENT_ID.apps.googleusercontent.com',  // Из Google Console
        redirectUrl: chrome.identity.getRedirectURL('oauth2')
    }
};
```

#### Шаг 3: Загрузи расширение в Chrome

1. Открой Chrome
2. Перейди в `chrome://extensions/`
3. Включи "Режим разработчика" (справа вверху)
4. Нажми "Загрузить распакованное расширение"
5. Выбери папку `locator-editor-pro/`
6. Расширение установлено! ✅

#### Шаг 4: Узнай Extension ID

После загрузки:
1. В `chrome://extensions/` найди "Locator Editor Pro"
2. Скопируй **ID расширения** (например: `abcdefghijklmnopqrstuvwxyz123456`)

#### Шаг 5: Обнови Google OAuth настройки

1. Вернись в [Google Cloud Console](https://console.cloud.google.com/)
2. "API и сервисы" → "Учётные данные"
3. Найди свой OAuth Client
4. Нажми "✏️" (редактировать)
5. Обнови URI:
   ```
   Разрешенные источники:
   chrome-extension://ТВОЙ_EXTENSION_ID
   
   URI перенаправления:
   https://ТВОЙ_EXTENSION_ID.chromiumapp.org/
   ```
6. Сохрани

---

## 🧪 Тестирование

### Тест 1: Регистрация через форму

1. Открой расширение (нажми на иконку)
2. Перейди на вкладку "Регистрация"
3. Заполни:
   - Имя: Test User
   - Email: test@example.com
   - Пароль: test123
   - Подтверждение: test123
4. Нажми "Зарегистрироваться"
5. ✅ Должна появиться dashboard с балансом 10,000 токенов

### Тест 2: Вход через форму

1. Закрой и открой расширение (или сделай Logout)
2. Перейди на вкладку "Вход"
3. Введи:
   - Email: test@example.com
   - Пароль: test123
4. Нажми "Войти"
5. ✅ Должен войти в dashboard

### Тест 3: Google OAuth

1. Открой расширение
2. Нажми "Войти через Google"
3. Выбери Google аккаунт
4. Разреши доступ
5. ✅ Должен войти в dashboard с Google аккаунтом

### Тест 4: Проверка баланса

1. В dashboard нажми "🔄 Обновить"
2. ✅ Баланс должен обновиться

### Тест 5: Просмотр API ключа

1. В dashboard нажми "🔑 API ключ"
2. ✅ Должен открыться модальное окно с ключом
3. Нажми "📋 Копировать"
4. ✅ Ключ скопирован в буфер обмена

### Тест 6: Открытие редактора

1. Открой любую веб-страницу (не chrome://)
2. Нажми на иконку расширения
3. Нажми "✏️ Открыть редактор"
4. ✅ Должен открыться редактор локаторов на странице

---

## 📊 Структура работы

### Схема авторизации:

```
┌─────────────────┐
│ Расширение      │
│ (popup.html)    │
└────────┬────────┘
         │
         │ 1. Ввод email/password
         │    или Google OAuth
         ▼
┌─────────────────┐
│ auth.js         │
│ (AuthManager)   │
└────────┬────────┘
         │
         │ 2. POST запрос
         │    /api/v1/auth/login
         ▼
┌─────────────────┐
│ Сервер          │
│ (auth_api.php)  │
└────────┬────────┘
         │
         │ 3. Проверка в БД
         │    users, api_keys
         ▼
┌─────────────────┐
│ PostgreSQL      │
└────────┬────────┘
         │
         │ 4. Возврат API ключа
         ▼
┌─────────────────┐
│ Chrome Storage  │
│ (сохранение)    │
└─────────────────┘
```

### Схема использования:

```
┌─────────────────┐
│ Пользователь    │
│ открывает popup │
└────────┬────────┘
         │
         ▼
    Авторизован?
    ╱          ╲
  Да            Нет
  │              │
  ▼              ▼
Dashboard    Форма входа
  │              │
  │              │ Вход/Регистрация
  │              ▼
  │          Сохранение токена
  │              │
  │◄─────────────┘
  │
  ▼
Открытие редактора
  │
  ▼
editor.js получает API ключ
  │
  ▼
Использование API с токеном
```

---

## 🔧 Конфигурация

### Файлы для редактирования:

#### 1. `auth.js` - Настройки API

```javascript
const API_CONFIG = {
    baseUrl: 'https://srv378106.hstgr.cloud',  // ← Измени на свой домен
    endpoints: {
        login: '/api/v1/auth/login',
        register: '/api/v1/auth/register',
        balance: '/api/v1/balance',
        profile: '/api/v1/profile'
    },
    googleOAuth: {
        clientId: 'YOUR_CLIENT_ID',  // ← Вставь свой Google Client ID
        redirectUrl: chrome.identity.getRedirectURL('oauth2')
    }
};
```

#### 2. `manifest.json` - OAuth настройки

```json
{
  "oauth2": {
    "client_id": "YOUR_CLIENT_ID",  // ← Вставь свой Google Client ID
    "scopes": [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile"
    ]
  }
}
```

#### 3. `auth_api.php` - Бонусные токены

```php
# Строка 202
$stmt = $this->db->prepare("
    INSERT INTO user_balances (user_id, tokens_purchased, tokens_used)
    VALUES (?, 10000, 0)  // ← Измени количество бонусных токенов
");
```

---

## 🔒 Безопасность

### Важные моменты:

1. **HTTPS обязателен** - Google OAuth работает только через HTTPS
2. **API ключи** хранятся в хешированном виде в БД
3. **Пароли** хешируются с солью
4. **CORS** настроен только для расширения
5. **Токены** хранятся в `chrome.storage.local` (зашифровано Chrome)

### Рекомендации:

```javascript
// В production используй более безопасное хеширование
// Вместо MD5 используй bcrypt или Argon2
const passwordHash = await bcrypt.hash(password, 10);
```

---

## ⚠️ Troubleshooting

### Проблема: Google OAuth не работает

**Причина:** Неверный Client ID или Extension ID

**Решение:**
1. Проверь Extension ID в `chrome://extensions/`
2. Обнови OAuth URI в Google Console
3. Обнови `clientId` в `auth.js` и `manifest.json`
4. Перезагрузи расширение

### Проблема: Ошибка CORS

**Причина:** Сервер не разрешает запросы от расширения

**Решение:**
```php
// В auth_api.php должно быть:
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

### Проблема: API ключ не сохраняется

**Причина:** Нет разрешения `storage` в manifest

**Решение:**
```json
{
  "permissions": [
    "storage",  // ← Должно быть
    ...
  ]
}
```

### Проблема: Баланс не загружается

**Причина:** Endpoint `/api/v1/balance` не настроен

**Решение:**
Используй endpoint из `index.php` или создай отдельный.

---

## 📝 Следующие шаги

После установки:

1. ✅ Протестируй все формы входа/регистрации
2. ✅ Проверь Google OAuth
3. ✅ Убедись что баланс отображается
4. ✅ Протестируй открытие редактора
5. 🔄 Реализуй endpoint `/api/v1/generate` для AI
6. 🔄 Добавь списание токенов при использовании
7. 🔄 Добавь систему пополнения баланса

---

## 🎉 Готово!

Теперь твоё расширение:
- ✅ Имеет красивый интерфейс входа/регистрации
- ✅ Поддерживает Google OAuth
- ✅ Хранит API ключи безопасно
- ✅ Синхронизируется с сервером
- ✅ Отображает баланс токенов
- ✅ Готово к интеграции с AI API

**URL админки:** https://srv378106.hstgr.cloud/admin/login.html
**Расширение установлено в Chrome!** 🚀
