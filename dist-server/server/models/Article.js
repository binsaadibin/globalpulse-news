import mongoose from 'mongoose';
var articleSchema = new mongoose.Schema({
    title: {
        en: { type: String, required: true },
        ar: { type: String, required: true },
        ur: { type: String, required: true },
    },
    description: {
        en: { type: String, required: true },
        ar: { type: String, required: true },
        ur: { type: String, required: true },
    },
    category: {
        type: String,
        required: true,
        enum: ['technology', 'business', 'sports', 'politics', 'environment', 'health'],
    },
    imageUrl: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['published', 'draft'],
        default: 'draft',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});
export var Article = mongoose.model('Article', articleSchema);
