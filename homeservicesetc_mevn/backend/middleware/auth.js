// backend/middleware/auth.js
import jwt from 'jsonwebtoken';

export const authMiddleware = (req,res,next)=>{
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if(!token) return res.status(401).json({ error:'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(403).json({ error:'Invalid token' });
  }
};

export const requireRole = (roles=[]) => (req,res,next)=>{
  if(!req.user || !roles.includes(req.user.role)){
    return res.status(403).json({ error:'Forbidden' });
  }
  next();
};
