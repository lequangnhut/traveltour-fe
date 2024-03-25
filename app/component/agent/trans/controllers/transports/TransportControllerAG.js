travel_app.controller('TransportControllerAG',
    function ($scope, $sce, $routeParams, $timeout, $location, LocalStorageService, TransportServiceAG) {
        let searchTimeout;
        let transportId = $routeParams.id;
        let brandId = LocalStorageService.get('brandId');

        $scope.licenseError = null;
        $scope.isLoading = true;

        $scope.currentPage = 0;
        $scope.pageSize = 5;

        $scope.transportTypeName = {};
        $scope.transportUtilTitle = {};

        $scope.transportUtilityModal = [];
        $scope.selectedUtilities = [];

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

        /**
         * Phương thức mở modal
         */
        $scope.openModal = function (transportId) {
            $('#modal-transport-detail').modal('show');
            $scope.transportUtilityModal = [];

            if (transportId !== undefined && transportId !== null && transportId !== "") {
                TransportServiceAG.findByTransportId(transportId).then(function successCallback(response) {
                    if (response.status === 200) {
                        $scope.transportation = response.data.data.transportGetDataDto;
                        $scope.transportUtilAPI = response.data.data.transportUtilities;
                        $scope.transportationImages = response.data.data.transportGetDataDto.transportationImagesById;
                        $scope.transportBrand = response.data.data.transportGetDataDto.transportationBrandsByTransportationBrandId;
                        $scope.transportType = response.data.data.transportGetDataDto.transportationTypesByTransportationTypeId;

                        $scope.transportUtilAPI.some(function (utilId) {
                            TransportServiceAG.findByTransportUtilityId(utilId).then(function (response) {
                                if (response.status === 200) {
                                    $scope.transportUtilityModal.push(response.data.data)
                                } else {
                                    $location.path('/admin/page-not-found');
                                }
                            }, errorCallback);
                        });
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                }, errorCallback);
            }
        }

        /**
         * Phương thức đóng modal
         */
        $scope.closeModal = function () {
            $('#modal-transport-detail').modal('hide');
        };

        $scope.init = function () {
            TransportServiceAG.findAllTransport(brandId, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir).then(function successCallback(response) {
                if (response.status === 200) {
                    $scope.transportData = response.data.content;

                    $scope.totalPages = Math.ceil(response.data.totalElements / $scope.pageSize);
                    $scope.totalElements = response.data.totalElements;

                    response.data.content.forEach(transportation => {
                        $scope.findTransportTypeName(transportation.transportationTypeId);
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

            /**
             * Tìm tất cả các tiện ích fill lên nhà xe
             */
            TransportServiceAG.findAllTransportUtilities().then(function (response) {
                if (response.status === 200) {
                    $scope.transportUtilities = response.data.data;
                } else {
                    $location.path('/admin/page-not-found');
                }
            }, errorCallback);

            /**
             * hàm này để click vào các tiện ích nó sẽ lưu vào biến selectedUtilities
             */
            $scope.selectedTransportUtilities = function (utilId) {
                let index = $scope.selectedUtilities.indexOf(utilId);
                if (index === -1) {
                    $scope.selectedUtilities.push(utilId);
                } else {
                    $scope.selectedUtilities.splice(index, 1);
                }
            };

            /**
             * hàm này để check box các tiện ích từ api
             * @param title
             * @returns {*}
             */
            $scope.checkedTitle = function (title) {
                return $scope.transportUtilityModal && $scope.transportUtilityModal.some(function (util) {
                    return util.title === title;
                });
            };

            /**
             * cập nhật xe và tiện ích của xe
             */
            if (transportId !== undefined && transportId !== null && transportId !== "") {
                TransportServiceAG.findByTransportId(transportId).then(function successCallback(response) {
                    if (response.status === 200) {
                        $scope.transportation = response.data.data.transportGetDataDto;
                        $scope.transportUtilAPI = response.data.data.transportUtilities;

                        $scope.transportUtilAPI.some(function (utilId) {
                            $scope.selectedUtilities.push(utilId);

                            TransportServiceAG.findByTransportUtilityId(utilId).then(function (response) {
                                if (response.status === 200) {
                                    $scope.transportUtilityModal.push(response.data.data)
                                } else {
                                    $location.path('/admin/page-not-found');
                                }
                            }, errorCallback);
                        });
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
                if ($scope.sortDir === 'asc') {
                    return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>');
                } else {
                    return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"/></svg>');
                }
            }
            return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"/></svg>');
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

            TransportServiceAG.create(transportData, $scope.selectedUtilities).then(function successCallback() {
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

            TransportServiceAG.update(transportData, $scope.selectedUtilities).then(function successCallback() {
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
            function confirmDelete() {
                TransportServiceAG.delete(transportId).then(function successCallback() {
                    toastAlert('success', 'Xóa phương tiện thành công !');
                    $location.path('/business/transport/transport-management');
                    $scope.init();
                }, errorCallback);
            }

            confirmAlert('Bạn có chắc chắn muốn xóa phương tiện ' + licensePlate + ' không ?', confirmDelete);
        }

        $scope.init();
    });
