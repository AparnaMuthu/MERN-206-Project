import { Router } from 'express';
import * as borrowController from '../controllers/borrowController.js';

const router = Router();

router.get('/', borrowController.getAll);
router.post('/', borrowController.borrow);
router.put('/:id/return', borrowController.returnBook);

export default router;
