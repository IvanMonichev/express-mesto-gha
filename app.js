const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const router = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '62cdf2dd54786145bdd582b1',
  };

  next();
});

app.use(router);

app.use((req, res) => {
  res.status(404).send({ message: 'Путь не найден' });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Сервер успешно запущен! Порт – ${PORT}.`);
});
