var mongoose = require('mongoose');

const subjectNameModel = mongoose.model('SubjectName')					

module.exports = {
	getById: function(req, res, next) {
		console.log(req.body);
		subjectNameModel.findById(req.params.subjectId, function(err, subjectNameInfo){
			if (err) {
				next(err);
			} else {
				res.json({status:"success", message: "Subject found!!!", data:{subject: subjectNameInfo}});
			}
		});
	},

	getAll: function(req, res, next) {
		let subjectNameList = [];

		subjectNameModel.find({}, function(err, subjectname){
			if (err){
				next(err);
			} else{
				for (let name of subjectname) {
					subjectNameList.push({id: name._id, name: name.name});
				}
				res.json({status:"success", message: "Subject list found!!!", data:{names: subjectNameList}});
							
			}

		});
	},

	updateById: function(req, res, next) {
		subjectNameModel.findByIdAndUpdate(req.params.subjectId,{name:req.body.name}, function(err, subjectNameInfo){

			if(err)
				next(err);
			else {
				res.json({status:"success", message: "Subject updated successfully!!!", data:null});
			}
		});
	},

	deleteById: function(req, res, next) {
		subjectNameModel.findByIdAndRemove(req.params.subjectId, function(err, subjectNameInfo){
			if(err)
				next(err);
			else {
				res.json({status:"success", message: "Subject deleted successfully!!!", data:null});
			}
		});
	},

	create: function(req, res, next) {
		subjectNameModel.create({ name: req.body.name }, function (err, result) {
				  if (err) 
				  	next(err);
				  else
				  	res.json({status: "success", message: "Subject added successfully!!!", data: null});
				  
				});
	},

}					