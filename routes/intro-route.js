const express = require('express');
const introController = require('../controllers/intro-controller');
const { registerUser, loginUser } = require('../controllers/auth-controller');

const router = express.Router()


router.get('/', introController)


//register route
router.post('/register',registerUser)


//login route
router.post('/login', loginUser)



module.exports = router