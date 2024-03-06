travel_app.controller('CustomerControllerAD', function ($scope, $sce, $window, $location, $rootScope, $routeParams, $timeout, $http, CustomerServiceAD, AuthService, LocalStorageService) {
    $scope.isLoading = true;

    const fileName = "default.jpg";
    const mimeType = "image/jpeg";

    $scope.hasImage = false;

    $scope.customer = {
        avatar: null,
        email: null,
        password: null,
        gender: null,
        fullName: null,
        birth: null,
        address: null,
        citizenCard: null,
        phone: null,
        isActive: null
    }


    $scope.customerList = [];
    $scope.currentPage = 0; // Trang hiện tại
    $scope.pageSize = 5; // Số lượng tours trên mỗi trang

    let searchTimeout;
    let customerId = $routeParams.id;

    $scope.emailError = false;
    $scope.phoneError = false;
    $scope.cardError = false;
    $scope.invalidBirth = false;

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    /**
     * Tải lên hình ảnh tour và lưu vào biến customer.avatar
     * @param file
     */
    $scope.uploadCustomerAvatar = function (file) {
        if (file && !file.$error) {
            let reader = new FileReader();

            reader.onload = function (e) {
                $scope.customer.avatar = e.target.result;
                $scope.customerAvatarNoCloud = file;
                $scope.hasImage = true; // Đánh dấu là đã có ảnh
                $scope.$apply();
            };

            reader.readAsDataURL(file);
        }
    };


    $scope.checkBirth = function () {
        let birthDate = new Date($scope.customer.birth);
        let today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        let monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        $scope.invalidBirth = age < 16;
    };


    $scope.isBirthInvalid = function () {
        return $scope.invalidBirth; // Sử dụng biến mới để kiểm tra tuổi
    };

    $scope.isBirthValid = function () {
        return !$scope.invalidBirth && $scope.customer.birth;
    };


    /**
     * @message Check duplicate email
     */
    $scope.checkDuplicateEmail = function () {
        AuthService.checkExistEmail($scope.customer.email).then(function successCallback(response) {
            $scope.emailError = response.data.exists;
        });
    };

    /**
     * @message Check duplicate phone
     */
    $scope.checkDuplicatePhone = function () {
        AuthService.checkExistPhone($scope.customer.phone).then(function successCallback(response) {
            $scope.phoneError = response.data.exists;
        });
    };

    /**
     * @message Check duplicate card
     */
    $scope.checkDuplicateCard = function () {
        AuthService.checkExistCard($scope.customer.citizenCard).then(function successCallback(response) {
            $scope.cardError = response.data.exists;
        });
    };

    $scope.getCurrentAvatarSource = function () {
        if ($scope.customer.avatar && typeof $scope.customer.avatar === 'string') {
            if ($scope.customer.avatar.startsWith('http')) {
                $scope.customerAvatarNoCloud = $scope.customer.avatar;
                return $scope.customer.avatar;
            } else {
                return $scope.customer.avatar;
            }
        } else {
            return 'https://i.imgur.com/xm5Ufr5.jpg';
        }
    };


    $scope.setPage = function (page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getCustomerList();
        }
    };

    $scope.getPaginationRange = function () {
        let range = [];
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
        $scope.currentPage = 0; // Đặt lại về trang đầu tiên
        $scope.getCustomerList(); // Tải lại dữ liệu với kích thước trang mới
    };

    $scope.getDisplayRange = function () {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };

    $scope.getCustomerList = function () {
        CustomerServiceAD.getAllCustomer($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir)
            .then(function (response) {
                $scope.customerList = response.data.data.content;
                $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.data.totalElements; // Tổng số phần tử
            }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        if (customerId !== undefined && customerId !== null && customerId !== "") {
            CustomerServiceAD.findCustomerById(customerId).then(function successCallback(response) {
                if (response.status === 200) {
                    $timeout(function () {
                        $scope.customer = response.data.data;
                        $rootScope.phonenow = response.data.data.phone;
                        $rootScope.cardnow = response.data.data.citizenCard;
                        $scope.customer.birth = new Date(response.data.data.birth);
                    }, 0);
                }
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }
    };


    $scope.sortData = function (column) {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.getCustomerList();
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


    $scope.searchCustomers = function () {
        if (searchTimeout) $timeout.cancel(searchTimeout);

        searchTimeout = $timeout(function () {
            CustomerServiceAD.getAllCustomer($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                .then(function (response) {
                    $scope.customerList = response.data.data.content;
                    $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                    $scope.totalElements = response.data.data.totalElements;
                }, errorCallback);
        }, 500); // 500ms debounce
    };

    $scope.getCustomerList();

    /*==============================================================================*/
    //form create

    $scope.createCustomerSubmit = () => {
        $scope.isLoading = true;
        const dataCustomer = new FormData();
        dataCustomer.append("customerDto", new Blob([JSON.stringify($scope.customer)], {type: "application/json"}));
        dataCustomer.append("customerAvatar", $scope.customerAvatarNoCloud);

        CustomerServiceAD.createCustomer(dataCustomer).then(function successCallback() {
            toastAlert('success', 'Thêm mới thành công !');
            $location.path('/admin/customer-list');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    };

    function urlToFile(url, fileName, mimeType) {
        return fetch(url)
            .then(response => response.blob())
            .then(blob => new File([blob], fileName, {type: mimeType}));
    }

    //form update
    $scope.updateCustomerSubmit = () => {
        const dataCustomer = new FormData();
        $scope.isLoading = true;
        if ($scope.hasImage) {
            dataCustomer.append("customerDto", new Blob([JSON.stringify($scope.customer)], {type: "application/json"}));
            dataCustomer.append("customerAvatar", $scope.customerAvatarNoCloud);
            updateCustomer(customerId, dataCustomer);
        } else {
            urlToFile($scope.customer.avatar, fileName, mimeType).then(file => {
                dataCustomer.append("customerDto", new Blob([JSON.stringify($scope.customer)], {type: "application/json"}));
                dataCustomer.append("customerAvatar", file);
                updateCustomer(customerId, dataCustomer);
            }, errorCallback);
        }
    };

    const updateCustomer = (customerId, dataCustomer) => {
        CustomerServiceAD.updateCustomer(customerId, dataCustomer).then(function successCallback() {
            toastAlert('success', 'Cập nhật thành công !');
            $location.path('/admin/customer-list');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }


    //delete
    /**
     * Gọi api delete tour
     */
    $scope.deleteCustomer = function (customerId, fullName) {
        function confirmDeleteCustomer() {
            CustomerServiceAD.deactivateCustomer(customerId).then(function successCallback() {
                toastAlert('success', 'Xóa thành công !');
                $scope.getCustomerList();
            }, errorCallback);
        }

        confirmAlert('Bạn có chắc chắn muốn xóa khách hàng ' + fullName + ' không ?', confirmDeleteCustomer);
    }
    /**
     * * Của Thuynhdpc04763
     */
    $scope.checkDuplicateThisPhone = function () {
        if($scope.customer.phone == $rootScope.phonenow){
            $scope.phoneError = false;
            return;
        }
        AuthService.checkExistPhone($scope.customer.phone)
            .then(function successCallback(response) {
                if (response.status === 200){
                    $scope.phoneError = response.data.exists;
                }else{
                    $scope.phoneError = response.data.exists;
                }
            });
    };

    $scope.checkDuplicateCard = function () {
        if($scope.customer.citizenCard == $rootScope.cardnow){
            $scope.cardError = false;
            return;
        }
        AuthService.checkExistCard($scope.customer.citizenCard).then(function successCallback(response) {
            $scope.cardError = response.data.exists;
        });
    };

    function confirmUpdate() {
        const dataCustomer = new FormData();
        $scope.isLoading = true;
        if ($scope.hasImage) {
            dataCustomer.append("customerDto", new Blob([JSON.stringify($scope.customer)], {type: "application/json"}));
            dataCustomer.append("customerAvatar", $scope.customerAvatarNoCloud);
            updateInfo(customerId, dataCustomer);
        } else {
            if($scope.customer.avatar === null){
               $scope.customer.avatar = 'https://i.imgur.com/xm5Ufr5.jpg'
            }
            urlToFile($scope.customer.avatar, fileName, mimeType).then(file => {
                dataCustomer.append("customerDto", new Blob([JSON.stringify($scope.customer)], {type: "application/json"}));
                dataCustomer.append("customerAvatar", file);
                updateInfo(customerId, dataCustomer);
            }, errorCallback);
        }
    };

    const updateInfo = (customerId, dataCustomer) => {
        $scope.isLoading = true;
        CustomerServiceAD.updateCustomer(customerId, dataCustomer).then(function successCallback(response) {
            if (response.status === 200) {
                toastAlert('success', 'Cập nhật thành công !');
                LocalStorageService.set('user', response.data.data);
                var userRoles = response.data.data.roles;

                if (hasAdminRole(userRoles)) {
                    $window.location.href = '/admin/dashboard';
                } else {
                    $window.location.href = '/business/select-type';
                }
            } else {
                $location.path('/admin/page-not-found');
            }
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }
    $scope.updateInfoSubmit = function () {
        confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdate);
    }

    function hasAdminRole(roles) {
        var adminRoles = ['ROLE_SUPERADMIN', 'ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_GUIDE'];

        for (var i = 0; i < roles.length; i++) {
            if (adminRoles.includes(roles[i].nameRole)) {
                return true;
            }
        }
        return false;
    }

    if (AuthService.getUser() !== null) {
        $scope.roles = AuthService.getUser().roles.map(role => role.nameRole);
    }
    $scope.hasRole = function (roleToCheck) {
        return $scope.roles.includes(roleToCheck);
    };
});