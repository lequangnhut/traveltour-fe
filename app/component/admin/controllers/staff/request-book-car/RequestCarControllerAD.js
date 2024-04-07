travel_app.controller('RequestCarControllerAD',
    function ($scope, $location, $routeParams, $sce, $timeout, TransportServiceAG, GenerateCodePayService, Base64ObjectService, AgencyServiceAD, AuthService, RequestCarServiceAD) {
        const user = AuthService.getUser();

        $scope.currentPage = 0; // Trang hiện tại
        $scope.pageSize = 10; // Số lượng tours trên mỗi trang

        $scope.currentPageDetail = 0; // Trang hiện tại
        $scope.pageSizeDetail = 10; // Số lượng tours trên mỗi trang

        $scope.agencies = [];
        $scope.transportations = [];
        $scope.transportUtilities = [];

        $scope.requestCarId = Base64ObjectService.decodeObject($routeParams.requestCarId);

        $scope.requestCar = {
            id: null,
            tourDetailId: null,
            amountCustomer: null,
            fromLocation: null,
            toLocation: null,
            departureDate: null,
            arrivalDate: null,
            isTransportBed: null,
            requestCarNoted: null
        }

        $scope.init = function () {
            $scope.isLoading = true;

            /**
             * Tìm tất cả tour detail fill lên select
             */
            RequestCarServiceAD.findAllTourDetailUseRequestCarService().then(function (response) {
                if (response.status === 200) {
                    $scope.tourDetailSelect = response.data.data;
                } else {
                    $location.path('/admin/page-not-found');
                }
            });

            /**
             * Tìm các yêu cầu
             */
            RequestCarServiceAD.findAllRequestCarService($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir)
                .then((response) => {
                    if (response.data.data === null || response.data.data.content.length === 0) {
                        $scope.setPage(Math.max(0, $scope.currentPage - 1));
                        return
                    }

                    $scope.requestCarList = response.data.data.content;
                    $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                }).finally(() => {
                $scope.isLoading = false;
            });

            /**
             * Chọn tour trên select thì lấy id để chọn ra một tour
             */
            $scope.findTourDetailOnSelect = function () {
                let tourDetailId = $scope.requestCar.tourDetailId;

                $scope.tourDetailSelect.forEach(function (tourDetail) {
                    if (tourDetail.id === tourDetailId) {
                        $scope.requestCar.amountCustomer = tourDetail.numberOfGuests;
                        $scope.requestCar.toLocation = tourDetail.toLocation;
                        $scope.requestCar.fromLocation = tourDetail.fromLocation;
                        $scope.requestCar.departureDate = new Date(tourDetail.departureDate);
                        $scope.requestCar.arrivalDate = new Date(tourDetail.arrivalDate);

                        $scope.requestCar.requestCarNoted = "Chúng tôi đang cần một đối tác cung cấp dịch vụ vận chuyển chất lượng cao, bao gồm xe limousine và hỗ trợ nước, để đáp ứng nhu cầu di chuyển của doanh nghiệp và khách hàng của chúng tôi.";
                    }
                });
            };

            /**
             * Tour request car bằng id
             */
            if ($scope.requestCarId !== undefined && $scope.requestCarId !== null && $scope.requestCarId !== "") {
                RequestCarServiceAD.findRequestCarById($scope.requestCarId).then(function (response) {
                    if (response.status === 200) {
                        $scope.requestCar = response.data.data;
                        $scope.requestCar.departureDate = new Date(response.data.data.departureDate);
                        $scope.requestCar.arrivalDate = new Date(response.data.data.arrivalDate);
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                });
            }

            /**
             * Mở modal và tìm tất cả các xe đã gửi yêu cầu
             */
            $scope.openModalRequestCarList = function (requestCarId) {
                $('#request-car-list').modal('show');
                $scope.requestCarDetailList = [];

                RequestCarServiceAD.findAllRequestCarDetailService(requestCarId, $scope.currentPageDetail, $scope.pageSizeDetail, $scope.sortBy, $scope.sortDir)
                    .then((response) => {
                        if (response.data.data === null || response.data.data.content.length === 0) {
                            $scope.setPage(Math.max(0, $scope.currentPageDetail - 1));
                            return
                        }

                        $scope.requestCarDetailList = response.data.data.content;
                        $scope.totalPagesDetail = Math.ceil(response.data.data.totalElements / $scope.pageSizeDetail);

                        $scope.requestCarDetailList.forEach(function (requestCarDetail) {
                            let agenciesId = requestCarDetail.transportationBrands.agenciesId;
                            let transportationId = requestCarDetail.transportations.id;

                            AgencyServiceAD.findAgencieById(agenciesId).then(function (response) {
                                if (response.status === 200) {
                                    $scope.agencies.push(response.data.data);
                                } else {
                                    $location.path('/admin/page-not-found');
                                }
                            });

                            TransportServiceAG.findByTransportId(transportationId).then(function (response) {
                                if (response.status === 200) {
                                    $scope.transportations.push(response.data.data.transportGetDataDto);
                                } else {
                                    $location.path('/admin/page-not-found');
                                }
                            });
                        })
                    }).finally(() => {
                    $scope.isLoading = false;
                });
            }

            /**
             * Phưương thức mở tab xem thêm bên dưới
             * @param index
             */
            $scope.toggleRequestDetail = function (index) {
                $scope.activeTransportInfoTab = ($scope.activeTransportInfoTab === index) ? -1 : index;
                $scope.activeTransportBookingTab = -1;

                if ($scope.activeTransportInfoTab !== -1) {
                    $scope.getTransportUtilities(index);
                }
            };

            /**
             * Phưương thức thay đổi icon khi nhấn vào xem thêm
             * @param index
             */
            $scope.getChangeIconRequestDetail = function (index) {
                if ($scope.activeTransportInfoTab === index) {
                    if ($scope.activeTransportInfoTab === -1) {
                        return $sce.trustAsHtml('<svg class="svg-inline--fa fa-angle-down" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z"></path></svg>');
                    } else {
                        return $sce.trustAsHtml('<svg class="svg-inline--fa fa-angle-up" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M352 352c-8.188 0-16.38-3.125-22.62-9.375L192 205.3l-137.4 137.4c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25C368.4 348.9 360.2 352 352 352z"></path></svg>');
                    }
                }
                return $sce.trustAsHtml('<svg class="svg-inline--fa fa-angle-down" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z"></path></svg>');
            };

            /**
             * Lấy dữ liệu tiện ích từ API fill lên cho từng chiếc xe
             * @param index
             */
            $scope.getTransportUtilities = function (index) {
                $scope.transportUtilities = [];
                let transportationId = $scope.requestCarDetailList[index].transportations.id;

                TransportServiceAG.findByTransportId(transportationId).then(function (response) {
                    if (response.status === 200) {
                        if (!$scope.transportUtilities[index]) {
                            $scope.transportUtilities[index] = [];
                        }

                        let transportUtilities = response.data.data.transportUtilities;

                        transportUtilities.forEach(function (utilId) {
                            TransportServiceAG.findByTransportUtilityId(utilId).then(function (response) {
                                if (response.status === 200) {
                                    if (!$scope.transportUtilities[index]) {
                                        $scope.transportUtilities[index] = [];
                                    }
                                    $scope.transportUtilities[index].push(response.data.data);
                                } else {
                                    $location.path('/admin/page-not-found');
                                }
                            });
                        });
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                })
            };

            /**
             * Phân trang request car
             * @param page
             */
            $scope.setPageRequestCar = (page) => {
                if (page >= 0 && page < $scope.totalPages) {
                    $scope.currentPage = page;
                    $scope.init();
                }
            };

            $scope.getPaginationRangeRequestCar = () => {
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

            /**
             * Phân trang request car detail
             * @param page
             */
            $scope.setPageRequestCarDetail = (page) => {
                if (page >= 0 && page < $scope.totalPagesDetail) {
                    $scope.currentPageDetail = page;
                    $scope.init();
                }
            };

            $scope.getPaginationRangeRequestCarDetail = () => {
                let range = [];
                let start, end;

                if ($scope.totalPagesDetail <= 3) {
                    // Nếu tổng số trang nhỏ hơn hoặc bằng 5, hiển thị tất cả các trang
                    start = 0;
                    end = $scope.totalPagesDetail;
                } else {
                    // Hiển thị 2 trang trước và 2 trang sau trang hiện tại
                    start = Math.max(0, $scope.currentPageDetail - 1);
                    end = Math.min(start + 3, $scope.totalPagesDetail);

                    // Điều chỉnh để luôn hiển thị 5 trang
                    if (end === $scope.totalPagesDetail) {
                        start = $scope.totalPagesDetail - 3;
                    }
                }

                for (let i = start; i < end; i++) {
                    range.push(i);
                }

                return range;
            };
        }

        /**
         * Tạo yêu cầu gửi đến nhà xe
         */
        $scope.createRequestCar = function () {
            $scope.isLoading = true;

            RequestCarServiceAD.createRequestCarService($scope.requestCar).then(function (response) {
                if (response.status === 200) {
                    $location.path('/admin/request-booking-car');
                    toastAlert('success', 'Tạo yêu cầu thành công !');
                } else {
                    $location.path('/admin/page-not-found');
                }
            }).finally(function () {
                $scope.isLoading = false;
            });
        }

        /**
         * Cập nhật yêu cầu
         */
        $scope.updateRequestCar = function () {
            function confirmUpdate() {
                $scope.isLoading = true;

                RequestCarServiceAD.updateRequestCarService($scope.requestCar).then(function (response) {
                    if (response.status === 200) {
                        $location.path('/admin/request-booking-car');
                        toastAlert('success', 'Cập nhật yêu cầu thành công !');
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                }).finally(function () {
                    $scope.isLoading = false;
                });
            }

            confirmAlert('Bạn có chắc chắn muốn cập nhật không ?', confirmUpdate);
        }

        $scope.acceptRequestCar = function (requestCarDetailId, licensePlate, scheduleId) {
            let orderTransportation = {
                id: GenerateCodePayService.generateCodeBooking('VPO', scheduleId),
                userId: user.id,
                paymentMethod: 0,
                dateCreated: new Date(),
                orderStatus: 0,
                orderCode: GenerateCodePayService.generateCodePayment('VPO')
            }

            function confirmAccept() {
                $scope.isLoading = true;

                let formData = new FormData();
                formData.append("requestCarDetailId", requestCarDetailId);
                formData.append("orderTransportationsDto", new Blob([JSON.stringify(orderTransportation)], {type: "application/json"}));

                RequestCarServiceAD.acceptRequestCarService(formData).then(function (response) {
                    if (response.status === 200) {
                        $('#request-car-list').modal('hide');
                        centerAlert('Thành công !', 'Bạn đã duyệt xe ' + licensePlate + ' thành công !', 'success');
                        $scope.init();
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                }).finally(function () {
                    $scope.isLoading = false;
                });
            }

            confirmAlert('Bạn có chắc chắn muốn duyệt xe ' + licensePlate + ' ?', confirmAccept);
        }

        $scope.init();
    })