travel_app.controller('HotelForTourGuideController',
    function ($scope, $sce, $location, $routeParams, $timeout, GuideService, LocalStorageService, Base64ObjectService, AccommodationInformationServiceAD) {
        $scope.isLoading = true;

        let searchTimeout;

        $scope.bookingTourHotelList = [];
        $scope.payment = 'TTTT';
        $scope.currentPage = 0;
        $scope.pageSize = 5;

        // $scope.tourDetailId = null;
        let tourDetailId = Base64ObjectService.decodeObject($routeParams.id);
        const errorCallback = () => {
            $location.path('/admin/internal-server-error')
        }

        $scope.getNavItem = LocalStorageService.get('activeNavItem');
        if ($scope.getNavItem === 'guide-future') {
            $scope.goBack = 'guide-future';
        } else if ($scope.getNavItem === 'guide-continuous') {
            $scope.goBack = 'guide-continuous';
        } else if ($scope.getNavItem === 'guide-perfect') {
            $scope.goBack = 'guide-perfect';
        } else if ($scope.getNavItem === 'guide-cancel') {
            $scope.goBack = 'guide-cancel';
        }

        //phân trang
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

        $scope.bookingTourHotelData = (response) => {
            $scope.bookingTourHotelList = response.data.data !== null ? response.data.data.content : [];
            $scope.totalPages = response.data.data !== null ? Math.ceil(response.data.data.totalElements / $scope.pageSize) : 0;
            $scope.totalElements = response.data.data !== null ? response.data.data.totalElements : 0;
        };

        $scope.getBookingTourHotelList = () => {
            $scope.isLoading = true;
            GuideService.getAllHotelForGuide($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, tourDetailId, '')
                .then((response) => {
                    $scope.bookingTourHotelData(response)
                }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        };

        //sắp xếp
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

        $scope.getBookingTourHotelList();

        $scope.searchBookingTour = () => {
            if (searchTimeout) $timeout.cancel(searchTimeout);

            searchTimeout = $timeout(() => {
                GuideService.getAllHotelForGuide($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortDir, tourDetailId, $scope.searchTerm)

                    .then((response) => {
                        $scope.bookingTourHotelData(response)
                    }, errorCallback);
            }, 500);
        };

        /**
         * MODAL KHÁCH SẠN
         */
        $scope.openModal = (hotelId, id) => {

            $('#modal-order-hotel').modal('show');

            $scope.hotelId = hotelId;

            if (!$scope.tourDetailId && !hotelId) return;

            AccommodationInformationServiceAD.getAllByTourDetailIdAndHotelId(tourDetailId, hotelId)
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

        $scope.closeModal = () => {
            $('#modal-order-hotel').modal('hide');
        };

        /**
         * MODAL PHƯƠNG TIỆN
         */
        $scope.openCarModal = (data) => {
            $('#modal-order-transportation-schedule').modal('show');
            $scope.transportationSchedule = data;
            $scope.transportationScheduleId = data.id;
            $scope.tourGuide = data.orderTransportationsById[0];
        }


        $scope.closeCarModal = () => {
            $('#modal-order-transportation-schedule').modal('hide');
        };

        /**
         * MODAL THAM QUAN
         */
        $scope.openVisitModal = (visit) => {
            $('#modal-order-visit').modal('show');
            $scope.visit = visit;
            if (!tourDetailId && !visit.id) return;

            GuideService.getAllVisitByTourDetailIdAndVisitId(tourDetailId, visit.id)
                .then(response => {
                    if (response.status === 200) {
                        $timeout(() => {
                            $scope.orderVisitDetailList = response.data.data;

                            let orderCustomer = $scope.orderVisitDetailList[0].orderVisitsByOrderVisitId;
                            $scope.totalPrice = $scope.orderVisitDetailList[0].orderVisitsByOrderVisitId.orderTotal;

                            $scope.tourGuide = {
                                customerName: orderCustomer.customerName,
                                customerEmail: orderCustomer.customerEmail,
                                customerPhone: orderCustomer.customerPhone,
                                paymentMethod: orderCustomer.paymentMethod,
                                orderStatus: orderCustomer.orderStatus
                            };
                        }, 0)

                    }
                }, errorCallback);
        }

        /**
         * Phương thức đóng modal
         */
        $scope.closeVisitModal = () => {
            $('#modal-order-visit').modal('hide');
        };

    });
