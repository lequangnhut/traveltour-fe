travel_app.controller('AccommodationInformationControllerAD',
    function ($scope, $sce, $location, $routeParams, $timeout, AccommodationInformationServiceAD, TourDetailsServiceAD) {
        $scope.isLoading = true;

        let searchTimeout;

        $scope.bookingTourHotelList = [];
        $scope.currentPage = 0;
        $scope.pageSize = 5;

        function errorCallback() {
            $location.path('/admin/internal-server-error')
        }

        //phân trang
        $scope.setPage = function (page) {
            if (page >= 0 && page < $scope.totalPages) {
                $scope.currentPage = page;
                $scope.getBookingTourHotelList();
            }
        };

        $scope.getPaginationRange = function () {
            let range = [];
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
            $scope.getBookingTourHotelList();
        };

        $scope.getDisplayRange = function () {
            return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
        };

        $scope.bookingTourHotelData = (response) => {
            $scope.bookingTourHotelList = response.data.data !== null ? response.data.data.content : [];
            $scope.totalPages = response.data.data !== null ? Math.ceil(response.data.data.totalElements / $scope.pageSize) : 0;
            $scope.totalElements = response.data.data !== null ? response.data.data.totalElements : 0;
        };

        $scope.getBookingTourHotelList = function () {
            $scope.isLoading = true;
            AccommodationInformationServiceAD.getAllByInfo($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.tourDetailId, $scope.orderHotelStatus, $scope.searchTerm)
                .then(function (response) {
                    $scope.bookingTourHotelData(response)
                }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        };

        //sắp xếp
        $scope.sortData = function (column) {
            $scope.sortBy = column;
            $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
            $scope.getBookingTourHotelList();
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

        //tìm kiếm
        $scope.searchBookingTour = function () {
            if (searchTimeout) $timeout.cancel(searchTimeout);

            searchTimeout = $timeout(function () {
                AccommodationInformationServiceAD.getAllByInfo($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.tourDetailId, $scope.orderHotelStatus, $scope.searchTerm)
                    .then(function (response) {
                        $scope.bookingTourHotelData(response)
                    }, errorCallback);
            }, 500);
        };

        $scope.orderHotelChanged = function () {
            $scope.getBookingTourHotelList();
        };

        $scope.deactivateBookingTourHotel = function () {
            function confirm() {
                AccommodationInformationServiceAD.deactivate($scope.tourDetailId, $scope.hotelId).then(function successCallback() {
                    toastAlert('success', 'Hủy thành công !');
                    $('#modal-tour-detail').modal('hide');
                    $scope.getBookingTourHotelList();
                }, errorCallback);
            }

            confirmAlert('Bạn có chắc chắn muốn hủy không ?', confirm);
        }

        $scope.getBookingTourHotelList();

        /**
         * Phương thức mở modal
         */
        $scope.openModal = function (hotelId) {
            $('#modal-order-hotel').modal('show');

            $scope.hotelId = hotelId;

            if (!$scope.tourDetailId && !hotelId) return;

            AccommodationInformationServiceAD.getAllByTourDetailIdAndHotelId($scope.tourDetailId, hotelId)
                .then(response => {
                    if (response.status === 200) {
                        let orderHotelDetailList = response.data.data;
                        let groupedRooms = {};
                        let orderHotel = orderHotelDetailList[0].orderHotelsByOrderHotelId;

                        $scope.tourGuide = {
                            fullName: orderHotel.customerName,
                            email: orderHotel.customerEmail,
                            phone: orderHotel.customerPhone,
                            orderStatus: orderHotel.orderStatus,
                            paymentMethod: orderHotel.paymentMethod
                        }
                        orderHotelDetailList.forEach(item => {
                            let roomTypeId = item.roomTypesByRoomTypeId.id;
                            let hotelId = item.roomTypesByRoomTypeId.hotelId;
                            let key = `${hotelId}-${roomTypeId}`;


                            if (!groupedRooms[key]) {
                                groupedRooms[key] = {
                                    roomTypeAvatar: item.roomTypesByRoomTypeId.roomTypeAvatar,
                                    roomTypeId: roomTypeId,
                                    hotelId: hotelId,
                                    roomTypeName: item.roomTypesByRoomTypeId.roomTypeName,
                                    totalAmount: item.amount,
                                    unitPrice: item.unitPrice,
                                    totalPrice: item.unitPrice * item.amount,
                                    checkIn: item.orderHotelsByOrderHotelId.checkIn,
                                    checkOut: item.orderHotelsByOrderHotelId.checkOut
                                };
                            } else {
                                groupedRooms[key].totalAmount += item.amount;
                                groupedRooms[key].totalPrice += item.unitPrice * item.amount;
                            }
                        });

                        $scope.orderHotelDetailList = Object.values(groupedRooms);
                    }
                }, errorCallback);

        }

        $scope.openModalPay = function () {
            $scope.closeModal()
            $('#modal-pay').modal('show');
        }

        /**
         * Phương thức đóng modal
         */
        $scope.closeModal = function () {
            $('#modal-order-hotel').modal('hide');
        };
        $scope.closeModalPay = function () {
            $('#modal-pay').modal('hide');
        };

        $scope.selectTourDetailId = () => {
            $scope.isLoading = true;
            TourDetailsServiceAD.findAllTourDetails().then(function (response) {
                $scope.tourDetails = response.data.data.content
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        $scope.selectTourDetailId()

    });
