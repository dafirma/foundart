const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const userSchema = new Schema({
  name: String,
  lastName: String,
  username: String,
  telephone: Number,
  email: String,
  password: String,
  address: {
    street: String,
    number: Number,
    zipcode: Number,
    city: String,
    country: String,
  },
  favorite: [{
    articleID: {
      type: ObjectId,
      ref: 'Article',
    },
  }],
  nationalId: {
    number: String,
    img: String,
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
