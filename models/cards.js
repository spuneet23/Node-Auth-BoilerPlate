const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const arSchema = new Schema({
	video_id: Number,
	url: String,
	barcode:String,
	uploadedAt: {type:Date, default:new Date()}
});


const ModelClass = mongoose.model('arcard', arSchema);

module.exports = ModelClass;