travel_app.controller('TransportDetailCusController',
    function ($scope, $location, $sce, $routeParams, UserLikeService, AuthService ,TransportCusService, TransportServiceAG, TransportBrandServiceAG, LocalStorageService, Base64ObjectService) {
        let brandId = Base64ObjectService.decodeObject($routeParams.brandId);
        let user = null
        user = AuthService.getUser();

        $scope.currentPage = 0;
        $scope.pageSize = 10;

        $scope.seatNumbers = [];
        $scope.seatSelections = [];

        $scope.transportUtilities = [];

        $scope.schedulePrices = [];

        $scope.isGetSeatCalled = false;

        $scope.activeTransportInfoTab = -1;
        $scope.activeTransportBookingTab = -1;

        $scope.filters = LocalStorageService.decryptLocalData('filtersTransportation', 'encryptFiltersTransportation');

        if ($scope.filters !== null) {
            if ($scope.filters.checkInDateFiller !== null) {
                $scope.filters.checkInDateFiller = new Date($scope.filters.checkInDateFiller);
            } else {
                $scope.filters.checkInDateFiller = new Date();
            }
        } else {
            $scope.filters = {
                checkInDateFiller: new Date()
            };
        }

        console.log($scope.filters)

        const fetchData = (serviceFunc, successCallback) => {
            return serviceFunc().then((response) => {
                if (response.status === 200) {
                    successCallback(response.data.data);
                } else {
                    $location.path('/admin/page-not-found');
                }
            });
        }

        /**
         * Phưương thức mở tab xem thêm bên dưới
         * @param index
         */
        $scope.toggleDetail = function (index) {
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
        $scope.getChangeIcon = function (index) {
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
         * Phưương thức mở tab booking bên dưới
         * @param schedule
         * @param index
         */
        $scope.toggleBooking = function (index, schedule) {
            $scope.activeTransportBookingTab = ($scope.activeTransportBookingTab === index) ? -1 : index;
            $scope.activeTransportInfoTab = -1;
            $scope.isGetSeatCalled = true;

            // lấy dữ liệu của ghế fill lên xe
            $scope.seatInTrans = $scope.getSeat(schedule);
        };

        $scope.init = function () {
            $scope.isLoading = true;

            fetchData(TransportCusService.getAllTransportCusDataList, (repo) => {
                if (repo === null) return;
                $scope.transportationDataList = repo.uniqueDataList;
                $scope.filteredDataList = $scope.transportationDataList.slice(0, 5);
                $scope.$watch('filters.searchTerm', function (newVal) {
                    if (newVal && newVal.trim() !== '') {
                        $scope.filteredDataList = $filter('filter')($scope.transportationDataList, newVal).slice(0, 5);
                    } else {
                        $scope.filteredDataList = $scope.transportationDataList.slice(0, 5);
                    }
                });
                $scope.fromLocationList = repo.fromLocationList;
                $scope.toLocationList = repo.toLocationList;
            })

            /**
             * Hiển thị tất cả các xe có vé
             */
            TransportCusService.findAllTransportScheduleCus($scope.currentPage, $scope.pageSize,$scope.filters, brandId).then(function (response) {
                console.log(response)
                if (response.status === 200) {
                    if (response.data && response.data.data && response.data.data.content) {
                        $scope.transportSchedule = response.data.data.content;

                        $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                        $scope.totalElements = response.data.data.totalElements;

                        $scope.transportSchedule.forEach(function (schedule) {
                            $scope.seatSelections[schedule.id] = {};
                            $scope.schedulePrices.push(0);
                        });
                    } else {
                        $scope.transportSchedule = [];
                        $scope.totalPages = 0;
                        $scope.totalElements = 0;
                    }

                } else {
                    $location.path('/admin/page-not-found');
                }
            }).finally(function () {
                $scope.isLoading = false;
            });

            /**
             * Tìm tên nhà xe
             */
            TransportBrandServiceAG.findByTransportBrandId(brandId).then(function (response) {
                if (response.status === 200) {
                    $scope.transportBrand = response.data.data;
                    $scope.checkIsLikeTransportationBrand($scope.transportBrand.id)
                } else {
                    $location.path('/admin/page-not-found');
                }
            }).finally(function () {
                $scope.isLoading = false;
            });

            /**
             * Lấy dữ liệu tiện ích từ API fill lên cho từng chiếc xe
             * @param index
             */
            $scope.getTransportUtilities = function (index) {
                $scope.transportUtilities = [];
                let schedule = $scope.transportSchedule[index];

                schedule.transportations.transportUtilities.forEach(function (utilId) {
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
            };

            /**
             * tìm tất cả chổ ngồi fill lên chiếc xe
             * @param transportSchedule
             * @returns {*[]}
             */
            $scope.getSeat = function (transportSchedule) {
                let seatRows = [];
                let bookSeats = transportSchedule.transportationScheduleSeatsById;

                if (transportSchedule.transportations.isTransportBed) {
                    let totalSeats = bookSeats.length;
                    let halfIndex = Math.ceil(totalSeats / 2);
                    let lowerBedSeats = bookSeats.slice(0, halfIndex);
                    let upperBedSeats = bookSeats.slice(halfIndex);

                    let chunkedLowerBedSeats = $scope.chunkArray(lowerBedSeats, 3);
                    let chunkedUpperBedSeats = $scope.chunkArray(upperBedSeats, 3);

                    seatRows.push(chunkedLowerBedSeats);
                    seatRows.push(chunkedUpperBedSeats);
                } else {
                    let chunkedSeats = $scope.chunkArray(bookSeats, 3);
                    seatRows.push(chunkedSeats);
                }

                return seatRows;
            }

            $scope.chunkArray = function (array, chunkSize) {
                let result = [];
                for (let i = 0; i < array.length; i += chunkSize) {
                    result.push(array.slice(i, i + chunkSize));
                }
                return result;
            }

            /**
             * Chọn chổ ngồi
             * @param schedule
             * @param seat
             */
            $scope.isActiveSeat = function (schedule, seat) {
                if (seat.isBooked) {
                    return;
                }

                let unitPrice = schedule.unitPrice;
                let seatNumber = seat.seatNumber;
                let seatSelections = $scope.seatSelections[schedule.id];
                let count = Object.keys(seatSelections).filter(key => seatSelections[key]).length;

                if ($scope.seatSelections[schedule.id] && $scope.seatSelections[schedule.id][seatNumber]) {
                    delete $scope.seatSelections[schedule.id][seatNumber];
                    count--;
                } else {
                    if (count >= 4) {
                        centerAlert('Thông báo', 'Quý khách chỉ được đặt tối đa 4 ghế.', 'warning');
                        return;
                    }

                    if (!$scope.seatSelections[schedule.id]) {
                        $scope.seatSelections[schedule.id] = {};
                    }
                    $scope.seatSelections[schedule.id][seatNumber] = true;
                    count++;
                }

                let totalPrice = unitPrice * count;
                let index = $scope.transportSchedule.findIndex(item => item.id === schedule.id);

                $scope.seatNumbers[index] = Object.keys($scope.seatSelections[schedule.id]);
                $scope.schedulePrices[index] = totalPrice;
            };

            /**
             * Chuyển hướng đến trang booking
             * @param schedule
             */
            $scope.redirectBooking = function (schedule) {
                let brandId = btoa(JSON.stringify(schedule.transportationBrands.id));
                let scheduleId = btoa(JSON.stringify(schedule.id));
                let totalAmountSeat = Object.keys($scope.seatSelections[schedule.id]).length;
                let seatNumber = Object.keys($scope.seatSelections[schedule.id]);
                let totalPrice = $scope.schedulePrices.reduce((total, price) => total + price, 0);

                if (angular.equals($scope.seatSelections[schedule.id], {})) {
                    centerAlert('Thông báo', 'Vui lòng chọn ít nhất một chổ ngồi !', 'warning');
                    return;
                }

                // api check xem chổ đã có người chọn trước chưa
                TransportCusService.checkSeatBySeatNumberAndScheduleId(schedule.id, seatNumber).then(function (response) {
                    if (response.status === 200) {
                        let isBooked = response.data.data;

                        if (!isBooked) {
                            TransportCusService.findSeatBySeatNumberAndScheduleId(schedule.id, seatNumber).then(function (response) {
                                if (response.status === 200) {
                                    let dataBookingTransport = {
                                        seatNumber: seatNumber,
                                        totalAmountSeat: totalAmountSeat,
                                        totalPrice: totalPrice,
                                    }

                                    let encryptBookingTransport = LocalStorageService.encryptData(dataBookingTransport, 'encryptBookingTransport');
                                    LocalStorageService.set('dataBookingTransport', encryptBookingTransport);
                                    $location.path('/drive-move/drive-transport-detail/' + brandId + '/booking-confirmation/' + scheduleId);
                                } else {
                                    $location.path('/admin/page-not-found');
                                }
                            })
                        } else {
                            centerAlert('Thông báo', 'Chỗ bạn chọn đã có người khác nhanh tay mua rồi, bạn hãy chọn chỗ khác nhé.', 'warning');
                        }
                    } else {
                        $location.path('/admin/page-not-found');
                    }
                });
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

        $scope.likeTransportationBrand = function (serviceId) {
            $scope.category = 2
            if (user != null && user) {
                UserLikeService.saveLike(serviceId, $scope.category, user.id).then(function (response) {
                    if (response.status === 200) {
                        toastAlert('success', response.data.message)
                        $scope.checkIsLikeTransportationBrand(serviceId)
                    } else {
                        toastAlert('error', response.data.message)
                    }
                })
            } else {
                toastAlert('error', "Vui lòng đăng nhập để thích khách sạn này")
            }
        }
        $scope.isLikeTransportationBrand = false;
        $scope.checkIsLikeTransportationBrand = async function (serviceId) {
            try {
                const response = await UserLikeService.findUserLikeByCategoryIdAndServiceId(serviceId, user.id);
                if (response.status === 200 && response.data.status === "200") {
                    $scope.isLikeTransportationBrand = response.data.data;
                    $scope.$apply();
                }
            } catch (error) {
            }
        };

        $scope.init();
    });