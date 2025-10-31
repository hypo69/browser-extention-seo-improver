// \file menu.js
// -*- coding: utf-8 -*-

class MenuManager {
    static CONFIG = {
        LOCATOR_EDITOR_ID: 'open-locator-editor',
        ADD_COMPONENT_ID: 'add-component',
        SAVED_COMPONENTS_PARENT_ID: 'saved-components-parent',
        CLEAR_ALL_COMPONENTS_ID: 'clear-all-components',
        GENERATE_OFFER_PARENT_ID: 'generate-offer-parent',
        LANG_EN_ID: 'generate-offer-lang-en',
        LANG_RU_ID: 'generate-offer-lang-ru',
        LANG_HE_ID: 'generate-offer-lang-he'
    };
    static STORAGE_KEY = 'addedComponents';

    constructor(logger) {
        this.logger = logger;
    }

    async initialize() {
        await this.create();
    }

    async refreshMenu() {
        this.logger.debug('Обновление контекстного меню...');
        await this.create();
    }

    async create() {
        await chrome.contextMenus.removeAll();

        // 1. Редактор локаторов
        chrome.contextMenus.create({
            id: MenuManager.CONFIG.LOCATOR_EDITOR_ID,
            title: 'Редактор локаторов',
            contexts: ['page']
        });

        // 2. Добавить компонент
        chrome.contextMenus.create({
            id: MenuManager.CONFIG.ADD_COMPONENT_ID,
            title: 'Добавить компонент',
            contexts: ['page']
        });

        const { [MenuManager.STORAGE_KEY]: components = [] } = await chrome.storage.local.get(MenuManager.STORAGE_KEY);

        if (components.length > 0) {
            // Разделитель
            chrome.contextMenus.create({ id: 'separator-1', type: 'separator', contexts: ['page'] });

            // 3. Родительский пункт "Сохраненные компоненты"
            chrome.contextMenus.create({
                id: MenuManager.CONFIG.SAVED_COMPONENTS_PARENT_ID,
                title: `Сохраненные компоненты (${components.length})`,
                contexts: ['page']
            });

            // Дочерние пункты для каждого компонента
            for (const component of components) {
                const title = component.name.length > 35 ? `${component.name.substring(0, 32)}...` : component.name;
                // Родительский для конкретного компонента
                chrome.contextMenus.create({
                    id: component.id,
                    parentId: MenuManager.CONFIG.SAVED_COMPONENTS_PARENT_ID,
                    title: title,
                    contexts: ['page']
                });
                // Действие "Удалить"
                chrome.contextMenus.create({
                    id: `delete-${component.id}`,
                    parentId: component.id,
                    title: 'Удалить',
                    contexts: ['page']
                });
            }

            // 4. Очистить все компоненты
            chrome.contextMenus.create({
                id: MenuManager.CONFIG.CLEAR_ALL_COMPONENTS_ID,
                title: 'Очистить все компоненты',
                contexts: ['page']
            });

            // Разделитель
            chrome.contextMenus.create({ id: 'separator-2', type: 'separator', contexts: ['page'] });
        }


        // 5. Родительский пункт "Сформировать предложение"
        chrome.contextMenus.create({
            id: MenuManager.CONFIG.GENERATE_OFFER_PARENT_ID,
            title: 'Сформировать предложение цены',
            contexts: ['page']
        });

        // Дочерние пункты для языков
        chrome.contextMenus.create({
            id: MenuManager.CONFIG.LANG_EN_ID,
            parentId: MenuManager.CONFIG.GENERATE_OFFER_PARENT_ID,
            title: 'на Английском',
            contexts: ['page']
        });
        chrome.contextMenus.create({
            id: MenuManager.CONFIG.LANG_RU_ID,
            parentId: MenuManager.CONFIG.GENERATE_OFFER_PARENT_ID,
            title: 'на Русском',
            contexts: ['page']
        });
        chrome.contextMenus.create({
            id: MenuManager.CONFIG.LANG_HE_ID,
            parentId: MenuManager.CONFIG.GENERATE_OFFER_PARENT_ID,
            title: 'на Иврите',
            contexts: ['page']
        });

        this.logger.info('Контекстное меню создано/обновлено');
    }
}
