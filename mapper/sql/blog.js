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

const blog_list_total = (limit, offset, title, tagId) => {
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
FROM t_comment where blog_id = ${bid} ORDER BY UNIX_TIMESTAMP(create_time) ASC`;

const delete_blog = (bid) => `delete from t_blog where id = ${bid};`;

const delete_blog_tag = (bid) =>
  `delete from t_tag_blog where blog_id = ${bid};`;

module.exports = {
  blog_list,
  blog_list_total,
  blog_tag,
  blog_detail,
  blog_comments,
  delete_blog,
  delete_blog_tag,
};
