const linkRegularExpression = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
const passwordRegularExpression = /^[a-zA-Z0-9]{6,30}$/;

module.exports = {
  linkRegularExpression,
  passwordRegularExpression,
};
