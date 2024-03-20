travel_app.controller("ChatCustomerController", function ($scope, $routeParams, $http, $timeout, UserChatService) {
    var user = JSON.parse(window.localStorage.getItem('user'));
    var stompClient = null;

    $scope.displayUserChat = {
        id: null,
        userId: null,
        fullName: null,
        avatar: null,
        status: null,
        role: null,
        lastUpdated: null
    };

    $scope.displayMessages = [];

    $scope.connect = async function () {
        if (user && user.id && user.fullName) {
            var socket = new SockJS('http://localhost:8080/api/v1/ws');
            stompClient = Stomp.over(socket);
            stompClient.connect({}, async function () {
                try {
                    await $scope.onConnected();
                } catch (error) {
                    console.error('Error in onConnected:', error);
                }
            }, $scope.onError);
        } else {
            console.log('User information is not available or incomplete!');
        }
    };

    $scope.onConnected = async function () {
        stompClient.subscribe(`/user/${user.id}/queue/messages`, function (message) {
            $scope.message = JSON.parse(message.body)
            $scope.message.timestamp = Date.now();
            $scope.handleMessage($scope.message)
            $scope.notifyMessenger($scope.message, "Bạn vừa có tin nhắn mới", "/business/hotel/chat")
            scrollToBottom()
        });
        stompClient.subscribe(`/user/public`, $scope.onMessageReceived);
        stompClient.send("/app/user.userConnected", {},
            JSON.stringify({
                userId: user.id,
                fullName: user.fullName,
                role: user.roles[0].nameRole,
                avatar: user.avatar
            }));
        $scope.userAgencyId = JSON.parse(window.localStorage.getItem('user'))
        if ($routeParams.id != null) {
            await $scope.findAgencyChatById($routeParams.id);
        }
        await $scope.findUsersWithChatHistoryUser()
    };

    $scope.findAgencyChatById = async function (agencyId) {
        try {
            $scope.agencyId = atob(agencyId);
            const userChatResponse = await UserChatService.findAgencyChatById($scope.agencyId);

            if(userChatResponse.status === 200){
                $scope.displayUserChat = userChatResponse.data.data;
                $scope.$apply();
            }
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    $scope.fetchAndDisplayUserChat = async function (selectedAgencyId) {
        try {
            const userChatResponse = await fetch(`${BASE_API}messages/${selectedAgencyId}/${user.id}`);
            $scope.userChatData = await userChatResponse.json();
            $scope.handleWebSocketMessage($scope.userChatData);
            $scope.$apply();
        } catch (error) {
            console.error('Error fetching user chat:', error);
            // Xử lý lỗi nếu cần
        }
    };

    /**
     * Phương thức cập nhật trạng thái đã xem của tin nhắn khi người dùng click vào tin nhắn
     * @param userChat Danh sách người dùng
     * @returns {Promise<void>}
     */
    $scope.updateStatusMessengerAgency = async function (userChat) {
        console.log("userChat: " + userChat.userId)
        $scope.displayUserChat = userChat;
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
        scrollToBottom()
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
    /**
     * Lấy danh sách lích sử tin nhắn của khách hàng
     * @returns {Promise<unknown>}
     */
    $scope.findUsersWithChatHistoryUser = async function () {
        return new Promise(function (resolve, reject) {
            try {
                console.log(user.id, user.roles[0].nameRole)
                stompClient.send("/app/chat.findUsersWithChatHistoryCustomer", {}, JSON.stringify({userId: user.id, role: user.roles[0].nameRole}));
                stompClient.subscribe('/user/customer', function (message) {
                    $scope.userChatsList = JSON.parse(message.body);
                    $scope.$apply();
                });
            } catch (error) {
                console.error("Error:", error);
                reject(error); // Đưa ra lỗi nếu có vấn đề xảy ra
            }
        });
    };


    $scope.messages = []; // Khởi tạo mảng để lưu trữ tin nhắn

    $scope.scrollToBottom = function () {
        var chatArea = document.getElementById('chatArea');
        chatArea.scrollTop = chatArea.scrollHeight;
    };


    /**
     * Phương thức gửi tin nhắn
     */
    $scope.messageInput = ''
    $scope.sendMessage = function (userId) {
        var messageContent = $scope.messageInput.trim();

        if (messageContent && stompClient) {
            var chatMessage = {
                senderId: user.id,
                recipientId: userId,
                content: messageContent,
                timestamp: new Date()
            };
            stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));

            $scope.messageContent = {
                senderId: user.id,
                content: messageContent,
                timestamp: Date.now()
            };

            $scope.handleMessage($scope.messageContent);

            $scope.messageInput = ''
            scrollToBottom()
        }
    };

    function scrollToBottom() {
        $timeout(function() {
            var chatMessagesDiv = document.getElementById('chatMessages');
            chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
        });
    }

    $scope.connect();
});
