import { Request, Response } from "express";
import { User, Role, Attachment } from '../models';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { validateEmail, validatePassword } from '../utils/validation';
import { UserRole } from '../types';
import { AuthRequest } from '../middlewares/auth';

// Standardized response function
const sendResponse = (res: Response, status: number, message: string, data?: any) => {
    res.status(status).json({
        status,
        message,
        data
    })
}

// Register a new user
export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = req.body;

        // Validation
        if (!email || !password || !role) {
            res.status(400).json({
                success: false,
                message: 'Email, password, and role are required'
            });
            return;
        }

        if (!validateEmail(email)) {
            res.status(400).json({
                success: false,
                message: 'Invalid email'
            });
            return;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            res.status(400).json({
                success: false,
                message: passwordValidation.message
            });
            return;
        }

        if (!Object.values(UserRole).includes(role)) {
            res.status(400).json({
                success: false,
                message: 'Invalid role. Must be Recruiter or Applicant'
            });
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
            return;
        }

        // Get role ID
        const roleRecord = await Role.findOne({ where: { name: role } });
        if (!roleRecord) {
            res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
            return;
        }

        // Hash password and create user
        const hashedPassword = await hashPassword(password);
        
        const user = await User.create({
            name: name || null,
            email,
            passwordHash: hashedPassword,
            roleId: roleRecord.id
        });

        // Get profile picture if exists
        const profilePicture = await Attachment.findOne({
            where: { 
                attachableId: user.id, 
                attachableType: 'User', 
                fileType: 'profile' 
            }
        });

        // Generate JWT token
        const token = signToken({
            id: user.id,
            email: user.email,
            roleId: user.roleId
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: role,
                    profilePicture: profilePicture?.fileUrl || null
                },
                accessToken: token
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
            return;
        }

        if (!validateEmail(email)) {
            res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
            return;
        }

        // Find user with role
        const user = await User.findOne({
            where: { email },
            include: [{ model: Role, as: 'role' }]
        });

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }

        // Get profile picture if exists
        const profilePicture = await Attachment.findOne({
            where: { 
                attachableId: user.id, 
                attachableType: 'User', 
                fileType: 'profile' 
            }
        });

        // Generate JWT token
        const token = signToken({
            id: user.id,
            email: user.email,
            roleId: user.roleId
        });

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role?.name,
                    profilePicture: profilePicture?.fileUrl || null
                },
                accessToken: token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }

        const { name, email, currentPassword, newPassword } = req.body;

        // Find user with role
        const user = await User.findOne({
            where: { id: req.user.id },
            include: [{ model: Role, as: 'role' }]
        });

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        // Handle password change if both passwords are provided
        if (currentPassword && newPassword) {
            // Verify current password
            const isCurrentPasswordValid = await comparePassword(currentPassword, user.passwordHash);
            if (!isCurrentPasswordValid) {
                res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
                return;
            }

            // Validate new password
            const passwordValidation = validatePassword(newPassword);
            if (!passwordValidation.isValid) {
                res.status(400).json({
                    success: false,
                    message: passwordValidation.message
                });
                return;
            }

            // Hash new password
            const hashedNewPassword = await hashPassword(newPassword);
            await user.update({ passwordHash: hashedNewPassword });
        }

        // Handle profile info update (name, email)
        if (name !== undefined || email !== undefined) {
            // Validate email if provided and different from current
            if (email && email !== user.email) {
                if (!validateEmail(email)) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid email format'
                    });
                    return;
                }

                // Check if email is already taken by another user
                const existingUser = await User.findOne({ 
                    where: { email }
                });
                
                if (existingUser && existingUser.id !== user.id) {
                    res.status(409).json({
                        success: false,
                        message: 'Email is already taken'
                    });
                    return;
                }
            }

            // Update name and email if provided
            const updateData: any = {};
            if (name !== undefined) updateData.name = name;
            if (email && email !== user.email) updateData.email = email;

            if (Object.keys(updateData).length > 0) {
                await user.update(updateData);
            }
        }

        // Get updated user data with profile picture
        const updatedUser = await User.findOne({
            where: { id: req.user.id },
            include: [{ model: Role, as: 'role' }]
        });

        const profilePicture = await Attachment.findOne({
            where: { 
                attachableId: req.user.id, 
                attachableType: 'User', 
                fileType: 'profile' 
            }
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: updatedUser!.id,
                    name: updatedUser!.name,
                    email: updatedUser!.email,
                    role: updatedUser!.role?.name,
                    profilePicture: profilePicture?.fileUrl || null
                }
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};