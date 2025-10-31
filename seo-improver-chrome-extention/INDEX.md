# 📖 Индекс документации - Редактор локаторов

## 🎯 С чего начать?

### 👉 **НАЧНИТЕ ЗДЕСЬ:**
1. **[INSTALLATION_CHECKLIST.md](computer:///mnt/user-data/outputs/INSTALLATION_CHECKLIST.md)** ⭐ **САМОЕ ВАЖНОЕ!**
   - Пошаговая инструкция установки
   - Полный чеклист всех действий
   - Проверка правильности установки

2. **[QUICKSTART.md](computer:///mnt/user-data/outputs/QUICKSTART.md)** 🚀
   - Быстрый старт за 10 минут
   - Решение обеих ошибок
   - Краткая справка

---

## 📂 Файлы для установки (9 штук)

### ✅ Обязательные файлы:

1. **[manifest.json](computer:///mnt/user-data/outputs/manifest.json)** - Конфигурация расширения
   - Содержит `"default_locale": "en"` ← ВАЖНО!
   - Указывает `background-minimal.js` как service worker

2. **[background-minimal.js](computer:///mnt/user-data/outputs/background-minimal.js)** - Фоновый скрипт
   - БЕЗ внешних зависимостей
   - Создает контекстное меню
   - Обрабатывает клики и открывает редактор

3. **[popup.html](computer:///mnt/user-data/outputs/popup.html)** - Popup расширения
   - Всплывающее окно при клике на иконку
   - Кнопка "Открыть редактор"

4. **[locator-popup.html](computer:///mnt/user-data/outputs/locator-popup.html)** - HTML редактора
   - Структура интерфейса редактора
   - Список ключей + форма редактирования

5. **[locator-popup.css](computer:///mnt/user-data/outputs/locator-popup.css)** - Стили редактора
   - Дизайн окна 820x650px
   - Адаптивная сетка

6. **[locator-popup.js](computer:///mnt/user-data/outputs/locator-popup.js)** - Логика редактора
   - Получение URL текущей страницы
   - Загрузка/сохранение локаторов
   - Редактирование и экспорт

7. **[_locales_en_messages.json](computer:///mnt/user-data/outputs/_locales_en_messages.json)** → `_locales/en/messages.json`
   - Английская локализация
   - ПЕРЕИМЕНОВАТЬ и поместить в `_locales/en/`

8. **[_locales_ru_messages.json](computer:///mnt/user-data/outputs/_locales_ru_messages.json)** → `_locales/ru/messages.json`
   - Русская локализация
   - ПЕРЕИМЕНОВАТЬ и поместить в `_locales/ru/`

9. **[example_locators.json](computer:///mnt/user-data/outputs/example_locators.json)** → `locators/example.com.json`
   - Пример файла локаторов
   - ПЕРЕИМЕНОВАТЬ и поместить в `locators/`

---

## 📚 Документация (6 файлов)

### 🆘 Решение проблем:

1. **[FIX_LOCALIZATION_ERROR.md](computer:///mnt/user-data/outputs/FIX_LOCALIZATION_ERROR.md)** 🔥
   - Решение ошибки "Локализация не указана"
   - Как создать структуру `_locales`
   - Варианты с локализацией и без

2. **[README_INSTALLATION.md](computer:///mnt/user-data/outputs/README_INSTALLATION.md)**
   - Подробная инструкция по установке
   - Интеграция с существующим проектом
   - Частые ошибки и решения

### 📖 Справочные материалы:

3. **[VISUAL_STRUCTURE.md](computer:///mnt/user-data/outputs/VISUAL_STRUCTURE.md)** 🎨
   - Визуальные схемы структуры
   - ASCII-диаграммы работы
   - Схемы потоков данных

4. **[README_LOCATOR_POPUP.md](computer:///mnt/user-data/outputs/README_LOCATOR_POPUP.md)** 🔧
   - Техническая документация
   - API и функции
   - Структура локаторов

5. **[INSTALLATION_CHECKLIST.md](computer:///mnt/user-data/outputs/INSTALLATION_CHECKLIST.md)** ✅
   - Полный чеклист установки
   - Пошаговые инструкции
   - Проверка корректности

6. **INDEX.md** - Этот файл
   - Навигация по документации
   - Список всех файлов
   - Рекомендации по чтению

---

## ❌ Файлы НЕ для standalone версии

### ⚠️ Эти файлы требуют зависимости:

1. **[background.js](computer:///mnt/user-data/outputs/background.js)** ❌
   - Требует: logger.js, ui-manager.js, gemini.js, handlers.js, menu.js
   - Используйте только для интеграции с полным проектом

2. **[menu.js](computer:///mnt/user-data/outputs/menu.js)** ❌
   - Требует: logger.js
   - Используйте только для интеграции с полным проектом

---

## 🗺️ Рекомендуемый порядок чтения

### Для быстрой установки:
```
1. INSTALLATION_CHECKLIST.md  ← Начните здесь!
2. QUICKSTART.md              ← Если нужно быстро
3. FIX_LOCALIZATION_ERROR.md  ← При ошибке локализации
```

### Для полного понимания:
```
1. INSTALLATION_CHECKLIST.md  ← Установка
2. VISUAL_STRUCTURE.md        ← Понимание структуры
3. README_LOCATOR_POPUP.md    ← Техническая документация
4. README_INSTALLATION.md     ← Дополнительные детали
```

### При возникновении ошибок:
```
1. FIX_LOCALIZATION_ERROR.md  ← Ошибка локализации
2. INSTALLATION_CHECKLIST.md  ← Проверка установки
3. README_INSTALLATION.md     ← Решение других проблем
```

---

## 🎯 Частые вопросы

### ❓ Какой файл background использовать?
**Ответ:** Только **background-minimal.js**! Файл background.js требует другие модули проекта.

### ❓ Нужна ли папка _locales?
**Ответ:** Да! Обязательно создайте `_locales/en/messages.json`, иначе будет ошибка.

### ❓ Где хранятся локаторы?
**Ответ:** В папке `locators/` с именем файла `{domain}.json` (например, `example.com.json`)

### ❓ Как добавить локаторы для нового домена?
**Ответ:** Создайте файл `locators/{domain}.json`, скопируйте структуру из `example_locators.json`

### ❓ Где искать ошибки?
**Ответ:** 
- Service Worker консоль: `chrome://extensions/` → "Service Worker"
- Консоль браузера: F12 → Console

---

## 📊 Структура установки

```
locator-editor-extension/
│
├── manifest.json                    ← 1. Конфигурация
├── background-minimal.js            ← 2. Фоновый скрипт
├── popup.html                       ← 3. Popup
│
├── locator-popup.html              ← 4. HTML редактора
├── locator-popup.css               ← 5. Стили
├── locator-popup.js                ← 6. Логика
│
├── _locales/                        ← 7. Локализация (ОБЯЗАТЕЛЬНО!)
│   ├── en/
│   │   └── messages.json           ← Английский
│   └── ru/
│       └── messages.json           ← Русский
│
└── locators/                        ← 8. Файлы локаторов
    └── example.com.json            ← Пример
```

---

## ✅ Чеклист перед началом

Убедитесь, что у вас есть:

- [ ] Все 9 обязательных файлов скачаны
- [ ] Прочитан INSTALLATION_CHECKLIST.md
- [ ] Создана структура папок
- [ ] Файлы размещены по правильным местам
- [ ] Файлы _locales переименованы в messages.json
- [ ] Файл example_locators переименован в example.com.json
- [ ] Chrome открыт на странице chrome://extensions/
- [ ] Включен "Режим разработчика"

---

## 🚀 Быстрый старт (команды)

### Windows (PowerShell):
```powershell
mkdir locator-editor-extension
cd locator-editor-extension
mkdir locators
mkdir _locales\en
mkdir _locales\ru

# Скопируйте файлы по местам (см. INSTALLATION_CHECKLIST.md)

# Загрузите в Chrome: chrome://extensions/ → Load unpacked
```

### Mac/Linux (Terminal):
```bash
mkdir -p locator-editor-extension/{locators,_locales/{en,ru}}
cd locator-editor-extension

# Скопируйте файлы по местам (см. INSTALLATION_CHECKLIST.md)

# Загрузите в Chrome: chrome://extensions/ → Load unpacked
```

---

## 📞 Поддержка

### При возникновении проблем:

1. **Проверьте чеклист:** INSTALLATION_CHECKLIST.md
2. **Читайте ошибки:** Service Worker консоль
3. **Смотрите решения:** FIX_LOCALIZATION_ERROR.md
4. **Сверьтесь со структурой:** VISUAL_STRUCTURE.md

---

## 🎉 Готово!

После выполнения всех шагов из INSTALLATION_CHECKLIST.md у вас будет работающий редактор локаторов.

**Следующий шаг:** Создайте файлы локаторов для ваших доменов в папке `locators/`

---

## 📝 Метаданные

**Проект:** SEO Improver - Locator Editor  
**Версия:** 1.0.1 (Standalone + Localization)  
**Дата:** 2025-10-23  
**Всего файлов:** 17 (9 для установки + 6 документации + 2 для интеграции)  
**Автор:** hypotez project

---

## 🔗 Быстрые ссылки

### 🚨 Начните здесь:
- **[INSTALLATION_CHECKLIST.md](computer:///mnt/user-data/outputs/INSTALLATION_CHECKLIST.md)** ⭐⭐⭐

### 📦 Файлы для установки:
- [manifest.json](computer:///mnt/user-data/outputs/manifest.json)
- [background-minimal.js](computer:///mnt/user-data/outputs/background-minimal.js)
- [popup.html](computer:///mnt/user-data/outputs/popup.html)
- [locator-popup.html](computer:///mnt/user-data/outputs/locator-popup.html)
- [locator-popup.css](computer:///mnt/user-data/outputs/locator-popup.css)
- [locator-popup.js](computer:///mnt/user-data/outputs/locator-popup.js)
- [_locales_en_messages.json](computer:///mnt/user-data/outputs/_locales_en_messages.json)
- [_locales_ru_messages.json](computer:///mnt/user-data/outputs/_locales_ru_messages.json)
- [example_locators.json](computer:///mnt/user-data/outputs/example_locators.json)

### 📚 Документация:
- [QUICKSTART.md](computer:///mnt/user-data/outputs/QUICKSTART.md) 🚀
- [FIX_LOCALIZATION_ERROR.md](computer:///mnt/user-data/outputs/FIX_LOCALIZATION_ERROR.md) 🔥
- [VISUAL_STRUCTURE.md](computer:///mnt/user-data/outputs/VISUAL_STRUCTURE.md) 🎨
- [README_LOCATOR_POPUP.md](computer:///mnt/user-data/outputs/README_LOCATOR_POPUP.md) 🔧
- [README_INSTALLATION.md](computer:///mnt/user-data/outputs/README_INSTALLATION.md) 📖
