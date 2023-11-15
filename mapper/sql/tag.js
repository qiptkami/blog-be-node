const tag_list = () => `SELECT t.id, t.name FROM t_tag t`;

const tag_blogs = (
  tid
) => `SELECT m.blog_id, b.title, b.first_picture, b.update_time, b.create_time, b.description
FROM t_tag_blog m, t_blog b WHERE m.tag_id = ${tid} AND b.id = m.blog_id`;

const tag_page = (limit, offset) =>
  `SELECT t.id, t.name, COUNT(tb.blog_id) AS bCount 
          FROM t_tag t
          LEFT JOIN t_tag_blog tb ON t.id = tb.tag_id
          GROUP BY t.id
          LIMIT ${limit} OFFSET ${offset}`;

const tag_list_total = () =>
  `SELECT COUNT(DISTINCT t.id) AS total FROM t_tag t`;

const tag_name = (name) =>
  `SELECT t.id, t.name FROM t_tag t WHERE t.name = '${name}'`;

const insert_tag = (tag) => `INSERT INTO t_tag(name) VALUES('${tag.name}');`;

const update_tag = (tag) =>
  `UPDATE t_tag SET name = '${tag.name}' WHERE id = ${tag.id};`;

const delete_tag = (tid) => `DELETE FROM t_tag WHERE id = ${tid};`;

module.exports = {
  tag_list,
  tag_blogs,
  tag_page,
  tag_list_total,
  insert_tag,
  update_tag,
  delete_tag,
  tag_name,
};
