require('dotenv').config();
const restify = require('restify'),

{ dbconn } = require('./services/utils'),
fs = require('fs');


dbconn(function (err) {
  if (err)
      console.log(err);
  else 
      console.log('MongoDB successfully connected to test DB: ', process.env.MONGODB_URI); // this for testing db
    //  console.log('MongoDB successfully connected to : ', process.env.MONGOLAB_NAVY_URI);  // this is for live db
});

//create server
var api = restify.createServer();
api.use(restify.plugins.acceptParser(api.acceptable));
api.use(restify.plugins.queryParser());
api.use(restify.plugins.bodyParser());
api.use(restify.plugins.gzipResponse());

/** CORS SETUP */////// ///////////////// 
api.use(
  function crossOrigin(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      return next();
  }
);
function unknownMethodHandler(req, res) {
  if (req.method.toLowerCase() === 'options') {
      var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'x-access-token', 'x-request-type'];

      if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

      res.header('Access-Control-Allow-Credentials', true);
      res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
      res.header('Access-Control-Allow-Methods', res.methods.join(', '));
      res.header('Access-Control-Allow-Origin', req.headers.origin);

      return res.send(204);
  }
  else
      return res.send(new errors.MethodNotAllowedError('Invalid Method'));
}

api.on('MethodNotAllowed', unknownMethodHandler);

var PORT = process.env.PORT || 5000;
api.listen(PORT, function () {
    console.log("Server started @ " + PORT);
});

module.exports.api = api;

api.get("/", function(req,res){res.send(200,{msg: 'WELCOME TO PRC API'})});

//ADMIN ROUTES
var admin_admin_routes = require('./endpoints/admin/_admin/routes');
var admin_auth_routes = require('./endpoints/admin/_auth/routes'); 
var admin_courses_routes = require('./endpoints/admin/_courses/routes');
var admin_assessments_routes = require('./endpoints/admin/_assessments/routes');
var admin_lessons_routes = require('./endpoints/admin/_lessons/routes');
var admin_questions_routes = require('./endpoints/admin/_questions/routes');
var admin_users_routes = require('./endpoints/admin/_users/routes');
var admin_me_routes = require('./endpoints/admin/_me/routes');
var dashboard_routes = require('./endpoints/dashboard/routes');
// var admin_exam_packages_routes = require('./endpoints/admin/_exam_packages/routes');

//USER ROUTES ///////////////
var user_auth_routes = require('./endpoints/user/_auth/routes');
var user_mock_routes = require('./endpoints/user/_mock_exams/routes');
var user_me_routes = require('./endpoints/user/_me/routes');
var user_subscription_routes = require('./endpoints/user/_subscription/routes');
var user_exam_packages_routes = require('./endpoints/user/_exam/routes');
var user_courses_routes = require('./endpoints/user/_courses/routes');
//ADMIN ROUTES
var admin_admin_routes = require('./endpoints/admin/_admin/routes');
var admin_auth_routes = require('./endpoints/admin/_auth/routes'); 
var admin_courses_routes = require('./endpoints/admin/_courses/routes');
var admin_assessments_routes = require('./endpoints/admin/_assessments/routes');
var admin_lessons_routes = require('./endpoints/admin/_lessons/routes');
var admin_questions_routes = require('./endpoints/admin/_questions/routes');
var admin_users_routes = require('./endpoints/admin/_users/routes');
var admin_me_routes = require('./endpoints/admin/_me/routes');
var admon_mock_exam_routes = require('./endpoints/admin/_mock_exams/routes');
var dashboard_routes = require('./endpoints/dashboard/routes');
// var admin_exam_packages_routes = require('./endpoints/admin/_exam_packages/routes');



/// landing page
var landing_page_routes = require('./endpoints/user/_landing_page/routes');