const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getAdmin, login, register, updateUser, getUsers } = require('../controller/User.controller');


router.get('/getAll', getUsers);
router.get('/', auth, getAdmin);

router.post('/login', login);

router.post('/register', register);

router.put("/:id", updateUser);


module.exports = router;