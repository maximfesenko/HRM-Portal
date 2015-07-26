var tables = require("./createDB");
console.log("server = ", tables.db);

tables.db.run("DELETE FROM Users");
console.log('Users table was cleaned.');