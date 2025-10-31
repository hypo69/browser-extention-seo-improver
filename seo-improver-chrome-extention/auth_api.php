<?php
## \file auth_api.php
# -*- coding: utf-8 -*-
#! .pyenv/bin/python3

/**
 * Billing CRM - Auth API для расширения Chrome
 * =============================================
 * 
 * Модуль реализует endpoints для авторизации из расширения:
 * - Вход (login)
 * - Регистрация (register)
 * - Google OAuth (google)
 * - Профиль пользователя (profile)
 * 
 * @version 1.0
 * @author Billing CRM Team
 * @date 2025-10-27
 * 
 * ```rst
 * .. module:: billing-crm.auth-api
 * ```
 */

# Загружаем конфигурацию
require_once __DIR__ . '/index.php';

# Заголовки для JSON API
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

# Обработка OPTIONS запроса для CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/**
 * Класс для обработки авторизации из расширения
 */
class ExtensionAuthAPI {
    private PDO $db;
    
    public function __construct() {
        $this->db = Database::getConnection();
    }
    
    /**
     * Обработка входящего запроса
     * Функция направляет запрос к соответствующему обработчику
     */
    public function handle(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = $_SERVER['REQUEST_URI'];
        
        # Определение endpoint
        if (strpos($path, '/api/v1/auth/login') !== false) {
            $this->handleLogin();
        } elseif (strpos($path, '/api/v1/auth/register') !== false) {
            $this->handleRegister();
        } elseif (strpos($path, '/api/v1/auth/google') !== false) {
            $this->handleGoogleAuth();
        } elseif (strpos($path, '/api/v1/profile') !== false) {
            $this->handleProfile();
        } else {
            $this->respond(['error' => true, 'message' => 'Invalid endpoint'], 404);
        }
    }
    
    /**
     * Обработка входа
     * Функция проверяет учётные данные и возвращает API ключ
     */
    private function handleLogin(): void {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (!$data) {
            $this->respond(['error' => true, 'message' => 'Invalid JSON'], 400);
            return;
        }
        
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        
        if (empty($email) || empty($password)) {
            $this->respond(['error' => true, 'message' => 'Email и пароль обязательны'], 400);
            return;
        }
        
        try {
            $emailHash = md5($email);
            $passwordHash = md5($password . Config::$apiKeySalt);
            
            # Поиск пользователя
            $stmt = $this->db->prepare("
                SELECT id, email_hash, name, status 
                FROM users 
                WHERE email_hash = ? AND password_hash = ?
            ");
            
            $stmt->execute([$emailHash, $passwordHash]);
            $user = $stmt->fetch();
            
            if (!$user) {
                $this->respond(['error' => true, 'message' => 'Неверный email или пароль'], 401);
                return;
            }
            
            if ($user['status'] !== 'active') {
                $this->respond(['error' => true, 'message' => 'Аккаунт заблокирован'], 403);
                return;
            }
            
            # Получение активного API ключа
            $stmt = $this->db->prepare("
                SELECT key_prefix 
                FROM api_keys 
                WHERE user_id = ? AND status = 'active' 
                LIMIT 1
            ");
            
            $stmt->execute([$user['id']]);
            $apiKey = $stmt->fetchColumn();
            
            if (!$apiKey) {
                # Создание нового ключа если нет
                $newKey = $this->generateApiKey();
                $keyHash = md5($newKey);
                $keyPrefix = substr($newKey, 0, 12);
                
                $stmt = $this->db->prepare("
                    INSERT INTO api_keys (user_id, key_hash, key_prefix, status)
                    VALUES (?, ?, ?, 'active')
                ");
                
                $stmt->execute([$user['id'], $keyHash, $keyPrefix]);
                $apiKey = $newKey;
            } else {
                # Восстановление полного ключа (в реальной системе нужно иначе)
                $apiKey = $keyPrefix . str_repeat('x', 20);
            }
            
            # Обновление последнего входа
            $stmt = $this->db->prepare("
                UPDATE users SET last_login_at = NOW() WHERE id = ?
            ");
            $stmt->execute([$user['id']]);
            
            $this->respond([
                'error' => false,
                'message' => 'Вход выполнен',
                'api_key' => $apiKey,
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email_hash' => $user['email_hash']
                ]
            ]);
            
        } catch (Exception $ex) {
            error_log('Login error: ' . $ex->getMessage());
            $this->respond(['error' => true, 'message' => 'Ошибка входа'], 500);
        }
    }
    
    /**
     * Обработка регистрации
     * Функция создает нового пользователя и возвращает API ключ
     */
    private function handleRegister(): void {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (!$data) {
            $this->respond(['error' => true, 'message' => 'Invalid JSON'], 400);
            return;
        }
        
        $name = $data['name'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        
        if (empty($name) || empty($email) || empty($password)) {
            $this->respond(['error' => true, 'message' => 'Все поля обязательны'], 400);
            return;
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->respond(['error' => true, 'message' => 'Неверный формат email'], 400);
            return;
        }
        
        try {
            $this->db->beginTransaction();
            
            $emailHash = md5($email);
            
            # Проверка дубликата
            $stmt = $this->db->prepare("SELECT id FROM users WHERE email_hash = ?");
            $stmt->execute([$emailHash]);
            
            if ($stmt->fetch()) {
                $this->db->rollBack();
                $this->respond(['error' => true, 'message' => 'Email уже используется'], 400);
                return;
            }
            
            # Создание пользователя
            $passwordHash = md5($password . Config::$apiKeySalt);
            
            $stmt = $this->db->prepare("
                INSERT INTO users (email_hash, password_hash, name, status)
                VALUES (?, ?, ?, 'active')
            ");
            
            $stmt->execute([$emailHash, $passwordHash, $name]);
            $userId = $this->db->lastInsertId();
            
            # Генерация API ключа
            $apiKey = $this->generateApiKey();
            $keyHash = md5($apiKey);
            $keyPrefix = substr($apiKey, 0, 12);
            
            $stmt = $this->db->prepare("
                INSERT INTO api_keys (user_id, key_hash, key_prefix, status)
                VALUES (?, ?, ?, 'active')
            ");
            
            $stmt->execute([$userId, $keyHash, $keyPrefix]);
            
            # Создание начального баланса (10,000 токенов в подарок)
            $stmt = $this->db->prepare("
                INSERT INTO user_balances (user_id, tokens_purchased, tokens_used)
                VALUES (?, 10000, 0)
            ");
            
            $stmt->execute([$userId]);
            
            $this->db->commit();
            
            $this->respond([
                'error' => false,
                'message' => 'Регистрация успешна',
                'api_key' => $apiKey,
                'user' => [
                    'id' => $userId,
                    'name' => $name,
                    'email_hash' => $emailHash
                ]
            ]);
            
        } catch (Exception $ex) {
            $this->db->rollBack();
            error_log('Registration error: ' . $ex->getMessage());
            $this->respond(['error' => true, 'message' => 'Ошибка регистрации'], 500);
        }
    }
    
    /**
     * Обработка Google OAuth
     * Функция создает/находит пользователя по Google ID и возвращает API ключ
     */
    private function handleGoogleAuth(): void {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (!$data) {
            $this->respond(['error' => true, 'message' => 'Invalid JSON'], 400);
            return;
        }
        
        $googleId = $data['google_id'] ?? '';
        $email = $data['email'] ?? '';
        $name = $data['name'] ?? '';
        $picture = $data['picture'] ?? '';
        
        if (empty($googleId) || empty($email)) {
            $this->respond(['error' => true, 'message' => 'Google ID и email обязательны'], 400);
            return;
        }
        
        try {
            $this->db->beginTransaction();
            
            $emailHash = md5($email);
            
            # Поиск существующего пользователя
            $stmt = $this->db->prepare("
                SELECT id, name, status 
                FROM users 
                WHERE email_hash = ?
            ");
            
            $stmt->execute([$emailHash]);
            $user = $stmt->fetch();
            
            if ($user) {
                # Пользователь существует
                $userId = $user['id'];
                
                if ($user['status'] !== 'active') {
                    $this->db->rollBack();
                    $this->respond(['error' => true, 'message' => 'Аккаунт заблокирован'], 403);
                    return;
                }
            } else {
                # Создание нового пользователя
                $stmt = $this->db->prepare("
                    INSERT INTO users (email_hash, name, status)
                    VALUES (?, ?, 'active')
                ");
                
                $stmt->execute([$emailHash, $name]);
                $userId = $this->db->lastInsertId();
                
                # Создание начального баланса
                $stmt = $this->db->prepare("
                    INSERT INTO user_balances (user_id, tokens_purchased, tokens_used)
                    VALUES (?, 10000, 0)
                ");
                
                $stmt->execute([$userId]);
            }
            
            # Получение/создание API ключа
            $stmt = $this->db->prepare("
                SELECT key_prefix 
                FROM api_keys 
                WHERE user_id = ? AND status = 'active' 
                LIMIT 1
            ");
            
            $stmt->execute([$userId]);
            $apiKey = $stmt->fetchColumn();
            
            if (!$apiKey) {
                $newKey = $this->generateApiKey();
                $keyHash = md5($newKey);
                $keyPrefix = substr($newKey, 0, 12);
                
                $stmt = $this->db->prepare("
                    INSERT INTO api_keys (user_id, key_hash, key_prefix, status)
                    VALUES (?, ?, ?, 'active')
                ");
                
                $stmt->execute([$userId, $keyHash, $keyPrefix]);
                $apiKey = $newKey;
            }
            
            # Обновление последнего входа
            $stmt = $this->db->prepare("
                UPDATE users SET last_login_at = NOW() WHERE id = ?
            ");
            $stmt->execute([$userId]);
            
            $this->db->commit();
            
            $this->respond([
                'error' => false,
                'message' => 'Вход через Google выполнен',
                'api_key' => $apiKey,
                'user' => [
                    'id' => $userId,
                    'name' => $name,
                    'email_hash' => $emailHash
                ]
            ]);
            
        } catch (Exception $ex) {
            $this->db->rollBack();
            error_log('Google auth error: ' . $ex->getMessage());
            $this->respond(['error' => true, 'message' => 'Ошибка входа через Google'], 500);
        }
    }
    
    /**
     * Получение профиля пользователя
     * Функция возвращает данные профиля по API ключу из заголовка
     */
    private function handleProfile(): void {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        
        if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $this->respond(['error' => true, 'message' => 'Отсутствует токен авторизации'], 401);
            return;
        }
        
        $apiKey = $matches[1];
        $keyHash = md5($apiKey);
        
        try {
            $stmt = $this->db->prepare("
                SELECT u.id, u.name, u.email_hash, u.status, u.created_at,
                       COALESCE(ub.tokens_available, 0) as tokens_available
                FROM users u
                LEFT JOIN api_keys ak ON u.id = ak.user_id
                LEFT JOIN user_balances ub ON u.id = ub.user_id
                WHERE ak.key_hash = ? AND ak.status = 'active'
            ");
            
            $stmt->execute([$keyHash]);
            $user = $stmt->fetch();
            
            if (!$user) {
                $this->respond(['error' => true, 'message' => 'Неверный API ключ'], 401);
                return;
            }
            
            $this->respond([
                'error' => false,
                'profile' => $user
            ]);
            
        } catch (Exception $ex) {
            error_log('Profile error: ' . $ex->getMessage());
            $this->respond(['error' => true, 'message' => 'Ошибка загрузки профиля'], 500);
        }
    }
    
    /**
     * Генерация уникального API ключа
     * 
     * Returns:
     *     string: Сгенерированный API ключ
     */
    private function generateApiKey(): string {
        return 'bcm_' . bin2hex(random_bytes(16));
    }
    
    /**
     * Отправка JSON ответа
     * 
     * Args:
     *     $data (array): Данные для отправки
     *     $statusCode (int): HTTP код статуса
     */
    private function respond(array $data, int $statusCode = 200): void {
        http_response_code($statusCode);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }
}

# Запуск Auth API
try {
    $authAPI = new ExtensionAuthAPI();
    $authAPI->handle();
    
} catch (Exception $ex) {
    error_log('Auth API error: ' . $ex->getMessage());
    http_response_code(500);
    
    echo json_encode([
        'error' => true,
        'message' => 'Internal server error'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
