const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const router = require('./routes');
const serverError = require('./middlewares/serverError');
const { errors } = require('celebrate');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use(router);
app.use(errors());
app.use(serverError);

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Сервер успешно запущен! Порт – ${PORT}.`);
});
