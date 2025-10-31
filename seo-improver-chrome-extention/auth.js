// auth.js
// \file auth.js
// -*- coding: utf-8 -*-

/**
 * Модуль авторизации для расширения
 * ===================================
 * 
 * Модуль обрабатывает:
 * - Вход и регистрацию
 * - Google OAuth
 * - Сохранение токенов
 * - Проверку авторизации
 */

/**
 * Конфигурация API
 */
const API_CONFIG = {
    baseUrl: 'https://srv378106.hstgr.cloud',
    endpoints: {
        login: '/api/v1/auth/login',
        register: '/api/v1/auth/register',
        balance: '/api/v1/balance',
        profile: '/api/v1/profile'
    },
    googleOAuth: {
        clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        redirectUrl: chrome.identity.getRedirectURL('oauth2')
    }
};

/**
 * Класс для работы с авторизацией
 */
class AuthManager {
    constructor() {
        this.apiKey = null;
        this.user = null;
    }

    /**
     * Инициализация
     * Функция загружает сохранённые данные из storage
     */
    async init() {
        try {
            const data = await chrome.storage.local.get(['apiKey', 'user']);
            this.apiKey = data.apiKey || null;
            this.user = data.user || null;
            
            return this.isAuthenticated();
        } catch (ex) {
            console.error('Ошибка инициализации:', ex);
            return false;
        }
    }

    /**
     * Проверка авторизации
     * 
     * Returns:
     *     boolean: true если пользователь авторизован
     */
    isAuthenticated() {
        return !!(this.apiKey && this.user);
    }

    /**
     * Вход через email и пароль
     * 
     * Args:
     *     email (string): Email пользователя
     *     password (string): Пароль пользователя
     * 
     * Returns:
     *     Object: Результат входа {success, message, apiKey, user}
     */
    async login(email, password) {
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.login}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (data.error) {
                return {
                    success: false,
                    message: data.message || 'Ошибка входа'
                };
            }

            // Сохранение данных
            await this.saveAuthData(data.api_key, data.user);

            return {
                success: true,
                message: 'Вход выполнен успешно',
                apiKey: data.api_key,
                user: data.user
            };

        } catch (ex) {
            console.error('Ошибка входа:', ex);
            return {
                success: false,
                message: 'Ошибка подключения к серверу'
            };
        }
    }

    /**
     * Регистрация нового пользователя
     * 
     * Args:
     *     name (string): Имя пользователя
     *     email (string): Email пользователя
     *     password (string): Пароль пользователя
     * 
     * Returns:
     *     Object: Результат регистрации {success, message, apiKey, user}
     */
    async register(name, email, password) {
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.register}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (data.error) {
                return {
                    success: false,
                    message: data.message || 'Ошибка регистрации'
                };
            }

            // Сохранение данных
            await this.saveAuthData(data.api_key, data.user);

            return {
                success: true,
                message: 'Регистрация успешна',
                apiKey: data.api_key,
                user: data.user
            };

        } catch (ex) {
            console.error('Ошибка регистрации:', ex);
            return {
                success: false,
                message: 'Ошибка подключения к серверу'
            };
        }
    }

    /**
     * Вход через Google OAuth
     * 
     * Returns:
     *     Object: Результат входа {success, message, apiKey, user}
     */
    async googleSignIn() {
        try {
            // Формирование URL для OAuth
            const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
            authUrl.searchParams.set('client_id', API_CONFIG.googleOAuth.clientId);
            authUrl.searchParams.set('response_type', 'token');
            authUrl.searchParams.set('redirect_uri', API_CONFIG.googleOAuth.redirectUrl);
            authUrl.searchParams.set('scope', 'email profile');

            // Запуск OAuth потока
            const redirectUrl = await chrome.identity.launchWebAuthFlow({
                url: authUrl.href,
                interactive: true
            });

            // Извлечение токена из URL
            const params = new URLSearchParams(redirectUrl.split('#')[1]);
            const googleToken = params.get('access_token');

            if (!googleToken) {
                return {
                    success: false,
                    message: 'Не удалось получить токен Google'
                };
            }

            // Получение информации о пользователе от Google
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                    'Authorization': `Bearer ${googleToken}`
                }
            });

            const googleUser = await userInfoResponse.json();

            // Отправка на сервер для создания/входа
            const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    google_id: googleUser.id,
                    email: googleUser.email,
                    name: googleUser.name,
                    picture: googleUser.picture
                })
            });

            const data = await response.json();

            if (data.error) {
                return {
                    success: false,
                    message: data.message || 'Ошибка входа через Google'
                };
            }

            // Сохранение данных
            await this.saveAuthData(data.api_key, data.user);

            return {
                success: true,
                message: 'Вход через Google выполнен',
                apiKey: data.api_key,
                user: data.user
            };

        } catch (ex) {
            console.error('Ошибка Google OAuth:', ex);
            return {
                success: false,
                message: 'Ошибка входа через Google'
            };
        }
    }

    /**
     * Получение баланса токенов
     * 
     * Returns:
     *     Object: Баланс пользователя {success, balance}
     */
    async getBalance() {
        if (!this.apiKey) {
            return {
                success: false,
                message: 'Не авторизован'
            };
        }

        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.balance}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            const data = await response.json();

            if (data.error) {
                return {
                    success: false,
                    message: data.message
                };
            }

            return {
                success: true,
                balance: data
            };

        } catch (ex) {
            console.error('Ошибка получения баланса:', ex);
            return {
                success: false,
                message: 'Ошибка подключения к серверу'
            };
        }
    }

    /**
     * Получение профиля пользователя
     * 
     * Returns:
     *     Object: Профиль пользователя {success, profile}
     */
    async getProfile() {
        if (!this.apiKey) {
            return {
                success: false,
                message: 'Не авторизован'
            };
        }

        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.profile}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            const data = await response.json();

            if (data.error) {
                return {
                    success: false,
                    message: data.message
                };
            }

            return {
                success: true,
                profile: data
            };

        } catch (ex) {
            console.error('Ошибка получения профиля:', ex);
            return {
                success: false,
                message: 'Ошибка подключения к серверу'
            };
        }
    }

    /**
     * Сохранение данных авторизации
     * Функция сохраняет API ключ и данные пользователя в storage
     * 
     * Args:
     *     apiKey (string): API ключ
     *     user (Object): Данные пользователя
     */
    async saveAuthData(apiKey, user) {
        this.apiKey = apiKey;
        this.user = user;

        await chrome.storage.local.set({
            apiKey: apiKey,
            user: user
        });
    }

    /**
     * Выход из системы
     * Функция очищает сохранённые данные
     */
    async logout() {
        this.apiKey = null;
        this.user = null;

        await chrome.storage.local.remove(['apiKey', 'user']);
    }

    /**
     * Получение сохранённого API ключа
     * 
     * Returns:
     *     string|null: API ключ или null
     */
    getApiKey() {
        return this.apiKey;
    }

    /**
     * Получение данных пользователя
     * 
     * Returns:
     *     Object|null: Данные пользователя или null
     */
    getUser() {
        return this.user;
    }
}

// Создание глобального экземпляра
window.authManager = new AuthManager();
