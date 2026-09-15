import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'landvista_super_secure_jwt_secret_2026';

export async function protect(req, res, next) {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Please log in to access this resource.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if live user exists in MongoDB
    try {
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (user) {
        req.user = user;
        return next();
      }
    } catch (e) {
      // Fallback
    }

    // Demo user payload fallback
    req.user = {
      _id: decoded.id,
      name: decoded.name || 'LandVista User',
      email: decoded.email || 'user@landvista.ai',
      role: decoded.role || 'landowner'
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Your session has expired or is invalid. Please log in again.'
    });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || (!roles.includes(req.user.role) && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user?.role}' is not authorized to view this resource.`
      });
    }
    next();
  };
}
