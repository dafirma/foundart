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
  userImgPath: String,
  userImgName: String,
  userOriginalName: String,
  conversation: [{
    user1: {
      type: ObjectId,
      ref: 'User',
    },
    user2: {
      type: ObjectId,
      ref: 'User',
    },
    message: {
      text: String,
      sender: {
        type: ObjectId,
        ref: 'User',
      },
      date: Date,
    },
  }],
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
  loc: {
    type: {
      type: String,
      enum: ['Point'], 
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  nationalId: {
    number: String,
    img: String,
  },
}, {
  timestamps: true,
});

userSchema.index({ loc: '2dsphere' });
const User = mongoose.model('User', userSchema);

module.exports = User;
