// locator-modal-content.js
// \file locator-modal-content.js
// -*- coding: utf-8 -*-

/**
 * Content Script для модального окна редактора локаторов
 * =======================================================
 * Внедряет модальное окно на текущую страницу
 */

(function() {
    'use strict';

    // Проверка, не загружен ли скрипт уже
    if (window.locatorEditorLoaded) {
        console.log('[Locator Editor] Скрипт уже загружен, пропускаем повторную инициализацию');
        return;
    }
    window.locatorEditorLoaded = true;

    console.log('[Locator Editor] Инициализация content script...');

    /**
     * Конфигурация модального окна
     */
    const ModalConfig = {
        currentDomain: null,
        currentConfig: {},
        originalConfig: {},
        activeKey: null,
        isOpen: false
    };

    /**
     * Создание HTML структуры модального окна
     * Функция генерирует DOM элементы модального окна программно
     * 
     * Returns:
     *     HTMLElement: Overlay элемент с модальным окном
     */
    function createModalHTML() {
        console.log('[Locator Editor] Создание структуры модального окна...');
        
        // Создаем overlay
        const overlay = document.createElement('div');
        overlay.id = 'locator-editor-overlay';
        
        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.id = 'locator-editor-modal';
        
        // Создаем заголовок
        const header = document.createElement('div');
        header.className = 'locator-modal-header';
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'locator-modal-title';
        
        const h1 = document.createElement('h1');
        h1.textContent = '⚙️ Редактор локаторов';
        
        const h2 = document.createElement('h2');
        h2.id = 'locator-domain-name';
        h2.textContent = 'Загрузка...';
        
        titleDiv.appendChild(h1);
        titleDiv.appendChild(h2);
        
        // Создаем кнопки действий
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'locator-modal-actions';
        
        const saveBtn = createButton('locator-save-btn', '💾 Сохранить', 'Сохранить изменения');
        const exportBtn = createButton('locator-export-btn', '📥 Экспорт', 'Экспортировать конфигурацию');
        const reloadBtn = createButton('locator-reload-btn', '🔄 Сброс', 'Перезагрузить из файла');
        const closeBtn = createButton('locator-close-btn', '✕', 'Закрыть', 'locator-modal-close');
        
        actionsDiv.appendChild(saveBtn);
        actionsDiv.appendChild(exportBtn);
        actionsDiv.appendChild(reloadBtn);
        actionsDiv.appendChild(closeBtn);
        
        header.appendChild(titleDiv);
        header.appendChild(actionsDiv);
        
        // Создаем body
        const body = document.createElement('div');
        body.className = 'locator-modal-body';
        
        // Sidebar
        const sidebar = document.createElement('aside');
        sidebar.className = 'locator-sidebar';
        sidebar.id = 'locator-keys-list';
        
        const sidebarPlaceholder = document.createElement('div');
        sidebarPlaceholder.className = 'locator-editor-placeholder';
        sidebarPlaceholder.textContent = 'Загрузка локаторов...';
        sidebar.appendChild(sidebarPlaceholder);
        
        // Editor panel
        const editorPanel = document.createElement('section');
        editorPanel.className = 'locator-editor-panel';
        editorPanel.id = 'locator-editor-panel';
        
        const editorPlaceholder = document.createElement('div');
        editorPlaceholder.className = 'locator-editor-placeholder';
        const placeholderText = document.createElement('p');
        placeholderText.textContent = 'Выберите элемент из списка слева для редактирования';
        editorPlaceholder.appendChild(placeholderText);
        editorPanel.appendChild(editorPlaceholder);
        
        body.appendChild(sidebar);
        body.appendChild(editorPanel);
        
        // Создаем footer
        const footer = document.createElement('div');
        footer.className = 'locator-modal-footer';
        
        const statusBar = document.createElement('div');
        statusBar.className = 'locator-status-bar';
        
        const statusText = document.createElement('span');
        statusText.className = 'locator-status-text';
        statusText.id = 'locator-status-text';
        statusText.textContent = 'Готов к работе';
        
        statusBar.appendChild(statusText);
        footer.appendChild(statusBar);
        
        // Собираем все вместе
        modal.appendChild(header);
        modal.appendChild(body);
        modal.appendChild(footer);
        overlay.appendChild(modal);
        
        console.log('[Locator Editor] Структура модального окна создана');
        return overlay;
    }
    
    /**
     * Создание кнопки
     * Вспомогательная функция для создания кнопок
     * 
     * Args:
     *     id (string): ID кнопки
     *     text (string): Текст кнопки
     *     title (string): Подсказка
     *     className (string): Дополнительный класс
     * 
     * Returns:
     *     HTMLButtonElement: Созданная кнопка
     */
    function createButton(id, text, title, className = 'locator-modal-btn') {
        const button = document.createElement('button');
        button.id = id;
        button.className = className;
        button.title = title;
        button.textContent = text;
        return button;
    }

    /**
     * Внедрение CSS стилей на страницу
     * Функция загружает стили из файла расширения
     */
    function injectStyles() {
        if (document.getElementById('locator-modal-styles')) {
            return;
        }

        const link = document.createElement('link');
        link.id = 'locator-modal-styles';
        link.rel = 'stylesheet';
        link.href = chrome.runtime.getURL('editor.css');
        document.head.appendChild(link);
    }

    /**
     * Открытие модального окна
     * Функция создает и отображает модальное окно
     */
    async function openModal() {
        if (ModalConfig.isOpen) {
            return;
        }

        injectStyles();

        const overlay = createModalHTML();
        document.body.appendChild(overlay);
        
        ModalConfig.isOpen = true;
        document.body.style.overflow = 'hidden';

        attachEventListeners();
        await loadLocatorsForCurrentPage();
    }

    /**
     * Закрытие модального окна
     * Функция удаляет модальное окно со страницы
     */
    function closeModal() {
        const overlay = document.getElementById('locator-editor-overlay');
        if (overlay) {
            overlay.remove();
        }

        ModalConfig.isOpen = false;
        document.body.style.overflow = '';
    }

    /**
     * Подключение обработчиков событий
     * Функция назначает обработчики для всех интерактивных элементов
     */
    function attachEventListeners() {
        const closeBtn = document.getElementById('locator-close-btn');
        const saveBtn = document.getElementById('locator-save-btn');
        const exportBtn = document.getElementById('locator-export-btn');
        const reloadBtn = document.getElementById('locator-reload-btn');
        const overlay = document.getElementById('locator-editor-overlay');

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', saveConfiguration);
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', exportConfiguration);
        }

        if (reloadBtn) {
            reloadBtn.addEventListener('click', reloadConfiguration);
        }

        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeModal();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && ModalConfig.isOpen) {
                closeModal();
            }
        });
    }

    /**
     * Загрузка локаторов для текущей страницы
     * Функция получает домен и загружает соответствующие локаторы
     */
    async function loadLocatorsForCurrentPage() {
        try {
            updateStatus('Загрузка локаторов...');

            const url = new URL(window.location.href);
            const hostname = url.hostname.replace(/^www\./, '');
            
            ModalConfig.currentDomain = hostname;
            
            const domainElement = document.getElementById('locator-domain-name');
            if (domainElement) {
                domainElement.textContent = `Домен: ${hostname}`;
            }

            await loadLocatorsForDomain(hostname);
            
            updateStatus('Готов к работе', 'success');

        } catch (ex) {
            console.error('Ошибка загрузки локаторов:', ex);
            updateStatus(`Ошибка: ${ex.message}`, 'error');
        }
    }

    /**
     * Загрузка конфигурации локаторов для указанного домена
     * Функция загружает JSON файл локаторов из директории locators/
     * 
     * Args:
     *     hostname (string): Имя домена без www
     */
    async function loadLocatorsForDomain(hostname) {
        try {
            const locatorPath = `locators/${hostname}.json`;
            const locatorUrl = chrome.runtime.getURL(locatorPath);

            const response = await fetch(locatorUrl);

            if (!response.ok) {
                throw new Error(`Файл локаторов не найден: ${locatorPath}`);
            }

            const config = await response.json();
            
            ModalConfig.currentConfig = JSON.parse(JSON.stringify(config));
            ModalConfig.originalConfig = JSON.parse(JSON.stringify(config));

            renderKeysList();

        } catch (ex) {
            console.error('[Locator Editor] Ошибка загрузки конфигурации:', ex);
            
            ModalConfig.currentConfig = {};
            ModalConfig.originalConfig = {};
            
            const keysList = document.getElementById('locator-keys-list');
            if (keysList) {
                keysList.innerHTML = '';
                
                const placeholder = document.createElement('div');
                placeholder.className = 'locator-editor-placeholder';
                placeholder.style.color = '#dc3545';
                placeholder.style.padding = '20px';
                
                const title = document.createElement('p');
                title.style.margin = '0 0 8px 0';
                title.style.fontWeight = '600';
                title.textContent = 'Локаторы не найдены';
                
                const description = document.createElement('p');
                description.style.fontSize = '12px';
                description.style.margin = '0';
                
                const text1 = document.createTextNode('Файл локаторов для домена');
                const br1 = document.createElement('br');
                const domain = document.createElement('strong');
                domain.textContent = hostname;
                const br2 = document.createElement('br');
                const text2 = document.createTextNode('отсутствует в расширении');
                
                description.appendChild(text1);
                description.appendChild(br1);
                description.appendChild(domain);
                description.appendChild(br2);
                description.appendChild(text2);
                
                placeholder.appendChild(title);
                placeholder.appendChild(description);
                keysList.appendChild(placeholder);
            }
            
            throw ex;
        }
    }

    /**
     * Отрисовка списка ключей локаторов
     * Функция создает список всех ключей конфигурации в боковой панели
     */
    function renderKeysList() {
        console.log('[Locator Editor] Отрисовка списка ключей');
        
        const keysList = document.getElementById('locator-keys-list');
        if (!keysList) {
            console.error('[Locator Editor] Keys list не найден');
            return;
        }

        keysList.innerHTML = '';

        const keys = Object.keys(ModalConfig.currentConfig);

        if (keys.length === 0) {
            const placeholder = document.createElement('div');
            placeholder.className = 'locator-editor-placeholder';
            placeholder.textContent = 'Конфигурация пуста';
            keysList.appendChild(placeholder);
            return;
        }

        keys.forEach(key => {
            const keyItem = document.createElement('div');
            keyItem.className = 'locator-key-item';
            keyItem.textContent = key;
            keyItem.dataset.key = key;
            keyItem.addEventListener('click', () => showEditorForKey(key));
            keysList.appendChild(keyItem);
        });

        updateStatus(`Загружено ключей: ${keys.length}`, 'success');
        console.log(`[Locator Editor] Отрисовано ключей: ${keys.length}`);
    }

    /**
     * Отображение редактора для выбранного ключа
     * Функция создает форму редактирования для указанного ключа локатора
     * 
     * Args:
     *     key (string): Ключ локатора для редактирования
     */
    function showEditorForKey(key) {
        console.log(`[Locator Editor] Показ редактора для ключа: ${key}`);
        
        ModalConfig.activeKey = key;

        document.querySelectorAll('.locator-key-item').forEach(item => {
            item.classList.toggle('active', item.dataset.key === key);
        });

        const data = ModalConfig.currentConfig[key];
        const editorPanel = document.getElementById('locator-editor-panel');
        
        if (!editorPanel) {
            console.error('[Locator Editor] Editor panel не найден');
            return;
        }

        editorPanel.innerHTML = '';

        const formTitle = document.createElement('h2');
        formTitle.className = 'locator-form-title';
        formTitle.textContent = `Редактирование: ${key}`;
        editorPanel.appendChild(formTitle);

        const formGrid = document.createElement('div');
        formGrid.className = 'locator-form-grid';

        if (typeof data === 'string') {
            const { label, input } = createInput('value', 'Значение', data, 'text', key);
            formGrid.appendChild(label);
            formGrid.appendChild(input);
        } else {
            // Метод поиска
            const byField = createSelect('by', 'Метод поиска (By)', data.by, ['XPATH', 'CSS_SELECTOR', 'ID', 'NAME', 'CLASS_NAME', 'TAG_NAME']);
            formGrid.appendChild(byField.label);
            formGrid.appendChild(byField.select);
            
            // Селектор
            const selectorField = createTextArea('selector', 'Селектор', data.selector);
            formGrid.appendChild(selectorField.label);
            formGrid.appendChild(selectorField.textarea);
            
            // Атрибут
            const attributeField = createInput('attribute', 'Атрибут', data.attribute, 'text');
            formGrid.appendChild(attributeField.label);
            formGrid.appendChild(attributeField.input);
            
            // Стратегия
            const strategyField = createSelect('strategy_for_multiple_selectors', 'Стратегия', data.strategy_for_multiple_selectors, ['find_first_match', 'find_all_matches']);
            formGrid.appendChild(strategyField.label);
            formGrid.appendChild(strategyField.select);
            
            // Если список
            const ifListField = createSelect('if_list', 'Если список', data.if_list, ['first', 'all', 'last']);
            formGrid.appendChild(ifListField.label);
            formGrid.appendChild(ifListField.select);
            
            // Обязательный
            const mandatoryField = createCheckbox('mandatory', 'Обязательный', data.mandatory);
            formGrid.appendChild(mandatoryField.label);
            formGrid.appendChild(mandatoryField.checkbox);
            
            // Ожидаемый текст
            const textField = createInput('text_to_be_present_in_element', 'Ожидаемый текст', data.text_to_be_present_in_element || '', 'text');
            formGrid.appendChild(textField.label);
            formGrid.appendChild(textField.input);
            
            // Событие
            const eventField = createInput('event', 'Событие', data.event || '', 'text');
            formGrid.appendChild(eventField.label);
            formGrid.appendChild(eventField.input);
            
            // Ожидание события
            const timeoutEventField = createSelect('timeout_for_event', 'Ожидание события', data.timeout_for_event, ['presence_of_element_located', 'element_to_be_clickable', 'visibility_of_element_located']);
            formGrid.appendChild(timeoutEventField.label);
            formGrid.appendChild(timeoutEventField.select);
            
            // Таймаут
            const timeoutField = createInput('timeout', 'Таймаут (сек)', data.timeout, 'number');
            formGrid.appendChild(timeoutField.label);
            formGrid.appendChild(timeoutField.input);
            
            // Описание
            const descField = createTextArea('locator_description', 'Описание', data.locator_description);
            formGrid.appendChild(descField.label);
            formGrid.appendChild(descField.textarea);
        }

        editorPanel.appendChild(formGrid);
        attachFormEventListeners(key);
        updateStatus(`Редактирование: ${key}`);
    }

    /**
     * Подключение обработчиков для полей формы
     * Функция назначает обработчики изменения для всех полей редактора
     * 
     * Args:
     *     parentKey (string): Ключ редактируемого локатора
     */
    function attachFormEventListeners(parentKey) {
        const fields = document.querySelectorAll('[data-field]');
        
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

                if (typeof ModalConfig.currentConfig[parentKey] === 'object') {
                    ModalConfig.currentConfig[parentKey][fieldKey] = value;
                } else {
                    ModalConfig.currentConfig[parentKey] = value;
                }

                updateStatus('Конфигурация изменена (не сохранена)', 'error');
            });
        });
    }

    /**
     * Сохранение конфигурации
     * Функция сохраняет изменения в chrome.storage
     */
    async function saveConfiguration() {
        try {
            updateStatus('Сохранение конфигурации...');

            const storageKey = `locators_${ModalConfig.currentDomain}`;
            await chrome.storage.local.set({ [storageKey]: ModalConfig.currentConfig });

            ModalConfig.originalConfig = JSON.parse(JSON.stringify(ModalConfig.currentConfig));

            const saveBtn = document.getElementById('locator-save-btn');
            if (saveBtn) {
                saveBtn.classList.add('success');
                setTimeout(() => {
                    saveBtn.classList.remove('success');
                }, 2000);
            }

            updateStatus('Конфигурация сохранена успешно!', 'success');

            setTimeout(() => {
                updateStatus('Готов к работе', 'success');
            }, 2000);

        } catch (ex) {
            console.error('Ошибка сохранения:', ex);
            updateStatus(`Ошибка сохранения: ${ex.message}`, 'error');
        }
    }

    /**
     * Экспорт конфигурации в JSON файл
     * Функция создает и скачивает JSON файл с текущей конфигурацией
     */
    function exportConfiguration() {
        try {
            const filename = `${ModalConfig.currentDomain}_locators.json`;
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
                JSON.stringify(ModalConfig.currentConfig, null, 2)
            );
            
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute('href', dataStr);
            downloadAnchorNode.setAttribute('download', filename);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

            updateStatus('Конфигурация экспортирована', 'success');

        } catch (ex) {
            console.error('Ошибка экспорта:', ex);
            updateStatus(`Ошибка экспорта: ${ex.message}`, 'error');
        }
    }

    /**
     * Перезагрузка конфигурации
     * Функция сбрасывает изменения и загружает исходную конфигурацию
     */
    async function reloadConfiguration() {
        try {
            updateStatus('Перезагрузка конфигурации...');

            ModalConfig.currentConfig = JSON.parse(JSON.stringify(ModalConfig.originalConfig));
            
            renderKeysList();
            
            if (ModalConfig.activeKey) {
                showEditorForKey(ModalConfig.activeKey);
            } else {
                const editorPanel = document.getElementById('locator-editor-panel');
                if (editorPanel) {
                    editorPanel.innerHTML = '';
                    
                    const placeholder = document.createElement('div');
                    placeholder.className = 'locator-editor-placeholder';
                    
                    const text = document.createElement('p');
                    text.textContent = 'Выберите элемент из списка слева для редактирования';
                    
                    placeholder.appendChild(text);
                    editorPanel.appendChild(placeholder);
                }
            }

            updateStatus('Конфигурация перезагружена', 'success');

        } catch (ex) {
            console.error('Ошибка перезагрузки:', ex);
            updateStatus(`Ошибка перезагрузки: ${ex.message}`, 'error');
        }
    }

    /**
     * Обновление статусной строки
     * Функция изменяет текст и стиль статусной строки
     * 
     * Args:
     *     message (string): Текст сообщения
     *     type (string): Тип сообщения ('success', 'error', '')
     */
    function updateStatus(message, type = '') {
        const statusText = document.getElementById('locator-status-text');
        if (statusText) {
            statusText.textContent = message;
            statusText.className = 'locator-status-text' + (type ? ` ${type}` : '');
        }
    }

    // ============================================================================
    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ГЕНЕРАЦИИ HTML ПОЛЕЙ
    // ============================================================================

    function createInput(key, labelText, value, type = 'text', parentKey = null) {
        const fieldId = `locator-field-${key}`;
        
        const label = document.createElement('label');
        label.htmlFor = fieldId;
        label.textContent = labelText;
        
        const input = document.createElement('input');
        input.type = type;
        input.id = fieldId;
        input.dataset.field = key;
        if (parentKey) {
            input.dataset.parent = parentKey;
        }
        input.value = value || '';
        
        return { label, input };
    }

    function createTextArea(key, labelText, value) {
        const fieldId = `locator-field-${key}`;
        
        const label = document.createElement('label');
        label.htmlFor = fieldId;
        label.textContent = labelText;
        
        const textarea = document.createElement('textarea');
        textarea.id = fieldId;
        textarea.dataset.field = key;
        textarea.value = value || '';
        
        return { label, textarea };
    }

    function createCheckbox(key, labelText, isChecked) {
        const fieldId = `locator-field-${key}`;
        
        const label = document.createElement('label');
        label.htmlFor = fieldId;
        label.textContent = labelText;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = fieldId;
        checkbox.dataset.field = key;
        checkbox.checked = isChecked || false;
        
        return { label, checkbox };
    }

    function createSelect(key, labelText, selectedValue, options) {
        const fieldId = `locator-field-${key}`;
        
        const label = document.createElement('label');
        label.htmlFor = fieldId;
        label.textContent = labelText;
        
        const select = document.createElement('select');
        select.id = fieldId;
        select.dataset.field = key;
        
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            if (opt === selectedValue) {
                option.selected = true;
            }
            select.appendChild(option);
        });
        
        return { label, select };
    }

    // Слушатель сообщений от background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'openLocatorModal') {
            openModal();
            sendResponse({ status: 'ok' });
        }
        return true;
    });

    console.log('Locator Modal Content Script loaded');
})();
