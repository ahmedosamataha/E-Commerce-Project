const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.use(authController.findUser);

router.use('/sign-out', authController.signOut);

router.get('/sign-in', authController.getSignIn);
router.post('/sign-in', authController.postSignInConsumer);

router.get('/sign-up', authController.getSignUp);   //v3
router.post('/sign-up', authController.postSignUpConsumer); //v3 Note: plz create another for seller

module.exports = router;
