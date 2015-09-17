var querystring = require("querystring");
var url = require("url");
var fs = require("fs");
var tables = require("./createDB");

function ajaxlistview(response, postData, request) {
	console.log("Request handler 'listview' was called.");
	var query = url.parse(request.url, true).query;

	var result = {};

	tables.db.each("PRAGMA table_info(Users)", function(err, row) {
		console.log('----columns',row);
	}, function(err, rows) {
	});

	if (query.name == "Users") {
		result["fields"] = ["id", "Active", "Email", "Username", "Password"];
		result["items"] = [];
		tables.db.each("SELECT rowid AS id, Active, Answer, Email, Hint, Username, Password, Question, Role FROM Users", function(err, row) {
			result.items.push({
				"id": row.id,
				"Active": (row.Active ? "true" : "false"),
				"Email": row.Email,
				"Username": row.Username,
				"Password": row.Password
			});
		}, function(err, rows) {
			response.writeHead(200, {"Content-Type": "application/json"});
			response.write(JSON.stringify(result));
			response.end();
		});
	}
	else if (query.name == "UserPlaces") {
		result["fields"] = ["Id", "UserId", "PlaceId", "ProfileUrl"];
		result["items"] = [];
		tables.db.each("SELECT rowid AS id, UserId, PlaceId, ProfileUrl FROM UserPlaces", function(err, row) {
			result.items.push({
				"id": row.id,
				"UserId": row.UserId,
				"PlaceId": row.PlaceId,
				"ProfileUrl": row.ProfileUrl
			});
		}, function(err, rows) {
			response.writeHead(200, {"Content-Type": "application/json"});
			response.write(JSON.stringify(result));
			response.end();
		});
	}
	else {
		response.writeHead(400, {"Content-Type": "application/json"});
		response.write(JSON.stringify({"message":"There is no " + query.name + " table."}));
		response.end();
	}
}

function ajaxLogin(response, postData, request) {
	var parts = postData.split('&');
	var parameters = {};

	for (var i = 0; i < parts.length; i++) {
		var param = parts[i].split('=');
		parameters[param[0]] = param[1];
	}

	var result = {};
	var databaseQuery =
		"SELECT rowid AS id, Active, Answer, Email, Hint, Username, Password, Question, Role " +
		"FROM Users " +
		"WHERE Username = \'" + parameters.username + "\' AND Password = \'" + parameters.password + "\'";

	tables.db.each(databaseQuery, function(err, row) {
		result["id"] = row.id;
	}, function(err, rows) {
		if (result.id != undefined) {
			response.writeHead(200, {"Content-Type": "application/json"});
			response.write(JSON.stringify(result));
			response.end();
		}
		else {
			response.writeHead(400, {"Content-Type": "text/plain"});
			response.write("There is no such user.");
			response.end();
		}
	});
}

function ajaxRegister(response, postData, request) {
	var parts = postData.split('&');
	var parameters = {};

	for (var i = 0; i < parts.length; i++) {
		var param = parts[i].split('=');
		parameters[param[0]] = param[1];
	}

	tables.db.run("INSERT INTO Users " +
		"(Active, Answer, Email, Hint, Username, Password, Question, Role)" +
		" VALUES (1, " + parameters.answer + ", " + parameters.email + ", " + parameters.hint + ", " +
		parameters.username + ", " + parameters.password + ", " + parameters.question + ", 'Standard User')");

	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write(postData);
	response.end();
}

function ajaxListTables(response, postData, request) {
	var table = [];

	tables.db.each("SELECT * FROM sqlite_master", function(err, row) {
		table.push(row.name);
	}, function(err, rows) {
		response.writeHead(200, {"Content-Type": "application/json"});
		response.write(JSON.stringify(table));
		response.end();
	});
}

exports.ajaxlistview = ajaxlistview;
exports.ajaxLogin = ajaxLogin;
exports.ajaxRegister = ajaxRegister;
exports.ajaxListTables = ajaxListTables;