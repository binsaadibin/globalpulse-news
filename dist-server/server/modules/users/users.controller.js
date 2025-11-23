var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import User from '../../models/User.js';
var JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key_here_change_in_production';
var JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
// Generate JWT token
var generateToken = function (userId) {
    return jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
// Initialize default admin users
export var initializeDefaultUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var defaultUsers, _i, defaultUsers_1, userData, existingUser, user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                defaultUsers = [
                    {
                        firstName: 'Global',
                        lastName: 'Admin',
                        username: 'globalplus',
                        email: 'admin@globalpulse.com',
                        password: 'globalplus@4455',
                        role: 'admin',
                        permissions: ['all'],
                        isActive: true,
                        isApproved: true
                    },
                    {
                        firstName: 'Global',
                        lastName: 'News',
                        username: 'globalnews',
                        email: 'news@globalpulse.com',
                        password: 'globalnews@4455',
                        role: 'admin',
                        permissions: ['all'],
                        isActive: true,
                        isApproved: true
                    },
                    {
                        firstName: 'Haroon',
                        lastName: 'Osmani',
                        username: 'haroonosmani',
                        email: 'haroon@globalpulse.com',
                        password: 'haroon@1324',
                        role: 'editor',
                        permissions: ['create:articles', 'edit:articles', 'create:videos', 'edit:videos'],
                        isActive: true,
                        isApproved: true
                    }
                ];
                _i = 0, defaultUsers_1 = defaultUsers;
                _a.label = 1;
            case 1:
                if (!(_i < defaultUsers_1.length)) return [3 /*break*/, 7];
                userData = defaultUsers_1[_i];
                return [4 /*yield*/, User.findOne({
                        $or: [
                            { email: userData.email },
                            { username: userData.username }
                        ]
                    })];
            case 2:
                existingUser = _a.sent();
                if (!!existingUser) return [3 /*break*/, 4];
                user = new User(userData);
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                console.log("\u2705 Created default user: ".concat(userData.username));
                return [3 /*break*/, 6];
            case 4: 
            // Update existing user to ensure correct permissions
            return [4 /*yield*/, User.findOneAndUpdate({ username: userData.username }, __assign(__assign({}, userData), { password: existingUser.password // Keep existing password
                 }))];
            case 5:
                // Update existing user to ensure correct permissions
                _a.sent();
                console.log("\u2705 Updated default user: ".concat(userData.username));
                _a.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 1];
            case 7:
                console.log('✅ Default users initialization completed');
                return [3 /*break*/, 9];
            case 8:
                error_1 = _a.sent();
                console.error('❌ Error initializing default users:', error_1);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
// User login
export var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, user, isValidPassword, token, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, username = _a.username, password = _a.password;
                console.log('🔐 Login attempt:', username);
                if (!username || !password) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: 'Username and password are required'
                        })];
                }
                return [4 /*yield*/, User.findOne({
                        $or: [{ username: username }, { email: username }]
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    console.log('❌ User not found:', username);
                    return [2 /*return*/, res.status(401).json({
                            success: false,
                            message: 'Invalid username or password'
                        })];
                }
                // Check if user is active
                if (!user.isActive) {
                    console.log('❌ User account is inactive:', username);
                    return [2 /*return*/, res.status(401).json({
                            success: false,
                            message: 'Account is deactivated. Please contact administrator.'
                        })];
                }
                // Check if user is approved
                if (!user.isApproved && user.role !== 'admin') {
                    console.log('❌ User account not approved:', username);
                    return [2 /*return*/, res.status(401).json({
                            success: false,
                            message: 'Account pending approval. Please contact administrator.'
                        })];
                }
                return [4 /*yield*/, user.comparePassword(password)];
            case 2:
                isValidPassword = _b.sent();
                if (!isValidPassword) {
                    console.log('❌ Invalid password for:', username);
                    return [2 /*return*/, res.status(401).json({
                            success: false,
                            message: 'Invalid username or password'
                        })];
                }
                // Update last login
                user.lastLogin = new Date();
                return [4 /*yield*/, user.save()];
            case 3:
                _b.sent();
                token = generateToken(user._id.toString());
                console.log('✅ Login successful for:', username);
                res.json({
                    success: true,
                    message: 'Login successful',
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        permissions: user.permissions,
                        isActive: user.isActive,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        lastLogin: user.lastLogin
                    },
                    token: token
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.error('Login error:', error_2);
                res.status(500).json({
                    success: false,
                    message: 'Server error during login'
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
// User registration
export var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, firstName, lastName, username, email, password, existingUser, user, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, firstName = _a.firstName, lastName = _a.lastName, username = _a.username, email = _a.email, password = _a.password;
                console.log('👤 Registration attempt:', username);
                // Validation
                if (!firstName || !lastName || !username || !email || !password) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: 'All fields are required'
                        })];
                }
                if (password.length < 6) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: 'Password must be at least 6 characters'
                        })];
                }
                return [4 /*yield*/, User.findOne({
                        $or: [{ email: email }, { username: username }]
                    })];
            case 1:
                existingUser = _b.sent();
                if (existingUser) {
                    return [2 /*return*/, res.status(409).json({
                            success: false,
                            message: 'User with this email or username already exists'
                        })];
                }
                user = new User({
                    firstName: firstName,
                    lastName: lastName,
                    username: username.toLowerCase(),
                    email: email.toLowerCase(),
                    password: password,
                    role: 'viewer',
                    isActive: true, // Auto-activate for now, can change to false for admin approval
                    isApproved: true, // Auto-approve for now
                    permissions: ['read:articles', 'read:videos']
                });
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                console.log('✅ User registered successfully:', username);
                res.status(201).json({
                    success: true,
                    message: 'Registration successful.',
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        firstName: user.firstName,
                        lastName: user.lastName
                    }
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                console.error('Registration error:', error_3);
                if (error_3.code === 11000) {
                    return [2 /*return*/, res.status(409).json({
                            success: false,
                            message: 'User with this email or username already exists'
                        })];
                }
                res.status(500).json({
                    success: false,
                    message: 'Server error during registration'
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Get current user
export var getMe = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).select('-password')];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({
                            success: false,
                            message: 'User not found'
                        })];
                }
                res.json({
                    success: true,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        permissions: user.permissions,
                        isActive: user.isActive,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        lastLogin: user.lastLogin,
                        createdAt: user.createdAt
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                console.error('Get me error:', error_4);
                res.status(500).json({
                    success: false,
                    message: 'Server error'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
