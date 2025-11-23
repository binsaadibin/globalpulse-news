import mongoose, { Schema } from 'mongoose';
var adminSettingsSchema = new Schema({
    settingKey: {
        type: String,
        required: true,
        unique: true
    },
    settingValue: Schema.Types.Mixed,
    description: String,
    isEnabled: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
export default mongoose.model('AdminSettings', adminSettingsSchema);
