const prisma = require('../libs/prisma');
const { createPostSchema } = require('../validations/post.schema');
const imagekit = require('../libs/imagekit');

const createPost = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required', data: null });

    const imageBase64 = req.file.buffer.toString('base64');

    const { error } = createPostSchema.validate({ title, description });

    if (error) return res.status(400).json({ success: false, message: error.message, data: null });

    const { url, fileId } = await imagekit.upload({
      file: imageBase64,
      fileName: `${title}-${Date.now()}`,
      folder: '/challenge/posts',
    });

    const post = await prisma.posts.create({
      data: {
        title,
        description,
        image: {
          create: {
            image_id: fileId,
            url,
          },
        },
      },
      include: {
        image: true,
      },
    });

    res.status(201).json({ success: true, message: 'Post created', data: post });
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const posts = await prisma.posts.findMany({
      include: {
        image: true,
      },
    });

    res.status(200).json({ success: true, message: 'Posts found', data: posts });
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.posts.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        image: true,
      },
    });

    if (!post) return res.status(404).json({ success: false, message: 'Post not found', data: null });

    res.status(200).json({ success: true, message: 'Post found', data: post });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const { error } = createPostSchema.validate({ title, description });

    if (error) return res.status(400).json({ success: false, message: error.message, data: null });

    const isPostExists = await prisma.posts.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!isPostExists) return res.status(404).json({ success: false, message: 'Post not found', data: null });

    const post = await prisma.posts.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        description,
      },
    });

    res.status(200).json({ success: true, message: 'Post updated', data: post });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const isPostExists = await prisma.posts.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        image: true,
      },
    });

    if (!isPostExists) return res.status(404).json({ success: false, message: 'Post not found', data: null });

    await imagekit.deleteFile(isPostExists.image.image_id);

    await prisma.images.delete({
      where: {
        post_id: parseInt(id),
      },
    });

    const post = await prisma.posts.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({ success: true, message: 'Post deleted', data: post });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};
