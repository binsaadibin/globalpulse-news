import mongoose from 'mongoose';
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'editor', 'viewer'],
        default: 'editor'
    },
    permissions: [{
            type: String,
            enum: [
                'all',
                'create:articles',
                'edit:articles',
                'delete:articles',
                'create:videos',
                'edit:videos',
                'delete:videos',
                'manage:users'
            ]
        }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
// Update the updatedAt field before saving
userSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
export var User = mongoose.model('User', userSchema);
