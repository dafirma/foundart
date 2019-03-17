const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const conversationSchema = new Schema({
  user1: {
    type: ObjectId,
    ref: 'User',
  },
  user2: {
    type: ObjectId,
    ref: 'User',
  },
  message: [{
    text: String,
    sender: {
      type: ObjectId,
      ref: 'User',
    },
    date: Date,
  },
  ],
});
const Convesation = mongoose.model('Conversation', conversationSchema);

module.exports = Convesation;
