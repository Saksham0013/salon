import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    service: { type: String, required: true, trim: true, maxlength: 120 },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true, trim: true, maxlength: 20 },
    notes: { type: String, trim: true, maxlength: 1200 },
    status: {
      type: String,
      enum: ['requested', 'confirmed', 'declined'],
      default: 'requested'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', appointmentSchema);
