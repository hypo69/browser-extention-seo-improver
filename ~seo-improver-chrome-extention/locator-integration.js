// locator-integration.js
// Минимальная версия с передачей URL исходной страницы

// Простая константа для ID меню
const LOCATOR_EDITOR_MENU_ID = 'open-locator-editor';

// Обработчик открытия редактора локаторов
function handleOpenLocatorEditorImpl(tab) {
    try {
        // Проверяем tab
        if (!tab || !tab.id) {
            throw new Error('Недопустимый объект вкладки');
        }

        // Проверяем наличие URL в tab
        if (!tab.url) {
            console.error('URL вкладки не доступен');
            return;
        }

        // Логируем через console вместо logger
        console.log('Открытие редактора локаторов, tabId:', tab.id, 'URL:', tab.url);

        // Получаем базовый URL редактора
        const baseEditorUrl = chrome.runtime.getURL('locator-editor/editor.html');

        // Кодируем URL исходной страницы для безопасной передачи
        const encodedSourceUrl = encodeURIComponent(tab.url);

        // Формируем полный URL с параметром исходной страницы
        const fullEditorUrl = `${baseEditorUrl}?source=${encodedSourceUrl}`;

        console.log('Открываем редактор с URL:', fullEditorUrl);

        // Открываем вкладку с параметром исходной страницы
        chrome.tabs.create({ url: fullEditorUrl }, function (newTab) {
            if (chrome.runtime.lastError) {
                console.error('Ошибка открытия вкладки:', chrome.runtime.lastError.message);
                return;
            }
            console.log('Редактор открыт, новый tabId:', newTab.id);
        });
    } catch (err) {
        console.error('Ошибка в handleOpenLocatorEditor:', String(err));
    }
}

// Функция добавления пункта меню
function addMenuItemImpl() {
    try {
        chrome.contextMenus.create({
            id: LOCATOR_EDITOR_MENU_ID,
            title: '🔍 Редактор локаторов',
            contexts: ['page']
        });
        console.log('Пункт меню редактора локаторов добавлен');
    } catch (err) {
        console.error('Ошибка добавления меню:', String(err));
    }
}

// Экспортируем API напрямую в self
self.LocatorIntegration = {
    handleOpenLocatorEditor: handleOpenLocatorEditorImpl,
    extendMenuWithLocatorEditor: addMenuItemImpl,
    LOCATOR_EDITOR: { MENU_ID: LOCATOR_EDITOR_MENU_ID }
};

console.log('Модуль LocatorIntegration загружен (с передачей URL исходной страницы)');