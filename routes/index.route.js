const router = require('express').Router();
const postRoute = require('./post.route');

router.use('/posts', postRoute);

module.exports = router;
