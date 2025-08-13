import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { Attachment, User, JobDescription } from '../models';
import { FailedFile, FileComparisonResponse, SuccessfulFile } from '../types';
import { compareCVWithJD } from '../utils/openai';
import { validateFileType, validateParsableFileType } from '../utils/validation';
import { UserRole } from '../constants';


// File parsing libraries (using require for better compatibility)
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface AuthRequest extends Request {
  user?: User;
}

// Multer configuration for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (validateFileType(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDF, and Word documents are allowed.'));
    }
  }
});

const uploadToCloudinary = async (file: Express.Multer.File, userId: number): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const publicId = `ats-app/users/${userId}/${Date.now()}-${file.originalname.split('.')[0]}`;
    
    const uploadOptions = {
      folder: `ats-app/users/${userId}`,
      public_id: publicId,
      resource_type: 'auto' as const, // Automatically detect file type
      unique_filename: true,
    };

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result!.secure_url,
            publicId: result!.public_id
          });
        }
      }
    ).end(file.buffer);
  });
};

const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};



export const updateProfilePicture = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file provided'
      });
      return;
    }

    // Validate file type - only images allowed for profile pictures
    if (!req.file.mimetype.startsWith('image/')) {
      res.status(400).json({
        success: false,
        message: 'Only image files are allowed for profile pictures'
      });
      return;
    }

    // Find existing profile picture
    const existingProfilePicture = await Attachment.findOne({
      where: { 
        attachableId: req.user.id, 
        attachableType: 'User', 
        fileType: 'profile' 
      }
    });

    // Delete old image from Cloudinary if exists
    if (existingProfilePicture) {
      try {
        // Extract public ID from Cloudinary URL
        const urlParts = existingProfilePicture.fileUrl.split('/');
        const fileNameWithExt = urlParts[urlParts.length - 1];
        const publicId = `ats-app/users/${req.user.id}/${fileNameWithExt.split('.')[0]}`;
        
        await new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
              console.error('Error deleting old profile picture from Cloudinary:', error);
              // Don't fail the upload if deletion fails, just log it
              resolve(result);
            } else {
              resolve(result);
            }
          });
        });
      } catch (error) {
        console.error('Error deleting old profile picture:', error);
        // Continue with upload even if deletion fails
      }
    }

    // Upload new image to Cloudinary
    const { url: fileUrl } = await uploadToCloudinary(req.file, req.user.id);

    // Update or create attachment record
    if (existingProfilePicture) {
      await existingProfilePicture.update({
        fileUrl,
        uploadedAt: new Date()
      });
    } else {
      await Attachment.create({
        fileUrl,
        fileType: 'profile',
        attachableId: req.user.id,
        attachableType: 'User',
        uploadedAt: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      data: {
        profilePicture: fileUrl
      }
    });

  } catch (error) {
    console.error('Profile picture update error:', error);
    res.status(500).json({
      success: false,
      message: 'Profile picture update failed'
    });
  }
};

export const uploadFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file provided'
      });
      return;
    }

    const { fileType } = req.body;
    
    if (!fileType || !['cv', 'image'].includes(fileType)) {
      res.status(400).json({
        success: false,
        message: 'Invalid file type. Must be "cv" or "image"'
      });
      return;
    }

    // Upload to Cloudinary
    const { url: fileUrl, publicId } = await uploadToCloudinary(req.file, req.user.id);

    // Save attachment record
    const attachment = await Attachment.create({
      fileUrl,
      fileType,
      attachableId: req.user.id,
      attachableType: 'User',
      uploadedAt: new Date()
    });

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: attachment.id,
        fileUrl: attachment.fileUrl,
        fileType: attachment.fileType,
        uploadedAt: attachment.uploadedAt
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed'
    });
  }
};

export const getUserFiles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const attachments = await Attachment.findAll({
      where: {
        attachableId: req.user.id,
        attachableType: 'User',
        fileType: 'cv'
      },
      order: [['uploadedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: attachments
    });

  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve files'
    });
  }
};

export const deleteFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const { fileId } = req.params;
    
    const attachment = await Attachment.findOne({
      where: {
        id: fileId,
        attachableId: req.user.id,
        attachableType: 'User'
      }
    });

    if (!attachment) {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
      return;
    }

    // Extract public ID from Cloudinary URL
    // URL format: https://res.cloudinary.com/cloud-name/resource_type/upload/v123456/folder/public_id.ext
    try {
      const urlParts = attachment.fileUrl.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const versionIndex = urlParts.findIndex(part => part.startsWith('v'));
      
      if (versionIndex !== -1 && versionIndex < urlParts.length - 1) {
        const folderAndId = urlParts.slice(versionIndex + 1).join('/');
        const publicId = folderAndId.includes('.') ? folderAndId.substring(0, folderAndId.lastIndexOf('.')) : folderAndId;
        
        // Delete from Cloudinary
        await deleteFromCloudinary(publicId);
      }
    } catch (cloudinaryError) {
      console.error('Cloudinary deletion error:', cloudinaryError);
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Delete from database
    await attachment.destroy();

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'File deletion failed'
    });
  }
};

export const fetchFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const { fileId } = req.params;
    
    const attachment = await Attachment.findOne({
      where: {
        id: fileId,
        attachableId: req.user.id,
        attachableType: 'User'
      }
    });

    if (!attachment) {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
      return;
    }

    try {
      // Fetch file from Cloudinary using axios for better error handling
      const response = await axios({
        method: 'GET',
        url: attachment.fileUrl,
        responseType: 'stream',
        timeout: 30000, // 30 second timeout
      });

      // Extract filename from URL or use a default
      const urlParts = attachment.fileUrl.split('/');
      const fileNameWithExtension = urlParts[urlParts.length - 1];
      const fileExt = path.extname(fileNameWithExtension).toLowerCase() || '.pdf';
      const fileName = `${attachment.id}${fileExt}`;

      // Set appropriate headers
      res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
      if (response.headers['content-length']) {
        res.setHeader('Content-Length', response.headers['content-length']);
      }
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      // Pipe the response
      response.data.pipe(res);

    } catch (axiosError: any) {
      console.error('Cloudinary fetch error:', axiosError.response?.status, axiosError.message);
      
      if (axiosError.response?.status === 401) {
        res.status(404).json({
          success: false,
          message: 'File access denied - please check Cloudinary configuration'
        });
      } else if (axiosError.response?.status === 404) {
        res.status(404).json({
          success: false,
          message: 'File not found in storage'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to fetch file from storage'
        });
      }
      return;
    }

  } catch (error) {
    console.error('File fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch file'
    });
  }
};

const parseFileContent = async (file: Express.Multer.File): Promise<string> => {
  try {
    const buffer = file.buffer;
    const mimetype = file.mimetype;

    if (mimetype === 'application/pdf') {
      // For PDF files
      const data = await pdf(buffer);
      return data.text;
    } else if (mimetype.includes('word') || mimetype.includes('docx') || mimetype.includes('doc')) {
      // For Word documents
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } else {
      throw new Error(`Unsupported file type: ${mimetype}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to parse file ${file.originalname}: ${errorMessage}`);
  }
};

export const compareFiles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const { jobDescription, jobDescriptionId, fileIds } = req.body;
    const newFiles = req.files as Express.Multer.File[] || [];
    
    // Parse fileIds if it's a string (from FormData)
    const parsedFileIds = fileIds ? (Array.isArray(fileIds) ? fileIds : fileIds.split(',').filter(Boolean)) : [];
    
    // Validation: Must have either fileIds OR new files, and at least one file total
    if (parsedFileIds.length === 0 && newFiles.length === 0) {
      res.status(400).json({
        success: false,
        message: 'At least one file is required (either existing or new)'
      });
      return;
    }

    // Check total file count limit (5 for recruiters, 1 for applicants)
    const totalFiles = parsedFileIds.length + newFiles.length;
    const maxFiles = req.user.role?.name === UserRole.RECRUITER ? 5 : 1;
    
    if (totalFiles > maxFiles) {
      res.status(400).json({
        success: false,
        message: `You can only process up to ${maxFiles} file${maxFiles > 1 ? 's' : ''}`
      });
      return;
    }

    // Validation: Must have either jobDescription OR jobDescriptionId
    if (!jobDescription && !jobDescriptionId) {
      res.status(400).json({
        success: false,
        message: 'Either jobDescription or jobDescriptionId is required'
      });
      return;
    }

    let actualJobDescription: string;
    let savedJobDescriptionId: number | null = null;

    if (jobDescriptionId) {
      // Scenario 2: Use existing JD (only for recruiters)
      if (req.user.role?.name !== UserRole.RECRUITER) {
        res.status(403).json({
          success: false,
          message: 'Only recruiters can use saved job descriptions'
        });
        return;
      }

      const existingJD = await JobDescription.findOne({
        where: { id: parseInt(jobDescriptionId), userId: req.user.id }
      });

      if (!existingJD) {
        res.status(404).json({
          success: false,
          message: 'Job description not found'
        });
        return;
      }

      actualJobDescription = existingJD.description;
      savedJobDescriptionId = existingJD.id;

    } else {
      // Scenario 1: New JD content
      actualJobDescription = jobDescription;

      // Save new JD only if user is Recruiter
      if (req.user.role?.name === UserRole.RECRUITER) {
        try {
          const newJD = await JobDescription.create({
            description: jobDescription,
            userId: req.user.id
          });
          savedJobDescriptionId = newJD.id;
        } catch (error) {
          console.error('Error saving job description:', error);
          // Continue with comparison even if JD saving fails
        }
      }
    }

    // Validate new file types for parsing
    for (const file of newFiles) {
      if (!validateParsableFileType(file.mimetype)) {
        res.status(400).json({
          success: false,
          message: `File ${file.originalname} is not supported. Only PDF and Word documents are allowed.`
        });
        return;
      }
    }

    // Process existing files (by fileIds)
    const existingFilePromises = parsedFileIds.map(async (fileId: string) => {
      try {
        const attachment = await Attachment.findOne({
          where: {
            id: parseInt(fileId),
            attachableId: req.user!.id,
            attachableType: 'User',
            fileType: 'cv'
          }
        });

        if (!attachment) {
          return {
            success: false,
            fileName: `File ID: ${fileId}`,
            error: 'File not found or access denied'
          };
        }

        // Download file from Cloudinary
        const response = await axios({
          method: 'GET',
          url: attachment.fileUrl,
          responseType: 'arraybuffer',
          timeout: 30000,
        });
        // Detect file type using magic bytes since Cloudinary URL doesn't preserve extensions
        const buffer = Buffer.from(response.data);
        let correctMimetype = 'application/pdf'; // default
        
        // Check magic bytes for file type detection
        if (buffer.length >= 4) {
          const magicBytes = buffer.slice(0, 4);
          
          // ZIP format (used by .docx files)
          if (magicBytes[0] === 0x50 && magicBytes[1] === 0x4B && magicBytes[2] === 0x03 && magicBytes[3] === 0x04) {
            correctMimetype = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          }
          // PDF format
          else if (magicBytes[0] === 0x25 && magicBytes[1] === 0x50 && magicBytes[2] === 0x44 && magicBytes[3] === 0x46) {
            correctMimetype = 'application/pdf';
          }
          // DOC format (OLE compound file)
          else if (magicBytes[0] === 0xD0 && magicBytes[1] === 0xCF && magicBytes[2] === 0x11 && magicBytes[3] === 0xE0) {
            correctMimetype = 'application/msword';
          }
        }

        // Create a mock file object for parsing
        const mockFile: Express.Multer.File = {
          buffer: Buffer.from(response.data),
          originalname: attachment.fileUrl.split('/').pop() || 'unknown.pdf',
          mimetype: correctMimetype,
          fieldname: 'file',
          encoding: '7bit',
          size: response.data.length,
          destination: '',
          filename: '',
          path: '',
          stream: require('stream').Readable.from(Buffer.from(response.data))
        };

        // Parse file content
        const fileContent = await parseFileContent(mockFile);
        // OpenAI comparison
        const comparisonResult = await compareCVWithJD(fileContent, actualJobDescription);
        
        return {
          success: true,
          data: {
            id: attachment.id,
            fileName: attachment.fileUrl.split('/').pop() || 'unknown.pdf',
            fileUrl: attachment.fileUrl,
            score: comparisonResult.score,
            feedback: comparisonResult.feedback
          }
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          success: false,
          fileName: `File ID: ${fileId}`,
          error: errorMessage
        };
      }
    });

    // Process new files
    const newFilePromises = newFiles.map(async (file, index) => {
      try {
        // Upload to Cloudinary
        const { url: fileUrl, publicId } = await uploadToCloudinary(file, req.user!.id);

        // Save to database
        const attachment = await Attachment.create({
          fileUrl,
          fileType: 'cv',
          attachableId: req.user!.id,
          attachableType: 'User',
          uploadedAt: new Date()
        });

        // Parse file content
        const fileContent = await parseFileContent(file);

        // OpenAI comparison - parallel processing
        const comparisonResult = await compareCVWithJD(fileContent, actualJobDescription);
        
        return {
          success: true,
          data: {
            id: attachment.id,
            fileName: file.originalname,
            fileUrl: attachment.fileUrl,
            score: comparisonResult.score,
            feedback: comparisonResult.feedback
          }
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.log('Error message: ', errorMessage);
        return {
          success: false,
          fileName: file.originalname,
          error: errorMessage
        };
      }
    });

    // Process all files in parallel
    const allPromises = [...existingFilePromises, ...newFilePromises];
    const results = await Promise.allSettled(allPromises);
    
    // Separate successful and failed results
    const successfulFiles: SuccessfulFile[] = [];
    const failedFiles: FailedFile[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const fileResult = result.value;
        if (fileResult.success && fileResult.data) {
          successfulFiles.push(fileResult.data);
        } else {
          failedFiles.push({
            fileName: fileResult.fileName,
            error: fileResult.error || 'Unknown error'
          });
        }
      } else {
        failedFiles.push({
          fileName: 'Unknown file',
          error: result.reason?.message || 'Unknown error'
        });
      }
    });

    const comparisonResponse: FileComparisonResponse = {
      success: true,
      message: 'Job is done',
      data: {
        filesProcessed: successfulFiles.length,
        totalFiles: totalFiles,
        successfulFiles,
        failedFiles,
        jobDescription: actualJobDescription,
        jobDescriptionId: savedJobDescriptionId
      }
    }
    res.json(comparisonResponse);

  } catch (error) {
    console.error('File comparison error:', error);
    const errorMessage = error instanceof Error ? error.message : 'File comparison failed';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

export { upload };
