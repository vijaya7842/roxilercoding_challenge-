const express = require('express');
const router = express.Router();
const { verifyJWT, isNormalUser, isadmin,isStoreOwner } = require('../middleware/verifyJWT'); 
router.post('/rate', verifyJWT, isNormalUser, async (req, res) => {
  const { storeID, rating, userId ,name,email} = req.body;

  if (!storeID || !rating || !userId||!name||!email) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
   
    const [existing] = await req.db.query(
      "SELECT * FROM store_ratings WHERE storeID = ? AND userId = ?",
      [storeID, userId]
    );

    if (existing.length > 0) {
     
      await req.db.execute(
        "UPDATE store_ratings SET rating = ? WHERE storeID = ? AND userId = ?",
        [rating, storeID, userId]
      );
      return res.status(200).json({ msg: "Rating Updated Successfully" });
    } else {
      
      await req.db.execute(
        "INSERT INTO store_ratings (storeID, rating, userId,name,email) VALUES (?, ?, ?,?,?)",
        [storeID, rating, userId,name,email]
      );
      return res.status(200).json({ msg: "Rating Added Successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server error", error });
  }
});

router.get('/getRatingCount', verifyJWT, isadmin, async (req, res) => {
    try {
        
        // We use 'AS ratingCount' to name the resulting column
        const sql = 'SELECT COUNT(*) AS ratingCount FROM store_ratings';
        
        
        const [rows] = await req.db.query(sql);

        
        const ratingCount = rows[0].ratingCount;
        const success=true

        
        return res.status(200).json({ ratingCount ,success});

    } catch (error) {
        console.error(error); 
        return res.status(500).json({ msg: "Internal Server Error", error });
    }
});
router.get('/getRatingCountByStore/:storeID', verifyJWT, isStoreOwner, async (req, res) => {
  const {storeID } = req.params;

  try {
    const sql = `
      SELECT COUNT(*) AS storeRatingCount
      FROM store_ratings
      WHERE storeID = ?
    `;
    const [rows] = await req.db.query(sql, [storeID]);

    const getStoreCount = rows[0].storeRatingCount;

    return res.status(200).json({ success: true, getStoreCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, msg: "Internal Server Error", error });
  }
});
router.get('/averageRating/:storeID', verifyJWT, isStoreOwner, async (req, res) => {
  const { storeID } = req.params;

  console.log('Received storeID:', storeID);

  try {
    const sql = `
      SELECT AVG(rating) AS averageRating
      FROM store_ratings
      WHERE storeID = ?
    `;

    const [rows] = await req.db.query(sql, [storeID]);

    console.log('Database query result:', rows);

    let averageRating = rows[0].averageRating;
    averageRating = averageRating !== null ? Number(parseFloat(averageRating).toFixed(1)) : 0;

    return res.status(200).json({ success: true, averageRating });

  } catch (error) {
    console.error('Error fetching average rating:', error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});
router.get('/getStoreByEmail/:email', async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ success: false, msg: "Please provide email" });
  }

  try {
    const [store] = await req.db.query(
      "SELECT * FROM stores WHERE email = ?",
      [email]
    );

    if (store.length === 0) {
      return res.status(404).json({ success: false, msg: "No store found with this email" });
    }

    return res.status(200).json({ success: true, store: store[0] });
  } catch (error) {
    console.error("Error fetching store by email:", error);
    return res.status(500).json({ success: false, msg: "Error fetching store" });
  }
});

router.put("/updatepass", verifyJWT, async (req, res) => {
  try {
    const email = req.user.email; 
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

   
    const [users] = await req.db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const user = users[0];

  
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    
    await req.db.execute(
      "UPDATE users SET password = ?, ispasswordupdated = 1 WHERE email = ?",
      [hashedPassword, email]
    );

    return res.status(200).json({
      success: true,
      msg: "Password updated successfully. Please login again with new password",
    });
  } catch (error) {
    console.error("Update Password Error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
});

router.get('/getUsersWhoRated/:storeID', verifyJWT, isStoreOwner, async (req, res) => {
  const { storeID } = req.params;

  try {
    if (!storeID) {
      return res.status(400).json({ msg: "Please provide a valid store ID" });
    }

    const [rates] = await req.db.query(
      "SELECT id, name, email, rating FROM store_ratings WHERE storeID = ?",
      [storeID]
    );

    if (rates.length === 0) {
      return res.status(404).json({ success: false, msg: "Rate not found" });
    }

    return res.status(200).json({
      success: true,
      rates: rates,
    });

  } catch (error) {
    return res.status(500).json({ msg: "Internal Server error", error });
  }
});

    


module.exports = router;