# Быстрая установка авторизации - Шпаргалка ⚡

## 📦 Что нужно

**7 файлов для расширения + 1 для сервера**

---

## 🚀 Установка за 10 минут

### 1. Google OAuth (3 минуты)

```
1. console.cloud.google.com → Создать проект
2. API и сервисы → Библиотека → Включить "Google+ API"
3. Учётные данные → Создать → OAuth Client ID
4. Скопировать Client ID
```

### 2. Сервер (2 минуты)

```bash
# Загрузить auth_api.php
scp auth_api.php user@server:/var/www/html/billing-crm/

# Добавить в .htaccess:
RewriteRule ^api/v1/auth/(.*)$ auth_api.php [L]
RewriteRule ^api/v1/profile$ auth_api.php [L]

# Перезагрузить Apache
sudo systemctl restart apache2
```

### 3. Расширение (5 минут)

```javascript
// 1. Обновить auth.js (строка 14)
baseUrl: 'https://srv378106.hstgr.cloud',  // ← Твой домен

// 2. Обновить auth.js (строка 22)
clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',  // ← Google Client ID

// 3. Обновить manifest.json (строка 21)
"client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",  // ← Google Client ID
```

```
4. chrome://extensions/ → Режим разработчика
5. Загрузить распакованное расширение
6. Скопировать Extension ID
7. Обновить OAuth URI в Google Console:
   chrome-extension://EXTENSION_ID
   https://EXTENSION_ID.chromiumapp.org/
```

---

## ✅ Проверка

```bash
# Тест регистрации
curl -X POST https://srv378106.hstgr.cloud/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Должен вернуть: {"error":false,"api_key":"bcm_..."}
```

---

## 🎯 Структура файлов

```
locator-editor-pro/
├── manifest.json          ← OAuth Client ID
├── popup.html             ← Готов
├── popup.css              ← Готов
├── popup.js               ← Переименовать popup-new.js
├── auth.js                ← Базовый URL + Client ID
├── google-icon.svg        ← Готов
├── background.js          ← Твой существующий
├── editor.js              ← Твой существующий
└── editor.css             ← Твой существующий
```

---

## 🔑 Что изменить

### Только 3 места:

**1. auth.js (строка 14-22)**
```javascript
const API_CONFIG = {
    baseUrl: 'https://srv378106.hstgr.cloud',  // ← ИЗМЕНИТЬ
    ...
    googleOAuth: {
        clientId: 'YOUR_CLIENT_ID',  // ← ИЗМЕНИТЬ
```

**2. manifest.json (строка 21)**
```json
"oauth2": {
  "client_id": "YOUR_CLIENT_ID"  // ← ИЗМЕНИТЬ
```

**3. Google Console**
```
URI: chrome-extension://EXTENSION_ID  // ← ИЗМЕНИТЬ
```

---

## 📱 Использование

### Для пользователя:

```
1. Клик на иконку расширения
2. Регистрация / Вход / Google
3. Видит баланс токенов
4. Открывает редактор на странице
```

### Для админа:

```
1. Открыть админку: https://srv378106.hstgr.cloud/admin/login.html
2. Создать пользователя
3. Скопировать API ключ
4. Отправить клиенту
```

---

## 🎨 Возможности popup

| Экран | Функция |
|-------|---------|
| 🔐 Вход | Email + пароль |
| 📝 Регистрация | Имя + email + пароль |
| 🌐 Google OAuth | Вход через Google |
| 📊 Dashboard | Баланс + кнопки |
| 🔑 API ключ | Просмотр + копирование |
| ✏️ Редактор | Открытие на странице |

---

## 🧪 Быстрый тест

1. Открой расширение → Регистрация
2. Заполни форму → Зарегистрироваться
3. Видишь dashboard с балансом ✅
4. Нажми "Открыть редактор" ✅
5. Редактор открылся на странице ✅

---

## 🔧 Частые проблемы

| Проблема | Решение |
|----------|---------|
| Google OAuth не работает | Проверь Extension ID в OAuth URI |
| Баланс не загружается | Проверь `/api/v1/balance` endpoint |
| CORS ошибка | Добавь headers в auth_api.php |
| Расширение не загружается | Проверь manifest.json синтаксис |

---

## 📊 Бонусы для новых пользователей

```php
// auth_api.php, строка 202 и 295
VALUES (?, 10000, 0)  // ← 10,000 токенов в подарок
```

Можно изменить на любое количество!

---

## 🎉 Результат

После установки:
- ✅ Красивый popup с авторизацией
- ✅ Google OAuth работает
- ✅ API ключи сохраняются
- ✅ Баланс отображается
- ✅ Редактор открывается
- ✅ Готово к использованию!

**Установка завершена за 10 минут!** 🚀

---

## 📞 Что дальше?

1. Протестируй все функции
2. Реализуй AI endpoint (`/api/v1/generate`)
3. Добавь списание токенов
4. Запускай в production! 🎯
