
// @file openai.js
// Manages interactions with the OpenAI API for generating price offers and parsing responses.  # ==================================
// Detailed description of module functionality, classes, functions, and usage
// This module provides functions to communicate with the OpenAI API to process
// web page content, generate price offer texts, and parse JSON responses.
// It handles prompt loading, API request formatting, error handling,
// and includes a debug utility for viewing prompts.
// ========================================================================
// Version: 0.1.0
// Author: hypo69
// Licence: MIT (link/to/licence)
// Copyright: @hypo69 (2025)
// Date: 2024-07-30
// Repository: https://github.com/hypo69/hypotez
// ========================================================================

const OpenAIAPI = {};

const MAX_PROMPT_LENGTH = 16000; // The limit may vary depending on the model; 16k is a safe value.

/**
 * Renders the full prompt content in a new browser tab for debugging purposes.
 * @param {string} promptContent The full prompt content to display.
 * @returns {void}
 */
function _openDebugTab(promptContent) {
    logger.info('[OPENAI] Opening debug tab with prompt.');

    // Escape HTML tags for safe display in the browser
    const escapedContent = promptContent
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\n/g, '<br>'); // Replace newlines with <br>

    // Create a minimal HTML document
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>OpenAI Prompt Debug</title>
            <style>
                body { white-space: pre-wrap; font-family: monospace; padding: 20px; background-color: #f5f5f5; color: #333; }
                h1 { color: #10a37f; }
                .prompt-content { background-color: white; border: 1px solid #ccc; padding: 15px; border-radius: 5px; }
            </style>
        </head>
        <body>
            <h1>OpenAI Full Prompt (DEBUG)</h1>
            <div class="prompt-content">${escapedContent}</div>
        </body>
        </html>
    `;

    // Create a data URL
    const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);

    // Open a new tab with this data URL
    chrome.tabs.create({ url: dataUrl })
        .catch(error => {
            logger.error('[OPENAI] Error opening debug tab:', { error: error.message });
        });
}

/**
 * Loads the appropriate price offer prompt text based on a defined priority hierarchy.
 * @returns {Promise<string|null>} The loaded prompt text, or `null` if an error occurred.
 */
async function loadPriceOfferPrompt() {
    const tryLoad = async (locale) => {
        if (!locale) return null;
        // Use the same prompt file as the structure is universal
        const path = `_locales/${locale}/price_offer_prompt.txt`;
        try {
            const url = chrome.runtime.getURL(path);
            const res = await fetch(url);
            if (res.ok) {
                logger.info(`[OPENAI] Prompt successfully loaded for locale: "${locale}"`);
                return await res.text();
            }
            return null;
        } catch (ex) {
            logger.warn(`[OPENAI] Error loading prompt: ${path}`, { error: ex.message });
            return null;
        }
    };

    let promptText = null;
    const defaultLocale = 'ru';

    // --- Priority 1: Language from URL parameter '?lang=...' ---
    if (typeof window !== 'undefined' && window.location) {
        const urlParams = new URLSearchParams(window.location.search);
        const langFromUrl = urlParams.get('lang');

        if (langFromUrl) {
            logger.info(`[OPENAI] Language detected in URL: "${langFromUrl}". Attempting to load.`);
            promptText = await tryLoad(langFromUrl);
        }
    }

    // --- Fallback: Default language ---
    if (!promptText) {
        logger.info(`[OPENAI] Prompt for URL language not found or specified. Loading default prompt: "${defaultLocale}".`);
        promptText = await tryLoad(defaultLocale);
    }

    if (!promptText) {
        logger.error('[OPENAI] CRITICAL ERROR: Failed to load prompt even for default language.');
    }

    return promptText;
}

/**
 * Initiates and transmits a request to the OpenAI API for chat completions.
 * @param {string} fullPrompt The complete prompt to send to the model.
 * @param {string} apiKey The OpenAI API key for authentication.
 * @param {string} model The name of the OpenAI model to use (e.g., 'gpt-3.5-turbo').
 * @returns {Promise<string>} The text content of the model's response.
 */
async function _sendRequestToOpenAI(fullPrompt, apiKey, model) {
    const url = 'https://api.openai.com/v1/chat/completions';
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: fullPrompt }],
                // can add other parameters, e.g., temperature
            })
        });
        const data = await response.json();

        if (data.error) {
            const error = new Error(data.error.message || 'Unknown OpenAI API error');
            error.details = data.error;
            throw error;
        }

        if (!data.choices || data.choices.length === 0) {
            const finishReason = data.choices?.[0]?.finish_reason || 'Unknown reason';
            const error = new Error(`No response received from the model. Reason: ${finishReason}`);
            error.details = data;
            throw error;
        }

        const resultText = data.choices?.[0]?.message?.content;
        if (!resultText) {
            throw new Error('Empty response from the model');
        }

        return resultText;
    } catch (ex) {
        logger.error('[OPENAI] API request error', { error: ex.message, stack: ex.stack });
        throw new Error(`Error connecting to OpenAI API: ${ex.message}`);
    }
}

/**
 * Extracts a comprehensive price offer from the OpenAI model based on the provided page text and instructions.
 * @param {string} pageText The raw text content of the page to analyze.
 * @param {string} apiKey The OpenAI API key.
 * @param {string} model The OpenAI model identifier.
 * @returns {Promise<string>} The generated price offer text from the model.
 */
OpenAIAPI.getFullPriceOffer = async (pageText, apiKey, model) => {
    const instructions = await loadPriceOfferPrompt();
    if (!instructions) {
        throw new Error('Failed to load instructions for the model');
    }
    const truncatedText = pageText.substring(0, MAX_PROMPT_LENGTH);
    const fullPrompt = `${instructions}\n\n${truncatedText}`;

    return await _sendRequestToOpenAI(fullPrompt, apiKey, model);
};

/**
 * Transforms the OpenAI model's response into a JSON object, cleaning any surrounding markdown.
 * @param {string} pageText The raw text content of the page.
 * @param {string} apiKey The OpenAI API key.
 * @param {string} model The OpenAI model identifier.
 * @returns {Promise<Object>} The parsed JSON object from the model's response.
 */
OpenAIAPI.getModelResponseJSON = async (pageText, apiKey, model) => {
    const modelResponse = await OpenAIAPI.getFullPriceOffer(pageText, apiKey, model);
    try {
        // The response from OpenAI often contains "json" at the beginning and "" at the end.
        const cleanedResponse = modelResponse.trim().replace(/^json\s*/i, '').replace(/\s*\s*$/, '').trim();
        return JSON.parse(cleanedResponse);
    } catch (ex) {
        logger.error('[OPENAI] JSON parsing error', { error: ex.message });
        throw new Error(`Failed to parse model response as JSON: ${ex.message}`);
    }
};

// Conditional export for preview-offer.html
if (typeof window !== 'undefined') {
    window.OpenAIAPI = OpenAIAPI;
}
