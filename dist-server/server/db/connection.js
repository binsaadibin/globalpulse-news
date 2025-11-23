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
import mongoose from 'mongoose';
import { initializeDefaultUsers } from '../modules/users/users.controller.js';
var DatabaseManager = /** @class */ (function () {
    function DatabaseManager() {
        this.isConnected = false;
        this.connectionAttempts = 0;
        this.maxConnectionAttempts = 3;
    }
    DatabaseManager.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mongoURI, connectionOptions, conn, error_1, retryDelay_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        mongoURI = process.env.MONGODB_URI || 'mongodb+srv://golbalnews:zulfiqar4455@globalnews.yhhmhpy.mongodb.net/globalpulse?retryWrites=true&w=majority';
                        console.log('🔗 Establishing MongoDB connection...');
                        connectionOptions = {
                            maxPoolSize: 20,
                            minPoolSize: 5,
                            serverSelectionTimeoutMS: 10000,
                            socketTimeoutMS: 45000,
                            heartbeatFrequencyMS: 10000,
                            retryWrites: true,
                            w: 'majority',
                            retryReads: true,
                        };
                        return [4 /*yield*/, mongoose.connect(mongoURI, connectionOptions)];
                    case 1:
                        conn = _a.sent();
                        this.isConnected = true;
                        this.connectionAttempts = 0;
                        console.log("\u2705 MongoDB Connected Successfully:");
                        console.log("   Host: ".concat(conn.connection.host));
                        console.log("   Database: ".concat(conn.connection.name));
                        console.log("   Port: ".concat(conn.connection.port));
                        console.log("   Ready State: ".concat(this.getReadyStateText(conn.connection.readyState)));
                        // Initialize default users
                        return [4 /*yield*/, initializeDefaultUsers()];
                    case 2:
                        // Initialize default users
                        _a.sent();
                        // Set up event listeners
                        this.setupEventListeners(conn.connection);
                        return [2 /*return*/, conn.connection];
                    case 3:
                        error_1 = _a.sent();
                        this.connectionAttempts++;
                        console.error("\u274C MongoDB Connection Attempt ".concat(this.connectionAttempts, " Failed:"), error_1);
                        if (this.connectionAttempts >= this.maxConnectionAttempts) {
                            console.log('💥 Maximum connection attempts reached. Exiting...');
                            throw error_1;
                        }
                        retryDelay_1 = Math.min(1000 * Math.pow(2, this.connectionAttempts), 30000);
                        console.log("\uD83D\uDD04 Retrying connection in ".concat(retryDelay_1, "ms..."));
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                _this.retryTimeout = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                    var connection, retryError_1;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 2, , 3]);
                                                return [4 /*yield*/, this.connect()];
                                            case 1:
                                                connection = _a.sent();
                                                resolve(connection);
                                                return [3 /*break*/, 3];
                                            case 2:
                                                retryError_1 = _a.sent();
                                                reject(retryError_1);
                                                return [3 /*break*/, 3];
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); }, retryDelay_1);
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseManager.prototype.setupEventListeners = function (connection) {
        var _this = this;
        connection.on('connected', function () {
            console.log('✅ MongoDB connection established');
            _this.isConnected = true;
        });
        connection.on('error', function (error) {
            console.error('❌ MongoDB connection error:', error);
            _this.isConnected = false;
        });
        connection.on('disconnected', function () {
            console.log('⚠️ MongoDB connection disconnected');
            _this.isConnected = false;
        });
        connection.on('reconnected', function () {
            console.log('🔄 MongoDB connection reestablished');
            _this.isConnected = true;
        });
        connection.on('close', function () {
            console.log('🔒 MongoDB connection closed');
            _this.isConnected = false;
        });
    };
    DatabaseManager.prototype.getReadyStateText = function (readyState) {
        switch (readyState) {
            case 0: return 'Disconnected';
            case 1: return 'Connected';
            case 2: return 'Connecting';
            case 3: return 'Disconnecting';
            default: return 'Unknown';
        }
    };
    DatabaseManager.prototype.getConnectionStatus = function () {
        var connection = mongoose.connection;
        return {
            isConnected: this.isConnected && connection.readyState === 1,
            readyState: this.getReadyStateText(connection.readyState)
        };
    };
    DatabaseManager.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.retryTimeout) {
                            clearTimeout(this.retryTimeout);
                        }
                        if (!this.isConnected) return [3 /*break*/, 2];
                        return [4 /*yield*/, mongoose.disconnect()];
                    case 1:
                        _a.sent();
                        this.isConnected = false;
                        console.log('✅ MongoDB connection closed gracefully');
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseManager.prototype.healthCheck = function () {
        return __awaiter(this, void 0, void 0, function () {
            var status, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        status = this.getConnectionStatus();
                        if (!status.isConnected) {
                            return [2 /*return*/, {
                                    status: 'unhealthy',
                                    details: {
                                        readyState: status.readyState,
                                        connectionAttempts: this.connectionAttempts
                                    }
                                }];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        // Test database operation
                        return [4 /*yield*/, mongoose.connection.db.admin().ping()];
                    case 2:
                        // Test database operation
                        _a.sent();
                        return [2 /*return*/, {
                                status: 'healthy',
                                details: {
                                    readyState: status.readyState,
                                    database: mongoose.connection.db.databaseName,
                                    host: mongoose.connection.host
                                }
                            }];
                    case 3:
                        error_2 = _a.sent();
                        return [2 /*return*/, {
                                status: 'unhealthy',
                                details: {
                                    readyState: status.readyState,
                                    error: error_2.message
                                }
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return DatabaseManager;
}());
// Create singleton instance
var databaseManager = new DatabaseManager();
export var connectDB = function () { return databaseManager.connect(); };
export var getDBStatus = function () { return databaseManager.getConnectionStatus(); };
export var disconnectDB = function () { return databaseManager.disconnect(); };
export var healthCheckDB = function () { return databaseManager.healthCheck(); };
