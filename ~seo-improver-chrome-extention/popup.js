// popup.js
// \file popup.js
// -*- coding: utf-8 -*-

/**
 * Скрипт для popup окна расширения
 * ==================================
 * Обрабатывает клик по кнопке "Открыть редактор"
 */

document.addEventListener('DOMContentLoaded', () => {
    const openEditorBtn = document.getElementById('openEditor');
    
    if (openEditorBtn) {
        openEditorBtn.addEventListener('click', async () => {
            try {
                const [activeTab] = await chrome.tabs.query({ 
                    active: true, 
                    currentWindow: true 
                });
                
                if (!activeTab) {
                    console.error('Активная вкладка не найдена');
                    return;
                }

                // Проверка доступности страницы
                if (isRestrictedPage(activeTab.url)) {
                    alert('Редактор локаторов недоступен на этой странице.\n\nОткройте обычную веб-страницу.');
                    return;
                }

                try {
                    // Попытка отправить сообщение (если скрипт уже внедрен)
                    await chrome.tabs.sendMessage(activeTab.id, { 
                        action: 'openLocatorModal' 
                    });
                } catch (err) {
                    // Если content script не загружен, загружаем его
                    console.log('Content script не загружен, внедряем...');
                    
                    await chrome.scripting.insertCSS({
                        target: { tabId: activeTab.id },
                        files: ['editor.css']
                    });
                    
                    await chrome.scripting.executeScript({
                        target: { tabId: activeTab.id },
                        files: ['editor.js'],
                        world: 'ISOLATED'  // Изолированный мир для избежания конфликтов
                    });
                    
                    // Небольшая задержка для инициализации скрипта
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                    // Повторная попытка отправить сообщение
                    await chrome.tabs.sendMessage(activeTab.id, { 
                        action: 'openLocatorModal' 
                    });
                }
                
                // Закрываем popup после успешного открытия
                window.close();
                
            } catch (ex) {
                console.error('Ошибка открытия редактора:', ex);
                alert('Не удалось открыть редактор локаторов.\n\nПроверьте консоль для деталей.');
            }
        });
    }
});

/**
 * Проверка, является ли страница ограниченной
 * Функция проверяет URL на наличие системных протоколов
 * 
 * Args:
 *     url (string): URL страницы
 * 
 * Returns:
 *     boolean: true если страница ограничена
 */
function isRestrictedPage(url) {
    if (!url) {
        return true;
    }
    
    const restrictedProtocols = [
        'chrome://',
        'edge://',
        'about:',
        'chrome-extension://',
        'chrome-devtools://'
    ];
    
    return restrictedProtocols.some(protocol => url.startsWith(protocol));
}
