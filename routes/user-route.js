const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const router = express.Router();

router.get('/user', authMiddleware, (req, res) => {
    const {username,userId,role} = req.userInfo
    res.json({
        message: 'Hello from user route',
        user: {
            username,
            userId,
            role
        }
    })
})



module.exports = router;