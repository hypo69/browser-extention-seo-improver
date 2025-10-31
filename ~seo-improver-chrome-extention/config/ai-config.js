
// config/ai-config.js
// \file config/ai-config.js
// -*- coding: utf-8 -*-

/**
 * Централизованная конфигурация AI провайдеров и моделей.
 * =========================================================
 * Модуль содержит настройки для различных AI провайдеров (OpenAI, Gemini, HuggingFace и др.),
 * включая endpoints, модели по умолчанию и лимиты.
 */

const AIConfig = {
    providers: {
        openai: {
            name: 'OpenAI',
            baseUrl: 'https://api.openai.com/v1',
            endpoints: {
                chat: '/chat/completions'
            },
            defaultModel: 'gpt-3.5-turbo',
            models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'],
            maxPromptLength: 16000,
            requiresAuth: true,
            authType: 'bearer'
        },
        gemini: {
            name: 'Google Gemini',
            versions: {
                v1: {
                    baseUrl: 'https://generativelanguage.googleapis.com/v1/models',
                    method: 'generateContent'
                },
                v2: {
                    baseUrl: 'https://aiplatform.googleapis.com/v1/publishers/google/models',
                    method: 'streamGenerateContent'
                }
            },
            defaultVersion: 'v1',
            defaultModel: 'gemini-pro',
            models: {
                v1: ['gemini-pro', 'gemini-pro-vision'],
                v2: ['gemini-2.5-flash-lite', 'gemini-2.5-pro']
            },
            maxPromptLength: 10000,
            requiresAuth: true,
            authType: 'apikey'
        },
        huggingface: {
            name: 'HuggingFace',
            baseUrl: 'https://api-inference.huggingface.co/models',
            defaultModel: 'mistralai/Mistral-7B-Instruct-v0.2',
            models: [
                'mistralai/Mistral-7B-Instruct-v0.2',
                'meta-llama/Llama-2-70b-chat-hf',
                'tiiuae/falcon-180B-chat'
            ],
            maxPromptLength: 8000,
            requiresAuth: true,
            authType: 'bearer'
        },
        anthropic: {
            name: 'Anthropic Claude',
            baseUrl: 'https://api.anthropic.com/v1',
            endpoints: {
                messages: '/messages'
            },
            defaultModel: 'claude-3-sonnet-20240229',
            models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
            maxPromptLength: 20000,
            requiresAuth: true,
            authType: 'apikey'
        }
    },

    /**
     * Возвращает конфигурацию для указанного провайдера.
     * @param {string} providerName Имя провайдера (openai, gemini, huggingface, anthropic).
     * @returns {Object|null} Конфигурация провайдера или null если не найден.
     */
    getProviderConfig: function (providerName) {
        const config = this.providers[providerName.toLowerCase()];
        if (!config) {
            logger.error(`[AI_CONFIG] Провайдер "${providerName}" не найден в конфигурации`);
            return null;
        }
        return config;
    },

    /**
     * Проверяет доступность модели для указанного провайдера.
     * @param {string} providerName Имя провайдера.
     * @param {string} modelName Название модели.
     * @returns {boolean} True если модель доступна.
     */
    isModelAvailable: function (providerName, modelName) {
        const config = this.getProviderConfig(providerName);
        if (!config) return false;

        if (providerName === 'gemini' && config.models) {
            return Object.values(config.models).flat().includes(modelName);
        }

        return config.models && config.models.includes(modelName);
    }
};

if (typeof window !== 'undefined') {
    window.AIConfig = AIConfig;
}