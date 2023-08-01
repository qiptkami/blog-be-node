const jwt = require('jsonwebtoken');

const secretKey = 'sadaiusgduasjhgdjkas';

// 生成 Token
const generateToken = (userId) => {
  const token = jwt.sign({ userId }, secretKey, { expiresIn: '24h' });
  return token;
};

// 验证 Token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = { generateToken, verifyToken };
