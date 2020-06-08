const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const ClassRoomSchema = new Schema({
	meeting_name: {
		type: String,
		trim: true,
		required: true
	},
	class_name: {
		type: String,
		trim: true,
		required: true,
	},
    subject_name: {
		type: String,
		trim: true,
		required: true,
	},
    section_name: {
		type: String,
		trim: true,
		required: true,
	},
    no_of_participants: {
		type: String,
		trim: true,
		required: true,
	},
	classroom_date: {
		type: String,
		trim: true,
		required: true
	},
    classroom_start_time: {
		type: String,
		trim: true,
		required: true,
	},
	created_by: {
		type: String,
		trim: true,
		required: true
	},
	classroom_end_time: {
		type: String,
		trim: true,
	},
    classroom_password: {
		type: String,
		trim: true,
		required: true,
	}
},{strict: false,timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

module.exports = mongoose.model('ClassRoom', ClassRoomSchema)
