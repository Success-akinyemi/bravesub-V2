import jsonwebtoken from 'jsonwebtoken'
import UserModel from '../model/User.js';
import AdminUserModel from '../model/AdminUser.js';

//authorize user routes
export const Protect = async (req, res, next) => {
    const token = req.cookies.bravesubtoken;
    console.log('TOKEN>>', token)
  
    if (!token) {
      return res.status(401).json({ success: false, data: 'Not Allowed Please Login' });
    }
  
    try {
      const user = await new Promise((resolve, reject) => {
        jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      });
  
      req.user = user;
  
      const { id } = user;
      const isUser = await UserModel.findById(id);
      if (!isUser) {
        return res.status(404).json({ success: false, data: 'Invalid user' });
      }
      if (isUser.verified === false) {
        return res.status(404).json({ success: false, data: 'User Account is not verified' });
      }

      req.user = isUser
  
      //console.log('user', isUser)
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ success: false, data: 'Token expired, please login again' });
      } else {
        return res.status(403).json({ success: false, data: 'User Forbidden Please Login' });
      }
    }
  };

  //admin user routes
  export const AdminProtect = async (req, res, next) => {
    //const token = req.cookies.token;
    const token = req.cookies.bravesubAtoken;
    //console.log('ADMTOKEN>>', token)
  
    if (!token) {
      return res.status(401).json({ success: false, data: 'Not Allowed Please Login' });
    }
  
    try {
      const user = await new Promise((resolve, reject) => {
        jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      });
  
      req.admin = user;
  
      const { id } = user;
      const isUser = await UserModel.findById(id);
      if (!isUser) {
        return res.status(404).json({ success: false, data: 'Invalid user' });
      }

      const isAdmin = await AdminUserModel.findOne({ userId: id });
      if (!isAdmin) {
        return res.status(404).json({ success: false, data: 'Invalid user' });
      }
      if (isAdmin.active === false) {
        return res.status(404).json({ success: false, data: 'UnAuthorized' });
      }
      

      req.admin = isAdmin
  
      //console.log('admin', isAdmin)
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ success: false, data: 'Token expired, please login again' });
      } else {
        return res.status(403).json({ success: false, data: 'User Forbidden Please Login' });
      }
    }
  };

  //admin roles routes (staff)
  export const BlockStaff = async (req, res, next) => {
    //const token = req.cookies.token;
    const token = req.cookies.bravesubAtoken;
    //console.log('TOKEN>>', token)
  
    if (!token) {
      return res.status(401).json({ success: false, data: 'Not Allowed Please Login' });
    }
  
    try {
      const user = await new Promise((resolve, reject) => {
        jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      });
  
      req.admin = user;
  
      const { id } = user;
      const isUser = await UserModel.findById(id);
      if (!isUser) {
        return res.status(404).json({ success: false, data: 'Invalid user' });
      }

      const isAdmin = await AdminUserModel.findOne({ userId: id });
      if (!isAdmin) {
        return res.status(404).json({ success: false, data: 'Invalid user' });
      }
      if (!isAdmin.role === 'manager' || 'grandAdmin') {
        return res.status(404).json({ success: false, data: 'UnAuthorized - Not allowed to perform this action' });
      }
      

      req.admin = isAdmin
  
      //console.log('user', isUser)
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ success: false, data: 'Token expired, please login again' });
      } else {
        return res.status(403).json({ success: false, data: 'User Forbidden Please Login' });
      }
    }
  };

  //admin roles routes (managers)
  export const BlockManagers = async (req, res, next) => {
    //const token = req.cookies.token;
    const token = req.cookies.bravesubAtoken;
    //console.log('TOKEN>>', token)
  
    if (!token) {
      return res.status(401).json({ success: false, data: 'Not Allowed Please Login' });
    }
  
    try {
      const user = await new Promise((resolve, reject) => {
        jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      });
  
      req.admin = user;
  
      const { id } = user;
      const isUser = await UserModel.findById(id);
      if (!isUser) {
        return res.status(404).json({ success: false, data: 'Invalid user' });
      }

      const isAdmin = await AdminUserModel.findOne({ userId: id });
      if (!isAdmin) {
        return res.status(404).json({ success: false, data: 'Invalid user' });
      }
      if (!isAdmin.role === 'grandAdmin') {
        return res.status(404).json({ success: false, data: 'UnAuthorized - Not allowed to perform this action' });
      }
      

      req.admin = isAdmin
  
      //console.log('user', isUser)
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ success: false, data: 'Token expired, please login again' });
      } else {
        return res.status(403).json({ success: false, data: 'User Forbidden Please Login' });
      }
    }
  };

  //admin roles routes (grandAdmin)
  export const OnlyGranAdmin = async (req, res, next) => {
    //const token = req.cookies.token;
    const token = req.cookies.bravesubAtoken;
    //console.log('TOKEN>>', token)
  
    if (!token) {
      return res.status(401).json({ success: false, data: 'Not Allowed Please Login' });
    }
  
    try {
      const user = await new Promise((resolve, reject) => {
        jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      });
  
      req.admin = user;
  
      const { id } = user;
      const isUser = await UserModel.findById(id);
      if (!isUser) {
        return res.status(404).json({ success: false, data: 'Invalid user' });
      }

      const isAdmin = await AdminUserModel.findOne({ userId: id });
      if (!isAdmin) {
        return res.status(404).json({ success: false, data: 'Invalid user' });
      }
      if (isAdmin.role === 'staff' || 'manager') {
        return res.status(404).json({ success: false, data: 'UnAuthorized - Not allowed to perform this action' });
      }
      

      req.admin = isAdmin
  
      //console.log('user', isUser)
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ success: false, data: 'Token expired, please login again' });
      } else {
        return res.status(403).json({ success: false, data: 'User Forbidden Please Login' });
      }
    }
  };
  

  //Validate admin passcode