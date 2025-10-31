// background.js
// \file background.js
// -*- coding: utf-8 -*-

/**
 * Фоновый скрипт для редактора локаторов с модальным окном
 * ==========================================================
 * Поддержка модального окна вместо popup
 */

/**
 * Простой логгер для отладки
 */
const logger = {
    debug: (...args) => console.log('[DEBUG]', ...args),
    info: (...args) => console.log('[INFO]', ...args),
    warn: (...args) => console.warn('[WARN]', ...args),
    error: (...args) => console.error('[ERROR]', ...args)
};

/**
 * Обработчик установки расширения
 * Функция создает контекстное меню при установке
 */
chrome.runtime.onInstalled.addListener(async () => {
    logger.info('Расширение установлено/обновлено');

    try {
        chrome.contextMenus.removeAll();
        
        chrome.contextMenus.create({
            id: 'edit-locators-action',
            title: '⚙️ Редактировать локаторы',
            contexts: ['page']
        });

        logger.info('Контекстное меню создано');
    } catch (ex) {
        logger.error('Ошибка создания меню:', ex);
    }
});

/**
 * Обработчик кликов по контекстному меню
 * Функция открывает модальное окно редактора
 */
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    logger.info('Клик по меню:', info.menuItemId);

    if (info.menuItemId === 'edit-locators-action') {
        await handleEditLocators(tab);
    }
});

/**
 * Обработчик открытия редактора локаторов
 * Функция внедряет content script и открывает модальное окно
 * 
 * Args:
 *     tab (Object): Объект вкладки Chrome
 */
async function handleEditLocators(tab) {
    logger.info('Открытие редактора локаторов', { tabId: tab.id, url: tab.url });

    try {
        // Проверка доступности вкладки
        if (!isTabAccessible(tab)) {
            logger.warn('Вкладка недоступна для внедрения скрипта', { url: tab.url });
            showNotification('Редактор локаторов', 'Действие недоступно на этой странице.');
            return;
        }

        // Внедрение CSS
        await chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: ['editor.css']
        });

        // Внедрение content script в изолированный мир
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['editor.js'],
            world: 'ISOLATED'  // Изолированный мир для избежания конфликтов
        });

        // Отправка сообщения для открытия модального окна
        await chrome.tabs.sendMessage(tab.id, { action: 'openLocatorModal' });

        logger.info('Модальное окно редактора открыто успешно');

    } catch (ex) {
        logger.error('Ошибка открытия редактора локаторов:', ex);
        
        // Попытка показать уведомление об ошибке
        try {
            showNotification('Ошибка', 'Не удалось открыть редактор локаторов');
        } catch (notifEx) {
            logger.error('Не удалось показать уведомление:', notifEx);
        }
    }
}

/**
 * Проверка доступности вкладки
 * Функция проверяет, можно ли внедрить скрипт на страницу
 * 
 * Args:
 *     tab (Object): Объект вкладки Chrome
 * 
 * Returns:
 *     boolean: true если вкладка доступна, false иначе
 */
function isTabAccessible(tab) {
    if (!tab || !tab.url) {
        return false;
    }

    const restrictedProtocols = ['chrome://', 'edge://', 'about:', 'chrome-extension://'];
    const isRestricted = restrictedProtocols.some(protocol => tab.url.startsWith(protocol));

    return !isRestricted;
}

/**
 * Показать уведомление
 * Функция отображает системное уведомление
 * 
 * Args:
 *     title (string): Заголовок уведомления
 *     message (string): Текст уведомления
 */
function showNotification(title, message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: title,
        message: message
    });
}

logger.info('Background script загружен (Modal version)');
