import { Router } from 'express';
import { body } from 'express-validator';
import { createContactMessage } from '../controllers/contactController.js';
import { validateRequest } from '../middleware/validate.js';

const router = Router();

router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2, max: 120 }),
    body('email').trim().isEmail().normalizeEmail(),
    body('subject').trim().isLength({ min: 3, max: 180 }),
    body('message').trim().isLength({ min: 10, max: 2500 })
  ],
  validateRequest,
  createContactMessage
);

export default router;
