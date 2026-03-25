import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['financier', 'production', 'stock', 'sante']
  },
  author: {
    type: mongoose.Schema.Types.Mixed, // Permet string ou ObjectId
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorRole: {
    type: String,
    required: true,
    enum: ['agent', 'chef', 'admin']
  },
  campaignId: {
    type: mongoose.Schema.Types.Mixed, // Permet string ou ObjectId
    required: true
  },
  period: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'transferred', 'validated', 'rejected', 'approved'],
    default: 'draft'
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  pdfPath: {
    type: String,
    required: true
  },
  transferredTo: {
    type: {
      type: String,
      enum: ['chef', 'admin']
    },
    id: String,
    transferredAt: Date,
    message: String
  },
  validation: {
    validatedAt: Date,
    action: {
      type: String,
      enum: ['validate', 'reject', 'approve']
    },
    comment: String,
    validatorRole: {
      type: String,
      enum: ['chef', 'admin']
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
reportSchema.index({ author: 1, createdAt: -1 });
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ type: 1, createdAt: -1 });
reportSchema.index({ campaignId: 1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;
