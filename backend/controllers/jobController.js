// controllers/jobController.js
import Job from '../models/Job.js';

// Create a new job
export const createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json({ message: 'Job created successfully', job });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create job', message: err.message });
  }
};

// Accept a job
export const acceptJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { freelancer: req.body.freelancer, status: 'Accepted' },
      { new: true }
    );
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job accepted', job });
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
    );
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job marked as completed', job });
  } catch (err) {
    res.status(500).json({ error: 'Failed to complete job', message: err.message });
  }
};

// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs', message: err.message });
  }
};
