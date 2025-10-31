# 🔧 Решение проблемы загрузки расширения

## ❌ Проблемы

### Проблема 1: Не удалось загрузить фоновый скрипт
```
Ошибка загрузки
Не удалось загрузить фоновый скрипт
Не удалось загрузить манифест
```

### Проблема 2: Локализация не указана (НОВАЯ!)
```
Локализация используется, однако в манифесте не указан атрибут default_locale.
Не удалось загрузить манифест.
```

## ✅ Решение

Создана **минимальная standalone версия** расширения для редактора локаторов с поддержкой локализации.

---

## 🚀 Быстрый старт (10 минут)

### Шаг 1: Создайте структуру

```bash
mkdir locator-editor-extension
cd locator-editor-extension
mkdir locators
mkdir -p _locales/en
mkdir -p _locales/ru
```

### Шаг 2: Скопируйте файлы

#### В корень папки `locator-editor-extension/`:
- ✅ manifest.json (ОБНОВЛЕННЫЙ с default_locale!)
- ✅ background-minimal.js
- ✅ popup.html
- ✅ locator-popup.html
- ✅ locator-popup.css
- ✅ locator-popup.js

#### В папку `_locales/en/`:
- ✅ Переименуйте `_locales_en_messages.json` → `messages.json`

#### В папку `_locales/ru/`:
- ✅ Переименуйте `_locales_ru_messages.json` → `messages.json`

### Шаг 3: Создайте файлы локаторов

Скопируйте `example_locators.json` в папку `locators/`:
```bash
cp example_locators.json locators/example.com.json
```

### Шаг 4: Загрузите в Chrome

1. Откройте `chrome://extensions/`
2. Включите **"Режим разработчика"** (Developer mode)
3. Нажмите **"Загрузить распакованное"** (Load unpacked)
4. Выберите папку `locator-editor-extension`

### Шаг 5: Проверьте работу

1. Откройте любую веб-страницу
2. **Правый клик** → **"⚙️ Редактировать локаторы"**
3. Откроется окно редактора с локаторами для текущего домена

---

## 📁 Итоговая структура папки

```
locator-editor-extension/
│
├── manifest.json                 ← ОБНОВЛЕННЫЙ с default_locale!
├── background-minimal.js         ← Фоновый скрипт (БЕЗ зависимостей!)
├── popup.html                    ← Popup расширения
│
├── locator-popup.html           ← Редактор (HTML)
├── locator-popup.css            ← Редактор (CSS)
├── locator-popup.js             ← Редактор (JavaScript)
│
├── _locales/                     ← Локализация (ОБЯЗАТЕЛЬНО!)
│   ├── en/
│   │   └── messages.json        ← Английская локализация
│   └── ru/
│       └── messages.json        ← Русская локализация
│
└── locators/                     ← Папка с JSON файлами
    ├── example.com.json
    └── yourdomain.com.json
```

---

## ⚠️ КРИТИЧЕСКИ ВАЖНО!

### 1. Файл manifest.json должен содержать:

```json
{
  "manifest_version": 3,
  "name": "SEO Improver - Locator Editor",
  "version": "1.0.0",
  "description": "Редактор локаторов для SEO Improver расширения",
  "default_locale": "en",    ← ЭТА СТРОКА ОБЯЗАТЕЛЬНА!
  ...
}
```

### 2. Структура _locales обязательна:

```
_locales/
├── en/
│   └── messages.json    ← Минимум этот файл!
└── ru/
    └── messages.json    ← Опционально
```

### 3. Используйте background-minimal.js

**НЕ используйте** `background.js` из outputs - он требует другие модули!

---

## 📦 Все файлы проекта

### ✅ Обязательные для работы:

1. **manifest.json** - Обновленный с default_locale
2. **background-minimal.js** - Автономный фоновый скрипт
3. **popup.html** - Popup расширения
4. **locator-popup.html** - HTML редактора
5. **locator-popup.css** - Стили редактора
6. **locator-popup.js** - Логика редактора
7. **_locales_en_messages.json** → переименовать в `_locales/en/messages.json`
8. **_locales_ru_messages.json** → переименовать в `_locales/ru/messages.json`
9. **example_locators.json** - Пример файла локаторов

### 📚 Документация:

10. **QUICKSTART.md** - Этот файл
11. **FIX_LOCALIZATION_ERROR.md** - Решение проблемы локализации
12. **README_INSTALLATION.md** - Подробная инструкция
13. **README_LOCATOR_POPUP.md** - Техническая документация

---

## 🎯 Функционал

✅ Автоматическое определение домена текущей страницы  
✅ Загрузка соответствующего файла локаторов  
✅ Редактирование всех параметров локатора  
✅ Сохранение в chrome.storage.local  
✅ Экспорт конфигурации в JSON  
✅ Перезагрузка (отмена изменений)  
✅ Контекстное меню (правый клик)  
✅ Popup с кнопкой запуска  
✅ Поддержка локализации (EN/RU)

---

## 🔍 Отладка

### Консоль Service Worker

1. Перейдите в `chrome://extensions/`
2. Найдите расширение
3. Нажмите **"Service Worker"**
4. Смотрите логи:
   ```
   [INFO] Расширение установлено/обновлено
   [INFO] Контекстное меню создано
   [INFO] Клик по меню: edit-locators-action
   [INFO] Открытие редактора локаторов
   ```

### Если не работает

1. ✅ Проверьте `"default_locale": "en"` в manifest.json
2. ✅ Проверьте наличие папки `_locales/en/` с файлом `messages.json`
3. ✅ Проверьте имя файла: `background-minimal.js`
4. ✅ Проверьте структуру папок (все файлы в корне)
5. ✅ Перезагрузите расширение (кнопка ⟳ в `chrome://extensions/`)

---

## 📚 Дополнительная информация

### Если получаете ошибку локализации:
Читайте **[FIX_LOCALIZATION_ERROR.md](computer:///mnt/user-data/outputs/FIX_LOCALIZATION_ERROR.md)**

### Для подробных инструкций:
Читайте **[README_INSTALLATION.md](computer:///mnt/user-data/outputs/README_INSTALLATION.md)**

### Для технической документации:
Читайте **[README_LOCATOR_POPUP.md](computer:///mnt/user-data/outputs/README_LOCATOR_POPUP.md)**

---

## ✅ Финальный чеклист

Перед загрузкой расширения проверьте:

- [ ] Создана папка `locator-editor-extension`
- [ ] Скопированы все 6 файлов в корень
- [ ] Создана папка `_locales/en/` с файлом `messages.json`
- [ ] Создана папка `_locales/ru/` с файлом `messages.json`
- [ ] Создана папка `locators/` с файлом `example.com.json`
- [ ] В `manifest.json` есть строка `"default_locale": "en"`
- [ ] В `manifest.json` указано `"service_worker": "background-minimal.js"`
- [ ] Расширение загружено в `chrome://extensions/`
- [ ] Включен "Режим разработчика"
- [ ] Нет ошибок в консоли расширения

---

## 🎉 Готово!

Теперь у вас есть работающий редактор локаторов с поддержкой локализации!

**Следующий шаг**: Создайте файлы локаторов для ваших доменов в папке `locators/`

---

**Версия**: 1.0.1 (Standalone + Localization)  
**Дата**: 2025-10-23  
**Обновление**: Добавлена поддержка локализации


## 🎯 Функционал

✅ Автоматическое определение домена текущей страницы  
✅ Загрузка соответствующего файла локаторов  
✅ Редактирование всех параметров локатора  
✅ Сохранение в chrome.storage.local  
✅ Экспорт конфигурации в JSON  
✅ Перезагрузка (отмена изменений)  
✅ Контекстное меню (правый клик)  
✅ Popup с кнопкой запуска  

---

## 🔍 Отладка

### Консоль Service Worker

1. Перейдите в `chrome://extensions/`
2. Найдите расширение
3. Нажмите **"Service Worker"**
4. Смотрите логи:
   ```
   [INFO] Расширение установлено/обновлено
   [INFO] Контекстное меню создано
   [INFO] Клик по меню: edit-locators-action
   [INFO] Открытие редактора локаторов
   ```

### Если не работает

1. ✅ Проверьте имя файла: `background-minimal.js`
2. ✅ Проверьте структуру папок (все файлы в корне)
3. ✅ Проверьте папку `locators/` существует
4. ✅ Перезагрузите расширение (кнопка ⟳ в `chrome://extensions/`)

---

## 📚 Дополнительная информация

Читайте подробные инструкции:
- **README_INSTALLATION.md** - Полная инструкция по установке
- **README_LOCATOR_POPUP.md** - Техническая документация

---

## 🎉 Готово!

Теперь у вас есть работающий редактор локаторов!

**Следующий шаг**: Создайте файлы локаторов для ваших доменов в папке `locators/`

---

**Версия**: 1.0.0 (Standalone)  
**Дата**: 2025-10-23  
**Автор**: hypotez project
