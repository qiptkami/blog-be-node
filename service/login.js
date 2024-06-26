const { executeQuery } = require('../mapper/mysql');
const { login_admin } = require('../mapper/sql/login');
const { generateToken, verifyToken } = require('../tools/jwt');

const login = async (username, password) => {
  const user = await executeQuery(login_admin(username));
  if (!user.length) {
    return {
      value: -1,
      message: '用户不存在',
    };
  }

  const u = user[0];
  if (u.username === username && u.password === password) {
    //登录成功
    const token = generateToken(u.id);
    return {
      value: {
        id: u.id,
        username: u.username,
        email: u.email,
        avatar: u.avatar,
        sign: u.sign,
        token,
      },
    };
  } else {
    return {
      value: -1,
      message: '用户名或密码错误',
    };
  }
};

const verifyLoginInfo = async (token) => {
  return new Promise((resolve, reject) => {
    verifyToken(token).then((code) => {
      resolve(code === 200);
    });
  });
};

module.exports = { login, verifyLoginInfo };
