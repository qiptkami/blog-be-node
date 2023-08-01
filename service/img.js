const axios = require('axios');
const FormData = require('form-data');

const username = 'yiqiandewo';
const password = 'jkf76qRdx0l';

//sm.ms图床
const baseURL = 'https://sm.ms/api/v2';

const imgLogin = () => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const headers = {
      'Access-Control-Allow-Origin': '*',
    };
    axios
      .post(`${baseURL}/token`, formData, { headers })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const imgUpload = (token, file) => {
  return new Promise((resolve, reject) => {
    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: token,
    };
    resolve('success');
    // axios
    //   .post(`${baseURL}/upload`, file, { headers })
    //   .then((response) => {
    //     console.log('response: ', response.data);
    //     console.log('response: ', response.message);
    //     console.log('response: ', response.success);
    //     console.log('response: ', response.code);
    //     resolve(response.data);
    //   })
    //   .catch((error) => {
    //     reject(error);
    //   });
  });
};

const upload = async (file) => {
  return new Promise((resolve, reject) => {
    imgLogin()
      .then((tokenInfo) => {
        if (tokenInfo.data) {
          imgUpload(tokenInfo.data.token, file)
            .then((uploadRes) => {
              resolve(uploadRes);
              // console.log(uploadRes.success);
              // console.log(uploadRes.message);
              // console.log(uploadRes.data.url);
            })
            .catch((err) => reject(err));
        }
      })
      .catch((err) => reject(err));
  });
};

module.exports = { upload };
