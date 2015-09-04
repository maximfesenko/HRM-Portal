var tables = require("./createDB");
console.log("server = ", tables.db);

tables.db.serialize(function() {
	tables.db.run("INSERT INTO Places " +
		"(Name, Url)" +
		" VALUES ('LinkedIn', 'https://www.linkedin.com')");

	tables.db.each("SELECT rowid AS id, Name, Url FROM Places", function(err, row) {
		console.log(row.id + ": Name-" + row.Name + ", Url-" + row.Url);
	});
});