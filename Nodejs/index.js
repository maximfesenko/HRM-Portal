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
handle["/css/start.css"] = requestHandlers.filecss;

server.start(router.route, handle);