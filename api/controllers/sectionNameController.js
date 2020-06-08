var mongoose = require('mongoose');
const sectionNameModel = mongoose.model('SectionName')					

module.exports = {
	getById: function(req, res, next) {
		console.log(req.body);
		sectionNameModel.findById(req.params.sectionId, function(err, sectionNameInfo){
			if (err) {
				next(err);
			} else {
				res.json({status:"success", message: "section found!!!", data:{section: sectionNameInfo}});
			}
		});
	},

	getAll: function(req, res, next) {
		let sectionNameList = [];

		sectionNameModel.find({}, function(err, sectionname){
			if (err){
				next(err);
			} else{
				for (let name of sectionname) {
					sectionNameList.push({id: name._id, name: name.name});
				}
				res.json({status:"success", message: "section list found!!!", data:{names: sectionNameList}});
							
			}

		});
	},

	updateById: function(req, res, next) {
		sectionNameModel.findByIdAndUpdate(req.params.sectionId,{name:req.body.name}, function(err, sectionNameInfo){

			if(err)
				next(err);
			else {
				res.json({status:"success", message: "Section updated successfully!!!", data:null});
			}
		});
	},

	deleteById: function(req, res, next) {
		sectionNameModel.findByIdAndRemove(req.params.sectionId, function(err, sectionNameInfo){
			if(err)
				next(err);
			else {
				res.json({status:"success", message: "Section deleted successfully!!!", data:null});
			}
		});
	},

	create: function(req, res, next) {
		sectionNameModel.create({ name: req.body.name }, function (err, result) {
				  if (err) 
				  	next(err);
				  else
				  	res.json({status: "success", message: "Section added successfully!!!", data: null});
				  
				});
	},

}					