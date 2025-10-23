document.addEventListener('DOMContentLoaded', () => {

    // ВАШ ИСХОДНЫЙ СЛОВАРЬ
    const initialConfig = {
        "supplier_prefix": "ivory.co.il",
        "default_image_url": { "attribute": "src", "by": "XPATH", "selector": "//img[@id = 'img_zoom_inout']", "strategy_for_multiple_selectors": "find_first_match", "if_list": "first", "mandatory": false, "text_to_be_present_in_element": "", "event": null, "timeout_for_event": "presence_of_element_located", "timeout": 0, "locator_description": "URL главного изображения товара ivory.co.il" },
        "name": { "attribute": "innerText", "by": "XPATH", "selector": "//h1[@id = 'titleProd']", "strategy_for_multiple_selectors": "find_first_match", "if_list": "first", "mandatory": false, "text_to_be_present_in_element": "", "event": null, "timeout_for_event": "presence_of_element_located", "timeout": 0, "locator_description": "prestaShop: название товара ivory.co.il" },
        "description_short": { "attribute": "innerText", "by": "XPATH", "selector": "//h2[ contains( @class, 'col-12 h2fake')]", "strategy_for_multiple_selectors": "find_first_match", "if_list": "first", "mandatory": false, "text_to_be_present_in_element": "", "event": null, "timeout_for_event": "presence_of_element_located", "timeout": 0, "locator_description": "prestaShop: краткое описание товара ivory.co.il" },
        "specification": { "attribute": "innerText", "by": "XPATH", "selector": "//div[ contains( @class, 'contentproducttable') or contains( @class, 'product-params')]//ul", "strategy_for_multiple_selectors": "find_first_match", "if_list": "first", "mandatory": false, "text_to_be_present_in_element": "", "event": null, "timeout_for_event": "presence_of_element_located", "timeout": 0, "locator_description": "prestaShop: характеристики товара ivory.co.il" },
        "summary": { "attribute": "innerHTML", "by": "XPATH", "selector": "//div[contains(@data-a-expander-name , 'product_overview')]//table", "strategy_for_multiple_selectors": "find_first_match", "if_list": "first", "mandatory": false, "event": null, "timeout_for_event": "presence_of_element_located", "timeout": 0, "locator_description": "сводка/краткие характеристики ivory.co.il" },
        "description": { "attribute": "innerText", "by": "XPATH", "selector": "//div[@id='productDescription']", "strategy_for_multiple_selectors": "find_first_match", "if_list": "first", "mandatory": false, "event": null, "timeout_for_event": "presence_of_element_located", "timeout": 0, "locator_description": "полное описание товара (дополнительно) ivory.co.il" }
    };

    // Переменная для хранения текущей конфигурации
    let currentConfig = {};

    // Получаем ссылки на DOM-элементы
    const keysList = document.getElementById('keys-list');
    const editorPanel = document.getElementById('editor-panel');
    const saveBtn = document.getElementById('save-btn');
    const exportBtn = document.getElementById('export-btn');

    // --- ОСНОВНЫЕ ФУНКЦИИ ---

    /**
     * Загружает конфигурацию. В реальном расширении здесь будет chrome.storage.sync.get
     */
    function loadConfig() {
        // Для примера, мы просто используем начальный объект.
        // Чтобы сделать сохранение постоянным, раскомментируйте код ниже
        /*
        chrome.storage.sync.get('locatorConfig', (data) => {
            if (data.locatorConfig) {
                currentConfig = data.locatorConfig;
            } else {
                currentConfig = JSON.parse(JSON.stringify(initialConfig)); // Глубокое копирование
            }
            renderKeyList();
        });
        */
        currentConfig = JSON.parse(JSON.stringify(initialConfig));
        renderKeyList();
    }

    /**
     * Сохраняет текущую конфигурацию. В реальном расширении будет chrome.storage.sync.set
     */
    function saveConfig() {
        /*
        chrome.storage.sync.set({ locatorConfig: currentConfig }, () => {
            alert('Конфигурация сохранена!');
        });
        */
        console.log('Сохраненная конфигурация:', currentConfig);
        alert('Конфигурация сохранена! (в консоли)');
    }

    /**
     * Экспортирует конфигурацию в JSON файл
     */
    function exportConfig() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentConfig, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "locator_config.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }


    /**
     * Отрисовывает список ключей в левой панели
     */
    function renderKeyList() {
        keysList.innerHTML = '';
        for (const key in currentConfig) {
            const item = document.createElement('div');
            item.className = 'key-item';
            item.textContent = key;
            item.dataset.key = key;
            item.addEventListener('click', () => showEditorForKey(key));
            keysList.appendChild(item);
        }
    }

    /**
     * Показывает форму редактора для выбранного ключа
     * @param {string} key - Ключ из объекта currentConfig
     */
    function showEditorForKey(key) {
        // Подсветка активного элемента в списке
        document.querySelectorAll('.key-item').forEach(item => {
            item.classList.toggle('active', item.dataset.key === key);
        });

        const data = currentConfig[key];
        editorPanel.innerHTML = ''; // Очищаем панель

        const formTitle = document.createElement('h2');
        formTitle.className = 'form-title';
        formTitle.textContent = `Редактирование: ${key}`;
        editorPanel.appendChild(formTitle);

        const formGrid = document.createElement('div');
        formGrid.className = 'form-grid';

        // Особый случай для supplier_prefix (простое текстовое поле)
        if (typeof data === 'string') {
            formGrid.innerHTML = `
                <label for="field-supplier_prefix">Значение</label>
                <input type="text" id="field-supplier_prefix" data-key="${key}" value="${data}">
            `;
        } else { // Рендеринг стандартной формы для объекта-локатора
            formGrid.innerHTML = `
                ${createSelect('by', 'Метод поиска (By)', data.by, ['XPATH', 'CSS_SELECTOR', 'ID', 'NAME', 'CLASS_NAME', 'TAG_NAME'])}
                ${createTextArea('selector', 'Селектор', data.selector)}
                ${createInput('attribute', 'Атрибут элемента', data.attribute)}
                ${createSelect('strategy_for_multiple_selectors', 'Стратегия', data.strategy_for_multiple_selectors, ['find_first_match', 'find_all_matches'])}
                ${createSelect('if_list', 'Если список', data.if_list, ['first', 'all', 'last'])}
                ${createCheckbox('mandatory', 'Обязательный', data.mandatory)}
                ${createInput('text_to_be_present_in_element', 'Ожидаемый текст', data.text_to_be_present_in_element)}
                ${createInput('event', 'Событие (event)', data.event || '')}
                ${createSelect('timeout_for_event', 'Ожидание события', data.timeout_for_event, ['presence_of_element_located', 'element_to_be_clickable', 'visibility_of_element_located'])}
                ${createInput('timeout', 'Таймаут (сек)', data.timeout, 'number')}
                ${createTextArea('locator_description', 'Описание локатора', data.locator_description)}
            `;
        }

        editorPanel.appendChild(formGrid);

        // Навешиваем обработчики событий на созданные поля
        addEventListenersToForm(key);
    }

    /**
     * Добавляет обработчики событий для полей формы для обновления currentConfig
     * @param {string} parentKey - Родительский ключ (name, description и т.д.)
     */
    function addEventListenersToForm(parentKey) {
        const fields = editorPanel.querySelectorAll('[data-field]');
        fields.forEach(field => {
            const fieldKey = field.dataset.field;
            const eventType = (field.type === 'checkbox' || field.tagName === 'SELECT') ? 'change' : 'input';

            field.addEventListener(eventType, (e) => {
                let value = e.target.value;
                if (e.target.type === 'checkbox') {
                    value = e.target.checked;
                } else if (e.target.type === 'number') {
                    value = parseFloat(value) || 0;
                }

                if (typeof currentConfig[parentKey] === 'object') {
                    currentConfig[parentKey][fieldKey] = value;
                } else {
                    currentConfig[parentKey] = value; // Для простых полей типа supplier_prefix
                }
            });
        });
    }

    // --- Вспомогательные функции для генерации HTML полей ---

    function createInput(key, label, value, type = 'text') {
        return `
            <label for="field-${key}">${label}</label>
            <input type="${type}" id="field-${key}" data-field="${key}" value="${value}">
        `;
    }

    function createTextArea(key, label, value) {
        return `
            <label for="field-${key}">${label}</label>
            <textarea id="field-${key}" data-field="${key}">${value}</textarea>
        `;
    }

    function createCheckbox(key, label, isChecked) {
        return `
            <label for="field-${key}">${label}</label>
            <input type="checkbox" id="field-${key}" data-field="${key}" ${isChecked ? 'checked' : ''}>
        `;
    }

    function createSelect(key, label, selectedValue, options) {
        const optionsHtml = options.map(opt =>
            `<option value="${opt}" ${opt === selectedValue ? 'selected' : ''}>${opt}</option>`
        ).join('');
        return `
            <label for="field-${key}">${label}</label>
            <select id="field-${key}" data-field="${key}">${optionsHtml}</select>
        `;
    }

    // --- Инициализация ---
    saveBtn.addEventListener('click', saveConfig);
    exportBtn.addEventListener('click', exportConfig);
    loadConfig();
});