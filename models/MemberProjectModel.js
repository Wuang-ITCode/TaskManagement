// models/Project.js
const mongoose = require("mongoose");
const AutoInscrement = require('mongoose-sequence')(mongoose);

const MemberProjectSchema = new mongoose.Schema({
    _id: Number,
    memberID: Number,
    projectID: Number
});

MemberProjectSchema.plugin(AutoInscrement, { id: 'MemberProject_counter', inc_field: '_id' });
module.exports = mongoose.model("MemberProject", MemberProjectSchema);
