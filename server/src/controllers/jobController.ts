import { Response } from 'express';
import { JobDescription } from '../models';
import { AuthRequest } from '../middlewares/auth';
import { UserRole } from '../constants';

// Create new job description
export const createJobDescription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    // Check if user is a recruiter
    if (req.user.role?.name !== UserRole.RECRUITER) {
      res.status(403).json({
        success: false,
        message: 'Only recruiters can create job descriptions'
      });
      return;
    }

    const { description } = req.body;

    if (!description || description.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Job description content is required'
      });
      return;
    }

    const jobDescription = await JobDescription.create({
      description: description.trim(),
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Job description created successfully',
      data: jobDescription
    });
  } catch (error) {
    console.error('Create job description error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create job description';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

// Get all job descriptions for current user
export const getJobDescriptions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    // Check if user is a recruiter
    if (req.user.role?.name !== UserRole.RECRUITER) {
      res.status(403).json({
        success: false,
        message: 'Only recruiters can access job descriptions'
      });
      return;
    }

    const jobDescriptions = await JobDescription.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: jobDescriptions
    });
  } catch (error) {
    console.error('Get job descriptions error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch job descriptions';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

// Get specific job description by ID
export const getJobDescriptionById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    // Check if user is a recruiter
    if (req.user.role?.name !== UserRole.RECRUITER) {
      res.status(403).json({
        success: false,
        message: 'Only recruiters can access job descriptions'
      });
      return;
    }

    const { id } = req.params;

    const jobDescription = await JobDescription.findOne({
      where: { 
        id: parseInt(id), 
        userId: req.user.id 
      }
    });

    if (!jobDescription) {
      res.status(404).json({
        success: false,
        message: 'Job description not found'
      });
      return;
    }

    res.json({
      success: true,
      data: jobDescription
    });
  } catch (error) {
    console.error('Get job description error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch job description';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

// Update job description
export const updateJobDescription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    // Check if user is a recruiter
    if (req.user.role?.name !== UserRole.RECRUITER) {
      res.status(403).json({
        success: false,
        message: 'Only recruiters can update job descriptions'
      });
      return;
    }

    const { id } = req.params;
    const { description } = req.body;

    if (!description || description.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Job description content is required'
      });
      return;
    }

    const jobDescription = await JobDescription.findOne({
      where: { 
        id: parseInt(id), 
        userId: req.user.id 
      }
    });

    if (!jobDescription) {
      res.status(404).json({
        success: false,
        message: 'Job description not found'
      });
      return;
    }

    await jobDescription.update({
      description: description.trim()
    });

    res.json({
      success: true,
      message: 'Job description updated successfully',
      data: jobDescription
    });
  } catch (error) {
    console.error('Update job description error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update job description';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

// Delete job description
export const deleteJobDescription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    // Check if user is a recruiter
    if (req.user.role?.name !== UserRole.RECRUITER) {
      res.status(403).json({
        success: false,
        message: 'Only recruiters can delete job descriptions'
      });
      return;
    }

    const { id } = req.params;

    const jobDescription = await JobDescription.findOne({
      where: { 
        id: parseInt(id), 
        userId: req.user.id 
      }
    });

    if (!jobDescription) {
      res.status(404).json({
        success: false,
        message: 'Job description not found'
      });
      return;
    }

    await jobDescription.destroy();

    res.json({
      success: true,
      message: 'Job description deleted successfully'
    });
  } catch (error) {
    console.error('Delete job description error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete job description';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};
