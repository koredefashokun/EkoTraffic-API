import { Router } from 'express';
import users from './users';
import tickets from './tickets';

const router = new Router();

router.use('/users', users);
router.use('/tickets', tickets);

export default router;