const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "please add your user name"],
  },
  email: {
    type: String,
    required: [true, "please add your email"],
    unique: [true, "Email address taken!"],
  },
  password: { type: String,
     required: [true, "please add your password"] },
},{
    timestamp: true
}
);
module.exports = mongoose.model('User', userSchema)