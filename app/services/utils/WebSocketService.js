travel_app.factory('WebSocketService', ['$rootScope', function($rootScope) {
    var service = {};
    var ws = new WebSocket("ws://localhost:8080/websocket");

    ws.onopen = function() {
        console.log("WebSocket connection established.");
    };

    ws.onmessage = function(event) {
        var message = event.data;
        console.log("Received message:", message);
        $rootScope.$broadcast('ws:message', message);
    };

    service.sendMessage = function(message) {
        ws.send(message);
    };

    return service;
}]);
