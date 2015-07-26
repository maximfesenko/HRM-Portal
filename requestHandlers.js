var querystring = require("querystring");
var url = require("url");
var fs = require("fs");
var tables = require("./createDB");

function start(response, postData, request) {
	console.log("Request handler 'start' was called.");

	fs.readFile("start.html", "utf8", function(error, file) {
		if (error) {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(file, "utf8");
			response.end();
		}
	});
}

function show(response, postData, request) {
	console.log("Request handler 'show' was called.");
	fs.readFile("ListView.html", "utf8", function(error, file) {
		if (error) {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(file, "utf8");
			response.end();
		}
	});
}

function clean(response, postData, request) {
	console.log("Request handler 'clean' was called.");
	var query = url.parse(request.url, true).query;

	response.writeHead(200, {"Content-Type": "text/plain"});

	tables.db.run("DELETE FROM " + query.name);
	response.write(query.name + ' table was cleaned.');
	response.end();
}

function ajaxlistview(response, postData, request) {
	console.log("Request handler 'listview' was called.");
	var query = url.parse(request.url, true).query;

	var result = {};

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
	else {
		response.writeHead(400, {"Content-Type": "application/json"});
		response.write(JSON.stringify({"message":"There is no " + query.name + " table."}));
		response.end();
	}
}

exports.start = start;
exports.show = show;
exports.clean = clean;
exports.ajaxlistview = ajaxlistview;