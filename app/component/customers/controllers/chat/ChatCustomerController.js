travel_app.controller("ChatCustomerController", function ($scope, $routeParams, $http, $timeout,AuthService, UserChatService) {
    $scope.agencyId = null;
    if ($routeParams.id) {
        $scope.agencyId = atob($routeParams.id);
        console.log($scope.agencyId)
    }

    let user = $scope.user = AuthService.getUser();
    $scope.avatarUser = $scope.user = AuthService.getUser();
    var stompClient = null;

    $scope.userAgencyId = []

    $scope.userChatsList = []
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

            if ($scope.agencyId) {
                const userChatResponse = await fetch(`${BASE_API}messages/${$scope.agencyId}/${user.id}/checkNoChatMessage`);
                $scope.statusNotVariable = await userChatResponse.json();
                if ($scope.statusNotVariable.data === 0) {
                    var chatMessage = {
                        senderId: $scope.agencyId,
                        recipientId: user.id,
                        content: "Chúng tôi có thể giúp gì cho bạn?",
                        timestamp: new Date()
                    };

                    if ($scope.displayUserChat) {
                        $scope.newMessage = {
                            senderId: $scope.agencyId,
                            content: "Chúng tôi có thể giúp gì cho bạn?",
                            timestamp: new Date()
                        }

                        $scope.displayMessages.push($scope.newMessage)
                    }
                    stompClient.send(`/app/${user.id}/chat`, {}, JSON.stringify(chatMessage));
                }
                await $scope.findUsersChat();
                $scope.matchedUserChat = $scope.userChatsList.find(function (userChat) {
                    return userChat.userId === $scope.agencyId;
                });
                await $scope.fetchAndDisplayUserChat($scope.agencyId)
                $timeout(function () {
                    $scope.displayUserChat = $scope.matchedUserChat;
                }, 200)
            }
        } catch (error) {
            console.error("Error:", error);
        }
        await $scope.findUsersChat();
        scrollToBottom()
        if ($scope.agencyId) {
            $scope.matchedUserChat = $scope.userChatsList.find(function (userChat) {
                return userChat.userId === $scope.agencyId;
            });
            await $scope.fetchAndDisplayUserChat($scope.agencyId)
            $timeout(function () {
                $scope.displayUserChat = $scope.matchedUserChat;
            }, 200)
            await $scope.fetchAndDisplayUserChat($scope.agencyId)
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

            stompClient.subscribe(`/user/${user.id}/chat/findUsersChat`, function (message) {
                $scope.userChatsList = JSON.parse(message.body);
                console.log($scope.userChatsList)
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
        scrollToBottom()
    };

    $scope.showMessage = function (messages) {
        $scope.displayMessages = []
        if (Array.isArray(messages)) {
            messages.forEach(function (message) {
                $scope.newMessage = {
                    senderId: message.senderId,
                    content: message.content,
                    timestamp: message.timestamp
                };
                $scope.displayMessages.push($scope.newMessage);
                $scope.userAgencyId = $scope.user = AuthService.getUser();
                console.log("heheh",$scope.userAgencyId)
            });
        } else if (typeof messages === 'object') {
            $scope.newMessage = {
                senderId: messages.senderId,
                content: messages.content,
                timestamp: messages.timestamp
            };
            $scope.displayMessages.push($scope.newMessage);
            console.log('NewMessage: ', $scope.newMessage);
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

                $scope.displayMessages.push($scope.newMessage);
                console.log('NewMessage: ', $scope.newMessage);
            }
        }
        $timeout(function () {
            $scope.$apply();
        });
        scrollToBottom()
    };

    $scope.sendMessage = async function (customerId) {
        $scope.messageContent.trim();
        if (($scope.messageContent !== '') && $scope.displayUserChat !== null && $scope.displayUserChat !== undefined) {
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

            stompClient.send(`/app/${user.id}/chat.updateStatusMessenger`, {}, JSON.stringify({
                senderId: user.id,
                recipientId: customerId
            }));

            $scope.displayMessages.push($scope.newMessage)
            console.log($scope.displayMessages)
            stompClient.send(`/app/${user.id}/chat`, {}, JSON.stringify(chatMessage));
        }

        $scope.messageContent = '';
        $timeout(function () {
            $scope.updateStatusMessenger($scope.displayUserChat);
        }, 100)
        scrollToBottom()
    };

    /**
     * Cập nhật lại thông tin nhắn tin của người dùng khi thực hiện gửi tin nhắn mới
     * @param userChat mã của khách
     * @returns {Promise<void>}
     */
    $scope.updateStatusMessenger = async function (userChat) {
        $scope.displayUserChat = userChat;
        console.log(userChat);
        if (user.id !== null) {
            try {
                const response = await UserChatService.findUserChatById(userChat.userId, user.id);
                if (response.status === 200) {
                    $scope.userChats = response.data.data;

                    stompClient.send(`/app/${user.id}/chat.updateStatusMessenger`, {}, JSON.stringify({
                        senderId: userChat.userId,
                        recipientId: user.id
                    }));

                    await $scope.fetchAndDisplayUserChat(userChat.userId);
                } else {
                    console.log("Error:", response);
                }
            } catch (error) {
                console.error("Error fetching user chat:", error);
                // Xử lý lỗi nếu cần
            }
        }
        await $scope.findUsersChat();
        await $scope.fetchAndDisplayUserChat(userChat.userId)
    };

    function scrollToBottom() {
        $timeout(function () {
            var chatMessagesDiv = document.getElementById('chatMessages');
            chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
        });
    }

    $scope.connect();
});
