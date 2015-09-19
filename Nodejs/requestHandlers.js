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

function filecss(response, postData, request) {
	var pathname = url.parse(request.url).pathname;
	var contentType = 'text/plain';

	var extension = pathname.substring(pathname.lastIndexOf('.') + 1);

	switch(extension) {
		case 'css': {
			contentType = 'text/css';
			break;
		}
		case 'js': {
			contentType = 'text/javascript';
			break;
		}
		case 'woff2': {
			contentType = 'application/font-woff';
			break;
		}
		case 'woff': {
			contentType = 'application/font-woff';
			break;
		}
		case 'ttf': {
			contentType = 'application/font-woff';
			break;
		}
	}

	fs.readFile(pathname.substring(1), "utf8", function(error, file) {
		displayFile(response, error, file, contentType);
	});
}

function displayFile(response, error, file, pathname) {
	if (error) {
		response.writeHead(500, {"Content-Type": "text/plain"});
		response.write(error + "\n");
		response.end();
	} else if (file) {
		response.writeHead(200, {"Content-Type": pathname});
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
exports.home = home;
exports.filecss = filecss;
exports.addcandidate = addCandidate;