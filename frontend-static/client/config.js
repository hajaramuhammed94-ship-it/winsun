/**
 * Winsun API 配置文件
 * 
 * 在这里配置你的 API 端点
 */

const API_CONFIG = {
    // ========================================
    // 选择使用哪个 API
    // ========================================
    // 选项 1: 使用原始 Winsun API
    // 选项 2: 使用你自己部署的后端 API
    // 选项 3: 使用自定义 API

    USE_API: 'DEPLOYED', // 可选值: 'ORIGINAL', 'DEPLOYED', 'CUSTOM'
    
    // ========================================
    // API 端点配置
    // ========================================
    
    APIS: {
        // 原始 Winsun API
        ORIGINAL: {
            baseUrl: 'https://api.winsun8.com',
            endpoints: {
                login: '/api/account/login/m={email}&priv={password_hash}',
                register: '/api/account/register',
                passwordReset: '/api/account/reset'
            },
            // 原始 API 使用 GET 请求和 MD5 加密
            method: 'GET',
            passwordEncryption: 'MD5',
            // 响应格式: { status: "ok", rsp: "..." }
            responseFormat: 'ORIGINAL'
        },
        
        // 你部署的后端 API
        DEPLOYED: {
            baseUrl: 'https://winsun-backend.vercel.app',
            endpoints: {
                login: '/api/auth/login',
                register: '/api/auth/register',
                profile: '/api/auth/profile'
            },
            // 新 API 使用 POST 请求和 bcrypt 加密
            method: 'POST',
            passwordEncryption: 'BCRYPT',
            // 响应格式: { success: true, token: "...", user: {...} }
            responseFormat: 'JWT'
        },
        
        // 自定义 API（在这里配置你自己的 API）
        CUSTOM: {
            // 👇 修改这里为你的 API 地址
            baseUrl: 'https://your-api.example.com',
            
            endpoints: {
                // 👇 修改这里为你的登录端点
                login: '/api/auth/login',
                
                // 👇 修改这里为你的注册端点
                register: '/api/auth/register',
                
                // 👇 修改这里为你的用户信息端点
                profile: '/api/auth/profile'
            },
            
            // 👇 修改这里为你的 API 请求方法 ('GET' 或 'POST')
            method: 'POST',
            
            // 👇 修改这里为你的密码加密方式
            // 可选值: 'NONE' (明文), 'MD5', 'BCRYPT' (后端加密), 'SHA256'
            passwordEncryption: 'BCRYPT',
            
            // 👇 修改这里为你的 API 响应格式
            // 可选值: 'ORIGINAL' (Winsun格式), 'JWT' (标准JWT格式), 'CUSTOM'
            responseFormat: 'JWT',
            
            // 👇 如果使用 CUSTOM 响应格式，定义你的响应字段映射
            customResponseMapping: {
                // 成功标识字段
                successField: 'success',  // 例如: success, status, ok
                successValue: true,       // 成功时的值，例如: true, "ok", 200
                
                // Token 字段
                tokenField: 'token',      // 例如: token, access_token, jwt
                
                // 用户信息字段
                userField: 'user',        // 例如: user, data, userInfo
                
                // 错误信息字段
                errorField: 'error',      // 例如: error, message, msg
            }
        }
    },
    
    // ========================================
    // 登录成功后的跳转页面
    // ========================================
    REDIRECT_AFTER_LOGIN: {
        ORIGINAL: '../../dashboard/index.html',  // 原始仪表板
        DEPLOYED: '/client/dashboard.html',       // 新仪表板
        CUSTOM: '/client/dashboard.html'          // 自定义仪表板
    },
    
    // ========================================
    // 其他配置
    // ========================================
    
    // 是否在控制台打印调试信息
    DEBUG: true,
    
    // Token 存储位置
    TOKEN_STORAGE: 'localStorage', // 可选值: 'localStorage', 'sessionStorage', 'cookie'
    
    // Token 存储的键名
    TOKEN_KEY: 'winsun_auth_token',
    
    // 用户信息存储的键名
    USER_KEY: 'winsun_user_info'
};

// ========================================
// 辅助函数
// ========================================

/**
 * 获取当前使用的 API 配置
 */
function getCurrentAPI() {
    return API_CONFIG.APIS[API_CONFIG.USE_API];
}

/**
 * 构建完整的 API URL
 */
function buildApiUrl(endpoint, params = {}) {
    const api = getCurrentAPI();
    let url = api.baseUrl + api.endpoints[endpoint];
    
    // 替换 URL 中的参数占位符
    Object.keys(params).forEach(key => {
        url = url.replace(`{${key}}`, params[key]);
    });
    
    return url;
}

/**
 * 加密密码
 */
function encryptPassword(password) {
    const api = getCurrentAPI();
    
    switch (api.passwordEncryption) {
        case 'MD5':
            return hex_md5(password);
        case 'SHA256':
            // 需要引入 SHA256 库
            return CryptoJS.SHA256(password).toString();
        case 'BCRYPT':
        case 'NONE':
        default:
            return password; // 明文或后端加密
    }
}

/**
 * 解析 API 响应
 */
function parseApiResponse(data, endpoint) {
    const api = getCurrentAPI();
    
    if (API_CONFIG.DEBUG) {
        console.log('API Response:', data);
    }
    
    switch (api.responseFormat) {
        case 'ORIGINAL':
            // Winsun 原始格式: { status: "ok", rsp: "..." }
            return {
                success: data.status === 'ok',
                message: data.rsp,
                data: data
            };
            
        case 'JWT':
            // 标准 JWT 格式: { success: true, token: "...", user: {...} }
            return {
                success: data.success === true,
                message: data.message || data.error,
                token: data.token,
                user: data.user,
                data: data
            };
            
        case 'CUSTOM':
            // 自定义格式
            const mapping = api.customResponseMapping;
            return {
                success: data[mapping.successField] === mapping.successValue,
                message: data[mapping.errorField] || data[mapping.successField],
                token: data[mapping.tokenField],
                user: data[mapping.userField],
                data: data
            };
            
        default:
            return {
                success: false,
                message: '未知的响应格式',
                data: data
            };
    }
}

/**
 * 保存认证信息
 */
function saveAuthInfo(token, user) {
    const storage = API_CONFIG.TOKEN_STORAGE === 'sessionStorage' ? sessionStorage : localStorage;
    
    if (token) {
        storage.setItem(API_CONFIG.TOKEN_KEY, token);
    }
    
    if (user) {
        storage.setItem(API_CONFIG.USER_KEY, JSON.stringify(user));
    }
}

/**
 * 获取认证信息
 */
function getAuthInfo() {
    const storage = API_CONFIG.TOKEN_STORAGE === 'sessionStorage' ? sessionStorage : localStorage;
    
    return {
        token: storage.getItem(API_CONFIG.TOKEN_KEY),
        user: JSON.parse(storage.getItem(API_CONFIG.USER_KEY) || 'null')
    };
}

/**
 * 清除认证信息
 */
function clearAuthInfo() {
    const storage = API_CONFIG.TOKEN_STORAGE === 'sessionStorage' ? sessionStorage : localStorage;
    storage.removeItem(API_CONFIG.TOKEN_KEY);
    storage.removeItem(API_CONFIG.USER_KEY);
}

// 导出配置和函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_CONFIG,
        getCurrentAPI,
        buildApiUrl,
        encryptPassword,
        parseApiResponse,
        saveAuthInfo,
        getAuthInfo,
        clearAuthInfo
    };
}

