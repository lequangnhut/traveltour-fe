travel_app.controller('DecentralizationControllerAgentAD', function ($scope, $sce, $timeout, $location, $routeParams, RandomPasswordService, AccountServiceAD, AuthService, DecentralizationServiceAD) {
    let searchTimeout;
    let userId = $routeParams.id;

    // Lưu trữ trạng thái ban đầu của các quyền
    $scope.originalRoles = {};
    $scope.selectedRoles = [];

    $scope.currentPage = 0;
    $scope.pageSize = 5;

    $scope.emailError = false;
    $scope.phoneError = false;
    $scope.cardError = false;

    $scope.admin = {
        email: null,
        password: RandomPasswordService.generateRandomPassword(10),
        cpsw: null,
        fullName: null,
        address: null,
        citizenCard: null,
        phone: null,
        isActive: null
    }

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    /**
     * @message Check duplicate email
     */
    $scope.checkDuplicateEmail = function () {
        AuthService.checkExistEmail($scope.admin.email).then(function successCallback(response) {
            $scope.emailError = response.data.exists;
        });
    };

    /**
     * @message Check duplicate phone
     */
    $scope.checkDuplicatePhone = function () {
        AuthService.checkExistPhone($scope.admin.phone).then(function successCallback(response) {
            $scope.phoneError = response.data.exists;
        });
    };

    /**
     * @message Check duplicate card
     */
    $scope.checkDuplicateCard = function () {
        AuthService.checkExistCard($scope.admin.citizenCard).then(function successCallback(response) {
            $scope.cardError = response.data.exists;
        });
    };

    /**
     * @message Chọn role lưu vào mảng selectedRoles
     */
    $scope.toggleRole = function (role) {
        var index = $scope.selectedRoles.indexOf(role);

        if (index === -1) {
            $scope.selectedRoles.push(role);
        } else {
            $scope.selectedRoles.splice(index, 1);
        }
    };

    /**
     * Service tìm tất cả tài khoản của nhân viên và đối tác
     */
    $scope.init = function () {
        $scope.isLoading = true;

        DecentralizationServiceAD.findAllDecentralizationAgent($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.userRoleAgent = response.data.content;
                $scope.totalPages = Math.ceil(response.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.totalElements;

                $scope.userRoleAgent.forEach(function (userRoleAgent) {
                    $scope.originalRoles[userRoleAgent.id] = userRoleAgent.roles.map(function (role) {
                        return role.nameRole;
                    });
                });
            }
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        /**
         * Tìm kiếm
         */
        $scope.searchDecentralizationAgency = function () {
            if (searchTimeout) $timeout.cancel(searchTimeout);

            searchTimeout = $timeout(function () {
                DecentralizationServiceAD.findAllDecentralizationAgent($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                    .then(function (response) {
                        $scope.userRoleAgent = response.data.content;
                        $scope.totalPages = Math.ceil(response.data.totalElements / $scope.pageSize);
                        $scope.totalElements = response.data.totalElements;

                        $scope.userRoleAgent.forEach(function (userRoleAgent) {
                            $scope.originalRoles[userRoleAgent.id] = userRoleAgent.roles.map(function (role) {
                                return role.nameRole;
                            });
                        });
                    }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }, 500);
        };

        if (userId !== undefined && userId !== null && userId !== "") {
            AccountServiceAD.findById(userId).then(function successCallback(response) {
                if (response.status === 200) {
                    $scope.admin = response.data;
                }
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }
    }

    /**
     * Phân trang
     */
    $scope.setPage = function (page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.init();
        }
    };

    $scope.getPaginationRange = function () {
        const range = [];
        let start, end;

        if ($scope.totalPages <= 3) {
            start = 0;
            end = $scope.totalPages;
        } else {
            start = Math.max(0, $scope.currentPage - 1);
            end = Math.min(start + 3, $scope.totalPages);

            if (end === $scope.totalPages) {
                start = $scope.totalPages - 3;
            }
        }

        for (let i = start; i < end; i++) {
            range.push(i);
        }

        return range;
    };

    $scope.pageSizeChanged = function () {
        $scope.currentPage = 0;
        $scope.init();
    };

    $scope.getDisplayRange = function () {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };

    /**
     * Sắp xếp
     */
    $scope.sortData = function (column) {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.init();
    };

    $scope.getSortIcon = function (column) {
        if ($scope.sortBy === column) {
            if ($scope.sortDir === 'asc') {
                return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>');
            } else {
                return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"/></svg>');
            }
        }
        return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"/></svg>');
    };

    /**
     * Gọi api tạo mới agent
     */
    $scope.createAccountAgent = function () {
        $scope.isLoading = true;

        let dataAccount = {
            accountDto: $scope.admin,
            roles: $scope.selectedRoles
        }
        AccountServiceAD.create(dataAccount).then(function successCallback() {
            toastAlert('success', 'Thêm mới thành công !');
            $location.path('/admin/decentralized-agent-management');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }

    /**
     * Gọi api cập nhật staff
     */
    function confirmUpdateAgent() {
        $scope.isLoading = true;

        AccountServiceAD.update($scope.admin).then(function successCallback() {
            toastAlert('success', 'Cập nhật thành công !');
            $location.path('/admin/decentralized-agent-management');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }

    $scope.updateAccountAgent = function () {
        confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdateAgent);
    }

    /**
     * Gọi api delete staff
     */
    $scope.deleteAccountAgent = function (userId, fullName) {
        $scope.isLoading = true;

        function confirmDeleteStaff() {
            AccountServiceAD.delete(userId).then(function successCallback() {
                toastAlert('success', 'Xóa tài khoản thành công !');
                $location.path('/admin/decentralized-agent-management');
                $scope.init();
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn muốn xóa nhân viên ' + fullName + ' không ?', confirmDeleteStaff);
    }

    /**
     * Api thay đổi role
     * @param role
     * @param userStaff
     * @returns {*}
     */
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
        $scope.isLoading = true;

        DecentralizationServiceAD.updateDecentralization(userId, dataRole).then(function successCallback() {
            toastAlert('success', 'Cập nhật quyền thành công !');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    $scope.init();
});
