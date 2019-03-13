const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const conversationSchema = new Schema({
  user1: {
    type: ObjectId,
    ref: 'User',
    require: true,
  },
  user2: {
    type: ObjectId,
    ref: 'User',
    require: true,
  },
  message: [{
    sender: String,
    date: String,
    text: String,
  }],
  text: String,
});

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;
