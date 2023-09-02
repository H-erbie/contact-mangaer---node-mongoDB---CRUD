const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    currentUser,
} = require('../controllers/usercontroller');
const validToken = require("../middleware/tokenHandler");

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/current', validToken, currentUser)
module.exports = router 