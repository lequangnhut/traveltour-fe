travel_app.controller('TransportControllerAG', function ($scope, $routeParams, $timeout, $location, LocalStorageService, TransportServiceAG) {
    let searchTimeout;
    let transportId = $routeParams.id;
    let brandId = LocalStorageService.get('brandId');

    $scope.licenseError = null;
    $scope.isLoading = true;

    $scope.currentPage = 0;
    $scope.pageSize = 5;

    $scope.transportTypeName = {};

    $scope.transportation = {
        id: null,
        transportationBrandId: null,
        transportationTypeId: null,
        transportationImg: null,
        transportTypeImg: null,
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
        TransportServiceAG.findByLicensePlate($scope.transportation.licensePlate).then(function successCallback(response) {
            $scope.licenseError = response.data.exists;
            console.log(response.data)
        }, errorCallback);
    };

    /**
     * Upload hình ảnh và lưu vào biến transportationImg
     * @param file
     */
    $scope.uploadAvatarTransport = function (file) {
        if (file && !file.$error) {
            $scope.transportation.transportationImg = file;
        }
    };

    /**
     * Upload hình ảnh và lưu vào biến transportTypeImg
     * @param file
     */
    $scope.uploadTransportTypeImg = function (file) {
        if (file && !file.$error) {
            $scope.transportation.transportTypeImg = file;
        }
    };

    $scope.openImageModal = function (imageUrl) {
        document.getElementById('modalImage').src = imageUrl;
        $('#imageModal').modal('show');
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
         * Tìm transportImage bằng transportId
         * @param transportId
         */
        TransportServiceAG.findImageByTransportId(transportId).then(function (response) {
            if (response.status === 200) {
                $scope.transportTypeImg = response.data.data;
            } else {
                $location.path('/admin/page-not-found');
            }
        }, errorCallback);

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
                    $scope.transportation = response.data.data;
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
        $scope.isLoading = true;
        $scope.transportation.transportationBrandId = brandId;

        let transportation = $scope.transportation;
        let transportTypeImg = $scope.transportation.transportTypeImg;
        let transportationImg = $scope.transportation.transportationImg;

        const transportData = new FormData();

        transportData.append('transportationsDto', new Blob([JSON.stringify(transportation)], {type: 'application/json'}));
        angular.forEach(transportTypeImg, function (file) {
            transportData.append('transportTypeImg', file);
        });
        transportData.append('transportationImg', transportationImg);

        TransportServiceAG.create(transportData).then(function successCallback() {
            toastAlert('success', 'Thêm mới thành công !')
            $location.path('/business/transport/transport-management');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
    }

    /**
     * Gọi api cập nhật
     */
    function confirmUpdate() {
        $scope.isLoading = true;
        $scope.transportation.id = transportId;

        let transportation = $scope.transportation;
        let transportTypeImg = $scope.transportation.transportTypeImg;
        let transportationImg = $scope.transportation.transportationImg;

        const transportData = new FormData();

        transportData.append('transportationsDto', new Blob([JSON.stringify(transportation)], {type: 'application/json'}));
        angular.forEach(transportTypeImg, function (file) {
            transportData.append('transportTypeImg', file);
        });
        transportData.append('transportationImg', transportationImg);

        TransportServiceAG.update(transportData).then(function successCallback() {
            toastAlert('success', 'Cập nhật thành công !');
            $location.path('/business/transport/transport-management');
        }, errorCallback).finally(function () {
            $scope.isLoading = false;
        });
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
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn muốn xóa phương tiện ' + licensePlate + ' không ?', confirmDeleteStaff);
    }

    $scope.init();
});
