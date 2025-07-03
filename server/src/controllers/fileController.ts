import { v2 as cloudinary } from 'cloudinary';
import { Request, Response } from 'express';
import https from 'https';
import multer from 'multer';
import { Attachment, User } from '../models';
import { validateFileType } from '../utils/validation';

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
        attachableType: 'User'
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

    // Fetch file from Cloudinary and stream it back
    https.get(attachment.fileUrl, (response) => {
      if (response.statusCode !== 200) {
        res.status(404).json({
          success: false,
          message: 'File not found in storage'
        });
        return;
      }

      // Set appropriate headers
      res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
      res.setHeader('Content-Length', response.headers['content-length'] || '0');
      res.setHeader('Content-Disposition', `attachment; filename="${attachment.id}-file"`);

      // Pipe the response
      response.pipe(res);
    }).on('error', (error) => {
      console.error('File fetch error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch file'
      });
    });

  } catch (error) {
    console.error('File fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch file'
    });
  }
};

export { upload };
