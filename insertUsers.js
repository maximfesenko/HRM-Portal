var tables = require("./createDB");
console.log("server = ", tables.db);

tables.db.serialize(function() {
	tables.db.run("INSERT INTO Users " +
		"(Active, Answer, Email, Hint, Username, Password, Question, Role)" +
		" VALUES (1, 'cool', 'fesmaksim@gmail.com', 'cool', 'fesmaksim', 'fesmaksim', 'How are you?', 'Admin')");
	tables.db.run("INSERT INTO Users " +
		"(Active, Answer, Email, Hint, Username, Password, Question, Role)" +
		" VALUES (1, 'cool', 'fesmaksim@gmail.com', 'cool', 'user', 'user', 'How are you?', 'Standard User')");

	console.log('Insert Admin into the Users table.');

	tables.db.each("SELECT rowid AS id, Active, Answer, Email, Hint, Username, Password, Question, Role FROM Users", function(err, row) {
		console.log(row.id + ": Active-" + (row.Active ? "true" : "false") + ", Email-" + row.Email + ", Username-" + row.Username + ", Password-" + row.Password);
	});
});