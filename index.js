var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/login"] = requestHandlers.start;
handle["/show"] = requestHandlers.show;
handle["/clean"] = requestHandlers.clean;
handle["/ajaxListView"] = requestHandlers.ajaxlistview;

server.start(router.route, handle);