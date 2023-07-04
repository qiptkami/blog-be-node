const blog_list = (limit, offset) =>
  `SELECT b.id, b.title, b.first_picture, b.update_time, b.create_time, b.description, b.user_id 
   FROM t_blog b
   LIMIT ${limit} OFFSET ${offset}`;

const blog_total = () => `SELECT COUNT(*) AS total FROM t_blog`;

const blog_tag = (bid) =>
  `SELECT m.tag_id, t.name FROM t_tag_blog m LEFT JOIN t_tag t ON t.id = m.tag_id WHERE m.blog_id = ${bid}`;

const blog_detail = (bid) =>
  `SELECT b.id, b.title, b.content, b.first_picture, b.update_time, b.create_time, b.user_id
  FROM t_blog b WHERE b.id = ${bid}`;

const blog_comments = (
  bid
) => `SELECT id, nickname, content, avatar, email, create_time, blog_id, parent_comment_id, is_admin_comment
FROM t_comment where blog_id = ${bid} ORDER BY UNIX_TIMESTAMP(create_time) ASC`;

module.exports = {
  blog_list,
  blog_total,
  blog_tag,
  blog_detail,
  blog_comments,
};
