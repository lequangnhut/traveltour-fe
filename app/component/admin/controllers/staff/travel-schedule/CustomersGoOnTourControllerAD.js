travel_app.controller('CustomersGoOnTourControllerAD', function ($scope, $rootScope, $sce, $location, $routeParams, $timeout, CustomersGoOnTourServiceAD, TourDetailsServiceAD) {
    $scope.isLoading = true;

    $scope.bookingTourCustomer = {
        customerName: null,
        customerBirth: null,
        customerPhone: null
    }

    $scope.customerList = [];
    $scope.currentPage = 0;
    $scope.pageSize = 5;

    let searchTimeout;

    $scope.tourDetailId = sessionStorage.getItem('selectedTourDetailId') || '';
    $scope.buttonAddCustomer = $scope.tourDetailId !== undefined && $scope.tourDetailId !== null && $scope.tourDetailId !== '';
    let tourDetailId = $routeParams.tourDetailId;
    let customerId = $routeParams.id;

    const errorCallback = () => {
        $location.path('/admin/internal-server-error')
    }


    $scope.checkBirth = () => {
        let birthDate = new Date($scope.bookingTourCustomer.customerBirth);
        let today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        let monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        $scope.invalidBirth = age < 16;
    };

    $scope.isBirthInvalid = () => {
        return $scope.invalidBirth;
    };

    $scope.isBirthValid = () => {
        return !$scope.invalidBirth && $scope.bookingTourCustomer.customerBirth;
    };

    $scope.checkDuplicatePhone = () => {
        let currentPhone = sessionStorage.getItem('currentPhone');
        let newPhone = $scope.bookingTourCustomer.customerPhone;

        if (newPhone !== currentPhone) {
            CustomersGoOnTourServiceAD.checkExistPhone(newPhone).then((response) => {
                $scope.phoneError = response.data.exists;
            });
        } else {
            $scope.phoneError = false;
        }
    };

    $scope.setPage = (page) => {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getAllList();
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
        $scope.currentPage = 0;
        $scope.getAllList();
    };

    $scope.getDisplayRange = () => {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
    };

    $scope.sortData = (column) => {
        $scope.sortBy = column;
        $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
        $scope.getAllList();
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

    $scope.tourDetailIdChanged = () => {
        $scope.buttonAddCustomer = $scope.tourDetailId !== undefined && $scope.tourDetailId !== null && $scope.tourDetailId !== '';
        sessionStorage.setItem('selectedTourDetailId', $scope.tourDetailId);
        $scope.getAllList();
    };


    const data = (response) => {
        $scope.bookingTourCustomerList = response.data.data !== null ? response.data.data.content : [];
        $scope.totalPages = response.data.data !== null ? Math.ceil(response.data.data.totalElements / $scope.pageSize) : 0;
        $scope.totalElements = response.data.data !== null ? response.data.data.totalElements : 0;
    };

    $scope.getAllList = () => {
        CustomersGoOnTourServiceAD.getAll($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.tourDetailId, $scope.searchTerm)
            .then((response) => {
                data(response);
            }, errorCallback).finally(() => {
            $scope.isLoading = false;
        });

        if (customerId !== undefined && customerId !== null && customerId !== "") {
            CustomersGoOnTourServiceAD.findById(customerId).then((response) => {
                if (response.status === 200) {
                    $timeout(() => {
                        $scope.bookingTourCustomer = response.data.data;
                        $scope.bookingTourCustomer.customerBirth = new Date(response.data.data.customerBirth);
                    }, 0);
                }
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        }
    };

    $scope.searchKey = () => {
        if (searchTimeout) $timeout.cancel(searchTimeout);
        $scope.setPage(0);

        searchTimeout = $timeout(() => {
            CustomersGoOnTourServiceAD.getAll($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.tourDetailId, $scope.searchTerm)
                .then((response) => {
                    data(response);
                }, errorCallback);
        }, 500);
    };

    $scope.createSubmit = () => {
        $scope.isLoading = true;
        const dataCustomer = new FormData();
        dataCustomer.append("bookingTourCustomersDto", new Blob([JSON.stringify($scope.bookingTourCustomer)], {type: "application/json"}));
        dataCustomer.append("tourDetailId", tourDetailId);
        CustomersGoOnTourServiceAD.createCustomer(dataCustomer).then((repo) => {
            console.log(repo)
            if (repo.data.status === '500') {
                console.log(repo.data.message)
                toastAlert('warning', 'Thêm thất bại !');
                return;
            }
            toastAlert('success', 'Thêm mới thành công !');
            $location.path('/admin/customer-go-on-list');
        }, errorCallback).finally(() => {
            $scope.isLoading = false;
        });
    };


    $scope.clickUpdate = (id, phone) => {
        sessionStorage.setItem('currentPhone', phone);
        sessionStorage.setItem('currentCustomerId', id);
        $location.path(`/admin/customer-go-on-list/customer-go-on-update/${id}`);
    };

    $rootScope.$on('$locationChangeStart', (event, next, current) => {
        let currentCustomerId = sessionStorage.getItem('currentCustomerId');
        if (currentCustomerId && current.includes(`/admin/customer-go-on-list/customer-go-on-update/${currentCustomerId}`) && !next.includes(`/admin/customer-go-on-list/customer-go-on-update/${currentCustomerId}`)) {
            sessionStorage.removeItem('currentPhone');
            sessionStorage.removeItem('currentCustomerId');
        }
    });


    $scope.updateSubmit = () => {
        $scope.isLoading = true;
        const dataCustomer = new FormData();
        dataCustomer.append("bookingTourCustomersDto", new Blob([JSON.stringify($scope.bookingTourCustomer)], {type: "application/json"}));
        CustomersGoOnTourServiceAD.updateCustomer(customerId, dataCustomer).then(() => {
            toastAlert('success', 'Cập nhật thành công !');
            $location.path('/admin/customer-go-on-list');
        }, errorCallback).finally(() => {
            $scope.isLoading = false;
        });
    };

    $scope.deleteCustomer = (customerId, fullName) => {
        const confirmDeleteCustomer = () => {
            CustomersGoOnTourServiceAD.deactivateCustomer(customerId).then(() => {
                toastAlert('success', 'Xóa thành công !');
                $scope.getAllList();
            }, errorCallback);
        }

        confirmAlert('Bạn có chắc chắn muốn xóa khách hàng ' + fullName + ' không ?', confirmDeleteCustomer);
    }

    TourDetailsServiceAD.findAllJoinBooking().then((response) => {
        $scope.tourDetails = response.data.data
    }, errorCallback).finally(() => {
        $scope.isLoading = false;
    });

    $scope.getAllList();

});