travel_app.controller('HistoryRequestCarControllerAG',
    function ($scope, $location, $timeout, $window, $filter, $routeParams, RequestCarServiceAG, TransportServiceAG, LocalStorageService) {
        $scope.brandId = LocalStorageService.get('brandId');

        $scope.currentTab = 'submitted';
        $scope.acceptedRequest = 0;

        $scope.currentPage = 0; // Trang hiện tại
        $scope.pageSize = 10; // Số lượng tours trên mỗi trang

        $scope.changeTab = (tab, isAccepted) => {
            if ($scope.currentTab !== tab || $scope.acceptedRequest !== isAccepted) {
                $scope.currentTab = tab;
                $scope.acceptedRequest = isAccepted;
                $scope.findAllHistoryRequestCarAgent();
            }
        };

        $scope.init = function () {
            $scope.isLoading = true;

            /**
             * Danh sách tất cả lịch sử đã ứng tuyển
             */
            $scope.findAllHistoryRequestCarAgent = function () {
                $scope.isLoading = true;
                $scope.historyRequestCarList = [];

                RequestCarServiceAG.findAllHistoryRequestCarServiceAgent($scope.brandId, $scope.acceptedRequest, $scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir).then(function (response) {
                    if (response.status === 200) {
                        if (response.data.data === null || response.data.data.content.length === 0) {
                            $scope.setPage(Math.max(0, $scope.currentPage - 1));
                            return
                        }

                        $scope.historyRequestCarList = response.data.data.content;
                        $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                        $scope.totalElements = response.data.data.totalElements; // Tổng số phần tử

                        $scope.historyRequestCarList.forEach(function (requestCar) {
                            $scope.checkTransportBrandSubmitted(requestCar);
                        })
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                }).finally(function () {
                    $scope.isLoading = false;
                });
            }

            /**
             * Xét điều kiện xem có nộp yêu cầu chưa
             * @param requestCar
             */
            $scope.checkTransportBrandSubmitted = function (requestCar) {
                let requestCarId = requestCar.requestCar.id;
                let transportBrandId = $scope.brandId;

                RequestCarServiceAG.findRequestCarSubmittedServiceAgent(requestCarId, transportBrandId).then(function (response) {
                    if (response.status === 200) {
                        requestCar.requestCar.isSubmiited = response.data.data;
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                });
            }

            /**
             * Tìm tên thương hiệu phương tiện bằng brandId
             * @param transportTypeId
             */
            TransportServiceAG.findByTransportBrandId($scope.brandId).then(function (response) {
                if (response.status === 200) {
                    $scope.transportBrand = response.data.data;
                } else {
                    $location.path('/admin/page-not-found');
                }
            });

            /**
             * Phân trang
             * @param page
             */
            $scope.setPage = (page) => {
                if (page >= 0 && page < $scope.totalPages) {
                    $scope.currentPage = page;
                    $scope.findAllHistoryRequestCarAgent();
                }
            };

            $scope.getPaginationRange = () => {
                let range = [];
                let start, end;

                if ($scope.totalPages <= 3) {
                    // Nếu tổng số trang nhỏ hơn hoặc bằng 5, hiển thị tất cả các trang
                    start = 0;
                    end = $scope.totalPages;
                } else {
                    // Hiển thị 2 trang trước và 2 trang sau trang hiện tại
                    start = Math.max(0, $scope.currentPage - 1);
                    end = Math.min(start + 3, $scope.totalPages);

                    // Điều chỉnh để luôn hiển thị 5 trang
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
                $scope.findAllHistoryRequestCarAgent(); // Tải lại dữ liệu với kích thước trang mới
            };

            $scope.getDisplayRange = () => {
                return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
            };

            /**
             * Phương thức mở modal chọn xe
             */
            $scope.openModalCheckCar = function (transportId) {
                $('#modal-transport-detail').modal('show');
                $scope.transportation = {};
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
                                });
                            });
                        } else {
                            $location.path('/admin/page-not-found');
                        }
                    });
                }
            }
        }

        /**
         * Phương thức hủy yêu cầu đi xe
         */
        $scope.cancelRequestCar = function (requestCarDetailId, transportationScheduleId, fromLocation, toLocation) {
            function confirmCancel() {
                $scope.isLoading = true;

                RequestCarServiceAG.cancelRequestCarDetail(requestCarDetailId, transportationScheduleId).then(function (response) {
                    if (response.status === 200) {
                        $scope.findAllHistoryRequestCarAgent();
                        centerAlert('Thành công', `Hủy yêu cầu cho chuyến đi từ ${fromLocation} đến ${toLocation} thành công!`, 'success');
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                }).finally(function () {
                    $scope.isLoading = false;
                })
            }

            confirmAlert(`Bạn có chắc chắn muốn hủy yêu cầu đã nộp cho TravelTour đi từ ${fromLocation} đến ${toLocation} không?`, confirmCancel);
        }

        $scope.init();
        $scope.findAllHistoryRequestCarAgent();
    });