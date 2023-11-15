const user_info = (id) =>
  `SELECT u.id, u.username, u.email, u.avatar, u.sign, u.create_time FROM t_user u WHERE u.id = ${id}`;

module.exports = { user_info };
