const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { body, validationResult } = require("express-validator");

const userValidationRules = [
  body("first_name").isString().isLength({ min: 3 })
  .withMessage("First Name should be at least 3 characters"),
  body("last_name").isString().isLength({ min: 1 })
  .withMessage("Last Name should be at least 3 characters"),
  body("email").isEmail(),
  body("gender").isString().notEmpty()
  .withMessage("Gender should not be empty"),
  body("avatar").isURL().withMessage("Avatar should be a valid URL"),
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
