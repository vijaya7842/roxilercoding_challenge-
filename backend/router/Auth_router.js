const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {verifyJWT, isadmin, isNormalUser} = require('../middleware/verifyJWT'); 
require('dotenv').config();

const jwt_secreat = process.env.JWT_SECRET; 


router.post('/register', async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !address || !role) {
    return res.status(400).json({ msg: "All feilds are requred" });
  }

  const allowedRoles = ['systemAdmin', 'normalUser', 'storeOwner'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ msg: "Invalide role type" });
  }

  try {
    const [existUser] = await req.db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existUser.length > 0) {
      return res.status(400).json({ msg: "Email alredy exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    await req.db.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashPass, address, role]
    );

    const [newUser] = await req.db.query("SELECT * FROM users WHERE email = ?", [email]);

    const token = jwt.sign(
      { id: newUser[0].id, role: newUser[0].role,name:newUser[0].name,email:newUser[0].email },
      jwt_secreat,
      { expiresIn: '1d' }
      
    );
    const success=true

    return res.status(200).json({ token, msg: "Regestration succesfull" ,success});

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error while registring user", err });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "All feilds are requred" });
  }

  try {
    const [user] = await req.db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (user.length === 0) {
      return res.status(404).json({ msg: "User not fount" });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalide credintials" });
    }

    const token = jwt.sign(
      { id: user[0].id, role: user[0].role,name:user[0].name,email:user[0].email },
      jwt_secreat,
      { expiresIn: '1d' }
    );
    const success=true

    return res.status(200).json({ token, role: user[0].role, msg: "Login Succesfull",success });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internel Server Error", err });
  }
});


router.get('/userCount', verifyJWT, isadmin, async (req, res) => {
  try {
    const [result] = await req.db.query("SELECT COUNT(*) AS count FROM users");
    const success=true
    return res.status(200).json({ usersCount: result[0].count,success  });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server Errror", err });
  }
});
router.get('/listOfUsers', verifyJWT, isadmin, async (req, res) => {
    try {
        const [users] = await req.db.query("SELECT id, name, email, address, role, created_at From users")
        const success = true;
        return res.status(200).json({users, success})
    } catch (error) {
        
    }
    
})

module.exports = router;