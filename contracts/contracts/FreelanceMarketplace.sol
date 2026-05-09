// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract FreelanceMarketplace {
    uint256 public jobCount = 0;

    enum JobStatus { Open, Accepted, Completed }

    struct Job {
        uint256 id;
        address payable client;
        address payable freelancer;
        string description;
        uint256 payment;
        bool completed;
    }

    mapping(uint256 => Job) public jobs;

    event JobPosted(uint256 indexed jobId, address indexed client, string description, uint256 payment);
    event JobAccepted(uint256 indexed jobId, address indexed freelancer);
    event JobCompleted(uint256 indexed jobId, address indexed freelancer, uint256 payment);

    // Post a new job
    function postJob(string memory _description) public payable {
        require(msg.value > 0, "Payment must be greater than 0");
        require(bytes(_description).length > 0, "Description cannot be empty");

        jobs[jobCount] = Job({
            id: jobCount,
            client: payable(msg.sender),
            freelancer: payable(address(0)),
            description: _description,
            payment: msg.value,
            completed: false
        });

        emit JobPosted(jobCount, msg.sender, _description, msg.value);
        jobCount++;
    }

    // Accept a job
    function acceptJob(uint256 _jobId) public {
        require(_jobId < jobCount, "Job does not exist");
        Job storage job = jobs[_jobId];
        require(job.freelancer == address(0), "Job already accepted");
        require(!job.completed, "Job already completed");
        require(msg.sender != job.client, "Client cannot accept their own job");

        job.freelancer = payable(msg.sender);
        emit JobAccepted(_jobId, msg.sender);
    }

    // Complete a job and release payment
    function completeJob(uint256 _jobId) public {
        require(_jobId < jobCount, "Job does not exist");
        Job storage job = jobs[_jobId];
        require(msg.sender == job.client, "Only client can complete the job");
        require(job.freelancer != address(0), "No freelancer assigned");
        require(!job.completed, "Job already completed");

        job.completed = true;
        job.freelancer.transfer(job.payment);

        emit JobCompleted(_jobId, job.freelancer, job.payment);
    }

    // Get job details
    function getJob(uint256 _jobId) public view returns (
        uint256 id,
        address client,
        address freelancer,
        string memory description,
        uint256 payment,
        bool completed
    ) {
        require(_jobId < jobCount, "Job does not exist");
        Job memory job = jobs[_jobId];
        return (job.id, job.client, job.freelancer, job.description, job.payment, job.completed);
    }

    // Get all jobs (for frontend)
    function getAllJobs() public view returns (Job[] memory) {
        Job[] memory allJobs = new Job[](jobCount);
        for (uint256 i = 0; i < jobCount; i++) {
            allJobs[i] = jobs[i];
        }
        return allJobs;
    }
}
