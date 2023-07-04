const { executeQuery } = require('../mapper/mysql');
const { tag_list, tag_blogs } = require('../mapper/sql/tag');

const getTagList = async () => {
  const tags = await executeQuery(tag_list());
  const value = await Promise.all(
    tags.map(async (tag) => {
      const blogs = await executeQuery(tag_blogs(tag.id));
      return {
        id: tag.id,
        name: tag.name,
        blogs: blogs.map((blog) => {
          return {
            id: blog.blog_id,
            title: blog.title,
            firstPicture: blog.first_picture,
            updateTime: blog.update_time,
            createTime: blog.create_time,
            description: blog.description,
          };
        }),
      };
    })
  );
  return { value: value };
};

module.exports = { getTagList };
