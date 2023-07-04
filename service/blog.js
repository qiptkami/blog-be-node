const { executeQuery } = require('../mapper/mysql');
const {
  blog_total,
  blog_list,
  blog_tag,
  blog_detail,
  blog_comments,
} = require('../mapper/sql/blog');

const getBlogList = async (page = 1, size = 5, title, tagId) => {
  const total = await executeQuery(blog_total());
  const blogs = await executeQuery(blog_list(size, size * (page - 1)));
  const value = await Promise.all(
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
    value,
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
    return {
      value: {
        id: b.id,
        title: b.title,
        content: b.content,
        firstPicture: b.first_picture,
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

module.exports = { getBlogList, getBlogDetail, getBlogComments };
