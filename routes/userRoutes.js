const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { body, validationResult } = require("express-validator");

const userValidationRules = [
  body("first_name").isString().isLength({ min: 3 })
  .withMessage("First Name should be at least 3 characters"),
  body("last_name").isString().isLength({ min: 3 })
  .withMessage("Last Name should be at least 3 characters"),
  body("email").isEmail(),
  body("gender").isLength({ min: 3 })
  .withMessage("Gender should be at least 3 characters"),
  body("avatar").isURL(),
  body("domain").isString().notEmpty(),
  body("available").isBoolean(),
];
// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};
// CRUD routes
router.get('/', UserController.getAllUsers);
router.get('/user/:id', UserController.getUserById);
router.post('/creatuser',userValidationRules,validate, UserController.createUser);
router.put('/updateuser/:id',userValidationRules,validate, UserController.updateUser);
router.delete('/deleteuser/:id', UserController.deleteUser);

module.exports = router;
