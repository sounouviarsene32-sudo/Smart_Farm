import mongoose from 'mongoose';
const { Schema } = mongoose;

const todoSchema = new Schema({
    title: { type: String },
    description: { type: String },
    status: { 
        type: String, 
        enum: ['pending', 'in-progress', 'completed', 'cancelled'], 
        default: 'pending' 
    },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high'], 
        default: 'medium' 
    },
    dueDate: { type: Date },
    // Relations
    agent: { type: Schema.Types.ObjectId, ref: 'Agent' },
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign' },
    departement: { type: Schema.Types.ObjectId, ref: 'Departement' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' } // Le Chef ou l'Admin
}, { timestamps: true });

export default mongoose.model('Todo', todoSchema);