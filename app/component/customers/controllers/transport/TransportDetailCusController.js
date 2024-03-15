travel_app.controller('TransportDetailCusController',
    function ($scope, $location, $sce, $routeParams, TransportCusService, TransportBrandServiceAG) {
        $scope.encryptedBrandId = $routeParams.brandId;
        let brandId = JSON.parse(atob($scope.encryptedBrandId));

        $scope.currentPage = 0;
        $scope.pageSize = 10;

        $scope.showTransportInfoNav = [];
        $scope.showTransportBookingNav = [];

        $scope.seatSelections = {};

        $scope.toggleDetail = function (index) {
            $scope.showTransportInfoNav[index] = !$scope.showTransportInfoNav[index];
        };

        $scope.toggleBooking = function (index) {
            $scope.showTransportBookingNav[index] = !$scope.showTransportBookingNav[index];
        };

        $scope.init = function () {
            $scope.isLoading = true;

            TransportCusService.findAllTransportScheduleCus($scope.currentPage, $scope.pageSize, brandId).then(function (response) {
                if (response.status === 200) {
                    $scope.transportSchedule = response.data.data.content;

                    $scope.totalPages = Math.ceil(response.data.data.totalElements / $scope.pageSize);
                    $scope.totalElements = response.data.data.totalElements;

                    for (let i = 0; i < $scope.transportSchedule.length; i++) {
                        $scope.showTransportInfoNav[i] = false;
                    }

                    for (let i = 0; i < $scope.transportSchedule.length; i++) {
                        $scope.showTransportBookingNav[i] = false;
                    }
                } else {
                    $location.path('/admin/page-not-found');
                }
            }).finally(function () {
                $scope.isLoading = false;
            });

            TransportBrandServiceAG.findByTransportBrandId(brandId).then(function (response) {
                if (response.status === 200) {
                    $scope.transportBrand = response.data.data;
                } else {
                    $location.path('/admin/page-not-found');
                }
            }).finally(function () {
                $scope.isLoading = false;
            });

            $scope.getSeat = function (transportSchedule) {
                let seatRows = [];
                for (let i = 0; i < transportSchedule.length; i++) {
                    let bookSeats = Array.from({length: transportSchedule[i].transportations.amountSeat}, (_, i) => i + 1);
                    let chunkedSeats = chunkArray(bookSeats, 3);
                    seatRows.push(chunkedSeats);
                }
                return seatRows;
            }

            function chunkArray(array, chunkSize) {
                let result = [];
                for (let i = 0; i < array.length; i += chunkSize) {
                    result.push(array.slice(i, i + chunkSize));
                }
                return result;
            }

            $scope.isActiveSeat = function (seatNumber) {
                if ($scope.seatSelections[seatNumber]) {
                    delete $scope.seatSelections[seatNumber];
                } else {
                    $scope.seatSelections[seatNumber] = true;
                }

                console.log($scope.seatSelections)
            };
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