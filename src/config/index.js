const validateFields = require('./validateFields');
const generateJWT = require('./generateJwt');

module.exports = {
  ...validateFields,
  ...generateJWT,
}