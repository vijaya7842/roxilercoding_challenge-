const express = require("express");
const router = express.Router();
const { verifyJWT, isadmin } = require('../middleware/verifyJWT'); 
const bcrypt = require('bcryptjs');





router.post('/addStore', verifyJWT, isadmin, async (req, res) => {
    const { name, email, address, password } = req.body;

    try {
        if (!name || !email || !address || !password) {
            return res.status(400).json({ success: false, msg: "All fields are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = 'INSERT INTO stores (name, email, address, password) VALUES (?, ?, ?, ?)';
        await req.db.execute(sql, [name, email, address, hashedPassword]);
        const sqlUser = "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)";
        const [userResult] = await req.db.execute(sqlUser, [name, email, hashedPassword, address, "storeOwner"]);

        return res.status(200).json({ success: true, msg: "Store Added Successfully" });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, msg: "A store with this email already exists." });
        }
        console.error(error);
        return res.status(500).json({ success: false, msg: "Internal Server Error", error });
    }
});



router.get('/getStores', verifyJWT,  async (req, res) => {
    try {
        
        const sql = `
            SELECT 
                s.id, 
                s.name, 
                s.email, 
                s.address, 
                s.created_at,
                -- Use COALESCE to return 0 if AVG is NULL (no ratings)
                COALESCE(AVG(r.rating), 0) AS averageRating 
            FROM 
                stores AS s
            LEFT JOIN 
                store_ratings AS r ON s.id = r.storeID
            GROUP BY 
                s.id
            ORDER BY
                s.id;
        `;
        
        const [stores] = await req.db.query(sql);
        const success=true
        return res.status(200).json({ stores,success });


    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error", error });
    }
});


router.get('/storeCount', verifyJWT, isadmin, async (req, res) => {
    try {
        const sql = 'SELECT COUNT(*) AS storeCount FROM stores';
        
        const [rows] = await req.db.query(sql);
        const getStoreCount = rows[0].storeCount; 
        const success=true

        return res.status(200).json({ getStoreCount ,success });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error", error });
    }
});

module.exports = router;
