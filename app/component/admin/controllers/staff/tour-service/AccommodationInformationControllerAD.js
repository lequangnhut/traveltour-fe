travel_app.controller('AccommodationInformationControllerAD',
    function ($scope, $sce, $location, $routeParams, $timeout, Base64ObjectService,
              AccommodationInformationServiceAD, TourDetailsServiceAD) {
        $scope.isLoading = true;

        let searchTimeout;
        $scope.tourDetailIdEncode = $routeParams.tourDetailId;
        $scope.tourDetailId = Base64ObjectService.decodeObject($scope.tourDetailIdEncode);

        $scope.bookingTourHotelList = [];
        $scope.payment = 'VPO';
        $scope.currentPage = 0;
        $scope.pageSize = 5;

        const errorCallback = () => {
            $location.path('/admin/internal-server-error')
        }

        /**
         * Tìm tất cả dữ liệu bằng tourDetailId
         * @param response
         */
        $scope.bookingTourHotelData = (response) => {
            $scope.bookingTourHotelList = response.data.data !== null ? response.data.data.content : [];
            $scope.totalPages = response.data.data !== null ? Math.ceil(response.data.data.totalElements / $scope.pageSize) : 0;
            $scope.totalElements = response.data.data !== null ? response.data.data.totalElements : 0;
        };

        $scope.getBookingTourHotelList = () => {
            $scope.isLoading = true;

            AccommodationInformationServiceAD.getAllByInfo($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.tourDetailId, $scope.orderHotelStatus, $scope.searchTerm)
                .then((response) => {
                    $scope.bookingTourHotelData(response)
                }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        };

        /**
         * Tìm kiếm
         */
        $scope.searchBookingTour = () => {
            if (searchTimeout) $timeout.cancel(searchTimeout);

            searchTimeout = $timeout(() => {
                AccommodationInformationServiceAD.getAllByInfo($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, $scope.tourDetailId, $scope.orderHotelStatus, $scope.searchTerm)
                    .then((response) => {
                        $scope.bookingTourHotelData(response)
                    }, errorCallback);
            }, 500);
        };

        /**
         * Phân trang
         * @param page
         */
        $scope.setPage = (page) => {
            if (page >= 0 && page < $scope.totalPages) {
                $scope.currentPage = page;
                $scope.getBookingTourHotelList();
            }
        };

        $scope.getPaginationRange = () => {
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

        $scope.pageSizeChanged = () => {
            $scope.currentPage = 0;
            $scope.getBookingTourHotelList();
        };

        $scope.getDisplayRange = () => {
            return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.totalElements);
        };

        /**
         * Sắp xếp
         * @param column
         */
        $scope.sortData = (column) => {
            $scope.sortBy = column;
            $scope.sortDir = ($scope.sortDir === 'asc') ? 'desc' : 'asc';
            $scope.getBookingTourHotelList();
        };

        $scope.getSortIcon = (column) => {
            if ($scope.sortBy === column) {
                if ($scope.sortDir === 'asc') {
                    return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>');
                } else {
                    return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"/></svg>');
                }
            }
            return $sce.trustAsHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"/></svg>');
        };

        $scope.orderHotelChanged = () => {
            $scope.getBookingTourHotelList();
        };

        /**
         * Modal xem chi tiết tour detail
         */
        $scope.checkTourDetailModal = function () {
            $('#tourInformationModal').modal('show');

            TourDetailsServiceAD.findTourDetailById($scope.tourDetailId).then(function (response) {
                if (response.status === 200) {
                    $scope.tourDetailModal = response.data.data;
                } else {
                    $location.path('/admin/page-not-found');
                }
            })
        }

        $scope.getBookingTourHotelList();

        /**
         * Phương thức thanh toán khách sạn
         */
        $scope.pay = () => {
            const confirm = () => {
                AccommodationInformationServiceAD.pay($scope.tourDetailId, $scope.hotelId, $scope.payment).then(() => {
                    $timeout(() => {
                        toastAlert('success', 'Thanh toán thành công !');
                        $scope.orderHotelStatus = '1';
                        $scope.closeModal();
                        $scope.getBookingTourHotelList();
                    }, 0)``
                }, errorCallback);
            }

            confirmAlert('Bạn có chắc chắn muốn thanh toán đặt phòng của khách sạn này không ?', confirm);
        }

        /**
         * Phương thức hủy khách sạn
         */
        $scope.deactivateBookingTourHotel = () => {
            const confirm = () => {
                AccommodationInformationServiceAD.deactivate($scope.tourDetailId, $scope.hotelId).then(() => {
                    $timeout(() => {
                        toastAlert('success', 'Hủy khách sạn thành công !');
                        $scope.closeModal();
                        $scope.orderHotelStatus = '2';
                        $scope.getBookingTourHotelList();
                    }, 0)
                }, errorCallback);
            }

            confirmAlert('Bạn có chắc chắn muốn hủy đặt phòng của khách sạn này không ?', confirm);
        }

        /**
         * Phương thức mở modal
         */
        $scope.openModal = (hotelId) => {
            $('#modal-order-hotel').modal('show');

            $scope.hotelId = hotelId;

            if (!$scope.tourDetailId && !hotelId) return;

            AccommodationInformationServiceAD.getAllByTourDetailIdAndHotelId($scope.tourDetailId, hotelId)
                .then(response => {
                    if (response.status === 200) {
                        let orderHotelDetailList = response.data.data;
                        let groupedRooms = {};
                        let orderHotel = orderHotelDetailList[0].orderHotelsByOrderHotelId;
                        let totalRooms = 0; // Biến cho tổng số lượng phòng
                        let totalPrice = 0; // Biến cho tổng giá

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
                            let amount = item.amount;
                            let unitPrice = item.unitPrice;
                            let totalPriceForItem = unitPrice * amount;

                            totalRooms += amount; // Cộng dồn số lượng phòng
                            totalPrice += totalPriceForItem; // Cộng dồn tổng giá

                            if (!groupedRooms[key]) {
                                groupedRooms[key] = {
                                    roomTypeAvatar: item.roomTypesByRoomTypeId.roomTypeAvatar,
                                    roomTypeId: roomTypeId,
                                    hotelId: hotelId,
                                    roomTypeName: item.roomTypesByRoomTypeId.roomTypeName,
                                    totalAmount: amount,
                                    unitPrice: unitPrice,
                                    totalPrice: totalPriceForItem,
                                    checkIn: item.orderHotelsByOrderHotelId.checkIn,
                                    checkOut: item.orderHotelsByOrderHotelId.checkOut
                                };
                            } else {
                                groupedRooms[key].totalAmount += amount;
                                groupedRooms[key].totalPrice += totalPriceForItem;
                            }
                        });

                        $scope.orderHotelDetailList = Object.values(groupedRooms);
                        $scope.totalRooms = totalRooms; // Set tổng số lượng phòng vào $scope
                        $scope.totalPrice = totalPrice; // Set tổng giá vào $scope
                    }
                }, errorCallback);
        }

        /**
         * Phương thức đóng modal
         */
        $scope.closeModal = () => {
            $('#modal-order-hotel').modal('hide');
        };

        $scope.closeModalPay = () => {
            $('#modal-pay').modal('hide');
        };
    });
