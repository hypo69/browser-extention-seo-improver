# ✅ Финальный чеклист установки

## 📥 ШАГ 1: Скачайте все файлы

Скачайте эти 16 файлов из outputs:

### ✅ Обязательные файлы (9 штук):
- [ ] manifest.json
- [ ] background-minimal.js
- [ ] popup.html
- [ ] locator-popup.html
- [ ] locator-popup.css
- [ ] locator-popup.js
- [ ] _locales_en_messages.json
- [ ] _locales_ru_messages.json
- [ ] example_locators.json

### 📚 Документация (5 файлов - для справки):
- [ ] QUICKSTART.md (НАЧНИТЕ С ЭТОГО!)
- [ ] FIX_LOCALIZATION_ERROR.md
- [ ] README_INSTALLATION.md
- [ ] README_LOCATOR_POPUP.md
- [ ] VISUAL_STRUCTURE.md

### ⚠️ НЕ используйте (нужны для интеграции с существующим проектом):
- ❌ background.js (требует зависимости)
- ❌ menu.js (требует зависимости)

---

## 📂 ШАГ 2: Создайте структуру папок

### Windows (PowerShell):
```powershell
mkdir locator-editor-extension
cd locator-editor-extension
mkdir locators
mkdir _locales\en
mkdir _locales\ru
```

### Mac/Linux (Terminal):
```bash
mkdir -p locator-editor-extension
cd locator-editor-extension
mkdir locators
mkdir -p _locales/en
mkdir -p _locales/ru
```

---

## 📋 ШАГ 3: Разместите файлы

### В корень папки `locator-editor-extension/`:
```
locator-editor-extension/
├── manifest.json                    ← Скопируйте сюда
├── background-minimal.js            ← Скопируйте сюда
├── popup.html                       ← Скопируйте сюда
├── locator-popup.html              ← Скопируйте сюда
├── locator-popup.css               ← Скопируйте сюда
└── locator-popup.js                ← Скопируйте сюда
```

### В папку `_locales/en/`:
```
_locales/en/
└── messages.json    ← Переименуйте _locales_en_messages.json и скопируйте сюда
```

### В папку `_locales/ru/`:
```
_locales/ru/
└── messages.json    ← Переименуйте _locales_ru_messages.json и скопируйте сюда
```

### В папку `locators/`:
```
locators/
└── example.com.json    ← Переименуйте example_locators.json и скопируйте сюда
```

---

## 🔍 ШАГ 4: Проверьте структуру

Итоговая структура должна выглядеть так:

```
locator-editor-extension/
│
├── manifest.json
├── background-minimal.js
├── popup.html
├── locator-popup.html
├── locator-popup.css
├── locator-popup.js
│
├── _locales/
│   ├── en/
│   │   └── messages.json
│   └── ru/
│       └── messages.json
│
└── locators/
    └── example.com.json
```

### Команда для проверки (Windows PowerShell):
```powershell
tree /F
```

### Команда для проверки (Mac/Linux):
```bash
find . -type f | sort
```

Должны увидеть все 9 файлов на своих местах.

---

## 🚀 ШАГ 5: Загрузите расширение в Chrome

1. **Откройте Chrome**

2. **Перейдите на страницу расширений:**
   - Введите в адресной строке: `chrome://extensions/`
   - ИЛИ: Меню → Расширения → Управление расширениями

3. **Включите режим разработчика:**
   - Найдите переключатель "Режим разработчика" (Developer mode) в правом верхнем углу
   - Переключите его в положение ВКЛ

4. **Загрузите расширение:**
   - Нажмите кнопку "Загрузить распакованное расширение" (Load unpacked)
   - Выберите папку `locator-editor-extension`
   - Нажмите "Выбрать папку" (Select Folder)

5. **Проверьте установку:**
   - Расширение "SEO Improver - Locator Editor" должно появиться в списке
   - Статус должен быть "Включено" (Enabled)
   - НЕ должно быть красных ошибок

---

## ✅ ШАГ 6: Проверьте работу

### Тест 1: Контекстное меню
1. Откройте любую веб-страницу (например, example.com)
2. Кликните правой кнопкой мыши на странице
3. В контекстном меню должен появиться пункт: **"⚙️ Редактировать локаторы"**

### Тест 2: Открытие редактора
1. Кликните на пункт "⚙️ Редактировать локаторы"
2. Должно открыться popup окно 820x650px
3. В заголовке должен отображаться текущий домен
4. Слева должен быть список ключей из example.com.json

### Тест 3: Редактирование
1. Выберите любой ключ из списка (например, "name")
2. Справа должна появиться форма редактирования
3. Измените любое значение
4. Нажмите "Сохранить"
5. Должно появиться сообщение "Конфигурация сохранена успешно!"

---

## 🐛 Если что-то пошло не так

### Ошибка: "Не указан default_locale"
**Решение:** 
- Откройте `manifest.json`
- Убедитесь, что есть строка: `"default_locale": "en",`
- См. файл **FIX_LOCALIZATION_ERROR.md**

### Ошибка: "Не удалось загрузить фоновый скрипт"
**Решение:**
- Проверьте, что файл называется `background-minimal.js` (не `background.js`!)
- Проверьте, что в `manifest.json` указано: `"service_worker": "background-minimal.js"`

### Ошибка: "Locators not found"
**Решение:**
- Создайте файл локаторов для текущего домена
- Например, для example.com создайте `locators/example.com.json`
- Скопируйте структуру из `example_locators.json`

### Ошибка: "Invalid messages.json"
**Решение:**
- Проверьте, что файл называется именно `messages.json` (не `_locales_en_messages.json`)
- Проверьте, что файл находится в `_locales/en/` (не в корне!)

### Контекстное меню не появляется
**Решение:**
- Перезагрузите расширение: в `chrome://extensions/` нажмите кнопку ⟳
- Обновите страницу: F5
- Проверьте консоль Service Worker на наличие ошибок

---

## 📚 Дополнительные материалы

### Для быстрого старта:
📖 **QUICKSTART.md** - Краткая инструкция

### При ошибке локализации:
📖 **FIX_LOCALIZATION_ERROR.md** - Решение проблемы

### Для подробной установки:
📖 **README_INSTALLATION.md** - Полная инструкция

### Для понимания структуры:
📖 **VISUAL_STRUCTURE.md** - Визуальные схемы

### Для технических деталей:
📖 **README_LOCATOR_POPUP.md** - Техническая документация

---

## 🎯 Следующие шаги

После успешной установки:

### 1. Создайте файлы локаторов для ваших доменов
```bash
cd locators/
cp example.com.json yourdomain.com.json
# Отредактируйте yourdomain.com.json
```

### 2. Настройте локаторы для каждого сайта
- Откройте нужный сайт
- Кликните правой кнопкой → "⚙️ Редактировать локаторы"
- Настройте селекторы для каждого элемента

### 3. Экспортируйте конфигурацию
- После настройки нажмите "Экспорт"
- Сохраните JSON файл как backup

### 4. Поделитесь конфигурацией
- Скопируйте файлы из `locators/` в проект
- Или передайте экспортированные JSON файлы коллегам

---

## ✅ Финальный чеклист

Проверьте все пункты перед использованием:

### Структура папок:
- [ ] Создана папка `locator-editor-extension`
- [ ] Создана папка `locators`
- [ ] Создана папка `_locales/en`
- [ ] Создана папка `_locales/ru`

### Файлы в корне:
- [ ] manifest.json
- [ ] background-minimal.js
- [ ] popup.html
- [ ] locator-popup.html
- [ ] locator-popup.css
- [ ] locator-popup.js

### Файлы локализации:
- [ ] _locales/en/messages.json (переименован из _locales_en_messages.json)
- [ ] _locales/ru/messages.json (переименован из _locales_ru_messages.json)

### Файлы локаторов:
- [ ] locators/example.com.json (переименован из example_locators.json)

### Проверка manifest.json:
- [ ] Содержит `"default_locale": "en"`
- [ ] Содержит `"service_worker": "background-minimal.js"`

### Установка в Chrome:
- [ ] Расширение загружено в `chrome://extensions/`
- [ ] Включен "Режим разработчика"
- [ ] Расширение включено
- [ ] Нет красных ошибок

### Проверка работы:
- [ ] Контекстное меню показывает "⚙️ Редактировать локаторы"
- [ ] Редактор открывается при клике
- [ ] Отображается текущий домен
- [ ] Список ключей загружается
- [ ] Форма редактирования работает
- [ ] Сохранение работает

---

## 🎉 Поздравляем!

Если все пункты выполнены - редактор локаторов установлен и готов к работе!

---

## 📞 Поддержка

При возникновении проблем:
1. Проверьте консоль Service Worker: `chrome://extensions/` → "Service Worker"
2. Проверьте консоль браузера: F12 → Console
3. Сверьтесь с документацией в файлах .md
4. Убедитесь, что все файлы на своих местах

---

**Версия**: 1.0.1  
**Дата**: 2025-10-23  
**Тип**: Финальный чеклист установки  
**Статус**: Готово к использованию
