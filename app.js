require('dotenv').config();
const express = require('express');
const errorHandler = require('./middlewares/errorHandler.middleware');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use('/api/v1', require('./routes/index.route'));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
