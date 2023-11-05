const router = require('express').Router();
const { createPost, getPosts, getPost, updatePost, deletePost } = require('../controllers/post.controller');
const { imageFilter } = require('../libs/multer');

router.post('/', imageFilter.single('image'), createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
