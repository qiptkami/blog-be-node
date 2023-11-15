const blog_list = (limit, offset, title, tagId) => {
  let query = `SELECT b.id, b.title, b.first_picture, b.update_time, b.create_time, b.description, b.user_id
                FROM t_blog b
                LEFT JOIN t_tag_blog tb ON b.id = tb.blog_id WHERE 1 = 1`;
  if (title) {
    query += ` AND b.title LIKE '%${title}%'`;
  }
  if (tagId) {
    query += ` AND tb.tag_id = ${tagId}`;
  }

  query += ` GROUP BY b.id LIMIT ${limit} OFFSET ${offset}`;
  return query;
};

const blog_list_total = (title, tagId) => {
  let query = `SELECT COUNT(DISTINCT b.id) AS total
                FROM t_blog b
                LEFT JOIN t_tag_blog tb ON b.id = tb.blog_id WHERE 1 = 1`;
  if (title) {
    query += ` AND b.title LIKE '%${title}%'`;
  }
  if (tagId) {
    query += ` AND tb.tag_id = ${tagId}`;
  }
  return query;
};

const blog_tag = (bid) =>
  `SELECT m.tag_id, t.name FROM t_tag_blog m LEFT JOIN t_tag t ON t.id = m.tag_id WHERE m.blog_id = ${bid}`;

const blog_detail = (bid) =>
  `SELECT b.id, b.title, b.content, b.first_picture, b.description, b.update_time, b.create_time, b.user_id
  FROM t_blog b WHERE b.id = ${bid}`;

const blog_comments = (
  bid
) => `SELECT id, nickname, content, avatar, email, create_time, blog_id, parent_comment_id, is_admin_comment
FROM t_comment WHERE blog_id = ${bid} ORDER BY UNIX_TIMESTAMP(create_time) ASC`;

const update_blog = (blog) =>
  `UPDATE t_blog SET content = '${blog.content}', first_picture = '${blog.firstPicture}',
title = '${blog.title}', update_time = NOW(), description = '${blog.description}' WHERE id = ${blog.id};`;

const delete_blog = (bid) => `DELETE FROM t_blog WHERE id = ${bid};`;

const insert_blog_tag = (bid, tid) =>
  `INSERT into t_tag_blog(blog_id, tag_id) VALUES(${bid}, ${tid})`;

const delete_blog_tag = (bid) =>
  `DELETE FROM t_tag_blog WHERE blog_id = ${bid};`;

const insert_blog = (blog) =>
  `INSERT INTO t_blog(content, first_picture, title, user_id, description, update_time, create_time) 
VALUES('${blog.content}', '${blog.firstPicture}', '${blog.title}', ${blog.user.id}, '${blog.description}', NOW(), NOW());`;

module.exports = {
  blog_list,
  blog_list_total,
  blog_tag,
  blog_detail,
  blog_comments,
  update_blog,
  insert_blog_tag,
  delete_blog,
  delete_blog_tag,
  insert_blog,
};
