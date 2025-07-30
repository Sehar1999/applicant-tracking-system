import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User, Role } from '../models';

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ 
        success: false, 
        message: 'Access denied, you need to login first.' 
      });
      return;
    }

    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role, as: 'role' }]
    });

    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
}; 