travel_app.controller('TransportDetailCusController', function ($scope, $location, $sce, $routeParams, TransportCusService, TransportBrandServiceAG, LocalStorageService) {
    $scope.encryptedBrandId = $routeParams.brandId;
    let brandId = JSON.parse(atob($scope.encryptedBrandId));

    $scope.currentPage = 0;
    $scope.pageSize = 10;

    $scope.seatNumbers = [];
    $scope.seatSelections = [];

    $scope.schedulePrices = [];

    $scope.activeTransportInfoTab = -1;
    $scope.activeTransportBookingTab = -1;

    $scope.toggleDetail = function (index) {
        $scope.activeTransportInfoTab = ($scope.activeTransportInfoTab === index) ? -1 : index;
        $scope.activeTransportBookingTab = -1;
    };

    $scope.toggleBooking = function (index) {
        $scope.activeTransportBookingTab = ($scope.activeTransportBookingTab === index) ? -1 : index;
        $scope.activeTransportInfoTab = -1;
    };

    $scope.init = function () {
        $scope.isLoading = true;

        /**
         * Hiển thị tất cả các xe có vé
         */
        TransportCusService.findAllTransportScheduleCus($scope.currentPage, $scope.pageSize, brandId).then(function (response) {
            if (response.status === 200) {
                $scope.transportSchedule = response.data.data.content;

                $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                $scope.totalElements = response.data.data.totalElements;

                $scope.transportSchedule.forEach(function (schedule) {
                    $scope.seatSelections[schedule.id] = {};
                    $scope.schedulePrices.push(0);
                });
            } else {
                $location.path('/admin/page-not-found');
            }
        }).finally(function () {
            $scope.isLoading = false;
        });

        /**
         * tìm tất cả chổ ngồi fill lên chiếc xe
         * @param transportSchedule
         * @returns {*[]}
         */
        $scope.getSeat = function (transportSchedule) {
            let seatRows = [];
            for (let i = 0; i < transportSchedule.length; i++) {
                let bookSeats = transportSchedule[i].transportationScheduleSeatsById;
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
         * Tìm tên nhà xe
         */
        TransportBrandServiceAG.findByTransportBrandId(brandId).then(function (response) {
            if (response.status === 200) {
                $scope.transportBrand = response.data.data;
            } else {
                $location.path('/admin/page-not-found');
            }
        }).finally(function () {
            $scope.isLoading = false;
        });

        /**
         * Chọn chổ ngồi
         * @param schedule
         * @param rowIndex
         * @param seatIndex
         */
        $scope.isActiveSeat = function (schedule, rowIndex, seatIndex) {
            let scheduleSeat = $scope.getSeat([schedule])[0][rowIndex][seatIndex];

            if (scheduleSeat.isBooked) {
                return;
            }

            let unitPrice = schedule.unitPrice;
            let seatNumber = scheduleSeat.seatNumber;
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

            let dataBookingTransport = {
                seatNumber: seatNumber,
                totalAmountSeat: totalAmountSeat,
                totalPrice: totalPrice
            }

            LocalStorageService.set('dataBookingTransport', dataBookingTransport);
            $location.path('/drive-move/drive-transport-detail/' + brandId + '/booking-confirmation/' + scheduleId);
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

    $scope.init();
});