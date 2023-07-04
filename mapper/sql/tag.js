const tag_list = () => `SELECT t.id, t.name FROM t_tag t`;

const tag_blogs = (
  tid
) => `SELECT m.blog_id , b.title, b.first_picture, b.update_time, b.create_time, b.description
FROM t_tag_blog m,  t_blog b WHERE m.tag_id = ${tid} AND  b.id = m.blog_id`;

module.exports = { tag_list, tag_blogs };
