travel_app.controller('RequestCarControllerAD',
    function ($scope, $location, $routeParams, $sce, $timeout, TransportationBrandServiceAD, TransportationTypeServiceAD,
              TransportServiceAG, GenerateCodePayService, Base64ObjectService, AgencyServiceAD, AuthService,
              RequestCarServiceAD, TourDetailsServiceAD, LocalStorageService) {
        const user = AuthService.getUser();

        $scope.currentPage = 0; // Trang hiện tại
        $scope.pageSize = 10; // Số lượng tours trên mỗi trang

        $scope.currentPageDetail = 0; // Trang hiện tại
        $scope.pageSizeDetail = 10; // Số lượng tours trên mỗi trang

        $scope.transportations = [];
        $scope.transportUtilities = [];

        $scope.showMoreTransportationBrand = false;
        $scope.limitTransportationBrand = 5;

        $scope.showMoreTransportationType = false;
        $scope.limitTransportationType = 5;

        $scope.tourDetailIdDecrypt = Base64ObjectService.decodeObject(LocalStorageService.decryptLocalData('tourDetailIdRequestCar', 'tourDetailEncode'));
        $scope.requestCarId = Base64ObjectService.decodeObject($routeParams.requestCarId);

        $scope.requestCar = {
            id: null,
            tourDetailId: null,
            amountCustomer: null,
            fromLocation: null,
            toLocation: null,
            departureDate: null,
            arrivalDate: null,
            isActive: null,
            isTransportBed: null,
            requestCarNoted: null
        }

        $scope.ratings = [
            {id: 1, label: 'Trên 1 sao'},
            {id: 2, label: 'Trên 2 sao'},
            {id: 3, label: 'Trên 3 sao'},
            {id: 4, label: 'Trên 4 sao'},
            {id: 5, label: 'Trên 5 sao'}
        ];

        $scope.filters = {
            fromLocation: null,
            toLocation: null,
            mediaTypeList: [],
            listOfVehicleManufacturers: [],
            seatTypeList: [],
        };

        $scope.validateDates = (day) => {
            $scope.currentDate = new Date();

            let currentDateNow = Math.floor((day - $scope.currentDate) / (1000 * 60 * 60 * 24))

            if (currentDateNow < -1) {
                $scope.errorCheckInDateFiller = "Ngày đi không thể nhỏ hơn ngày hiện tại";
            } else {
                $scope.errorCheckInDateFiller = "";
            }
        };

        $scope.getCurrentDate = () => {
            let currentDate = new Date();
            const year = currentDate.getFullYear();
            let month = currentDate.getMonth() + 1;
            let day = currentDate.getDate();

            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }

            return year + '-' + month + '-' + day;
        };

        $scope.checkDate = () => {
            const currentDate = new Date();
            if ($scope.filters.departure === undefined) {
                $scope.filters.departure = currentDate;
                toastAlert('warning', 'Không được nhập ngày quá khứ!');
            }
        };

        //show tiện ích
        $scope.showMoreItemsTransportationBrand = () => {
            $scope.limitTransportationBrand = $scope.transportationBrandList.length;
            $scope.showMoreTransportationBrand = true;
        };

        $scope.showLessItemsTransportationBrand = () => {
            $scope.limitTransportationBrand = 5;
            $scope.showMoreTransportationBrand = false;
        };

        $scope.showMoreItemsTransportationType = () => {
            $scope.limitTransportationType = $scope.transportationTypeList.length;
            $scope.showMoreTransportationType = true;
        };

        $scope.showLessItemsTransportationType = () => {
            $scope.limitTransportationType = 5;
            $scope.showMoreTransportationType = false;
        };

        //thêm danh sách lọc
        $scope.ChooseFromAVarietyOfVehicles = (id) => {
            let index = $scope.filters.mediaTypeList.indexOf(id);
            if (index === -1) {
                $scope.filters.mediaTypeList.push(id);
            } else {
                $scope.filters.mediaTypeList.splice(index, 1);
            }
        };

        $scope.ChooseFromManyCarBrands = (id) => {
            let index = $scope.filters.listOfVehicleManufacturers.indexOf(id);
            if (index === -1) {
                $scope.filters.listOfVehicleManufacturers.push(id);
            } else {
                $scope.filters.listOfVehicleManufacturers.splice(index, 1);
            }
        };

        $scope.chooseFromSeatingType = (id) => {
            let index = $scope.filters.seatTypeList.indexOf(id);
            if (index === -1) {
                $scope.filters.seatTypeList.push(id);
            } else {
                $scope.filters.seatTypeList.splice(index, 1);
            }
        };

        const fetchData = (serviceFunc, successCallback) => {
            return serviceFunc().then((response) => {
                if (response.status === 200) {
                    successCallback(response.data.data);
                } else {
                    $location.path('/admin/page-not-found');
                }
            });
        }

        $scope.init = function () {
            $scope.isLoading = true;

            Promise.all([fetchData(TransportationBrandServiceAD.getAllTransportationBrands, (repo) => {
                $scope.transportationBrandList = repo;
            }), fetchData(TransportationTypeServiceAD.getAllTransportationTypes, (repo) => {
                $scope.transportationTypeList = repo;
            })]).finally(() => {
            });

            /**
             * Tìm tất cả tour detail fill lên select
             */
            RequestCarServiceAD.findAllTourDetailUseRequestCarService().then(function (response) {
                if (response.status === 200) {
                    $scope.tourDetailSelect = response.data.data;

                    if ($scope.tourDetailIdDecrypt) {
                        $scope.requestCar.tourDetailId = $scope.tourDetailIdDecrypt;

                        $scope.tourDetailSelect.forEach(function (tourDetail) {
                            if (tourDetail.id === $scope.tourDetailIdDecrypt) {
                                $scope.requestCar.amountCustomer = tourDetail.numberOfGuests;
                                $scope.requestCar.toLocation = tourDetail.toLocation;
                                $scope.requestCar.fromLocation = tourDetail.fromLocation;
                                $scope.requestCar.departureDate = new Date(tourDetail.departureDate);
                                $scope.requestCar.arrivalDate = new Date(tourDetail.arrivalDate);

                                $scope.requestCar.requestCarNoted = "Chúng tôi đang cần một đối tác cung cấp dịch vụ vận chuyển chất lượng cao, bao gồm xe limousine và hỗ trợ nước, để đáp ứng nhu cầu di chuyển của doanh nghiệp và khách hàng của chúng tôi.";
                            }
                        });
                    }
                } else {
                    $location.path('/admin/page-not-found');
                }
            });

            /**
             * Tìm các yêu cầu
             */
            RequestCarServiceAD.findAllRequestCarService($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir)
                .then((response) => {
                    $scope.requestCarList = response.data.data !== null ? response.data.data.content : [];
                    $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                }).finally(() => {
                $scope.isLoading = false;
            });

            /**
             * Chọn tour trên select thì lấy id để chọn ra một tour
             */
            $scope.findTourDetailOnSelect = function () {
                let tourDetailId = $scope.requestCar.tourDetailId;

                RequestCarServiceAD.checkExitsTourDetail(tourDetailId).then(function (response) {
                    if (response.status === 200) {
                        let amountCreated = response.data.data;

                        if (amountCreated === 0) {
                            importDataOnInput();
                        } else {
                            Swal.fire({
                                title: "Xác nhận !",
                                text: `Tour này đã được tạo yêu cầu tìm xe  
                                               ${amountCreated > 1 ? `lần thứ ${amountCreated}` : 'rồi'}, 
                                               bạn có muốn tiếp tục tạo thêm nữa không ?`,
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Đồng ý !",
                                cancelButtonText: 'Hủy'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    $timeout(function () {
                                        importDataOnInput();
                                    }, 50)
                                } else {
                                    $timeout(function () {
                                        $scope.requestCar = null;
                                    }, 50)
                                }
                            });
                        }
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                });

                function importDataOnInput() {
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
                }
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
                $scope.isLoading = true;
                $scope.requestCarDetailList = [];

                RequestCarServiceAD.findAllRequestCarDetailService(requestCarId, $scope.currentPageDetail, $scope.pageSizeDetail, $scope.sortBy, $scope.sortDir)
                    .then((response) => {
                        $scope.requestCarDetailList = response.data.data.content;
                        $scope.totalPagesDetail = Math.ceil(response.data.data.totalElements / $scope.pageSizeDetail);

                        $scope.requestCarDetailList.forEach(function (requestCarDetail) {
                            let agenciesId = requestCarDetail.transportationBrands.agenciesId;
                            let transportationId = requestCarDetail.transportations.id;
                            let transportationScheduleId = requestCarDetail.transportationScheduleId;
                            let requestCarId = requestCarDetail.requestCarId;

                            AgencyServiceAD.findAgenciesById(agenciesId).then(function (response) {
                                if (response.status === 200) {
                                    requestCarDetail.agencies = response.data.data;
                                } else {
                                    $location.path('/admin/page-not-found');
                                }
                            });

                            TransportServiceAG.findByTransportId(transportationId).then(function (response) {
                                if (response.status === 200) {
                                    requestCarDetail.transportations = response.data.data.transportGetDataDto;
                                } else {
                                    $location.path('/admin/page-not-found');
                                }
                            });

                            RequestCarServiceAD.findRequestCarDetailSubmittedService(transportationScheduleId).then(function (response) {
                                if (response.status === 200) {
                                    requestCarDetail.isSubmiited = response.data.data;
                                } else {
                                    $location.path('/admin/page-not-found');
                                }
                            })

                            RequestCarServiceAD.findCarSubmittedService(requestCarId, transportationScheduleId).then(function (response) {
                                if (response.status === 200) {
                                    requestCarDetail.isCarSubmitted = response.data.data;
                                } else {
                                    $location.path('/admin/page-not-found');
                                }
                            })
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

            /**
             * Di chuyển đến trang danh sách
             */
            $scope.redirectPageDataTransport = function (requestCar) {
                let tourDetailId = Base64ObjectService.encodeObject(requestCar.tourDetailId);
                $location.path(`/admin/detail-tour-list/${tourDetailId}/service-list/transportation-information-list`);
                $scope.setActiveNavItem('detail-tour-list');
            }
        }

        //loc
        $scope.filterAllMedia = () => {
            RequestCarServiceAD.findAllRequestCarFilters($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.filters)
                .then((response) => {
                    $scope.requestCarList = response.data.data !== null ? response.data.data.content : [];
                    $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                }).finally(() => {
                $scope.isLoading = false;
            });
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

        /**
         * API để duyệt xe
         */
        $scope.acceptRequestCar = function (requestCarDetailId, requestCarId, licensePlate, scheduleId) {
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
                formData.append("requestCarId", requestCarId);
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

            confirmAlert('Sau khi bạn duyệt xe thành công thì yêu cầu này sẽ bị khóa. Bạn có chắc chắn muốn duyệt xe ' + licensePlate + ' ? ', confirmAccept);
        }

        $scope.init();

        $scope.$on('$routeChangeStart', function (event, next, current) {
            if (next.controller !== 'BookingTourSuccessCusController') {
                LocalStorageService.remove('tourDetailIdRequestCar');
            }
        });
    })