import { Router } from 'express';
import { body } from 'express-validator';
import { createAppointment } from '../controllers/appointmentController.js';
import { validateRequest } from '../middleware/validate.js';

const router = Router();

router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2, max: 120 }),
    body('email').trim().isEmail().normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false }),
    body('phone').trim().isLength({ min: 7, max: 40 }),
    body('service').trim().isLength({ min: 2, max: 120 }),
    body('preferredDate').custom((value) => {
      if (!value) return false;
      const d = new Date(value);
      return !isNaN(d.getTime());
    }).toDate(),
    body('preferredTime').trim().matches(/^(0?[1-9]|1[0-2]|2[0-3]|[0-9]):[0-5]\d(:[0-5]\d)?(\s?[APap][Mm])?$/),
    body('notes').optional({ checkFalsy: true }).trim().isLength({ max: 1200 })
  ],
  validateRequest,
  createAppointment
);

export default router;
