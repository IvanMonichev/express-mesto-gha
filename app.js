const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3000 } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log(`Сервер успешно запущен! Порт – ${PORT}.`);
})

mongoose.conntect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true,
});