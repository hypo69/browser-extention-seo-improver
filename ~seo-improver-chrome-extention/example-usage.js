
// example-usage.js
// Примеры использования централизованного AI API

// ========================================
// Пример 1: Работа с OpenAI
// ========================================
async function useOpenAI() {
    try {
        const pageText = 'Текст страницы для анализа...';
        const options = {
            apiKey: 'your-openai-api-key',
            model: 'gpt-4',
            temperature: 0.7
        };

        const response = await AI.getFullPriceOffer('openai', pageText, options);
        console.log('OpenAI Response:', response);

        const jsonResponse = await AI.getModelResponseJSON('openai', pageText, options);
        console.log('OpenAI JSON:', jsonResponse);
    } catch (error) {
        logger.error('[EXAMPLE] Ошибка OpenAI:', error);
    }
}

// ========================================
// Пример 2: Работа с Gemini (v1)
// ========================================
async function useGeminiV1() {
    try {
        const pageText = 'Текст страницы для анализа...';
        const options = {
            apiKey: 'your-gemini-api-key',
            model: 'gemini-pro',
            version: 'v1'
        };

        const response = await AI.getFullPriceOffer('gemini', pageText, options);
        console.log('Gemini V1 Response:', response);
    } catch (error) {
        logger.error('[EXAMPLE] Ошибка Gemini V1:', error);
    }
}

// ========================================
// Пример 3: Работа с Gemini (v2)
// ========================================
async function useGeminiV2() {
    try {
        const pageText = 'Текст страницы для анализа...';
        const options = {
            apiKey: 'your-gemini-api-key',
            model: 'gemini-2.5-flash-lite',
            version: 'v2'
        };

        const jsonResponse = await AI.getModelResponseJSON('gemini', pageText, options);
        console.log('Gemini V2 JSON:', jsonResponse);
    } catch (error) {
        logger.error('[EXAMPLE] Ошибка Gemini V2:', error);
    }
}

// ========================================
// Пример 4: Работа с HuggingFace
// ========================================
async function useHuggingFace() {
    try {
        const pageText = 'Текст страницы для анализа...';
        const options = {
            apiKey: 'your-huggingface-api-key',
            model: 'mistralai/Mistral-7B-Instruct-v0.2',
            max_new_tokens: 1500,
            temperature: 0.8
        };

        const response = await AI.getFullPriceOffer('huggingface', pageText, options);
        console.log('HuggingFace Response:', response);
    } catch (error) {
        logger.error('[EXAMPLE] Ошибка HuggingFace:', error);
    }
}

// ========================================
// Пример 5: Проверка доступных провайдеров
// ========================================
function checkAvailableProviders() {
    const providers = AI.getAvailableProviders();
    console.log('Доступные провайдеры:', providers);

    // Проверка доступности модели
    const isGeminiProAvailable = AI.isModelAvailable('gemini', 'gemini-pro');
    console.log('Gemini Pro доступна:', isGeminiProAvailable);
}

// ========================================
// Пример 6: Динамический выбор провайдера
// ========================================
async function dynamicProviderSelection(providerName, pageText, apiKey, model) {
    try {
        // Проверка доступности провайдера
        const availableProviders = AI.getAvailableProviders();
        if (!availableProviders.includes(providerName)) {
            throw new Error(`Провайдер "${providerName}" недоступен`);
        }

        // Проверка доступности модели
        if (!AI.isModelAvailable(providerName, model)) {
            throw new Error(`Модель "${model}" недоступна для провайдера "${providerName}"`);
        }

        // Выполнение запроса
        const options = { apiKey, model };
        const response = await AI.getModelResponseJSON(providerName, pageText, options);

        return response;
    } catch (error) {
        logger.error(`[EXAMPLE] Ошибка при работе с провайдером ${providerName}:`, error);
        throw error;
    }
}


//## Структура файлов проекта

//seo - improver - chrome - extension /
//├── ai - provider.js                 # Главный модуль(фабрика)
//├── config /
//│   └── ai - config.js              # Конфигурация провайдеров
//├── providers /
//│   ├── base - provider.js          # Базовый класс
//│   ├── openai - provider.js        # OpenAI провайдер
//│   ├── gemini - provider.js        # Gemini провайдер
//│   └── huggingface - provider.js   # HuggingFace провайдер
//├── _locales /
//│   ├── ru /
//│   │   └── price_offer_prompt.txt
//│   └── en /
//│       └── price_offer_prompt.txt
//└── manifest.json                  # Обновленный манифест