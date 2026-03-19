import mongoose from 'mongoose';

const vaccineScheduleSchema = new mongoose.Schema({
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    vaccineName: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    status: { type: String, enum: ['planifie', 'fait', 'retard'], default: 'planifie' },
    doneDate: Date
});

export default mongoose.model('VaccineSchedule', vaccineScheduleSchema);