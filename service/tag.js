const { executeQuery } = require('../mapper/mysql');
const {
  tag_list,
  tag_blogs,
  tag_page,
  tag_list_total,
  insert_tag,
  update_tag,
  delete_tag,
  tag_name,
} = require('../mapper/sql/tag');

const getAllTag = async () => {
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

const getTagList = async (page = 1, size = 5) => {
  const tags = await executeQuery(tag_page(size, size * (page - 1)));
  const total = await executeQuery(tag_list_total());

  return { value: tags, total: total[0].total };
};

const isExist = async (name) => {
  const res = await executeQuery(tag_name(name));
  console.log('res: ', res);
  if (!res.length) return false;
  return true;
};

const addTag = async (tag) => {
  const exist = await isExist(tag.name);
  console.log('exist: ', exist);
  if (exist) return -2; //已存在

  await executeQuery(insert_tag(tag));
  return 1;
};

const editTag = async (tag) => {
  const exist = await isExist(tag.name);
  if (exist) return -2; //已存在

  await executeQuery(update_tag(tag));
  return 1;
};

const deleteTag = async (tagId) => {
  try {
    await executeQuery(delete_tag(tagId));
  } catch (err) {
    return -1;
  }
  return 1;
};

module.exports = { getAllTag, getTagList, addTag, editTag, deleteTag };
