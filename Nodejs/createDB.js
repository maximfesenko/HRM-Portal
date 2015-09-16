var fs = require("fs");
var file = "test.db";

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);
console.log('test.db was created.');

db.run("CREATE TABLE IF NOT EXISTS Users(" +
	"Id Integer primary key autoincrement, " +
	"Active Boolean, " +
	"Answer Text, " +
	"Email Text, " +
	"Hint Text, " +
	"Username Text, " +
	"Password Text, " +
	"Question Text, " +
	"Role Text, " +
	"SessionId Text, " +
	"EmployeeType Text, " +
	"Company Text, " +
	"Industry Text" +
	")"
);

db.run("CREATE TABLE IF NOT EXISTS Places(" +
	"Id Integer primary key autoincrement, " +
	"Name Text, " +
	"Url Text" +
	")"
);

db.run("CREATE TABLE IF NOT EXISTS UserPlaces(" +
	"Id Integer primary key autoincrement, " +
	"UserId Integer, " +
	"PlaceId Integer, " +
	//"FOREIGN KEY(PlaceId) REFERENCES Places(Id), " +
	//"FOREIGN KEY(UserId) REFERENCES Users(Id), " +
	"ProfileUrl Text" +
	")"
);

exports.db = db;