const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isSuperAdmin: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin', 'superAdmin'], default: 'user' }
}, { timestamps: true })

const User = mongoose.model('User', userSchema);

module.exports = User;
