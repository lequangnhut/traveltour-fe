travel_app.controller('CustomerControllerAD', function ($scope, $sce, $window, $location, $rootScope, $routeParams, $timeout, $http, Base64ObjectService, CustomerServiceAD, AuthService, LocalStorageService, NotificationService) {
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

    $scope.currentPage = 0;
    $scope.pageSize = 5;

    let searchTimeout;
    let customerId = Base64ObjectService.decodeObject($routeParams.id);

    $scope.emailError = false;
    $scope.phoneError = false;
    $scope.cardError = false;
    $scope.invalidBirth = false;

    const errorCallback = () => {
        $location.path('/admin/internal-server-error')
    }

    /**
     * Tải lên hình ảnh tour và lưu vào biến customer.avatar
     * @param file
     */
    $scope.uploadCustomerAvatar = (file) => {
        if (file && !file.$error) {
            let reader = new FileReader();

            reader.onload = (e) => {
                $scope.customer.avatar = e.target.result;
                $scope.customerAvatarNoCloud = file;
                $scope.hasImage = true; // Đánh dấu là đã có ảnh
                $scope.$apply();
            };

            reader.readAsDataURL(file);
        }
    };


    $scope.checkBirth = () => {
        let birthDate = new Date($scope.customer.birth);
        let today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        let monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        $scope.invalidBirth = age < 0;
    };


    $scope.isBirthInvalid = () => {
        return $scope.invalidBirth; // Sử dụng biến mới để kiểm tra tuổi
    };

    $scope.isBirthValid = () => {
        return !$scope.invalidBirth && $scope.customer.birth;
    };


    /**
     * @message Check duplicate email
     */
    $scope.checkDuplicateEmail = () => {
        AuthService.checkExistEmail($scope.customer.email).then((response) => {
            $scope.emailError = response.data.exists;
        });
    };

    /**
     * @message Check duplicate phone
     */
    $scope.checkDuplicatePhone = () => {
        AuthService.checkExistPhone($scope.customer.phone).then((response) => {
            $scope.phoneError = response.data.exists;
        });
    };

    /**
     * @message Check duplicate card
     */
    $scope.checkDuplicateCard = () => {
        AuthService.checkExistCard($scope.customer.citizenCard).then((response) => {
            $scope.cardError = response.data.exists;
        });
    };

    $scope.getCurrentAvatarSource = () => {
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


    $scope.setPage = (page) => {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getCustomerList();
        }
    };

    $scope.getPaginationRange = () => {
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

    $scope.pageSizeChanged = () => {
        $scope.currentPage = 0; // Đặt lại về trang đầu tiên
        $scope.getCustomerList(); // Tải lại dữ liệu với kích thước trang mới
    };

    $scope.getDisplayRange = () => {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };

    const customerData = (response) => {
        $scope.customerList = response.data.data !== null ? response.data.data.content : [];
        $scope.totalPages = response.data.data !== null ? Math.ceil(response.data.data.totalElements / $scope.pageSize) : 0;
        $scope.totalElements = response.data.data !== null ? response.data.data.totalElements : 0;
    };

    $scope.getCustomerList = () => {
        CustomerServiceAD.getAllCustomer($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir)
            .then((response) => {
                customerData(response);
            }, errorCallback);

        if (customerId !== undefined && customerId !== null && customerId !== "") {
            $scope.isLoading = true;

            CustomerServiceAD.findCustomerById(customerId).then((response) => {
                if (response.status === 200) {
                    $timeout(() => {
                        $scope.customer = response.data.data;
                        $rootScope.phonenow = response.data.data.phone;
                        $rootScope.cardnow = response.data.data.citizenCard;
                        $scope.customer.birth = new Date(response.data.data.birth);
                    }, 100);
                }
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        }
    };


    $scope.sortData = (column) => {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.getCustomerList();
    };

    $scope.getSortIcon = (column) => {
        if ($scope.sortBy === column) {
            if ($scope.sortDir === 'asc') {
                return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>');
            } else {
                return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"/></svg>');
            }
        }
        return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"/></svg>');
    };


    $scope.searchCustomers = () => {
        if (searchTimeout) $timeout.cancel(searchTimeout);
        $scope.setPage(0);

        searchTimeout = $timeout(() => {
            CustomerServiceAD.getAllCustomer($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                .then((response) => {
                    customerData(response);
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

        CustomerServiceAD.createCustomer(dataCustomer).then(() => {
            toastAlert('success', 'Thêm mới thành công !');
            $location.path('/admin/customer-list');
        }, errorCallback).finally(() => {
            $scope.isLoading = false;
        });
    };

    //form update
    $scope.updateCustomerSubmit = () => {
        function confirmUpdate() {
            const dataCustomer = new FormData();
            if ($scope.hasImage) {
                dataCustomer.append("customerDto", new Blob([JSON.stringify($scope.customer)], {type: "application/json"}));
                dataCustomer.append("customerAvatar", $scope.customerAvatarNoCloud);
                updateCustomer(customerId, dataCustomer);
            } else {
                dataCustomer.append("customerDto", new Blob([JSON.stringify($scope.customer)], {type: "application/json"}));
                dataCustomer.append("customerAvatar", null);
                updateCustomer(customerId, dataCustomer);
            }
        }

        confirmAlert('Bạn có chắc chắn muốn cập nhật khách hàng không ?', confirmUpdate);
    };

    const updateCustomer = (customerId, dataCustomer) => {
        $scope.isLoading = true;
        CustomerServiceAD.updateCustomer(customerId, dataCustomer).then(() => {
            toastAlert('success', 'Cập nhật thành công !');
            $location.path('/admin/customer-list');
        }, errorCallback).finally(() => {
            $scope.isLoading = false;
        });
    }

    //delete
    /**
     * Gọi api delete tour
     */
    $scope.deleteCustomer = (customerId, fullName) => {
        const confirmDeleteCustomer = () => {
            CustomerServiceAD.deactivateCustomer(customerId).then(() => {
                toastAlert('success', 'Xóa thành công !');
                $scope.getCustomerList();
            }, errorCallback);
        }

        confirmAlert('Bạn có chắc chắn muốn xóa khách hàng ' + fullName + ' không ?', confirmDeleteCustomer);
    }
    /**
     * * Của Thuynhdpc04763
     */
    $scope.checkDuplicateThisPhone = () => {
        if ($scope.customer.phone === $rootScope.phonenow) {
            $scope.phoneError = false;
            return;
        }
        AuthService.checkExistPhone($scope.customer.phone)
            .then((response) => {
                if (response.status === 200) {
                    $scope.phoneError = response.data.exists;
                } else {
                    $scope.phoneError = response.data.exists;
                }
            });
    };

    $scope.checkDuplicateCard = () => {
        if ($scope.customer.citizenCard === $rootScope.cardnow) {
            $scope.cardError = false;
            return;
        }
        AuthService.checkExistCard($scope.customer.citizenCard).then((response) => {
            $scope.cardError = response.data.exists;
        });
    };

    $scope.updateAdminInfoSubmit = () => {
        function confirmUpdateInfoAdmin() {
            const dataCustomer = new FormData();
            if ($scope.hasImage) {
                dataCustomer.append("customerDto", new Blob([JSON.stringify($scope.customer)], {type: "application/json"}));
                dataCustomer.append("customerAvatar", $scope.customerAvatarNoCloud);
                updateInfoAdmin(customerId, dataCustomer);
            } else {
                dataCustomer.append("customerDto", new Blob([JSON.stringify($scope.customer)], {type: "application/json"}));
                dataCustomer.append("customerAvatar", null);
                updateInfoAdmin(customerId, dataCustomer);
            }
        }

        confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdateInfoAdmin);
    };

    const updateInfoAdmin = (customerId, dataCustomer) => {
        $scope.isLoading = true;
        CustomerServiceAD.updateCustomer(customerId, dataCustomer).then((response) => {
            if (response.status === 200) {
                let user = response.data.data;
                let userRoles = response.data.data.roles;
                LocalStorageService.encryptLocalData(JSON.stringify(user), 'user', 'encryptUser');

                if (hasAdminRole(userRoles)) {
                    $window.location.href = '/admin/dashboard';
                    $scope.setActiveNavItem('dashboard');
                } else {
                    $window.location.href = '/business/select-type';
                }
                NotificationService.setNotification('success', 'Cập nhật thành công !');
            } else {
                $location.path('/admin/page-not-found');
            }
        }, errorCallback).finally(() => {
            $scope.isLoading = false;
        });
    }

    const hasAdminRole = (roles) => {
        let adminRoles = ['ROLE_SUPERADMIN', 'ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_GUIDE'];

        for (let i = 0; i < roles.length; i++) {
            if (adminRoles.includes(roles[i].nameRole)) {
                return true;
            }
        }
        return false;
    }

    if (AuthService.getUser() !== null) {
        $scope.roles = AuthService.getUser().roles.map(role => role.nameRole);
    }
    $scope.hasRole = (roleToCheck) => {
        return $scope.roles.includes(roleToCheck);
    };
});