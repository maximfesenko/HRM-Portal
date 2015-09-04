var querystring = require("querystring");
var url = require("url");
var fs = require("fs");
var tables = require("./createDB");

function start(response, postData, request) {
	console.log("Request handler 'start' was called.");

	fs.readFile("html/start.html", "utf8", function(error, file) {
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

function home(response, postData, request) {
	console.log("Request handler 'start' was called.");

	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("You are welcome.");
	response.end();
}

function show(response, postData, request) {
	console.log("Request handler 'show' was called.");
	fs.readFile("html/ListView.html", "utf8", function(error, file) {
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

function filecss(response, postData, request) {
	var pathname = url.parse(request.url).pathname;
	var resultFile;
	var resultError;

	if (pathname.indexOf("start.css")) {
		fs.readFile("css/start.css", "utf8", function(error, file) {
			displayFile(response, error, file);
		});
	}
}

function displayFile(response, error, file) {
	if (error) {
		response.writeHead(500, {"Content-Type": "text/plain"});
		response.write(error + "\n");
		response.end();
	} else if (file) {
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(file, "utf8");
		response.end();
	}
}

function addCandidate(response, postData, request) {
	var data = querystring.parse(postData);
	console.log('postData=',data);

	var user = [];

	tables.db.run("INSERT INTO Users " +
		"(Active, Answer, Email, Hint, Username, Password, Question, Role, EmployeeType, Company, Industry)" +
		" VALUES (0, 'cool', '" + data.email + "', 'cool', '" + data.name + "', " +
			"'user', 'How are you?', 'Standard User', '" + data.employeeType + "', '" + data.currentCompany + "', " +
			"'" + data.industry + "')");

	console.log('user inserted.');

	var userId;
	tables.db.each("SELECT Id FROM Users WHERE Email='" + data.email + "'", function(err, row) {
		userId = row.Id;
	}, function(err, rows) {
		var placeId;
		tables.db.each("SELECT Id FROM Places WHERE Name='LinkedIn'", function(err, row) {
			placeId = row.Id;
		}, function(err, rows) {
			console.log('userid:',userId,'placeid:',placeId);

			tables.db.run("INSERT INTO UserPlaces(UserId, PlaceId, ProfileUrl)" +
		    	"VALUES ('" + userId + "', '" + placeId + "', '" + data.profile + "')");
			//TODO: needs to add catch for the exception
			user['status'] = 'success';
			user['code'] = 200;
			user['message'] = 'Candidate was added sucessfully.';

			response.writeHead(200, {"Content-Type": "application/json"});
			response.write(JSON.stringify(user), "utf8");
			response.end();
		});
	});
}

exports.start = start;
exports.show = show;
exports.clean = clean;
exports.ajaxlistview = ajaxlistview;
exports.ajaxLogin = ajaxLogin;
exports.ajaxRegister = ajaxRegister;
exports.home = home;
exports.filecss = filecss;
exports.addcandidate = addCandidate;