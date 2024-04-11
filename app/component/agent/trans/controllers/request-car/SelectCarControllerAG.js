travel_app.controller('SelectCarControllerAG',
    function ($scope, $location, $filter, $routeParams, TransportServiceAG, RequestCarServiceAG, TourDetailsServiceAD, LocalStorageService, Base64ObjectService) {
        $scope.brandId = LocalStorageService.get('brandId');
        $scope.requestCarId = Base64ObjectService.decodeObject($routeParams.requestCarId);

        $scope.requestCarDetail = {
            id: null,
            requestCarId: $scope.requestCarId,
            transportationScheduleId: null
        }

        $scope.init = function () {
            /**
             * Hàm gọi api find all transport bằng transport brand id
             */
            $scope.isLoading = true;

            RequestCarServiceAG.findAllTransportScheduleServiceByBrandId($scope.brandId).then(function (response) {
                if (response.status === 200) {
                    $scope.transportationScheduleList = response.data.data;
                } else {
                    $location.path('/admin/page-not-found');
                }
            }).finally(function () {
                $scope.isLoading = false;
            });

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
             * Phương thức mở modal chọn xe
             */
            $scope.openModal = function (transportId) {
                $('#modal-transport-detail').modal('show');
                $scope.transportation = {};
                $scope.transportUtilityModal = [];
                $scope.requestCarDetail.unitPrice = null;

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

                    /**
                     * API tìm kiếm tour detail để fill thông tin lên cho doanh nghiệp xem để tìm xe thích hợp
                     */
                    RequestCarServiceAG.findRequestCarByIdServiceAgent($scope.requestCarId).then(function (response) {
                        if (response.status === 200) {
                            let tourDetailId = response.data.data.tourDetailId;
                            $scope.requestCar = response.data.data;

                            TourDetailsServiceAD.findTourDetailById(tourDetailId).then(function (response) {
                                if (response.status === 200) {
                                    $scope.tourDetail = response.data.data;
                                } else {
                                    $location.path('/admin/page-not-found');
                                }
                            });
                        } else {
                            $location.path('/admin/page-not-found');
                        }
                    });
                }
            }

            $scope.checkTransportBrandSubmitted = function () {
                let requestCarId = $scope.requestCarId;
                let transportBrandId = $scope.brandId;

                return new Promise(function (resolve) {
                    RequestCarServiceAG.findRequestCarSubmittedServiceAgent(requestCarId, transportBrandId).then(function (response) {
                        resolve(response.data.data);
                    });
                });
            }
        }

        $scope.submitRequestCarToStaff = function () {
            $scope.transportationScheduleList.forEach(function (schedule) {
                if (schedule.transportationId === $scope.transportation.id) {
                    $scope.requestCarDetail.transportationScheduleId = schedule.id;

                    $scope.checkTransportBrandSubmitted().then(function (isSubmitted) {
                        if (!isSubmitted) {
                            function confirmSubmit() {
                                $scope.isLoading = true;

                                RequestCarServiceAG.submitRequestCarDetail($scope.requestCarDetail).then(function (response) {
                                    if (response.status === 200) {
                                        $location.path('/business/transport/notification-request-car');
                                        $('#modal-transport-detail').modal('hide');
                                        centerAlert('Thành công', 'TravelTour đã nhận được yêu cầu gửi từ bạn. Chúng tôi sẽ xử lý yêu cầu của bạn trong vòng 72h tới.', 'success')
                                    } else {
                                        $location.path('/admin/page-not-found');
                                    }
                                }).finally(function () {
                                    $scope.isLoading = false;
                                });
                            }

                            confirmAlert('Bạn có chắc chắn muốn gửi dữ liệu này cho TravelTour không ?', confirmSubmit);
                        } else {
                            centerAlert('Không thành công !', 'Chúng tôi nhận thấy bạn đã nộp hồ sơ gần đây, ' +
                                'vui lòng không nộp lại cho đến khi yêu cầu này kết thúc. Hoặc bạn có thể hủy và gửi lại.', 'warning');
                        }
                    }).catch(function (error) {
                        console.error("Có lỗi xảy ra khi kiểm tra trạng thái:", error);
                    });
                }
            });
        }

        $scope.init();
    });