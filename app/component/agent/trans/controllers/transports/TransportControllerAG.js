travel_app.controller('TransportControllerAG', function ($scope, $routeParams, $timeout, $location, LocalStorageService, TransportServiceAG) {
    let searchTimeout;
    let transportId = $routeParams.id;
    let brandId = LocalStorageService.get('brandId');

    $scope.licenseError = null;
    $scope.isLoading = true;

    $scope.currentPage = 0;
    $scope.pageSize = 5;

    $scope.transportTypeName = {};

    $scope.transportitation = {
        id: null,
        transportationBrandId: null,
        transportationTypeId: null,
        licensePlate: null,
        amountSeat: null,
        isActive: null
    }

    function errorCallback() {
        $location.path('/admin/internal-server-error');
    }

    /**
     * @message Check duplicate phone
     */
    $scope.checkDuplicateLicense = function () {
        TransportServiceAG.findByLicensePlate($scope.transportitation.licensePlate).then(function successCallback(response) {
            $scope.licenseError = response.data.exists;
            console.log(response.data)
        }, errorCallback);
    };

    $scope.init = function () {
        TransportServiceAG.findAllTransport(brandId, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.transportData = response.data.content;
                $scope.totalPages = Math.ceil(response.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.totalElements;

                response.data.content.forEach(transportType => {
                    $scope.findTransportTypeName(transportType.transportationTypeId);
                });
            }
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        TransportServiceAG.findAllTransportType().then(function successCallback(response) {
            if (response.status === 200) {
                $scope.transportType = response.data.data;
            } else {
                $location.path('/admin/page-not-found');
            }
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });

        /**
         * Tìm kiếm
         */
        $scope.searchTransportBrand = function () {
            if (searchTimeout) $timeout.cancel(searchTimeout);

            searchTimeout = $timeout(function () {
                TransportServiceAG.findAllTransport(brandId, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.searchTerm)
                    .then(function (response) {
                        $scope.transportData = response.data.content;
                        $scope.totalPages = Math.ceil(response.data.totalElements / $scope.pageSize);
                        $scope.totalElements = response.data.totalElements;
                    }, errorCallback).finally(function () {
                    $scope.isLoading = false;
                });
            }, 500);
        };

        /**
         * Tìm thể loại phương tiện bằng id
         * @param transportTypeId
         */
        $scope.findTransportTypeName = function (transportTypeId) {
            if (!$scope.transportTypeName[transportTypeId]) {
                TransportServiceAG.findByTransportTypeId(transportTypeId).then(function (response) {
                    $scope.transportTypeName[transportTypeId] = response.data.data.transportationTypeName;
                }, errorCallback);
            }
        };

        /**
         * Tìm tên thương hiệu phương tiện bằng brandId
         * @param transportTypeId
         */
        TransportServiceAG.findByTransportBrandId(brandId).then(function (response) {
            if (response.status === 200) {
                $scope.transportBrand = response.data.data;
            } else {
                $location.path('/admin/page-not-found');
            }
        }, errorCallback);

        if (transportId !== undefined && transportId !== null && transportId !== "") {
            TransportServiceAG.findByTransportId(transportId).then(function successCallback(response) {
                if (response.status === 200) {
                    $scope.transportitation = response.data.data;
                } else {
                    $location.path('/admin/page-not-found');
                }
            }, errorCallback);
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
            return $scope.sortDir === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
        }
        return 'fa-sort';
    };

    /**
     * Gọi api tạo mới
     */
    $scope.createTrans = function () {
        $scope.transportitation.transportationBrandId = brandId;
        let transportation = $scope.transportitation;

        TransportServiceAG.create(transportation).then(function successCallback() {
            toastAlert('success', 'Thêm mới thành công !')
            $location.path('/business/transport/transport-management');
        }, errorCallback);
    }

    /**
     * Gọi api cập nhật
     */
    function confirmUpdate() {
        $scope.transportitation.id = transportId;
        let transportation = $scope.transportitation;

        TransportServiceAG.update(transportation).then(function successCallback() {
            toastAlert('success', 'Cập nhật thành công !');
            $location.path('/business/transport/transport-management');
        }, errorCallback);
    }

    $scope.updateTrans = function () {
        confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdate);
    }

    /**
     * Gọi api delete
     */
    $scope.deleteTrans = function (transportId, licensePlate) {
        function confirmDeleteStaff() {
            TransportServiceAG.delete(transportId).then(function successCallback() {
                toastAlert('success', 'Xóa phương tiện thành công !');
                $location.path('/business/transport/transport-management');
                $scope.init();
            }, errorCallback);
        }

        confirmAlert('Bạn có chắc chắn muốn xóa phương tiện ' + licensePlate + ' không ?', confirmDeleteStaff);
    }

    $scope.init();
});
