'use strict';

module.exports = function(app) {
  var userHandlers = require('../controllers/userController.js'),
  classNameHandlers = require('../controllers/classNameController.js'),
  classRoomHandlers = require('../controllers/classRoomController.js'),
  sectionHandlers = require('../controllers/sectionNameController.js'),
  subjectHandlers = require('../controllers/subjectNameController.js');

  app.route('/')
  .get(userHandlers.index);

  app.route('/auth/register')
    .post(userHandlers.register);

  app.route('/auth/sign_in')
    .post(userHandlers.sign_in);


  app.route('/auth/student_sign_in')
      .post(userHandlers.student_sign_in);

  app.route('/user')
      .put(userHandlers.updateById);

  app.route('/auth/forgot_password')
    .get(userHandlers.render_forgot_password_template)
    .post(userHandlers.forgot_password);

  app.route('/auth/reset_password')
    .get(userHandlers.render_reset_password_template)
    .post(userHandlers.reset_password);

  app.route('/class_name')
    .get(classNameHandlers.getAll)
    .post(classNameHandlers.create);

  app.route('/class_name/:classId')
    .get(classNameHandlers.getById)
    .put(classNameHandlers.updateById)
    .delete(classNameHandlers.deleteById);

  app.route('/class_room')
    .get(classRoomHandlers.getAll)
    .post(classRoomHandlers.create);

  app.route('/class_room/:class/:section')
      .get(classRoomHandlers.getByClassSection)

  app.route('/class_room/:classRoomId')
    .get(classRoomHandlers.getById)
    .put(classRoomHandlers.updateById)
    .delete(classRoomHandlers.deleteById);

  app.route('/user_class_room/:userId')
      .get(classRoomHandlers.getByUserId)

  app.route('/section_name')
    .get(sectionHandlers.getAll)
    .post(sectionHandlers.create);

  app.route('/section_name/:sectionId')
    .get(sectionHandlers.getById)
    .put(sectionHandlers.updateById)
    .delete(sectionHandlers.deleteById);

  app.route('/subject_name')
    .get(subjectHandlers.getAll)
    .post(subjectHandlers.create);

  app.route('/subject_name/:subjectId')
    .get(subjectHandlers.getById)
    .put(subjectHandlers.updateById)
    .delete(subjectHandlers.deleteById);
};
