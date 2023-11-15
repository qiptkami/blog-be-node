const express = require('express');
const app = express();

const port = 8001;
const hostIP = '127.0.0.1';

const {
  getBlogList,
  getBlogDetail,
  getBlogComments,
  editBlog,
  deleteBlog,
  addBlog,
} = require('./service/blog');
const {
  getAllTag,
  getTagList,
  addTag,
  editTag,
  deleteTag,
} = require('./service/tag');
const { getUserInfo } = require('./service/user');
const { login } = require('./service/login');

app.use((req, res, next) => {
  // 允许来自所有来源的跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  // 允许的请求方法
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  // 允许的请求头
  res.setHeader('Access-Control-Allow-Headers', '*');
  // 允许携带凭据（如 Cookie）
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  // 预检请求的最大缓存时间，单位为秒
  res.setHeader('Access-Control-Max-Age', 3600);
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get('/blog/pagination', async (req, res) => {
  const query = req.query;
  const blogList = await getBlogList(
    query.page,
    query.size,
    query.title,
    query.tagId
  );
  res.statusCode = 200;
  res.end(JSON.stringify(blogList));
});

app.get('/blog/:id', async (req, res) => {
  try {
    const id = req.params.id;
    res.end(JSON.stringify(await getBlogDetail(id)));
  } catch (error) {
    console.error('Error :', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

app.get('/tag', async (req, res) => {
  try {
    const tags = await getAllTag();
    res.end(JSON.stringify(tags));
  } catch (error) {
    console.error('Error', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

app.get('/tag/pagination', async (req, res) => {
  try {
    const query = req.query;
    const tags = await getTagList(query.page, query.size);
    res.statusCode = 200;
    res.end(JSON.stringify(tags));
  } catch (error) {
    console.error('Error', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

app.get('/comment/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const comments = await getBlogComments(id);
    res.end(JSON.stringify(comments));
  } catch (error) {
    console.error('Error', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

app.get('/user/info/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const userInfo = await getUserInfo(id);
    res.end(JSON.stringify(userInfo));
  } catch (error) {
    console.error('Error', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

app.post('/login', (req, res) => {
  try {
    let body = '';
    req.on('data', (chunk) => {
      //会在数据流可用时触发多次。这是因为 HTTP 请求的数据通常以数据块（chunks）的形式进行传输，而不是一次性地传输所有数据
      body += chunk;
    });
    req.on('end', async () => {
      //为了处理完整的请求数据，需要将这些数据块收集起来，并在req.on('end', ...)事件中对它们进行处理。end事件表示请求的所有数据已经传输完毕。
      const data = JSON.parse(body);
      const userInfo = await login(data.username, data.password);
      // 进行相应的处理
      res.statusCode = 200;
      res.end(JSON.stringify(userInfo));
    });
  } catch (error) {
    console.error('Error', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

app.delete('/blog/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await deleteBlog(id);
    res.end(JSON.stringify('DELETE SUCCESS'));
  } catch (error) {
    console.error('Error', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

app.put('/blog', (req, res) => {
  try {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      const data = JSON.parse(body);
      editBlog(data);
      res.statusCode = 200;
      res.end(JSON.stringify('EDIT SUCCESS'));
    });
  } catch (error) {
    console.error('Error', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

app.post('/blog', (req, res) => {
  try {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      const data = JSON.parse(body);
      addBlog(data);
      res.statusCode = 200;
      res.end(JSON.stringify('ADD SUCCESS'));
    });
  } catch (error) {
    console.error('Error', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

app.delete('/tag/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await deleteTag(id);
    res.end(JSON.stringify('DELETE SUCCESS'));
  } catch (error) {
    console.error('Error', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

app.put('/tag', (req, res) => {
  try {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      const data = JSON.parse(body);
      const code = await editTag(data);
      if (code === -2) {
        res.end(JSON.stringify({ code, msg: 'name exist' }));
        return;
      }
      res.statusCode = 200;
      res.end(JSON.stringify({ code, msg: 'EDIT SUCCESS' }));
    });
  } catch (error) {
    console.error('Error', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

app.post('/tag', (req, res) => {
  try {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      const data = JSON.parse(body);
      const code = await addTag(data);
      console.log('code: ', code);
      res.statusCode = 200;
      if (code === -2) {
        res.end(JSON.stringify({ code, msg: 'name exist' }));
        return;
      }
      res.end(JSON.stringify({ code, msg: 'ADD SUCCESS' }));
    });
  } catch (error) {
    console.error('Error', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

app.listen(port, hostIP, () => {
  console.log(`Server started on port ${port}`);
});
