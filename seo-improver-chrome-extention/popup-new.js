// popup.js
// \file popup.js
// -*- coding: utf-8 -*-

/**
 * Скрипт для popup окна расширения с авторизацией
 * ================================================
 * 
 * Модуль управляет:
 * - Экранами входа/регистрации/dashboard
 * - Формами входа и регистрации
 * - Google OAuth
 * - Отображением баланса
 * - Открытием редактора локаторов
 */

/**
 * DOM элементы
 */
const elements = {
    // Экраны
    loadingScreen: document.getElementById('loadingScreen'),
    authScreen: document.getElementById('authScreen'),
    dashboardScreen: document.getElementById('dashboardScreen'),

    // Табы
    tabs: document.querySelectorAll('.tab'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),

    // Формы
    loginFormElement: document.getElementById('loginFormElement'),
    registerFormElement: document.getElementById('registerFormElement'),

    // Кнопки Google
    googleSignInBtn: document.getElementById('googleSignInBtn'),
    googleSignUpBtn: document.getElementById('googleSignUpBtn'),

    // Dashboard элементы
    userName: document.getElementById('userName'),
    userEmail: document.getElementById('userEmail'),
    userInitials: document.getElementById('userInitials'),
    tokensBalance: document.getElementById('tokensBalance'),
    refreshBalanceBtn: document.getElementById('refreshBalanceBtn'),
    openEditorBtn: document.getElementById('openEditorBtn'),
    viewApiKeyBtn: document.getElementById('viewApiKeyBtn'),
    logoutBtn: document.getElementById('logoutBtn'),

    // Модальное окно API ключа
    apiKeyModal: document.getElementById('apiKeyModal'),
    apiKeyDisplay: document.getElementById('apiKeyDisplay'),
    copyApiKeyBtn: document.getElementById('copyApiKeyBtn'),

    // Алерты
    alertContainer: document.getElementById('alertContainer')
};

/**
 * Инициализация при загрузке popup
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Popup загружен');

    // Инициализация менеджера авторизации
    const isAuthenticated = await window.authManager.init();

    // Переключение экрана
    if (isAuthenticated) {
        showDashboard();
    } else {
        showAuthScreen();
    }

    // Настройка обработчиков событий
    setupEventListeners();
});

/**
 * Настройка обработчиков событий
 * Функция привязывает обработчики ко всем интерактивным элементам
 */
function setupEventListeners() {
    // Табы входа/регистрации
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Формы
    elements.loginFormElement.addEventListener('submit', handleLogin);
    elements.registerFormElement.addEventListener('submit', handleRegister);

    // Google OAuth
    elements.googleSignInBtn.addEventListener('click', handleGoogleAuth);
    elements.googleSignUpBtn.addEventListener('click', handleGoogleAuth);

    // Dashboard кнопки
    elements.refreshBalanceBtn.addEventListener('click', refreshBalance);
    elements.openEditorBtn.addEventListener('click', openLocatorEditor);
    elements.viewApiKeyBtn.addEventListener('click', showApiKeyModal);
    elements.logoutBtn.addEventListener('click', handleLogout);

    // Модальное окно
    elements.copyApiKeyBtn.addEventListener('click', copyApiKey);
    
    const closeModalBtn = document.querySelector('.modal .close-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideApiKeyModal);
    }

    elements.apiKeyModal.addEventListener('click', (e) => {
        if (e.target === elements.apiKeyModal) {
            hideApiKeyModal();
        }
    });
}

/**
 * Переключение табов
 * Функция переключает между формами входа и регистрации
 * 
 * Args:
 *     tabName (string): Имя таба ('login' или 'register')
 */
function switchTab(tabName) {
    // Обновление табов
    elements.tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Переключение форм
    elements.loginForm.classList.toggle('active', tabName === 'login');
    elements.registerForm.classList.toggle('active', tabName === 'register');

    // Очистка алертов
    clearAlerts();
}

/**
 * Обработчик входа
 * Функция обрабатывает отправку формы входа
 * 
 * Args:
 *     event (Event): Событие отправки формы
 */
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showAlert('Заполните все поля', 'error');
        return;
    }

    // Отключение кнопки
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        const result = await window.authManager.login(email, password);

        if (result.success) {
            showAlert('Вход выполнен успешно!', 'success');
            setTimeout(() => showDashboard(), 1000);
        } else {
            showAlert(result.message, 'error');
        }

    } catch (ex) {
        console.error('Ошибка входа:', ex);
        showAlert('Ошибка входа', 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

/**
 * Обработчик регистрации
 * Функция обрабатывает отправку формы регистрации
 * 
 * Args:
 *     event (Event): Событие отправки формы
 */
async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

    // Валидация
    if (!name || !email || !password || !passwordConfirm) {
        showAlert('Заполните все поля', 'error');
        return;
    }

    if (password !== passwordConfirm) {
        showAlert('Пароли не совпадают', 'error');
        return;
    }

    if (password.length < 6) {
        showAlert('Пароль должен быть не менее 6 символов', 'error');
        return;
    }

    // Отключение кнопки
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        const result = await window.authManager.register(name, email, password);

        if (result.success) {
            showAlert('Регистрация успешна!', 'success');
            setTimeout(() => showDashboard(), 1000);
        } else {
            showAlert(result.message, 'error');
        }

    } catch (ex) {
        console.error('Ошибка регистрации:', ex);
        showAlert('Ошибка регистрации', 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

/**
 * Обработчик Google OAuth
 * Функция запускает процесс авторизации через Google
 */
async function handleGoogleAuth() {
    const btn = event.target.closest('button');
    btn.classList.add('loading');
    btn.disabled = true;

    try {
        const result = await window.authManager.googleSignIn();

        if (result.success) {
            showAlert('Вход через Google выполнен!', 'success');
            setTimeout(() => showDashboard(), 1000);
        } else {
            showAlert(result.message, 'error');
        }

    } catch (ex) {
        console.error('Ошибка Google OAuth:', ex);
        showAlert('Ошибка входа через Google', 'error');
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

/**
 * Отображение экрана авторизации
 * Функция показывает экран входа/регистрации
 */
function showAuthScreen() {
    elements.loadingScreen.classList.add('hidden');
    elements.dashboardScreen.classList.add('hidden');
    elements.authScreen.classList.remove('hidden');
}

/**
 * Отображение dashboard
 * Функция показывает главный экран с балансом и кнопками
 */
async function showDashboard() {
    const user = window.authManager.getUser();

    if (!user) {
        showAuthScreen();
        return;
    }

    // Установка данных пользователя
    elements.userName.textContent = user.name || 'User';
    elements.userEmail.textContent = user.email_hash || user.email || 'user@example.com';
    
    // Инициалы для аватара
    const initials = user.name 
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'UN';
    elements.userInitials.textContent = initials;

    // Загрузка баланса
    await refreshBalance();

    // Переключение экранов
    elements.loadingScreen.classList.add('hidden');
    elements.authScreen.classList.add('hidden');
    elements.dashboardScreen.classList.remove('hidden');
}

/**
 * Обновление баланса
 * Функция загружает актуальный баланс токенов с сервера
 */
async function refreshBalance() {
    const btn = elements.refreshBalanceBtn;
    btn.classList.add('loading');
    btn.disabled = true;

    try {
        const result = await window.authManager.getBalance();

        if (result.success) {
            const balance = result.balance.tokens_available || 0;
            elements.tokensBalance.textContent = balance.toLocaleString();
        } else {
            elements.tokensBalance.textContent = '—';
            showAlert('Не удалось загрузить баланс', 'error');
        }

    } catch (ex) {
        console.error('Ошибка загрузки баланса:', ex);
        elements.tokensBalance.textContent = '—';
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

/**
 * Открытие редактора локаторов
 * Функция открывает редактор на текущей странице
 */
async function openLocatorEditor() {
    try {
        const [activeTab] = await chrome.tabs.query({ 
            active: true, 
            currentWindow: true 
        });

        if (!activeTab) {
            showAlert('Активная вкладка не найдена', 'error');
            return;
        }

        // Проверка доступности страницы
        if (isRestrictedPage(activeTab.url)) {
            showAlert('Редактор недоступен на этой странице', 'error');
            return;
        }

        try {
            // Попытка отправить сообщение
            await chrome.tabs.sendMessage(activeTab.id, { 
                action: 'openLocatorModal',
                apiKey: window.authManager.getApiKey()
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
                world: 'ISOLATED'
            });

            await new Promise(resolve => setTimeout(resolve, 100));

            await chrome.tabs.sendMessage(activeTab.id, { 
                action: 'openLocatorModal',
                apiKey: window.authManager.getApiKey()
            });
        }

        // Закрываем popup
        window.close();

    } catch (ex) {
        console.error('Ошибка открытия редактора:', ex);
        showAlert('Не удалось открыть редактор', 'error');
    }
}

/**
 * Отображение модального окна с API ключом
 * Функция показывает API ключ пользователя
 */
function showApiKeyModal() {
    const apiKey = window.authManager.getApiKey();
    
    if (!apiKey) {
        showAlert('API ключ не найден', 'error');
        return;
    }

    // Маскирование ключа для отображения
    const maskedKey = apiKey.slice(0, 12) + '•'.repeat(20);
    elements.apiKeyDisplay.textContent = maskedKey;
    
    // Сохранение реального ключа в data-атрибут для копирования
    elements.apiKeyDisplay.dataset.realKey = apiKey;

    elements.apiKeyModal.classList.remove('hidden');
}

/**
 * Скрытие модального окна с API ключом
 */
function hideApiKeyModal() {
    elements.apiKeyModal.classList.add('hidden');
}

/**
 * Копирование API ключа
 * Функция копирует API ключ в буфер обмена
 */
async function copyApiKey() {
    const apiKey = elements.apiKeyDisplay.dataset.realKey;

    if (!apiKey) {
        showAlert('API ключ не найден', 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(apiKey);
        
        const btn = elements.copyApiKeyBtn;
        const originalText = btn.textContent;
        btn.textContent = '✓ Скопировано!';
        
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);

    } catch (ex) {
        console.error('Ошибка копирования:', ex);
        showAlert('Не удалось скопировать', 'error');
    }
}

/**
 * Выход из системы
 * Функция выполняет выход и переключает на экран авторизации
 */
async function handleLogout() {
    if (!confirm('Вы уверены что хотите выйти?')) {
        return;
    }

    await window.authManager.logout();
    showAuthScreen();
    showAlert('Вы вышли из системы', 'info');
}

/**
 * Отображение алерта
 * Функция показывает уведомление пользователю
 * 
 * Args:
 *     message (string): Текст сообщения
 *     type (string): Тип алерта ('success', 'error', 'info')
 */
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    elements.alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}

/**
 * Очистка всех алертов
 * Функция удаляет все показанные уведомления
 */
function clearAlerts() {
    elements.alertContainer.innerHTML = '';
}

/**
 * Проверка ограниченной страницы
 * Функция проверяет доступность страницы для внедрения скриптов
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

console.log('Popup script загружен');
