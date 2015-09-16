var tables = require("./createDB");
console.log("server = ", tables.db);

tables.db.serialize(function() {
	tables.db.run("INSERT INTO Users " +
		"(Active, Answer, Email, Hint, Username, Password, Question, Role) VALUES " +
		"(1, 'cool', 'fesmaksim@gmail.com', 'cool', 'fesmaksim', 'fesmaksim', 'How are you?', 'Admin')," +
		"(0, 'cool', 'fesmaksim@gmail.com', 'cool', 'user', 'user', 'How are you?', 'Standard User')");

	console.log('Users were created.');

	tables.db.each("SELECT rowid AS id, Active, Answer, Email, Hint, Username, Password, Question, Role FROM Users", function(err, row) {
		console.log(row.id + ": Active-" + (row.Active ? "true" : "false") + ", Email-" + row.Email + ", Username-" + row.Username + ", Password-" + row.Password);
	});

	tables.db.run("INSERT INTO Places " +
		"(Name, Url)" +
		" VALUES ('LinkedIn', 'https://www.linkedin.com')");

	console.log('Places were created.');

	tables.db.each("SELECT rowid AS id, Name, Url FROM Places", function(err, row) {
		console.log(row.id + ": Name-" + row.Name + ", Url-" + row.Url);
	});
});