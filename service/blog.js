const { executeQuery } = require('../mapper/mysql');
const {
  blog_list_total,
  blog_list,
  blog_tag,
  blog_detail,
  blog_comments,
  insert_comments,
  update_blog,
  insert_blog_tag,
  delete_blog,
  delete_blog_tag,
  insert_blog,
} = require('../mapper/sql/blog');

const getBlogList = async (page = 1, size = 5, title, tagId) => {
  const total = await executeQuery(blog_list_total(title, tagId));
  const blogs = await executeQuery(
    blog_list(size, size * (page - 1), title, tagId)
  );
  let value = await Promise.all(
    blogs.map(async (blog) => {
      const tags = await executeQuery(blog_tag(blog.id));
      return {
        id: blog.id,
        title: blog.title,
        firstPicture: blog.first_picture,
        createTime: blog.create_time,
        updateTime: blog.update_time,
        description: blog.description,
        tags: tags.map((tag) => {
          return { id: tag.tag_id, name: tag.name };
        }),
      };
    })
  );
  return {
    value: value,
    total: total[0].total,
    page: Number(page),
    size: Number(size),
  };
};

const getBlogDetail = async (blogId) => {
  return Promise.all([
    executeQuery(blog_detail(blogId)),
    executeQuery(blog_tag(blogId)),
  ]).then(([blog, tags]) => {
    const b = blog[0];
    if (!b) {
      return {};
    }
    return {
      value: {
        id: b.id,
        title: b.title,
        content: b.content,
        firstPicture: b.first_picture,
        description: b.description,
        createTime: b.create_time,
        updateTime: b.update_time,
        tags: tags.map((tag) => {
          return { id: tag.tag_id, name: tag.name };
        }),
      },
    };
  });
};

const getBlogComments = async (blogId) => {
  const comments = await executeQuery(blog_comments(blogId));
  return {
    value: comments.map((comment) => {
      return {
        id: comment.id,
        nickname: comment.nickname,
        email: comment.email,
        content: comment.content,
        avatar: comment.avatar,
        createTime: comment.create_time,
        isAdminComment: comment.is_admin_comment ? true : false,
        blog: { id: comment.blog_id },
        parentComment: comment.parent_comment_id
          ? { id: comment.parent_comment_id }
          : null,
      };
    }),
  };
};

const insertComments = async (comment) => {
  await executeQuery(insert_comments(comment));
  return 1;
};

const editBlog = async (blog) => {
  await executeQuery(update_blog(blog));
  //处理tag 一对多  两种方式 1. 删除原先的 直接新增 2. 新增的和原先的比较一下
  await updateBlogTag(blog.id, blog.tags);
  return 1;
};

const updateBlogTag = async (blogId, tags) => {
  await executeQuery(delete_blog_tag(blogId));
  await Promise.all(
    tags.map(async (tag) => await executeQuery(insert_blog_tag(blogId, tag.id)))
  );
};

const deleteBlog = async (blogId) => {
  try {
    await executeQuery(delete_blog(blogId));
    await executeQuery(delete_blog_tag(blogId));
  } catch (err) {
    return -1;
  }
  return 1;
};

const addBlog = async (blog) => {
  try {
    const newBlog = await executeQuery(insert_blog(blog));
    const blogId = newBlog.insertId;
    const tags = blog.tags;
    await Promise.all(
      tags.map(
        async (tag) => await executeQuery(insert_blog_tag(blogId, tag.id))
      )
    );
  } catch (err) {
    return -1;
  }
  return 1;
};

module.exports = {
  getBlogList,
  getBlogDetail,
  getBlogComments,
  insertComments,
  editBlog,
  deleteBlog,
  addBlog,
};
