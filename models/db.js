var settings = require('../settings'),
	Db = require('mongodb').Db,
	Connection = require('mongodb').Connection,
	Server = require('mongodb').Server;

module.exports =  new Db(settings.db, new Server(settings.host, settings.port), {safe: true});


// mongod.exe --logpath=D:\MongoData\log\log.txt --dbpath=D:\MongoData\blog
// mongod --dbpath "D:\MongoData\blog" --logpath "D:\MongoData\log\mongodb.log" --install --serviceName "MongoDB"
// mongod.exe -dbpath "D:\MongoData\blog" -storageEngine=mmapv1