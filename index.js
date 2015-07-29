var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/login"] = requestHandlers.start;
handle["/home"] = requestHandlers.home;
handle["/show"] = requestHandlers.show;
handle["/clean"] = requestHandlers.clean;
handle["/ajaxListView"] = requestHandlers.ajaxlistview;
handle["/ajaxLogin"] = requestHandlers.ajaxLogin;

server.start(router.route, handle);