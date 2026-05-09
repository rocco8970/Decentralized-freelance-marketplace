// routes/jobRoutes.js

import { Router } from 'express';
const router = Router();
import { createJob, getAllJobs, acceptJob, completeJob } from '../controllers/jobController.js';
//const { protect } = require('../middleware/authMiddleware');


router.post('/', createJob);
router.get('/', getAllJobs);
router.post('/:id/accept', acceptJob);
router.post("/:id/complete", completeJob);


export default router;
