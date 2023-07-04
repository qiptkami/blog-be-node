const http = require('http');
const url = require('url');

const {
  getBlogList,
  getBlogDetail,
  getBlogComments,
} = require('./service/blog');
const { getTagList } = require('./service/tag');
const { login } = require('./service/login');

const server = http.createServer(async (req, res) => {
  // 设置跨域允许的域名

  res.setHeader('Access-Control-Allow-Origin', '*'); // 允许任何域名进行跨域请求
  res.setHeader('Access-Control-Allow-Methods', '*'); // 允许任何请求方法
  res.setHeader('Access-Control-Allow-Headers', '*'); // 允许任何请求头
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 允许携带 Cookie 信息
  res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');
  res.setHeader('Access-Control-Max-Age', '3600');
  res.setHeader('Content-Type', 'text/plain;charset=utf-8');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }
  const parsedUrl = url.parse(req.url, true);
  const requestMethod = req.method;
  // 获取请求的 URL 和查询参数
  const requestUrl = parsedUrl.pathname;
  const queryParams = parsedUrl.query;
  // 处理其他请求
  if (requestUrl === '/blog/pagination' && requestMethod === 'GET') {
    const blogList = await getBlogList(
      queryParams.page,
      queryParams.size,
      queryParams.title,
      queryParams.tagId
    );
    res.statusCode = 200;
    res.end(JSON.stringify(blogList));
  } else if (requestUrl.match(/^\/blog\/(\d+)$/) && requestMethod === 'GET') {
    const id = requestUrl.match(/^\/blog\/(\d+)$/)[1];
    const blog = await getBlogDetail(id);
    res.end(JSON.stringify(blog));
  } else if (requestUrl === '/tags' && requestMethod === 'GET') {
    const tags = await getTagList();
    res.end(JSON.stringify(tags));
  } else if (
    requestUrl.match(/^\/comments\/(\d+)$/) &&
    requestMethod === 'GET'
  ) {
    const id = requestUrl.match(/^\/comments\/(\d+)$/)[1];
    const comments = await getBlogComments(id);
    res.end(JSON.stringify(comments));
  } else if (requestUrl === '/admin/login' && requestMethod === 'POST') {
    req.on('data', async function (chunk) {
      let body = JSON.parse(chunk.toString());
      const userInfo = await login(body.username, body.password);
      // 在end事件触发后，通过querystring.parse将body解析为真正的POST请求格式，然后向客户端返回。
      res.end(JSON.stringify(userInfo));
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

const port = 8001;
const hostName = 'localhost';
server.listen(port, hostName, () => {
  console.log(`Server started on port ${port}`);
  // console.log(mysql_connection);
});
