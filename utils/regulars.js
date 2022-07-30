const linkRegularExpression = /https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&/=]*)/;
const passwordRegularExpression = /^[a-zA-Z0-9]{6,30}$/;

module.exports = {
  linkRegularExpression,
  passwordRegularExpression,
};