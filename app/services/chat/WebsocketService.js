travel_app.service('WebSocketService', ['$rootScope', function($rootScope) {
    var service = {};
    var stompClient; // Dùng biến này để lưu trữ stompClient ở phạm vi toàn cục của service

    service.connect = async function(user, onConnectedCallback) {
        if (user && user.id && user.fullName) {
            var socket = new SockJS(`${BASE_API}ws`);
            stompClient = Stomp.over(socket);
            stompClient.connect({}, async function() {
                try {
                    await onConnectedCallback(user, stompClient); // Truyền stompClient vào callback
                } catch (error) {
                    console.error("Error connecting:", error);
                }
            }, function(error) {
                console.error("Error:", error);
            });
        }
    };

    service.disconnect = function(user) {
        if (stompClient && stompClient.connected) {
            stompClient.send("/app/user.disconnectUser", {}, JSON.stringify({
                userId: user.id,
                fullName: user.fullName,
                role: user.roles[0].nameRole,
                avatar: user.avatar
            }));
        }
    };

    service.sendNotification = function(senderId, recipientId, content) {
        if (stompClient && stompClient.connected && senderId && recipientId) {
            stompClient.send(`/app/${senderId}/send-notification-order`, {}, JSON.stringify({
                senderId: senderId,
                recipientId: recipientId,
                content: content
            }));
        }
    };

    return service;
}]);
