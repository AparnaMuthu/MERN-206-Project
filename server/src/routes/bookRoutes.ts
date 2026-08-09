import { Router } from 'express';
import * as bookController from '../controllers/bookController.js';

const router = Router();

router.get('/', bookController.getAll);
router.get('/:id', bookController.getById);
router.post('/', bookController.create);
router.put('/:id', bookController.update);
router.delete('/:id', bookController.remove);

export default router;
