const mongoose = require('mongoose');

const { Schema } = mongoose;

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
  nationalId: {
    number: String,
    img: String,
  },

  rent: [{
    objectID: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
    },
    dateStart: Date,
    dateEnd: Date,
    State: String,
  }],
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
