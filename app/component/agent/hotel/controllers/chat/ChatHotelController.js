travel_app.controller('ChatHotelController', function ($scope, $routeParams, $http, $timeout, UserChatService) {
    var user = JSON.parse(window.localStorage.getItem('user'));
    var stompClient = null;

    $scope.userAgencyId = []

    $scope.displayMessages = []
    $scope.messageContent = '';

    /**
     * Kết nối tới server websocket
     * @returns {Promise<void>}
     */
    $scope.connect = async function () {
        if (user && user.id && user.fullName) {
            var socket = new SockJS(`${BASE_API}ws`);
            stompClient = Stomp.over(socket);
            stompClient.connect({}, async function () {
                try {
                    await $scope.onConnected();
                } catch (error) {
                    console.error("Error connecting:", error);
                }
            }, function (error) {
                console.error("Error:", error);
            });
        } else {
            console.error("User or user information is missing.");
        }
    };


    /**
     * Phương thức kết nối tới webSocket
     * @returns {Promise<void>}
     */
    $scope.onConnected = async function () {
        try {
            stompClient.subscribe(`/user/${user.id}/queue/messages`, async function (message) {
                $scope.message = JSON.parse(message.body);
                $scope.message.timestamp = Date.now();
                await $scope.findUsersChat();
                $scope.notifyMessenger($scope.message, "Bạn vừa có tin nhắn mới", "/business/hotel/chat");
                $scope.showNewMessage($scope.message);
                $scope.$apply();
                scrollToBottom();
            });

            stompClient.subscribe(`/user/${user.id}/send/notification`, async function (message) {
                $scope.message = JSON.parse(message.body);
                await $scope.findUsersChat();
                $scope.$apply();
            });

            stompClient.send("/app/user.userConnected", {},
                JSON.stringify({
                    userId: user.id,
                    fullName: user.fullName,
                    role: user.roles[0].nameRole,
                    avatar: user.avatar
                }));

            await $scope.findUsersChat();
        } catch (error) {
            console.error("Error:", error);
            // Xử lý lỗi ở đây nếu cần thiết
        }
    };


    /**
     * Lấy danh sách lích sử tin nhắn của người dùng
     * @returns {Promise<unknown>}
     */
    $scope.findUsersChat = async function () {
        try {
            console.log(user.id, user.roles[0].nameRole);
            stompClient.send(`/app/${user.id}/chat.findUsersChat`, {}, JSON.stringify({
                userId: user.id,
                role: user.roles[0].nameRole
            }));

            return new Promise(function (resolve, reject) {
                stompClient.subscribe(`/user/${user.id}/chat/findUsersChat`, function (message) {
                    $scope.userChatsList = JSON.parse(message.body);
                    console.log($scope.userChatsList);
                    scrollToBottom();
                    resolve($scope.userChatsList);
                });
            });
        } catch (error) {
            console.error("Error:", error);
            throw error; // Ném lỗi để xử lý ở mức cao hơn
        }
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
            $scope.showMessage($scope.userChatData);
            scrollToBottom()
            $scope.$apply();
        } catch (error) {
            console.error('Error fetching user chat:', error);
            // Xử lý lỗi nếu cần
        }
        $timeout(function () {
            $scope.$apply();
        });
    };

    $scope.showMessage = function (messages) {
        console.log(messages)
        $scope.displayMessages = []
        if (Array.isArray(messages)) {
            messages.forEach(function (message) {
                $scope.newMessage = {
                    senderId: message.senderId,
                    content: message.content,
                    timestamp: message.timestamp
                };
                $scope.displayMessages.push($scope.newMessage);
                $scope.userAgencyId = JSON.parse(window.localStorage.getItem('user'))
            });
        } else if (typeof messages === 'object') {
            $scope.newMessage = {
                senderId: messages.senderId,
                content: messages.content,
                timestamp: messages.timestamp
            };
            $scope.displayMessages.push($scope.newMessage);
        }
        $timeout(function () {
            $scope.$apply();
        });
    };

    $scope.showNewMessage = function (messages) {
        console.log($scope.displayUserChat, messages)
        if ($scope.displayUserChat && messages) {
            if (messages.senderId.toString() === $scope.displayUserChat.userId.toString()) {
                $scope.newMessage = {
                    senderId: messages.senderId,
                    content: messages.content,
                    timestamp: messages.timestamp
                };
                console.log('NewMessage: ', $scope.newMessage);
                $scope.displayMessages.push($scope.newMessage);
            }
        }
        $timeout(function () {
            $scope.$apply();
        });
    };


    $scope.sendMessage = async function (customerId) {
        $scope.messageContent.trim();
        if ($scope.messageContent !== '' && $scope.displayUserChat !== null && $scope.displayUserChat !== undefined) {
            var chatMessage = {
                senderId: user.id,
                recipientId: customerId,
                content: $scope.messageContent,
                timestamp: new Date()
            };
            $scope.newMessage = {
                senderId: user.id,
                content: $scope.messageContent,
                timestamp: new Date()
            }

            $scope.displayMessages.push($scope.newMessage)
            stompClient.send(`/app/${user.id}/chat`, {}, JSON.stringify(chatMessage));
        }

        $scope.messageContent = '';
        console.log($scope.displayUserChat)
        $timeout(function () {
            $scope.updateStatusMessenger($scope.displayUserChat);
        },200)
        scrollToBottom()
    };

    $scope.updateStatusMessenger = async function (userChat) {
        $scope.displayUserChat = userChat;
        console.log(userChat)
        if (user.id !== null) {
            UserChatService.findUserChatById(userChat.userId, user.id).then(async function (response) {
                if (response.status === 200) {
                    $scope.userChats = response.data.data;

                    stompClient.send(`/app/${user.id}/chat.updateStatusMessenger`, {}, JSON.stringify({
                        senderId: userChat.userId,
                        recipientId: user.id
                    }));
                } else {
                    console.log("Error:", response);
                }
            })
        }
        $timeout(function() {
            $scope.findUsersChat();
        },100)
        await $scope.fetchAndDisplayUserChat(userChat.userId)
        $timeout(function () {
            $scope.$apply();
        });
    };


    function scrollToBottom() {
        $timeout(function () {
            var chatMessagesDiv = document.getElementById('chatMessages');
            chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
        });
    }

    $scope.connect();
})