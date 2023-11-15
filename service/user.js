const { executeQuery } = require('../mapper/mysql');
const { user_info } = require('../mapper/sql/user');

const getUserInfo = async (id) => {
  const userInfo = await executeQuery(user_info(id));

  return { value: userInfo[0] };
};

module.exports = { getUserInfo };
