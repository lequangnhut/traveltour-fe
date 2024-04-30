travel_app.controller('PaymentHotelController', function ($scope, $anchorScroll, $window, $location, $timeout, $routeParams, $rootScope, AuthService, WebSocketService, LocalStorageService, GenerateCodePayService, OrderHotelService, Base64ObjectService, HotelServiceCT, RoomTypeServiceCT, PaymentMethodServiceCT) {
    mapboxgl.accessToken = 'pk.eyJ1IjoicW5odXQxNyIsImEiOiJjbHN5aXk2czMwY2RxMmtwMjMxcGE1NXg4In0.iUd6-sHYnKnhsvvFuuB_bA';

    $anchorScroll();
    let user = AuthService.getUser();

    $scope.paymentHotelCustomer = {
        customerName: null,
        customerCitizenCard: null,
        customerPhone: null,
        customerEmail: null,
        capacityAdult: null,
        capacityKid: null,
        checkIn: null,
        checkOut: null,
        orderTotal: null,
        paymentMethod: null,
        orderCode: null,
        dateCreated: null,
        orderStatus: null,
        orderNote: null,
    }

    $scope.roomTypes = {
        id: null,
        roomTypeName: null,
        hotelId: null,
        capacityAdults: null,
        capacityChildren: null,
        bedTypeId: null,
        amountRoom: null,
        price: null,
        isActive: null,
        isDeleted: null,
        breakfastIncluded: false,
        freeCancellation: false,
        checkinTime: null,
        checkoutTime: null,
        roomTypeAvatar: null,
        roomTypeDescription: null,
        roomImagesById: [],
        roomUtilities: [],
        roomBedsById: {},
        listRoomTypeImg: [],
        amountRoomSelected: null,
        hotelsByHotelId: {
            id: null,
            hotelName: null,
            phoneNumber: null,
            website: null,
            province: null,
            district: null,
            ward: null,
            address: null,
            provinceName: null,
            districtName: null,
            wardName: null,
            floorNumber: null,
            avatarHotel: null,
            hotelType: null,
            agencyId: null,
            longitude: null,
            latitude: null,
            hotelTypesByHotelTypeId: {
                id: null, hotelTypeName: null, hotelsById: null,
            },

        },
        paymentHotelCustomer: {
            orderHotelId: null,
            roomTypeId: null,
            customerName: null,
            customerEmail: null,
            amount: null,
            unitPrice: null
        }
    }

    if (!localStorage.getItem('filterHotels')) {
        var today = new Date();

        var tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        $scope.filler = {
            priceFilter: 30000000,
            hotelTypeIdListFilter: [],
            placeUtilitiesIdListFilter: [],
            roomUtilitiesIdListFilter: [],
            breakfastIncludedFilter: null,
            freeCancellationFilter: null,
            roomBedsIdListFilter: [],
            amountRoomFilter: null,
            locationFilter: null,
            capacityAdultsFilter: 2,
            capacityChildrenFilter: 0,
            checkInDateFiller: today,
            checkOutDateFiller: tomorrow,
            hotelIdFilter: null,
            page: 0,
            size: 10,
            sort: null
        };

        $scope.filler.checkInDateFiller = new Date($scope.filler.checkInDateFiller);
        $scope.filler.checkOutDateFiller = new Date($scope.filler.checkOutDateFiller);

        $scope.filler.checkOutDateFiller.setDate($scope.filler.checkOutDateFiller.getDate() + 1);

        localStorage.setItem('filterHotels', JSON.stringify($scope.filler));
    }

    $scope.updateFilter = function() {
        $scope.fillerUpdate = JSON.parse(localStorage.getItem('filterHotels'));
        $scope.fillerUpdate.checkInDateFiller = $scope.filler.checkInDateFiller
        $scope.fillerUpdate.checkOutDateFiller = $scope.filler.checkOutDateFiller
        $scope.fillerUpdate.capacityChildrenFilter = $scope.filler.capacityChildrenFilter
        $scope.fillerUpdate.capacityAdultsFilter = $scope.filler.capacityAdultsFilter

        localStorage.setItem('filterHotels', JSON.stringify($scope.fillerUpdate));
    }

    $scope.filler = JSON.parse(localStorage.getItem('filterHotels'));
    $scope.filler.checkInDateFiller = new Date($scope.filler.checkInDateFiller);
    $scope.filler.checkOutDateFiller = new Date($scope.filler.checkOutDateFiller);
    $scope.daysBetween = Math.floor(($scope.filler.checkOutDateFiller - $scope.filler.checkInDateFiller) / (1000 * 60 * 60 * 24));

    $scope.totalPrice = 0;

    $scope.specialRequestHotel = null;
    $scope.remainingDays = new Date();
    $scope.cancellationFee = 0;
    $scope.totalPriceAfterCancellation = 0;
    $scope.paymentMethods = {}
    $scope.bookingForSelf = true;
    $scope.customerEmail = '';
    $scope.roomTypes = JSON.parse($window.localStorage.getItem('roomTypeSelected'))

    /**
     * Phương thức lấy tất cả các loại giường
     */
    HotelServiceCT.findAllRoomBedType().then(function successCallback(response) {
        if (response.status === 200) {
            $scope.bedTypes = response.data.data;
        } else {
            $location.path('/admin/internal-server-error');
        }
    })

    /**
     * Phương thức thay đổi id loại giường thành tên loại giường
     * @param bedTypeId id loại giường
     * @returns {null|*|string|string} tên loại giường
     */
    $scope.getRoomBedsName = function (bedTypeId) {
        if (Array.isArray($scope.bedTypes)) {
            var bedType = $scope.bedTypes.find(function (bedType) {
                return bedType.id === bedTypeId;
            });
            return bedType ? bedType.bedTypeName : '';
        } else {
            return '';
        }
    }

    /**
     * Phương thức lấy tổng số tiền sau khi hủy phòng
     * @param roomTypes
     */
    $scope.totalPriceAfterCancellations = function (roomTypes) {
        roomTypes.forEach(function (roomType) {
            $scope.totalPrice += roomType.price * roomType.amountRoomSelected;
        })

        console.log(roomTypes);
        // Ngày hiện tại
        $scope.currentDate = new Date();

        // Ngày hủy miễn phí
        $scope.checkInDateFiller = new Date($scope.filler.checkInDateFiller); // Chuyển đổi sang kiểu Date
        $scope.freeCancelDate = new Date($scope.checkInDateFiller.setDate($scope.checkInDateFiller.getDate() - 5)); // Trừ 10 ngày

        // Tính số ngày còn lại đến ngày hủy miễn phí
        $scope.remainingDays = Math.ceil(($scope.freeCancelDate - $scope.currentDate) / (1000 * 60 * 60 * 24));

        $scope.cancellationFee = 0;
        if ($scope.remainingDays > 5) {
            $scope.cancellationFee = 0;
        } else if ($scope.remainingDays > 4) {
            $scope.cancellationFee = 50;
        } else if ($scope.remainingDays > 1) {
            $scope.cancellationFee = 80;
        } else {
            $scope.cancellationFee = 100;
        }

        $scope.totalPriceAfterCancellation = $scope.totalPrice * ($scope.cancellationFee / 100);
    }

    $scope.totalPriceAfterCancellations($scope.roomTypes)

    /**
     * Phương thức tìm kiếm tât cả phương thức thanh toán
     */
    PaymentMethodServiceCT.findAllPaymentMethod().then(function (response) {
        if (response.status === 200) {
            $scope.paymentMethods = response.data.data;
            console.log($scope.paymentMethods);
        } else {
            // Xử lý khi có lỗi từ server
        }
    })

    /**
     * Phương thức lựa chọn phương thức thanh toán
     * @param paymentMethod
     */
    $scope.changePaymentMethod = function (paymentMethod) {
        $scope.paymentHotelCustomer.paymentMethod = paymentMethod;
        console.log($scope.paymentHotelCustomer.paymentMethod);
    }

    $scope.visibilityOption = 'hide';

    $scope.toggleCardVisibility = function (value) {
        $scope.isCardVisible = (value === 'show');
    };


    $scope.submitPaymentHotel = function (paymentMethod) {
        console.log(paymentMethod)
        if (paymentMethod === 'VPO') {
            $scope.directPayment();
        } else if (paymentMethod === 'VNPAY') {
            $scope.paymentVNPay();
        }
        // else if (paymentMethod === 'ZaloPay') {
        //     $scope.paymentZaLoPay();
        // } else if (paymentMethod === 'Momo') {
        //     $scope.paymentMomo();
        // }

    }

    // ======= Từ chổ này viết hàm để gọi vào submitBooking =======
    $scope.directPayment = function () {
        $scope.isLoading = true;
        $scope.orderRoomType = {
            id: GenerateCodePayService.generateCodePayment($scope.paymentHotelCustomer.paymentMethod),
            customerName: $scope.paymentHotelCustomer.customerName,
            customerCitizenCard: $scope.paymentHotelCustomer.customerCitizenCard,
            customerPhone: $scope.paymentHotelCustomer.customerPhone,
            customerEmail: $scope.paymentHotelCustomer.customerEmail,
            capacityAdult: $scope.filler.capacityAdultsFilter,
            capacityKid: $scope.filler.capacityChildrenFilter,
            checkIn: $scope.filler.checkInDateFiller,
            checkOut: $scope.filler.checkOutDateFiller,
            orderTotal: null,
            paymentMethod: $scope.paymentHotelCustomer.paymentMethod,
            orderNote: $scope.paymentHotelCustomer.orderNote
        }

        if (user !== null) {
            if (user.roles.some(role => role.nameRole === 'ROLE_CUSTOMER')) {
                $scope.orderRoomType.userId = user.id;
            } else {
                LocalStorageService.remove('user');
            }
        }

        $scope.orderDetailsHotel = $scope.roomTypes.map(function (roomType) {
            var orderDetail = {
                roomTypeId: roomType.id,
                amount: roomType.amountRoomSelected
            };

            if ($scope.visibilityOption === 'show') {
                orderDetail.customerName = roomType.paymentHotelCustomer.customerName || "";
                orderDetail.customerEmail = roomType.paymentHotelCustomer.customerEmail || "";
            }

            return orderDetail;
        });

        OrderHotelService.createOrderHotel($scope.orderRoomType, $scope.orderDetailsHotel).then(function successCallBack(response) {
            console.log(response)
            if (response.data.status === '200') {
                let baseUrl = response.data.data
                toastAlert('success', 'Đặt khách sạn thành công !');
                $scope.playSuccessSound()
                $location.path(baseUrl);
            } else if (response.data.status === '400') {
                Swal.fire({
                    icon: "error",
                    title: "Đặt phòng thất bại",
                    text: response.data.message,
                });
                $scope.playErrorSound()
                $location.path('/hotel')
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Đặt phòng thất bại",
                    text: 'Vui lòng thử lại sau ít phút',
                });
                $scope.playErrorSound()
            }
        }).finally(function () {
            $scope.isLoading = false;
        });
    }

    $scope.paymentVNPay = function () {
        $scope.isLoading = true;
        $scope.orderRoomType = {
            id: GenerateCodePayService.generateCodePayment($scope.paymentHotelCustomer.paymentMethod),
            customerName: $scope.paymentHotelCustomer.customerName,
            customerCitizenCard: $scope.paymentHotelCustomer.customerCitizenCard,
            customerPhone: $scope.paymentHotelCustomer.customerPhone,
            customerEmail: $scope.paymentHotelCustomer.customerEmail,
            capacityAdult: $scope.filler.capacityAdultsFilter,
            capacityKid: $scope.filler.capacityChildrenFilter,
            checkIn: $scope.filler.checkInDateFiller,
            checkOut: $scope.filler.checkOutDateFiller,
            orderTotal: null,
            paymentMethod: $scope.paymentHotelCustomer.paymentMethod,
            orderNote: $scope.paymentHotelCustomer.orderNote
        }

        if (user !== null) {
            if (user.roles.some(role => role.nameRole === 'ROLE_CUSTOMER')) {
                $scope.orderRoomType.userId = user.id;
            } else {
                LocalStorageService.remove('user');
            }
        }

        $scope.orderDetailsHotel = $scope.roomTypes.map(function (roomType) {
            var orderDetail = {
                roomTypeId: roomType.id,
                amount: roomType.amountRoomSelected
            };

            if ($scope.visibilityOption === 'show') {
                if (roomType.paymentHotelCustomer && roomType.paymentHotelCustomer.customerName != null) {
                    orderDetail.customerName = roomType.paymentHotelCustomer.customerName;
                } else {
                    orderDetail.customerName = null;
                }

                if (roomType.paymentHotelCustomer && roomType.paymentHotelCustomer.customerEmail != null) {
                    orderDetail.customerEmail = roomType.paymentHotelCustomer.customerEmail;
                } else {
                    orderDetail.customerEmail = null;
                }
            }

            return orderDetail;
        });


        console.log($scope.orderRoomType);
        console.log($scope.orderDetailsHotel);
        OrderHotelService.createOrderHotelWithVNPay($scope.orderRoomType, $scope.orderDetailsHotel).then(function successCallBack(response) {
            if (response.status === 200) {
                $window.location.href = response.data.redirectUrl;
            } else if (response.status === 400) {
                Swal.fire({
                    icon: "error",
                    title: "Đặt phòng thất bại",
                    text: "Phòng này đã có người nhanh tay hơn đặt trước bạn rồi, nhưng đừng lo bạn có thể chọn phòng khác",
                });
                $scope.playErrorSound()
                $location.path('/hotel')
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Xảy ra lỗi khi đặt phòng",
                    text: "Bạn có thể thử lại sau ít phút hoặc liên hệ với chúng tôi",
                });
                $scope.playErrorSound()
            }
            console.log(response)
        }).finally(function () {
            $scope.isLoading = false;
        });
    }
    //
    // $scope.paymentZaLoPay = function () {
    //     $scope.isLoading = true;
    //
    //     if (user !== null) {
    //         $scope.bookings_tour.userId = user.id;
    //     }
    //
    //     let ticket = $scope.ticket;
    //     let email = $scope.bookings_tour.customerEmail;
    //     let totalPrice = $scope.totalPrice;
    //     let tourDetail = $scope.tourDetail;
    //     let bookingTourId = GenerateCodePayService.generateCodeBooking('ZALOPAY', tourDetail.id);
    //
    //     $scope.bookings_tour.id = bookingTourId;
    //     $scope.bookings_tour.capacityAdult = ticket.adults;
    //     $scope.bookings_tour.capacityKid = ticket.children;
    //     $scope.bookings_tour.capacityBaby = ticket.baby;
    //     $scope.bookings_tour.orderTotal = totalPrice;
    //     $scope.bookings_tour.paymentMethod = 2; // 2: ZALOPAY
    //     $scope.bookings_tour.orderCode = GenerateCodePayService.generateCodePayment('ZALOPAY');
    //
    //     function confirmBookTour() {
    //         let paymentData = {
    //             amount: totalPrice,
    //             bookingTourId: bookingTourId
    //         }
    //
    //         BookingTourServiceCT.redirectZALOPay(paymentData).then(function successCallBack(response) {
    //             if (response.status === 200) {
    //                 $window.location.href = response.data.data;
    //                 $scope.bookingCustomerList.splice(0, $scope.bookingCustomerList.length);
    //             } else {
    //                 $location.path('/admin/page-not-found')
    //             }
    //         }, errorCallback).finally(function () {
    //             $scope.isLoading = false;
    //         });
    //     }
    //
    //     confirmAlert('Bạn có chắc chắn địa chỉ email: ' + email + ' là chính xác không ?', confirmBookTour);
    // }
    //
    // $scope.paymentMomo = function () {
    //     $scope.isLoading = true;
    //
    //     if (user !== null) {
    //         $scope.bookings_tour.userId = user.id;
    //     }
    //
    //     let ticket = $scope.ticket;
    //     let email = $scope.bookings_tour.customerEmail;
    //     let totalPrice = $scope.totalPrice;
    //     let tourDetail = $scope.tourDetail;
    //     let bookingTourId = GenerateCodePayService.generateCodeBooking('MOMO', tourDetail.id);
    //
    //     $scope.bookings_tour.id = bookingTourId;
    //     $scope.bookings_tour.capacityAdult = ticket.adults;
    //     $scope.bookings_tour.capacityKid = ticket.children;
    //     $scope.bookings_tour.capacityBaby = ticket.baby;
    //     $scope.bookings_tour.orderTotal = totalPrice;
    //     $scope.bookings_tour.paymentMethod = 3; // 3: MOMO
    //     $scope.bookings_tour.orderCode = GenerateCodePayService.generateCodePayment('MOMO');
    //
    //     function confirmBookTour() {
    //         let bookingDto = {
    //             bookingToursDto: $scope.bookings_tour,
    //             bookingTourCustomersDto: $scope.bookingCustomerList
    //         }
    //
    //         BookingTourServiceCT.redirectMomo(totalPrice, bookingTourId).then(function successCallBack(response) {
    //             if (response.status === 200) {
    //                 LocalStorageService.set('bookingDto', bookingDto);
    //                 LocalStorageService.set('bookingTicket', bookingDto.bookingToursDto);
    //
    //                 $window.location.href = response.data.redirectUrl;
    //                 $scope.bookingCustomerList.splice(0, $scope.bookingCustomerList.length);
    //             } else {
    //                 $location.path('/admin/page-not-found')
    //             }
    //         }, errorCallback).finally(function () {
    //             $scope.isLoading = false;
    //         });
    //     }
    //
    //     confirmAlert('Bạn có chắc chắn địa chỉ email: ' + email + ' là chính xác không ?', confirmBookTour);
    // }
});