var mongoose = require('mongoose');
const classRoomModel = mongoose.model('ClassRoom')

module.exports = {
	getById: function(req, res, next) {
		console.log(req.body);
		classRoomModel.findById(req.params.classRoomId, function(err, classRoomInfo){
			if (err) {
				next(err);
			} else {
				res.json({status:"success", message: "Class Room found!!!", data:{rooms: classRoomInfo}});
			}
		});
	},
	getByUserId: function(req, res, next) {
		console.log(req.body);
		classRoomModel.find({created_by: req.params.userId}, function(err, classRoomInfo){
			if (err) {
				next(err);
			} else {
				res.json({status:"success", message: "Class Room found!!!", data:{names: classRoomInfo}});
			}
		});
	},
	getByClassSection: function(req, res, next) {
		console.log(req.body);
		classRoomModel.find({class_name: req.params.class, section_name: req.params.section}, function(err, classRoomInfo){
			if (err) {
				next(err);
			} else {
				res.json({status:"success", message: "Class Room found!!!", data:{names: classRoomInfo}});
			}
		});
	},
	getAll: function(req, res, next) {
		let classRoomList = [];

		classRoomModel.find({}, function(err, classroom){
			if (err){
				next(err);
			} else {
				for (let name of classroom) {
					classRoomList.push({
                            id:name._id,
							meeting_name: name.meeting_name,
                            class_name: name.class_name,
                            subject_name: name.subject_name,
                            section_name: name.section_name,
                            no_of_participants: name.no_of_participants,
							classroom_date: name.classroom_date,
                            classroom_start_time: name.classroom_start_time,
                            classroom_end_time: name.classroom_end_time,
							classroom_password: name.classroom_password
                        });
				}
				res.json({status:"success", message: "Class Room list found!!!", data:{names: classRoomList}});

			}

		});
	},

	updateById: function(req, res, next) {
		classRoomModel.findByIdAndUpdate(req.params.classRoomId,{
                class_name: req.body.class_name,
                subject_name: req.body.subject_name,
                section_name: req.body.section_name,
                no_of_participants: req.body.no_of_participants,
                classroom_start_time: req.body.classroom_start_time,
                classroom_end_time: req.body.classroom_end_time,
                classroom_password: req.body.classroom_password,
             }, function(err, classRoomInfo){

			if(err)
				next(err);
			else {
				res.json({status:"success", message: "Class Room updated successfully!!!", data:null});
			}
		});
	},

	deleteById: function(req, res, next) {
		classRoomModel.findByIdAndRemove(req.params.classRoomId, function(err, classRoomInfo){
			if(err)
				next(err);
			else {
				res.json({status:"success", message: "Class Room deleted successfully!!!", data:null});
			}
		});
	},

	create: function(req, res, next) {
		classRoomModel.create(
            {
				meeting_name: req.body.meeting_name,
                class_name: req.body.class_name,
                subject_name: req.body.subject_name,
                section_name: req.body.section_name,
                no_of_participants: req.body.no_of_participants,
                classroom_start_time: req.body.classroom_start_time,
				created_by: req.body.created_by,
				classroom_date: req.body.classroom_date,
                classroom_password: req.body.classroom_password,
			}, function (err, result) {
				  if (err)
				  	next(err);
				  else
				  	res.json({status: "success", message: "Class Room added successfully!!!", data: null});

				});
	},

}
