// controllers/jobController.js
import Job from '../models/Job.js';
import User from '../models/User.js';

// Create a new job
export const createJob = async (req, res) => {
  try {
    const { title, description, budget, deadline, skills, postedBy } = req.body;
    const job = new Job({ title, description, budget, deadline, skills, postedBy });
    await job.save();
    const populated = await job.populate('postedBy', 'name email');
    res.status(201).json({ message: 'Job created successfully', job: populated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create job', message: err.message });
  }
};

// Accept a job
export const acceptJob = async (req, res) => {
  try {
    const { freelancerId } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.status !== 'Open') return res.status(400).json({ message: 'Job is no longer available' });

    job.acceptedBy = freelancerId;
    job.status = 'Accepted';
    await job.save();

    const populated = await job.populate(['postedBy', 'acceptedBy']);
    res.json({ message: 'Job accepted successfully', job: populated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept job', message: err.message });
  }
};

// Complete a job
export const completeJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: 'Completed' },
      { new: true }
    ).populate(['postedBy', 'acceptedBy']);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job marked as completed', job });
  } catch (err) {
    res.status(500).json({ error: 'Failed to complete job', message: err.message });
  }
};

// Get all jobs (open only for browse)
export const getAllJobs = async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const jobs = await Job.find(filter)
      .populate('postedBy', 'name email')
      .populate('acceptedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs', message: err.message });
  }
};
