travel_app.controller('DecentralizationControllerAD', function ($scope, DecentralizationServiceAD) {
    // Lưu trữ trạng thái ban đầu của các quyền
    $scope.originalRoles = {};

    $scope.selectedRoles = [];

    function errorCallback() {
        toastAlert('error', "Máy chủ không tồn tại !");
    }

    /**
     * Service tìm tất cả tài khoản của nhân viên
     */
    DecentralizationServiceAD.findAllDecentralizationStaff().then(function successCallback(response) {
        if (response.status === 200) {
            $scope.userRoleStaff = response.data;

            response.data.forEach(function (userRoleStaff) {
                $scope.originalRoles[userRoleStaff.id] = userRoleStaff.roles.map(function (role) {
                    return role.nameRole;
                });
            });
        }
    }, errorCallback);

    /**
     * Service tìm tất cả tài khoản của đối tác
     */
    DecentralizationServiceAD.findAllDecentralizationAgent().then(function successCallback(response) {
        if (response.status === 200) {
            $scope.userRoleAgent = response.data;

            response.data.forEach(function (userRoleAgent) {
                $scope.originalRoles[userRoleAgent.id] = userRoleAgent.roles.map(function (role) {
                    return role.nameRole;
                });
            });
        }
    }, errorCallback);

    $scope.userHasRole = function (role, userStaff) {
        return userStaff.roles && userStaff.roles.some(function (r) {
            return r.nameRole === role;
        });
    };

    $scope.changeRole = function (role, userId) {
        if (!$scope.selectedRoles[userId]) {
            $scope.selectedRoles[userId] = $scope.originalRoles[userId].slice();
        }

        const roleIndex = $scope.selectedRoles[userId].indexOf(role);

        if ($scope.selectedRoles[userId].length === 1 && roleIndex !== -1) {
            return;
        }

        if (roleIndex === -1) {
            $scope.selectedRoles[userId].push(role);
        } else {
            $scope.selectedRoles[userId].splice(roleIndex, 1);
        }

        $scope.updateRoles(userId, $scope.selectedRoles[userId]);
    };

    $scope.updateRoles = function (userId, dataRole) {
        DecentralizationServiceAD.updateDecentralization(userId, dataRole).then(function successCallback() {
            toastAlert('success', 'Cập nhật quyền thành công !');
        }, errorCallback);
    };
});
