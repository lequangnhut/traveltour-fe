travel_app.service('UserChatService', function ($http, $q) {
    let API_CHAT = BASE_API + 'chat/';
    this.getStaffSupportsOnline = async function () {
        try {
            const staffSupportOnlineResponse = await $http.get('/staff-supports/findStaffSupportsOnline');
            return staffSupportOnlineResponse.data;
        } catch (error) {
            console.error('Error while fetching staff supports:', error);
        }
    };

    this.getConnectedUsers = async function (nickname) {
        try {
            const connectedUsersResponse = await $http.get('/users');
            let connectedUsers = connectedUsersResponse.data;
            return connectedUsers.filter(user => user.nickName !== nickname);
        } catch (error) {
            console.error('Error while fetching connected users:', error);
        }
    };

    this.sendMessage = async function (chatMessage) {
        try {
            return await $http.post('/app/chat', chatMessage);
        } catch (error) {
            console.error('Error while sending message:', error);
        }
    };

    this.findByAgencyId = async function (agencyId) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_CHAT + 'findByAgencyId',
            params: {
                agencyId: agencyId
            }
        }).then(deferred.resolve, deferred.reject);
        return await deferred.promise;
    }

    this.findMessageWithAgency = async function (userId, agencyId) {
        const deferred = $q.defer();
        var formData = new FormData();

        formData.append('senderId', new Blob([JSON.stringify(userId)], {type: "application/json"}));
        formData.append('recipientId', new Blob([JSON.stringify(agencyId)], {type: "application/json"}));

        $http({
            method: 'POST',
            url: API_CHAT + 'messages/findMessageWithAgency',
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        }).then(deferred.resolve, deferred.reject);

        return await deferred.promise;
    }

    this.sendMessage = async function(nickname, selectedUserId, messageContent) {
        var chatMessage = {
            senderId: nickname,
            recipientId: selectedUserId,
            content: messageContent,
            timestamp: new Date()
        };

        try {
            // Gọi API bằng cách sử dụng await
            var response = await $http({
                method: 'POST',
                url: API_CHAT + 'chat',
                data: chatMessage,
            });

            // Trả về dữ liệu
            return response.data;
        } catch (error) {
            // Xử lý lỗi
            throw error;
        }
    };



    this.findUserChatById = async function (senderId, recipientId) {

        var formData = new FormData();

        formData.append('senderId', new Blob([JSON.stringify(senderId)], {type: "application/json"}));
        formData.append('recipientId', new Blob([JSON.stringify(recipientId)], {type: "application/json"}));

        return $http({
            method: 'POST',
            url: API_CHAT + 'findUserChatById',
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        });
    }

    this.findAgencyChatById = function(agencyId) {
        return $http({
            method: 'GET',
            url: API_CHAT + 'findAgencyChatById',
            params: {
                agencyId: agencyId
            }
        })
    }

})