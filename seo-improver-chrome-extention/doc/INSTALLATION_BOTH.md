# 🚀 Пошаговая установка обеих версий

## 📋 Содержание

1. [Подготовка](#подготовка)
2. [Установка locator-editor-popup](#установка-locator-editor-popup)
3. [Установка locator-editor-tab](#установка-locator-editor-tab)
4. [Проверка работы](#проверка-работы)

---

## 📁 Подготовка

### Шаг 1: Создайте обе директории

#### Windows (PowerShell):
```powershell
# Создайте главную папку
mkdir locator-editors
cd locator-editors

# Создайте popup версию
mkdir locator-editor-popup\locators
mkdir locator-editor-popup\_locales\en
mkdir locator-editor-popup\_locales\ru

# Создайте tab версию
mkdir locator-editor-tab\locators
mkdir locator-editor-tab\_locales\en
mkdir locator-editor-tab\_locales\ru
```

#### Mac/Linux:
```bash
# Создайте главную папку
mkdir locator-editors
cd locator-editors

# Создайте popup версию
mkdir -p locator-editor-popup/{locators,_locales/{en,ru}}

# Создайте tab версию
mkdir -p locator-editor-tab/{locators,_locales/{en,ru}}
```

### Шаг 2: Проверьте структуру

```
locator-editors/
├── locator-editor-popup/
│   ├── locators/
│   └── _locales/
│       ├── en/
│       └── ru/
│
└── locator-editor-tab/
    ├── locators/
    └── _locales/
        ├── en/
        └── ru/
```

---

## 🔵 Установка locator-editor-popup

### Файлы для popup версии (9 штук)

#### В корень `locator-editor-popup/`:

| № | Файл из outputs | Действие | Итоговое имя |
|---|-----------------|----------|--------------|
| 1 | manifest.json | Скопировать как есть | manifest.json |
| 2 | background-minimal.js | **Переименовать** | **background.js** |
| 3 | popup.html | Скопировать как есть | popup.html |
| 4 | locator-popup.html | Скопировать как есть | locator-popup.html |
| 5 | locator-popup.css | Скопировать как есть | locator-popup.css |
| 6 | locator-popup.js | Скопировать как есть | locator-popup.js |

#### В `locator-editor-popup/_locales/en/`:

| № | Файл из outputs | Действие | Итоговое имя |
|---|-----------------|----------|--------------|
| 7 | _locales_en_messages.json | **Переименовать** | **messages.json** |

#### В `locator-editor-popup/_locales/ru/`:

| № | Файл из outputs | Действие | Итоговое имя |
|---|-----------------|----------|--------------|
| 8 | _locales_ru_messages.json | **Переименовать** | **messages.json** |

#### В `locator-editor-popup/locators/`:

| № | Файл из outputs | Действие | Итоговое имя |
|---|-----------------|----------|--------------|
| 9 | example_locators.json | **Переименовать** | **example.com.json** |

### Итоговая структура locator-editor-popup:

```
locator-editor-popup/
├── manifest.json
├── background.js              ← Из background-minimal.js
├── popup.html
├── locator-popup.html
├── locator-popup.css
├── locator-popup.js
├── _locales/
│   ├── en/
│   │   └── messages.json      ← Из _locales_en_messages.json
│   └── ru/
│       └── messages.json      ← Из _locales_ru_messages.json
└── locators/
    └── example.com.json       ← Из example_locators.json
```

### Команда для проверки (опционально):

```bash
cd locator-editor-popup
find . -type f | sort
```

Должны увидеть 9 файлов.

---

## 🟢 Установка locator-editor-tab

### Файлы для tab версии (10 штук)

#### В корень `locator-editor-tab/`:

| № | Файл из outputs | Действие | Итоговое имя |
|---|-----------------|----------|--------------|
| 1 | manifest-updated.json | **Переименовать** | **manifest.json** |
| 2 | background-updated.js | **Переименовать** | **background.js** |
| 3 | popup-updated.html | **Переименовать** | **popup.html** |
| 4 | popup.js | Скопировать как есть | popup.js |
| 5 | editor.css | Скопировать как есть | editor.css |
| 6 | editor.js | Скопировать как есть | editor.js |
| 7 | editor.html | Скопировать как есть (опционально) | editor.html |

#### В `locator-editor-tab/_locales/en/`:

| № | Файл из outputs | Действие | Итоговое имя |
|---|-----------------|----------|--------------|
| 8 | _locales_en_messages.json | **Переименовать** | **messages.json** |

#### В `locator-editor-tab/_locales/ru/`:

| № | Файл из outputs | Действие | Итоговое имя |
|---|-----------------|----------|--------------|
| 9 | _locales_ru_messages.json | **Переименовать** | **messages.json** |

#### В `locator-editor-tab/locators/`:

| № | Файл из outputs | Действие | Итоговое имя |
|---|-----------------|----------|--------------|
| 10 | example_locators.json | **Переименовать** | **example.com.json** |

### Итоговая структура locator-editor-tab:

```
locator-editor-tab/
├── manifest.json              ← Из manifest-updated.json
├── background.js              ← Из background-updated.js
├── popup.html                 ← Из popup-updated.html
├── popup.js                   ← ОБЯЗАТЕЛЬНО!
├── editor.css
├── editor.js
├── editor.html                ← Опционально
├── _locales/
│   ├── en/
│   │   └── messages.json      ← Из _locales_en_messages.json
│   └── ru/
│       └── messages.json      ← Из _locales_ru_messages.json
└── locators/
    └── example.com.json       ← Из example_locators.json
```

### Команда для проверки (опционально):

```bash
cd locator-editor-tab
find . -type f | sort
```

Должны увидеть 10 файлов (или 9 если не добавили editor.html).

---

## ✅ Проверка работы

### Загрузка в Chrome

#### 1. Откройте страницу расширений:
```
chrome://extensions/
```

#### 2. Включите режим разработчика:
Переключите "Developer mode" в правом верхнем углу

#### 3. Загрузите popup версию:
- Нажмите "Load unpacked" (Загрузить распакованное)
- Выберите папку `locator-editor-popup`
- Расширение должно появиться в списке

#### 4. Загрузите tab версию:
- Снова нажмите "Load unpacked"
- Выберите папку `locator-editor-tab`
- Второе расширение должно появиться в списке

Теперь у вас **два расширения** в списке!

---

### Тестирование popup версии

1. Откройте **любую страницу** (включая chrome://)
2. **Правый клик** → "⚙️ Редактировать локаторы"
3. Должно открыться **отдельное окно** редактора
4. Размер окна: **820x650px**
5. Проверьте:
   - ✅ Список ключей слева
   - ✅ Форма редактирования справа
   - ✅ Кнопки "Сохранить", "Экспорт", "Перезагрузить"

---

### Тестирование tab версии

1. Откройте **обычную веб-страницу** (example.com)
   - ⚠️ НЕ открывайте chrome:// страницы!
2. Нажмите **F12** → Console (для просмотра логов)
3. **Правый клик** → "⚙️ Редактировать локаторы"
4. Должно открыться **модальное окно поверх страницы**
5. Проверьте логи в консоли:
```
✅ [Locator Editor] Инициализация content script...
✅ [Locator Editor] Создание структуры модального окна...
✅ [Locator Editor] Загрузка локаторов...
```
6. Проверьте функции:
   - ✅ Затемнение фона
   - ✅ Модальное окно по центру
   - ✅ Закрытие по ESC
   - ✅ Закрытие кликом вне окна
   - ✅ Список ключей и форма работают

---

## 🆚 Сравнение в работе

### Popup версия:
```
1. Правый клик
2. "⚙️ Редактировать локаторы"
3. Открывается отдельное окно 820x650px
4. Работает везде, включая chrome://
```

### Tab версия:
```
1. Правый клик (на обычной странице)
2. "⚙️ Редактировать локаторы"
3. Открывается модальное окно поверх страницы
4. Видна целевая страница (затемнена)
5. Не работает на chrome:// страницах
```

---

## ⚠️ Частые ошибки

### Popup версия

#### Ошибка: "Локализация не указана"
**Причина:** Отсутствует `default_locale` в manifest.json  
**Решение:** Убедитесь, что используете правильный manifest.json

#### Ошибка: "Background script не загружается"
**Причина:** Неправильное имя файла  
**Решение:** Файл должен называться `background.js`, а не `background-minimal.js`

### Tab версия

#### Ошибка: "popup.html не работает"
**Причина:** Отсутствует файл popup.js  
**Решение:** Обязательно добавьте popup.js в корень директории!

#### Ошибка: "Refused to execute inline script..."
**Причина:** Используется старая версия файлов  
**Решение:** Скачайте обновленные файлы:
- editor.js (29K)
- popup-updated.html (1.7K)
- background-updated.js (4.9K)

#### Ошибка: "Не работает на странице"
**Причина:** Попытка открыть на chrome:// странице  
**Решение:** Откройте обычную веб-страницу (example.com)

---

## 📊 Финальный чеклист

### locator-editor-popup:
- [ ] Создана структура папок
- [ ] Скопированы 6 основных файлов
- [ ] background-minimal.js → background.js
- [ ] Скопированы 2 файла локализации
- [ ] _locales_*_messages.json → messages.json
- [ ] Скопирован файл данных
- [ ] example_locators.json → example.com.json
- [ ] Загружено в Chrome
- [ ] Протестировано - открывается отдельное окно

### locator-editor-tab:
- [ ] Создана структура папок
- [ ] Скопированы 7 основных файлов (включая popup.js!)
- [ ] manifest-updated.json → manifest.json
- [ ] background-updated.js → background.js
- [ ] popup-updated.html → popup.html
- [ ] popup.js скопирован
- [ ] Скопированы 2 файла локализации
- [ ] Скопирован файл данных
- [ ] Загружено в Chrome
- [ ] Протестировано на обычной странице
- [ ] Модальное окно открывается
- [ ] Нет ошибок CSP в консоли

---

## 🎉 Готово!

Теперь у вас установлены **обе версии** редактора локаторов:

| Версия | Для чего использовать |
|--------|----------------------|
| **locator-editor-popup** | Для работы на chrome:// страницах и когда нужно отдельное окно |
| **locator-editor-tab** | Для работы на обычных страницах с визуальным контекстом |

Можете использовать обе версии параллельно в зависимости от задачи!

---

**Дата**: 2025-10-23  
**Статус**: Обе версии установлены и готовы к работе ✅
