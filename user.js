const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    first: String,
    last: String
  },
  phone: {
    type: Number
  },
  userId: {
    type: Number
  },
  requestId: {
    type: String
  },
  status: {
    type: Number
  },
  email:{
    type:String
  }
});

module.exports = User = mongoose.model("users", UserSchema);
