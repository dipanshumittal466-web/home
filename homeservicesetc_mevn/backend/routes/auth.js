// backend/routes/auth.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Models } from '../models/index.js';

export default (app) => {
  app.post('/api/auth/register', async (req,res)=>{
    try{
      const { name, email, password, role='user' } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await Models.User.create({ name, email, passwordHash, role });
      const safe = { id: user.id, name: user.name, email: user.email, role: user.role };
      res.json(safe);
    }catch(e){
      res.status(400).json({ error: e.message });
    }
  });

  app.post('/api/auth/login', async (req,res)=>{
    const { email, password } = req.body;
    const type = process.env.DB_TYPE || 'mongo';
    let user;
    if(type==='sql'){
      user = await Models.User.findOne({ where:{ email } });
    }else{
      user = await Models.User.findOne({ email });
    }
    if(!user) return res.status(404).json({ error: 'User not found' });
    const hash = user.passwordHash || user.get('passwordHash');
    const ok = await bcrypt.compare(password, hash);
    if(!ok) return res.status(401).json({ error:'Wrong password' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });
};
