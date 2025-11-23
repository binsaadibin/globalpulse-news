var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
var JWT_SECRET = process.env.JWT_SECRET || 'your_secure_jwt_secret_key_change_in_production_2024';
export var authenticateToken = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded, user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                authHeader = req.headers['authorization'];
                token = authHeader && authHeader.split(' ')[1];
                if (!token) {
                    return [2 /*return*/, res.status(401).json({
                            success: false,
                            message: 'Access token required',
                            code: 'MISSING_TOKEN'
                        })];
                }
                decoded = jwt.verify(token, JWT_SECRET);
                if (!decoded.userId) {
                    return [2 /*return*/, res.status(403).json({
                            success: false,
                            message: 'Invalid token payload',
                            code: 'INVALID_TOKEN'
                        })];
                }
                return [4 /*yield*/, User.findById(decoded.userId).select('-password -loginAttempts -lockUntil')];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(403).json({
                            success: false,
                            message: 'User account not found',
                            code: 'USER_NOT_FOUND'
                        })];
                }
                if (!user.isActive) {
                    return [2 /*return*/, res.status(403).json({
                            success: false,
                            message: 'Account is deactivated. Please contact administrator.',
                            code: 'ACCOUNT_DEACTIVATED'
                        })];
                }
                if (!user.isApproved && user.role !== 'admin') {
                    return [2 /*return*/, res.status(403).json({
                            success: false,
                            message: 'Account pending approval. Please contact administrator.',
                            code: 'ACCOUNT_PENDING_APPROVAL'
                        })];
                }
                req.user = user;
                next();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Auth middleware error:', error_1);
                if (error_1.name === 'TokenExpiredError') {
                    return [2 /*return*/, res.status(401).json({
                            success: false,
                            message: 'Token has expired',
                            code: 'TOKEN_EXPIRED'
                        })];
                }
                if (error_1.name === 'JsonWebTokenError') {
                    return [2 /*return*/, res.status(403).json({
                            success: false,
                            message: 'Invalid token',
                            code: 'INVALID_TOKEN'
                        })];
                }
                return [2 /*return*/, res.status(500).json({
                        success: false,
                        message: 'Authentication failed',
                        code: 'AUTH_FAILED'
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
export var requireRole = function (roles) {
    return function (req, res, next) {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
                code: 'AUTH_REQUIRED'
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Insufficient permissions. Required roles: ".concat(roles.join(', ')),
                code: 'INSUFFICIENT_PERMISSIONS'
            });
        }
        next();
    };
};
export var optionalAuth = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded, user, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                authHeader = req.headers['authorization'];
                token = authHeader && authHeader.split(' ')[1];
                if (!token) return [3 /*break*/, 2];
                decoded = jwt.verify(token, JWT_SECRET);
                return [4 /*yield*/, User.findById(decoded.userId).select('-password -loginAttempts -lockUntil')];
            case 1:
                user = _a.sent();
                if (user && user.isActive && (user.isApproved || user.role === 'admin')) {
                    req.user = user;
                }
                _a.label = 2;
            case 2:
                next();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                // Continue without authentication for optional routes
                next();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
