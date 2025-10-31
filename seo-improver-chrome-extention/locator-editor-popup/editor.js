// locator-modal-content.js
// \file locator-modal-content.js
// -*- coding: utf-8 -*-

/**
 * Content Script для модального окна редактора локаторов
 * =======================================================
 * Внедряет модальное окно на текущую страницу
 */

(function () {
    'use strict';

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
     * Функция генерирует DOM элементы модального окна
     * 
     * Returns:
     *     HTMLElement: Overlay элемент с модальным окном
     */
    function createModalHTML() {
        const overlay = document.createElement('div');
        overlay.id = 'locator-editor-overlay';

        overlay.innerHTML = `
            <div id="locator-editor-modal">
                <!-- Заголовок -->
                <div class="locator-modal-header">
                    <div class="locator-modal-title">
                        <h1>⚙️ Редактор локаторов</h1>
                        <h2 id="locator-domain-name">Загрузка...</h2>
                    </div>
                    <div class="locator-modal-actions">
                        <button id="locator-save-btn" class="locator-modal-btn" title="Сохранить изменения">
                            💾 Сохранить
                        </button>
                        <button id="locator-export-btn" class="locator-modal-btn" title="Экспортировать конфигурацию">
                            📥 Экспорт
                        </button>
                        <button id="locator-reload-btn" class="locator-modal-btn" title="Перезагрузить из файла">
                            🔄 Сброс
                        </button>
                        <button id="locator-close-btn" class="locator-modal-close" title="Закрыть">
                            ✕
                        </button>
                    </div>
                </div>

                <!-- Основной контент -->
                <div class="locator-modal-body">
                    <!-- Список ключей -->
                    <aside class="locator-sidebar" id="locator-keys-list">
                        <div class="locator-editor-placeholder">
                            Загрузка локаторов...
                        </div>
                    </aside>

                    <!-- Панель редактирования -->
                    <section class="locator-editor-panel" id="locator-editor-panel">
                        <div class="locator-editor-placeholder">
                            <p>Выберите элемент из списка слева для редактирования</p>
                        </div>
                    </section>
                </div>

                <!-- Футер -->
                <div class="locator-modal-footer">
                    <div class="locator-status-bar">
                        <span class="locator-status-text" id="locator-status-text">Готов к работе</span>
                    </div>
                </div>
            </div>
        `;

        return overlay;
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
            console.error('Ошибка загрузки конфигурации:', ex);

            ModalConfig.currentConfig = {};
            ModalConfig.originalConfig = {};

            const keysList = document.getElementById('locator-keys-list');
            if (keysList) {
                keysList.innerHTML = `
                    <div class="locator-editor-placeholder" style="color: #dc3545; padding: 20px;">
                        <p style="margin: 0 0 8px 0; font-weight: 600;">Локаторы не найдены</p>
                        <p style="font-size: 12px; margin: 0;">
                            Файл локаторов для домена<br>
                            <strong>${hostname}</strong><br>
                            отсутствует в расширении
                        </p>
                    </div>
                `;
            }

            throw ex;
        }
    }

    /**
     * Отрисовка списка ключей локаторов
     * Функция создает список всех ключей конфигурации в боковой панели
     */
    function renderKeysList() {
        const keysList = document.getElementById('locator-keys-list');
        if (!keysList) {
            return;
        }

        keysList.innerHTML = '';

        const keys = Object.keys(ModalConfig.currentConfig);

        if (keys.length === 0) {
            keysList.innerHTML = `
                <div class="locator-editor-placeholder">
                    Конфигурация пуста
                </div>
            `;
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
    }

    /**
     * Отображение редактора для выбранного ключа
     * Функция создает форму редактирования для указанного ключа локатора
     * 
     * Args:
     *     key (string): Ключ локатора для редактирования
     */
    function showEditorForKey(key) {
        ModalConfig.activeKey = key;

        document.querySelectorAll('.locator-key-item').forEach(item => {
            item.classList.toggle('active', item.dataset.key === key);
        });

        const data = ModalConfig.currentConfig[key];
        const editorPanel = document.getElementById('locator-editor-panel');

        if (!editorPanel) {
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
            formGrid.innerHTML = createInput('value', 'Значение', data, 'text', key);
        } else {
            formGrid.innerHTML = `
                ${createSelect('by', 'Метод поиска (By)', data.by, ['XPATH', 'CSS_SELECTOR', 'ID', 'NAME', 'CLASS_NAME', 'TAG_NAME'])}
                ${createTextArea('selector', 'Селектор', data.selector)}
                ${createInput('attribute', 'Атрибут', data.attribute, 'text')}
                ${createSelect('strategy_for_multiple_selectors', 'Стратегия', data.strategy_for_multiple_selectors, ['find_first_match', 'find_all_matches'])}
                ${createSelect('if_list', 'Если список', data.if_list, ['first', 'all', 'last'])}
                ${createCheckbox('mandatory', 'Обязательный', data.mandatory)}
                ${createInput('text_to_be_present_in_element', 'Ожидаемый текст', data.text_to_be_present_in_element || '', 'text')}
                ${createInput('event', 'Событие', data.event || '', 'text')}
                ${createSelect('timeout_for_event', 'Ожидание события', data.timeout_for_event, ['presence_of_element_located', 'element_to_be_clickable', 'visibility_of_element_located'])}
                ${createInput('timeout', 'Таймаут (сек)', data.timeout, 'number')}
                ${createTextArea('locator_description', 'Описание', data.locator_description)}
            `;
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
                    editorPanel.innerHTML = `
                        <div class="locator-editor-placeholder">
                            <p>Выберите элемент из списка слева для редактирования</p>
                        </div>
                    `;
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

    function createInput(key, label, value, type = 'text', parentKey = null) {
        const fieldId = `locator-field-${key}`;
        const dataAttr = parentKey ? `data-parent="${parentKey}"` : '';
        return `
            <label for="${fieldId}">${label}</label>
            <input type="${type}" id="${fieldId}" data-field="${key}" ${dataAttr} value="${value}">
        `;
    }

    function createTextArea(key, label, value) {
        const fieldId = `locator-field-${key}`;
        return `
            <label for="${fieldId}">${label}</label>
            <textarea id="${fieldId}" data-field="${key}">${value}</textarea>
        `;
    }

    function createCheckbox(key, label, isChecked) {
        const fieldId = `locator-field-${key}`;
        return `
            <label for="${fieldId}">${label}</label>
            <input type="checkbox" id="${fieldId}" data-field="${key}" ${isChecked ? 'checked' : ''}>
        `;
    }

    function createSelect(key, label, selectedValue, options) {
        const fieldId = `locator-field-${key}`;
        const optionsHtml = options.map(opt =>
            `<option value="${opt}" ${opt === selectedValue ? 'selected' : ''}>${opt}</option>`
        ).join('');
        return `
            <label for="${fieldId}">${label}</label>
            <select id="${fieldId}" data-field="${key}">${optionsHtml}</select>
        `;
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