var mongodb = require('./db');

function User(user){
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
}

module.exports = User;

User.prototype.save = function(callback){
	var user = {
		name : this.name,
		password : this.password,
		email : this.email
	}

	mongodb.open(function(err, db){
		if(err){
			return callback(err);  //open db err
		}
		db.collection('users', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err); //读取collection error
			}
			collection.insert(user, {safe:true}, function(err, user){
				mongodb.close();
				if(err){
					return callback(err); //insert error
				}
				callback(null, user[0])  //suceesss
			})
		})
	})
}

User.get = function(name, callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('users', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.findOne({name:name}, function(err, user){
				mongodb.close();
				if(err){
					return callback(err); //insert error
				}
				callback(null, user);
			})
		})
	})
}