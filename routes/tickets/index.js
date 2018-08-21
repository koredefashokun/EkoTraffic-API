import { Router } from 'express';

const router = new Router();

import { User, Ticket } from '../../models';


router.post('/:type/buy', (req, res) => {
  const { type } = req.params;

})

export default router;