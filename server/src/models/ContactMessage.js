import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    subject: { type: String, required: true, trim: true, minlength: 3, maxlength: 180 },
    message: { type: String, required: true, trim: true, minlength: 10, maxlength: 2500 },
    status: {
      type: String,
      enum: ['new', 'read', 'archived'],
      default: 'new'
    }
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', contactMessageSchema);
