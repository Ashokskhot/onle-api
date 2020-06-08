var mongoose = require('mongoose');
const classNameModel = mongoose.model('ClassName')					

module.exports = {
	getById: function(req, res, next) {
		console.log(req.body);
		classNameModel.findById(req.params.classId, function(err, classNameInfo){
			if (err) {
				next(err);
			} else {
				res.json({status:"success", message: "Class found!!!", data:{rooms: classNameInfo}});
			}
		});
	},

	getAll: function(req, res, next) {
		let classNameList = [];

		classNameModel.find({}, function(err, classname){
			if (err){
				next(err);
			} else{
				for (let name of classname) {
					classNameList.push({id: name._id, name: name.name});
				}
				res.json({status:"success", message: "Class list found!!!", data:{names: classNameList}});
							
			}

		});
	},

	updateById: function(req, res, next) {
		classNameModel.findByIdAndUpdate(req.params.classId,{name:req.body.name}, function(err, classNameInfo){

			if(err)
				next(err);
			else {
				res.json({status:"success", message: "Class updated successfully!!!", data:null});
			}
		});
	},

	deleteById: function(req, res, next) {
		classNameModel.findByIdAndRemove(req.params.classId, function(err, classNameInfo){
			if(err)
				next(err);
			else {
				res.json({status:"success", message: "Class deleted successfully!!!", data:null});
			}
		});
	},

	create: function(req, res, next) {
		classNameModel.create({ name: req.body.name }, function (err, result) {
				  if (err) 
				  	next(err);
				  else
				  	res.json({status: "success", message: "Class added successfully!!!", data: null});
				  
				});
	},

}					