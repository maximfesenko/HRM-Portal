var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var ajaxHandlers = require("./ajaxHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/login"] = requestHandlers.start;
handle["/home"] = requestHandlers.home;
handle["/show"] = requestHandlers.show;
handle["/addcandidate"] = requestHandlers.addcandidate;
handle["/clean"] = requestHandlers.clean;
handle["/ajaxListView"] = ajaxHandlers.ajaxlistview;
handle["/ajaxLogin"] = ajaxHandlers.ajaxLogin;
handle["/ajaxRegister"] = ajaxHandlers.ajaxRegister;
handle["/ajaxListTables"] = ajaxHandlers.ajaxListTables;
handle["/css/start.css"] = requestHandlers.filecss;
handle["/css/jquery.tablesorter.pager.css"] = requestHandlers.filecss;
handle["/css/theme.bootstrap.css"] = requestHandlers.filecss;
handle["/css/bootstrap.min.css"] = requestHandlers.filecss;
handle["/css/bootstrap-select.min.css"] = requestHandlers.filecss;
handle["/js/bootstrap-select.js"] = requestHandlers.filecss;
handle["/js/jquery.tablesorter.js"] = requestHandlers.filecss;
handle["/js/jquery.tablesorter.widgets.js"] = requestHandlers.filecss;
handle["/js/jquery.tablesorter.pager.js"] = requestHandlers.filecss;
handle["/fonts/glyphicons-halflings-regular.woff2"] = requestHandlers.filecss;
handle["/fonts/glyphicons-halflings-regular.woff"] = requestHandlers.filecss;
handle["/fonts/glyphicons-halflings-regular.ttf"] = requestHandlers.filecss;

server.start(router.route, handle);