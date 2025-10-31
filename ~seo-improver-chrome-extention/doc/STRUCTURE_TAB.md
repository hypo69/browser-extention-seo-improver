# 📦 Структура locator-editor-tab (Модальное окно)

## 📁 Назначение

Эта версия открывает **модальное окно поверх страницы** (как overlay).

---

## 📂 Структура директории

```
locator-editor-tab/
│
├── manifest.json                      ← Из manifest-updated.json
├── background.js                      ← Из background-updated.js
├── popup.html                         ← Из popup-updated.html
├── popup.js                           ← НОВЫЙ! Обязателен!
│
├── editor.css                         ← Стили модального окна
├── editor.js                          ← Content script
├── editor.html                        ← Справочно (опционально)
│
├── _locales/
│   ├── en/
│   │   └── messages.json             ← Из _locales_en_messages.json
│   └── ru/
│       └── messages.json             ← Из _locales_ru_messages.json
│
└── locators/
    └── example.com.json              ← Из example_locators.json
```

---

## 📦 Файлы для этой директории

### Основные файлы (7 штук):

| Скачайте из outputs | Переименуйте/поместите в |
|---------------------|--------------------------|
| manifest-updated.json | **manifest.json** |
| background-updated.js | **background.js** |
| popup-updated.html | **popup.html** |
| popup.js | popup.js (как есть) ← ВАЖНО! |
| editor.css | editor.css (как есть) |
| editor.js | editor.js (как есть) |
| editor.html | editor.html (опционально) |

### Локализация (2 файла):

| Скачайте из outputs | Переименуйте/поместите в |
|---------------------|--------------------------|
| _locales_en_messages.json | **_locales/en/messages.json** |
| _locales_ru_messages.json | **_locales/ru/messages.json** |

### Данные (1 файл):

| Скачайте из outputs | Переименуйте/поместите в |
|---------------------|--------------------------|
| example_locators.json | **locators/example.com.json** |

---

## 🔑 Ключевые особенности

- ✅ Модальное окно поверх страницы
- ✅ Видна целевая страница (затемнена)
- ✅ Закрытие по ESC или клику вне окна
- ✅ Content script внедряется динамически
- ✅ Изолированное выполнение (без CSP ошибок)
- ⚠️ Не работает на chrome:// страницах

---

## 🚀 Команды для создания

### Windows (PowerShell):
```powershell
mkdir locator-editor-tab
cd locator-editor-tab
mkdir locators
mkdir _locales\en
mkdir _locales\ru
```

### Mac/Linux:
```bash
mkdir -p locator-editor-tab/{locators,_locales/{en,ru}}
cd locator-editor-tab
```

---

## 📋 Чеклист установки

- [ ] Создана папка `locator-editor-tab`
- [ ] Создана структура `locators`, `_locales/en`, `_locales/ru`
- [ ] Скопированы основные файлы (7 штук):
  - [ ] manifest-updated.json → **manifest.json**
  - [ ] background-updated.js → **background.js**
  - [ ] popup-updated.html → **popup.html**
  - [ ] popup.js (как есть) ← ОБЯЗАТЕЛЬНО!
  - [ ] editor.css (как есть)
  - [ ] editor.js (как есть)
  - [ ] editor.html (опционально)
- [ ] Скопирована локализация (2 файла):
  - [ ] _locales_en_messages.json → **_locales/en/messages.json**
  - [ ] _locales_ru_messages.json → **_locales/ru/messages.json**
- [ ] Скопированы данные (1 файл):
  - [ ] example_locators.json → **locators/example.com.json**
- [ ] Загружено в Chrome через `chrome://extensions/`
- [ ] Проверена работа

---

## ⚠️ ВАЖНО!

### Файл popup.js обязателен!

Без него popup.html не будет работать:
```
locator-editor-tab/
├── popup.html    ← Требует popup.js
└── popup.js      ← ОБЯЗАТЕЛЬНО!
```

### Используйте правильные версии!

- ✅ editor.js размером **29K** (с исправлениями CSP)
- ✅ popup-updated.html размером **1.7K** (без inline скриптов)
- ✅ background-updated.js размером **4.9K** (с ISOLATED world)

---

## ✅ Проверка

1. `chrome://extensions/` → "Загрузить распакованное"
2. Выберите папку `locator-editor-tab`
3. Откройте любую веб-страницу (example.com)
4. F12 → Console
5. Правый клик → "⚙️ Редактировать локаторы"
6. Модальное окно должно открыться поверх страницы
7. Проверьте логи:
```
✅ [Locator Editor] Инициализация content script...
✅ [Locator Editor] Создание структуры модального окна...
✅ [Locator Editor] Загрузка локаторов...
```
8. Не должно быть ошибок CSP

---

**Версия**: 1.1.1 (Modal Window + CSP Fixed)  
**Размещение**: Модальное окно на странице  
**Файлов**: 10 (7 основных + 2 локализация + 1 данные)
