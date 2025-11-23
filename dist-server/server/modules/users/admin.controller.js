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
import User from '../../models/User.js';
// Get all users with advanced filtering and pagination
export var getAllUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, limit, role, isActive, search, _d, sortBy, _e, sortOrder, filter, sort, users, totalUsers, totalPages, error_1;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 3, , 4]);
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, role = _a.role, isActive = _a.isActive, search = _a.search, _d = _a.sortBy, sortBy = _d === void 0 ? 'createdAt' : _d, _e = _a.sortOrder, sortOrder = _e === void 0 ? 'desc' : _e;
                console.log('📋 Fetching users with filters:', {
                    page: page,
                    limit: limit,
                    role: role,
                    isActive: isActive,
                    search: search,
                    sortBy: sortBy,
                    sortOrder: sortOrder
                });
                filter = {};
                if (role && ['admin', 'editor', 'viewer'].includes(role)) {
                    filter.role = role;
                }
                if (isActive !== undefined) {
                    filter.isActive = isActive === 'true';
                }
                if (search) {
                    filter.$or = [
                        { firstName: { $regex: search, $options: 'i' } },
                        { lastName: { $regex: search, $options: 'i' } },
                        { username: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } }
                    ];
                }
                sort = {};
                sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
                return [4 /*yield*/, User.find(filter)
                        .select('-password -loginAttempts -lockUntil')
                        .sort(sort)
                        .limit(Number(limit))
                        .skip((Number(page) - 1) * Number(limit))
                        .lean()];
            case 1:
                users = _f.sent();
                return [4 /*yield*/, User.countDocuments(filter)];
            case 2:
                totalUsers = _f.sent();
                totalPages = Math.ceil(totalUsers / Number(limit));
                console.log("\u2705 Found ".concat(users.length, " users out of ").concat(totalUsers, " total"));
                res.json({
                    success: true,
                    users: users,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        totalUsers: totalUsers,
                        totalPages: totalPages,
                        hasNext: Number(page) < totalPages,
                        hasPrev: Number(page) > 1
                    },
                    filters: {
                        role: role || 'all',
                        isActive: isActive || 'all',
                        search: search || ''
                    }
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _f.sent();
                console.error('❌ Get users error:', error_1);
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch users',
                    error: process.env.NODE_ENV === 'development' ? error_1.message : undefined
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Create new user with validation
export var createUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password, _b, role, _c, permissions, firstName, lastName, existingUser, field, user, userResponse, error_2, errors;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 4, , 5]);
                _a = req.body, username = _a.username, email = _a.email, password = _a.password, _b = _a.role, role = _b === void 0 ? 'editor' : _b, _c = _a.permissions, permissions = _c === void 0 ? ['create:articles', 'edit:articles'] : _c, firstName = _a.firstName, lastName = _a.lastName;
                console.log('👤 Creating new user:', { username: username, email: email, role: role });
                // Validation
                if (!username || !email || !password || !firstName || !lastName) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: 'All fields are required: firstName, lastName, username, email, password'
                        })];
                }
                if (password.length < 6) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: 'Password must be at least 6 characters'
                        })];
                }
                if (!['admin', 'editor', 'viewer'].includes(role)) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: 'Role must be admin, editor, or viewer'
                        })];
                }
                return [4 /*yield*/, User.findOne({
                        $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
                    })];
            case 1:
                existingUser = _d.sent();
                if (existingUser) {
                    field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
                    return [2 /*return*/, res.status(409).json({
                            success: false,
                            message: "User with this ".concat(field, " already exists")
                        })];
                }
                user = new User({
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    username: username.toLowerCase().trim(),
                    email: email.toLowerCase().trim(),
                    password: password,
                    role: role,
                    permissions: permissions,
                    isActive: true,
                    isApproved: true
                });
                return [4 /*yield*/, user.save()];
            case 2:
                _d.sent();
                return [4 /*yield*/, User.findById(user._id)
                        .select('-password -loginAttempts -lockUntil')];
            case 3:
                userResponse = _d.sent();
                console.log('✅ User created successfully:', userResponse.username);
                res.status(201).json({
                    success: true,
                    message: 'User created successfully',
                    user: userResponse
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _d.sent();
                console.error('❌ Create user error:', error_2);
                if (error_2.name === 'ValidationError') {
                    errors = Object.values(error_2.errors).map(function (e) { return e.message; });
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: 'Validation failed',
                            errors: errors
                        })];
                }
                res.status(500).json({
                    success: false,
                    message: 'Failed to create user',
                    error: process.env.NODE_ENV === 'development' ? error_2.message : undefined
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
// Update user with comprehensive validation
export var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, username, email, role, permissions, firstName, lastName, isActive, profile, user, existingUser, field, updateData, updatedUser, error_3, errors;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                id = req.params.id;
                _a = req.body, username = _a.username, email = _a.email, role = _a.role, permissions = _a.permissions, firstName = _a.firstName, lastName = _a.lastName, isActive = _a.isActive, profile = _a.profile;
                console.log('✏️ Updating user:', id, {
                    username: username,
                    email: email,
                    role: role,
                    isActive: isActive
                });
                return [4 /*yield*/, User.findById(id)];
            case 1:
                user = _c.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({
                            success: false,
                            message: 'User not found'
                        })];
                }
                // Prevent self-modification of critical fields
                if (user._id.toString() === ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString())) {
                    if (isActive !== undefined && !isActive) {
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: 'Cannot deactivate your own account'
                            })];
                    }
                    if (role && role !== user.role) {
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                message: 'Cannot change your own role'
                            })];
                    }
                }
                if (!(username || email)) return [3 /*break*/, 3];
                return [4 /*yield*/, User.findOne({
                        $and: [
                            { _id: { $ne: id } },
                            {
                                $or: [
                                    { email: email === null || email === void 0 ? void 0 : email.toLowerCase() },
                                    { username: username === null || username === void 0 ? void 0 : username.toLowerCase() }
                                ].filter(Boolean)
                            }
                        ]
                    })];
            case 2:
                existingUser = _c.sent();
                if (existingUser) {
                    field = existingUser.email === (email === null || email === void 0 ? void 0 : email.toLowerCase()) ? 'email' : 'username';
                    return [2 /*return*/, res.status(409).json({
                            success: false,
                            message: "User with this ".concat(field, " already exists")
                        })];
                }
                _c.label = 3;
            case 3:
                updateData = {};
                if (username)
                    updateData.username = username.toLowerCase().trim();
                if (email)
                    updateData.email = email.toLowerCase().trim();
                if (firstName)
                    updateData.firstName = firstName.trim();
                if (lastName)
                    updateData.lastName = lastName.trim();
                if (role)
                    updateData.role = role;
                if (permissions)
                    updateData.permissions = permissions;
                if (typeof isActive === 'boolean')
                    updateData.isActive = isActive;
                if (profile)
                    updateData.profile = __assign(__assign({}, user.profile), profile);
                return [4 /*yield*/, User.findByIdAndUpdate(id, { $set: updateData }, {
                        new: true,
                        runValidators: true
                    }).select('-password -loginAttempts -lockUntil')];
            case 4:
                updatedUser = _c.sent();
                console.log('✅ User updated successfully:', updatedUser.username);
                res.json({
                    success: true,
                    message: 'User updated successfully',
                    user: updatedUser
                });
                return [3 /*break*/, 6];
            case 5:
                error_3 = _c.sent();
                console.error('❌ Update user error:', error_3);
                if (error_3.name === 'ValidationError') {
                    errors = Object.values(error_3.errors).map(function (e) { return e.message; });
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: 'Validation failed',
                            errors: errors
                        })];
                }
                res.status(500).json({
                    success: false,
                    message: 'Failed to update user',
                    error: process.env.NODE_ENV === 'development' ? error_3.message : undefined
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
// Toggle user activation with safety checks
export var toggleUserActivation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = req.params.id;
                console.log('🔧 Toggling user activation:', id);
                return [4 /*yield*/, User.findById(id)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({
                            success: false,
                            message: 'User not found'
                        })];
                }
                // Prevent self-deactivation
                if (user._id.toString() === ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: 'Cannot deactivate your own account'
                        })];
                }
                // Toggle activation
                user.isActive = !user.isActive;
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                console.log('✅ User activation toggled:', {
                    username: user.username,
                    newStatus: user.isActive
                });
                res.json({
                    success: true,
                    message: "User ".concat(user.isActive ? 'activated' : 'deactivated', " successfully"),
                    isActive: user.isActive,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                console.error('❌ Toggle activation error:', error_4);
                res.status(500).json({
                    success: false,
                    message: 'Failed to update user status',
                    error: process.env.NODE_ENV === 'development' ? error_4.message : undefined
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Delete user with comprehensive checks
export var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, adminCount, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                id = req.params.id;
                console.log('🗑️ Deleting user:', id);
                return [4 /*yield*/, User.findById(id)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({
                            success: false,
                            message: 'User not found'
                        })];
                }
                // Prevent self-deletion
                if (user._id.toString() === ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: 'Cannot delete your own account'
                        })];
                }
                if (!(user.role === 'admin')) return [3 /*break*/, 3];
                return [4 /*yield*/, User.countDocuments({ role: 'admin', isActive: true })];
            case 2:
                adminCount = _b.sent();
                if (adminCount <= 1) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: 'Cannot delete the last active admin user'
                        })];
                }
                _b.label = 3;
            case 3: 
            // Perform deletion
            return [4 /*yield*/, User.findByIdAndDelete(id)];
            case 4:
                // Perform deletion
                _b.sent();
                console.log('✅ User deleted successfully:', user.username);
                res.json({
                    success: true,
                    message: 'User deleted successfully',
                    deletedUser: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                });
                return [3 /*break*/, 6];
            case 5:
                error_5 = _b.sent();
                console.error('❌ Delete user error:', error_5);
                res.status(500).json({
                    success: false,
                    message: 'Failed to delete user',
                    error: process.env.NODE_ENV === 'development' ? error_5.message : undefined
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
// Get user statistics
export var getUserStats = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var stats, result, error_6;
    var _a, _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _h.trys.push([0, 2, , 3]);
                console.log('📊 Getting user statistics');
                return [4 /*yield*/, User.aggregate([
                        {
                            $facet: {
                                totalUsers: [{ $count: 'count' }],
                                activeUsers: [{ $match: { isActive: true } }, { $count: 'count' }],
                                usersByRole: [
                                    { $group: { _id: '$role', count: { $sum: 1 } } }
                                ],
                                recentRegistrations: [
                                    { $sort: { createdAt: -1 } },
                                    { $limit: 5 },
                                    {
                                        $project: {
                                            username: 1,
                                            email: 1,
                                            role: 1,
                                            createdAt: 1
                                        }
                                    }
                                ],
                                loginActivity: [
                                    { $match: { lastLogin: { $exists: true } } },
                                    { $sort: { lastLogin: -1 } },
                                    { $limit: 10 },
                                    {
                                        $project: {
                                            username: 1,
                                            lastLogin: 1,
                                            loginCount: 1
                                        }
                                    }
                                ]
                            }
                        }
                    ])];
            case 1:
                stats = _h.sent();
                result = {
                    totalUsers: ((_b = (_a = stats[0]) === null || _a === void 0 ? void 0 : _a.totalUsers[0]) === null || _b === void 0 ? void 0 : _b.count) || 0,
                    activeUsers: ((_d = (_c = stats[0]) === null || _c === void 0 ? void 0 : _c.activeUsers[0]) === null || _d === void 0 ? void 0 : _d.count) || 0,
                    usersByRole: ((_e = stats[0]) === null || _e === void 0 ? void 0 : _e.usersByRole) || [],
                    recentRegistrations: ((_f = stats[0]) === null || _f === void 0 ? void 0 : _f.recentRegistrations) || [],
                    loginActivity: ((_g = stats[0]) === null || _g === void 0 ? void 0 : _g.loginActivity) || []
                };
                console.log('✅ User statistics retrieved:', result);
                res.json({
                    success: true,
                    stats: result,
                    timestamp: new Date().toISOString()
                });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _h.sent();
                console.error('❌ Get user stats error:', error_6);
                res.status(500).json({
                    success: false,
                    message: 'Failed to get user statistics'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
