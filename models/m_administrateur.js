const mongoose = require("mongoose");
const UniqueValidator = require("mongoose-unique-validator");

const ModelUser = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

ModelUser.plugin(UniqueValidator);

module.exports = mongoose.model("User", ModelUser);