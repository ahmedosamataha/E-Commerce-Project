const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.use(authController.findUser);

router.use('/sign-out', authController.signOut);

router.get('/sign-in', authController.getSignIn);
router.post('/sign-in', authController.postSignIn);

module.exports = router;