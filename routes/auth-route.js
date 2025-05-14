const express = require('express');
const { registerUser, loginUser, changePassword } = require('../controllers/auth-controller');
const authMiddleware = require('../middleware/auth-middleware');

const router = express.Router()

//register route
router.post('/register', registerUser)

//login route
router.post('/login', loginUser)

//change password route
router.post('/change-password',authMiddleware, changePassword)
//     

module.exports = router