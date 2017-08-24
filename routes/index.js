var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/User');
var Post = require('../models/Post');
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;

function checkLogin(req, res, next){
	if(!req.session.user){
		res.redirect('/login');
	}
	next();
}

function checkNotLogin(req, res, next){
	if(req.session.user){
		res.redirect('back');
	}
	next();
}
module.exports = function(app){
	app.get('/', function(req, res, next) {
		Post.get(null, function(err, posts){
			if(err){
				posts = [];
			}
	  		res.render('index', { title: '主页', user: req.session.user, posts:posts });
		})
	});


	app.get('/login', checkNotLogin);
	app.get('/login', function(req, res, next) {
	  	res.render('login', {title: '登录', user: req.session.user});
	});

	app.post('/login', checkNotLogin);
	app.post('/login', function(req, res, next) {
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');

		User.get(req.body.name, function(err, user){
			
			if(!user){
				res.send({code: 500, message:'用户不存在'});
				return;
			}
			if(user.password !== password){
				res.send({code: 500, message:'密码错误'});
				return;
			}
			req.session.user = user;
			res.send({code: 200, message:'登录成功'});
		})

		
	});


	app.get('/logout', checkLogin)
	app.get('/logout', function(req, res, next) {
		req.session.user = null;
	  	res.redirect('/');
	});

	app.get('/post', function(req, res, next) {
	  	res.render('post', {title:'发帖', user:req.session.user});
	});
	app.get('/post', checkLogin)

	app.post('/post', checkLogin)
	app.post('/post', function(req, res, next){
		var currentUser = req.session.user,
			post = new Post({name:currentUser.name, title:req.body.title, content:req.body.content});

		post.save(function(err){
			if(err){
				return res.send({code: 500, message:err});
			}
			res.send({code: 200, message:'保存成功'});
		})
	})

	app.get('/upload', checkLogin)
	app.get('/upload', function(req, res, next) {
	  	res.render('upload', {title:'文件上传', user:req.session.user});
	});
	app.post('/upload', checkLogin)
	app.post('/upload', function(req, res){
		res.redirect('/upload');
	})

	app.get('/register', checkNotLogin)
	app.get('/register', function(req, res, next) {
	  	res.render('register', {title:'注册', user:req.session.user});
	});
	app.post('/register', checkNotLogin)
	app.post('/register', function(req, res, next){
		var name = req.body.name,
			md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');

		var newUser = new User({
			name : req.body.name,
			password : password,
			email : req.body.email
		})

		User.get(newUser.name, function(err, user){
			if(err){
				req.flash('error', err);
				// return res.redirect('/');
				return res.send({code: 500, message:err});
			}

			if(user){
				req.flash('error', '用户已存在');
				// return res.redirect('/register');
				return res.send({code: 500, message:'用户已存在'});
			}

			newUser.save(function(err, user){
				if(err){
					req.flash('error', err);
					return res.send({code: 500, message:err});
				}

				req.session.user = user;
				res.send({code: 200, message:'登录成功'});
			})
		})

	})
}