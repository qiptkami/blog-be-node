const express = require('express');
const app = express();

const port = 8001;
const hostIP = '127.0.0.1';

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

const {
  getBlogList,
  getBlogDetail,
  getBlogComments,
  deleteBlog,
} = require('./service/blog');
const { getTagList } = require('./service/tag');
const { login } = require('./service/login');

app.get('/blog/pagination', async (req, res) => {
  const queryParams = req.query;
  const blogList = await getBlogList(
    queryParams.page,
    queryParams.size,
    queryParams.title,
    queryParams.tagId
  );
  res.statusCode = 200;
  res.end(JSON.stringify(blogList));
});

app.get('/blog/:id', async (req, res) => {
  const id = req.params.id;
  res.end(JSON.stringify(await getBlogDetail(id)));
});

app.get('/tags', async (req, res) => {
  const tags = await getTagList();
  res.end(JSON.stringify(tags));
});

app.get('/comments/:id', async (req, res) => {
  const id = req.params.id;
  const comments = await getBlogComments(id);
  res.end(JSON.stringify(comments));
});

app.post('/admin/login', (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    //会在数据流可用时触发多次。这是因为 HTTP 请求的数据通常以数据块（chunks）的形式进行传输，而不是一次性地传输所有数据
    body += JSON.parse(chunk.toString());
  });
  req.on('end', async () => {
    //为了处理完整的请求数据，需要将这些数据块收集起来，并在req.on('end', ...)事件中对它们进行处理。end事件表示请求的所有数据已经传输完毕。
    const userInfo = await login(body.username, body.password);
    // 进行相应的处理
    res.statusCode = 200;
    res.end(JSON.stringify(userInfo));
  });
});

app.delete('blog/:id', (req, res) => {
  const id = req.params.id;
  res.end(JSON.stringify(deleteBlog(id)));
});

app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

app.listen(port, hostIP, () => {
  console.log(`Server started on port ${port}`);
});
