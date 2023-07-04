const mysql = require('mysql');

const dataBaseConfig = {
  host: '101.43.240.27', // 数据库主机名
  port: 3306,
  user: 'root', // 数据库用户名
  password: 'qikami', // 数据库密码
  database: 'blog', // 数据库名
};

const executeQuery = (sql) => {
  return new Promise((resolve, reject) => {
    // 创建连接
    var connection = mysql.createConnection(dataBaseConfig);
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to database: ', err);
        reject(err);
        throw err;
      }
      connection.query(sql, (err, results) => {
        if (err) {
          console.error('Error executing query: ', err);
          reject(err);
          throw err;
        }
        resolve(results);
        connection.end((err) => {
          if (err) {
            console.error('Error ending query: ', err);
            reject(err);
            throw err;
          }
        });
      });
    });
  });
};

module.exports = { executeQuery };
