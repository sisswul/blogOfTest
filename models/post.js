var mongodb = require('./db');
var markdown = require('markdown').markdown;

function Post(post){
	this.title = post.title;
	this.content = post.content;
	this.name = post.name;
}

module.exports = Post

Post.prototype.save = function(callback){
	var date = new Date();
	var time = {
		date:date,
		year:date.getFullYear(),
		month:date.getFullYear() + '-' +(date.getMonth()+1),
		day: date.getFullYear() + '-' +(date.getMonth()+1) + '-' + date.getDate()
	}
	var post  = {
		name : this.name,
		time : time,
		title: this.title,
		content : this.content
	}

	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}

		db.collection('posts', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.insert(post, {safe:true},function(err, post){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null, post[0]);
			})
		})
	})
}

Post.get = function(name, callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}

		db.collection('posts', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(name){
				query.name = name;
			}
			collection.find(query).sort({time:-1}).toArray(function(err, docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				docs.forEach(function(doc){
					doc.content = markdown.toHTML(doc.content);
				})
				callback(null, docs);
			})
		})
	})
}