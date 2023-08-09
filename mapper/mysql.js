const mysql = require('mysql');
const dataBaseConfig = require('./config');

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
