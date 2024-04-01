const jwt = require('jsonwebtoken');

const secretKey = 'sadaiusgduasjhgdjkas';

// 生成 Token
const generateToken = (userId) => {
  const token = jwt.sign({ userId }, secretKey, { expiresIn: '24h' });
  return token;
};

// 验证 Token
const verifyToken = (token) => {
  return new Promise((resolve) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        resolve(401);
      }
      resolve(200);
    });
  });
};

module.exports = { generateToken, verifyToken };
