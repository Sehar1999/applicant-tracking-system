import { Request, Response } from "express";
import { User, Role } from '../models';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { validateEmail, validatePassword } from '../utils/validation';
import { UserRole } from '../types';

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
                    role: role
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
                    role: user.role?.name
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