const login_admin = (username) =>
  `SELECT id, username, password, email, avatar, sign, create_time, update_time FROM t_user WHERE username = '${username}'`;

module.exports = { login_admin };
