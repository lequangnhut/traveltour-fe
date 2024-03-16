travel_app.controller('TourIsGoingControllerAD', function ($scope, $sce, $location, $timeout, CustomersGoOnTourServiceAD, TourDetailsServiceAD) {
    $scope.isLoading = true;

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
    $scope.currentPage = 0;
    $scope.pageSize = 5;

    let searchTimeout;

    const errorCallback = () => {
        $location.path('/admin/internal-server-error')
    }

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
        $scope.currentPage = 0;
        $scope.getCustomerList();
    };

    $scope.getDisplayRange = () => {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
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

    const customerData = (response) => {
        $scope.customerList = response.data.data !== null ? response.data.data.content : [];
        $scope.totalPages = response.data.data !== null ? Math.ceil(response.data.data.totalElements / $scope.pageSize) : 0;
        $scope.totalElements = response.data.data !== null ? response.data.data.totalElements : 0;
    };

    $scope.getCustomerList = () => {
        CustomerServiceAD.getAllCustomer($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir)
            .then((response) => {
                customerData(response);
            }, errorCallback).finally(() => {
            $scope.isLoading = false;
        });
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
        $scope.isLoading = true;
        const dataCustomer = new FormData();
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

    TourDetailsServiceAD.findAllTourDetails().then((response) => {
        $scope.tourDetails = response.data.data.content
    }, errorCallback).finally(() => {
        $scope.isLoading = false;
    });

    $scope.getCustomerList();

});