import mongoose from 'mongoose';
var videoSchema = new mongoose.Schema({
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
    platform: {
        type: String,
        required: true,
        enum: ['youtube', 'facebook', 'tiktok', 'instagram'],
    },
    videoUrl: {
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
export var Video = mongoose.model('Video', videoSchema);
