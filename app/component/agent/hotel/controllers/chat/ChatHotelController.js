travel_app.controller('ChatHotelController', function ($scope, $routeParams, $http, $timeout, UserChatService) {
    var user = JSON.parse(window.localStorage.getItem('user'));
    var stompClient = null;

    $scope.userAgencyId = []

    $scope.displayUserChat = {
        id: null,
        userId: null,
        fullName: null,
        avatar: null,
        status: null,
        role: null,
        lastUpdated: null
    };

    $scope.displayMessages = []
    $scope.messageContent = '';

    /**
     * Kết nối tới server websocket
     * @returns {Promise<void>}
     */
    $scope.connect = async function () {
        if (user && user.id && user.fullName) {
            var socket = new SockJS('http://localhost:8080/api/v1/ws');
            stompClient = Stomp.over(socket);
            stompClient.connect({}, async function () {
                try {
                    await $scope.onConnected();
                } catch (error) {

                }
            }, $scope.onError);
        } else {

        }
    };

    /**
     * Phương thức kết nối tới webSocket
     * @returns {Promise<void>}
     */
    $scope.onConnected = async function () {
        stompClient.subscribe(`/user/${user.id}/queue/messages`, function (message) {
            $scope.message = JSON.parse(message.body)
            $scope.message.timestamp = Date.now();
            $scope.handleMessage($scope.message)
            $scope.notifyMessenger($scope.message, "Bạn vừa có tin nhắn mới", "/business/hotel/chat")
            $scope.$apply();
            scrollToBottom();
        });
        stompClient.subscribe(`/user/public`, $scope.onMessageReceived);

        stompClient.send("/app/user.userConnected", {},
            JSON.stringify({
                userId: user.id,
                fullName: user.fullName,
                role: user.roles[0].nameRole,
                avatar: user.avatar
            }));

        await $scope.findUsersWithChatHistoryAdmin();
    };

    /**
     * Lấy danh sách lích sử tin nhắn của khách hàng
     * @returns {Promise<unknown>}
     */
    $scope.findUsersWithChatHistoryAdmin = async function () {
        return new Promise(function (resolve, reject) {
            try {
                console.log(user.id, user.roles[0].nameRole)
                stompClient.send("/app/chat.findUsersWithChatHistoryAdmin", {}, JSON.stringify({userId: user.id, role: user.roles[0].nameRole}));
                stompClient.subscribe('/user/admin', function (message) {
                    $scope.userChatsList = JSON.parse(message.body);
                    $scope.$apply();
                    scrollToBottom()
                });
            } catch (error) {
                console.error("Error:", error);
                reject(error); // Đưa ra lỗi nếu có vấn đề xảy ra
            }
        });
    };

    /**
     * Phương thức hiển thị người dùng lên giao diện chính
     * @param selectedAgencyId
     * @returns {Promise<void>}
     */
    $scope.fetchAndDisplayUserChat = async function (selectedAgencyId) {
        try {
            const userChatResponse = await fetch(`${BASE_API}messages/${selectedAgencyId}/${user.id}`);
            $scope.userChatData = await userChatResponse.json();
            $scope.handleWebSocketMessage($scope.userChatData);
            scrollToBottom()
            $scope.$apply();
        } catch (error) {
            console.error('Error fetching user chat:', error);
            // Xử lý lỗi nếu cần
        }
    };

    $scope.handleWebSocketMessage = function(messages) {
        console.log(messages)
        $scope.displayMessages = []
        // Kiểm tra xem messages có phải là mảng không
        if (Array.isArray(messages)) {
            // Nếu là mảng, lặp qua từng phần tử và xử lý tin nhắn
            messages.forEach(function(message) {
                $scope.newMessage = {
                    senderId: message.senderId,
                    content: message.content,
                    timestamp: message.timestamp
                };
                $scope.displayMessages.push($scope.newMessage);
                $scope.userAgencyId = JSON.parse(window.localStorage.getItem('user'))
            });
        } else if (typeof messages === 'object') {
            // Nếu là một đối tượng, xử lý tin nhắn duy nhất
            $scope.newMessage = {
                senderId: messages.senderId,
                content: messages.content,
                timestamp: message.timestamp
            };
            $scope.displayMessages.push($scope.newMessage);
        }
        $scope.$apply();
    };

    $scope.handleMessage = function(messages) {
        // Kiểm tra xem messages có phải là mảng không
        if (Array.isArray(messages)) {
            // Nếu là mảng, lặp qua từng phần tử và xử lý tin nhắn
            messages.forEach(function(message) {
                var newMessage = {
                    senderId: message.senderId,
                    content: message.content,
                    timestamp: messages.timestamp,
                };
                $scope.displayMessages.push(newMessage);
            });
        } else if (typeof messages === 'object') {
            // Nếu là một đối tượng, xử lý tin nhắn duy nhất
            var newMessage = {
                senderId: messages.senderId,
                content: messages.content,
                timestamp: messages.timestamp,
            };
            $scope.displayMessages.push(newMessage);
        }
        $timeout(function() {
            $scope.$apply();
        });
    };

    $scope.updateStatusMessengerAgency = async function (userChat) {
        $scope.userActive = userChat;
        if (user.id !== null) {
            UserChatService.findUserChatById(userChat.userId, user.id).then(function (response) {
                if (response.status === 200) {
                    $scope.userChats = response.data.data;
                    stompClient.send("/app/chat.updateStatusMessengerAgency", {}, JSON.stringify({userId: user.id, role: user.roles[0].nameRole}));
                    stompClient.subscribe(`/user/${user.id}/queue/updateStatusMessengerAgency`, function (message) {
                        console.log(message)
                        $scope.userChatsList = JSON.parse(message.body);
                        $scope.$apply();
                    });
                    $scope.fetchAndDisplayUserChat(userChat.userId);
                    $scope.$apply();
                } else {
                    console.log("Error:", response);
                }
            })
        }
    };

    $scope.sendMessageToUser = function(customerId) {
        $scope.messageContent.trim();

        if ($scope.messageContent !== '') {
            var chatMessage = {
                senderId: user.id,
                recipientId: customerId.userId,
                content: $scope.messageContent,
                timestamp: new Date()
            };

            $scope.messageContent = {
                senderId: user.id,
                content: $scope.messageContent,
                timestamp: Date.now()
            };

            $scope.handleMessage($scope.messageContent);

            stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
        }
        $scope.messageContent = '';
        scrollToBottom()
    };


    function scrollToBottom() {
        $timeout(function() {
            var chatMessagesDiv = document.getElementById('chatMessages');
            chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
        });
    }

    $scope.connect();
})