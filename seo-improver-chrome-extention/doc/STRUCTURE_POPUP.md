# 📦 Структура locator-editor-popup (Popup окно)

## 📁 Назначение

Эта версия открывает **отдельное popup окно** размером 820x650px.

---

## 📂 Структура директории

```
locator-editor-popup/
│
├── manifest.json                      ← Оригинальный манифест
├── background.js                      ← Из background-minimal.js
├── popup.html                         ← Оригинальный popup
│
├── locator-popup.html                ← HTML редактора
├── locator-popup.css                 ← Стили редактора
├── locator-popup.js                  ← Логика редактора
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

### Основные файлы (6 штук):

| Скачайте из outputs | Переименуйте/поместите в |
|---------------------|--------------------------|
| manifest.json | manifest.json (как есть) |
| background-minimal.js | **background.js** |
| popup.html | popup.html (как есть) |
| locator-popup.html | locator-popup.html (как есть) |
| locator-popup.css | locator-popup.css (как есть) |
| locator-popup.js | locator-popup.js (как есть) |

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

- ✅ Отдельное popup окно 820x650px
- ✅ Работает везде (включая chrome://)
- ✅ Не требует scripting permission
- ✅ Простая конфигурация
- ✅ Стабильная работа

---

## 🚀 Команды для создания

### Windows (PowerShell):
```powershell
mkdir locator-editor-popup
cd locator-editor-popup
mkdir locators
mkdir _locales\en
mkdir _locales\ru
```

### Mac/Linux:
```bash
mkdir -p locator-editor-popup/{locators,_locales/{en,ru}}
cd locator-editor-popup
```

---

## 📋 Чеклист установки

- [ ] Создана папка `locator-editor-popup`
- [ ] Создана структура `locators`, `_locales/en`, `_locales/ru`
- [ ] Скопированы основные файлы (6 штук):
  - [ ] manifest.json
  - [ ] background-minimal.js → **background.js**
  - [ ] popup.html
  - [ ] locator-popup.html
  - [ ] locator-popup.css
  - [ ] locator-popup.js
- [ ] Скопирована локализация (2 файла):
  - [ ] _locales_en_messages.json → **_locales/en/messages.json**
  - [ ] _locales_ru_messages.json → **_locales/ru/messages.json**
- [ ] Скопированы данные (1 файл):
  - [ ] example_locators.json → **locators/example.com.json**
- [ ] Загружено в Chrome через `chrome://extensions/`
- [ ] Проверена работа

---

## ✅ Проверка

1. `chrome://extensions/` → "Загрузить распакованное"
2. Выберите папку `locator-editor-popup`
3. Правый клик на странице → "⚙️ Редактировать локаторы"
4. Должно открыться отдельное окно редактора

---

**Версия**: 1.0.1 (Popup Window)  
**Размещение**: Отдельное окно  
**Файлов**: 9 (6 основных + 2 локализация + 1 данные)
