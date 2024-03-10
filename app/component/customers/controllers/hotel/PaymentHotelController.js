travel_app.controller('PaymentHotelController', function ($scope, $anchorScroll, $window, $timeout, $routeParams, $rootScope,AuthService,GenerateCodePayService, OrderHotelService, Base64ObjectService, HotelServiceCT, RoomTypeServiceCT, PaymentMethodServiceCT) {
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
        checkInDateFiller: new Date(),
        checkOutDateFiller: new Date(),
        hotelIdFilter: null,
        page: 0,
        size: 10,
        sort: null
    }

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


    $scope.totalPriceAfterCancellations = function (roomTypes) {
        roomTypes.forEach(function (roomType) {
            $scope.totalPrice += roomType.price * roomType.amountRoomSelected;
        })

        console.log(roomTypes);
        // Ngày hiện tại
        $scope.currentDate = new Date();

        // Ngày hủy miễn phí
        $scope.checkInDateFiller = new Date($scope.filler.checkInDateFiller); // Chuyển đổi sang kiểu Date
        $scope.freeCancelDate = new Date($scope.checkInDateFiller.setDate($scope.checkInDateFiller.getDate() - 10)); // Trừ 10 ngày

        // Tính số ngày còn lại đến ngày hủy miễn phí
        $scope.remainingDays = Math.ceil(($scope.freeCancelDate - $scope.currentDate) / (1000 * 60 * 60 * 24));

        $scope.cancellationFee = 0;
        if ($scope.remainingDays > 10) {
            $scope.cancellationFee = 0;
        } else if ($scope.remainingDays > 7) {
            $scope.cancellationFee = 30;
        } else if ($scope.remainingDays > 5) {
            $scope.cancellationFee = 70;
        } else {
            $scope.cancellationFee = 100;
        }

        $scope.totalPriceAfterCancellation = $scope.totalPrice * ($scope.cancellationFee / 100);
    }

    $scope.totalPriceAfterCancellations($scope.roomTypes)

    PaymentMethodServiceCT.findAllPaymentMethod().then(function (response) {
        if (response.status === 200) {
            $scope.paymentMethods = response.data.data;
            console.log($scope.paymentMethods);
        } else {
            // Xử lý khi có lỗi từ server
        }
    })

    // window.addEventListener('beforeunload', function (event) {
    //     var confirmationMessage = "Bạn có chắc chắn muốn rời khỏi trang?";
    //
    //     (event || window.event).returnValue = confirmationMessage;
    //     return confirmationMessage;
    // });

    // window.addEventListener('popstate', function (event) {
    //     var confirmationMessage = "Bạn có chắc chắn muốn rời khỏi trang?";
    //     if (!confirm(confirmationMessage)) {
    //         history.pushState(null, null, window.location.href);
    //         event.preventDefault();
    //     }
    // });

    $scope.changePaymentMethod = function (paymentMethod) {
        $scope.paymentHotelCustomer.paymentMethod = paymentMethod;
        console.log($scope.paymentHotelCustomer);
    }

    $scope.submitPaymentHotel = function (paymentMethod) {
        if (paymentMethod === 'TTTT') {
            $scope.directPayment();
        } else if (paymentMethod === 'VNPay') {
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
            userId: GenerateCodePayService.generateCodeBooking('TTTT', $scope.roomTypes.id),
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
            $scope.orderRoomType.userId = user.id;
        }

        $scope.orderDetailsHotel = $scope.roomTypes.map(function(roomType) {
            return {
                roomTypeId: roomType.id,
                customerName: roomType.paymentHotelCustomer.customerName,
                customerEmail: roomType.paymentHotelCustomer.customerEmail,
                amount: roomType.amountRoomSelected,
            };
        });


        console.log($scope.orderRoomType);
        console.log($scope.orderDetailsHotel);
        OrderHotelService.createOrderHotel($scope.orderRoomType, $scope.orderDetailsHotel).then(function successCallBack(response) {
            if (response.status === 200) {
                toastAlert('success', 'Đặt khách sạn thành công !');
            }
        }).finally(function () {
            $scope.isLoading = false;
        });


    }

    $scope.paymentVNPay = function () {
        $scope.isLoading = true;
        $scope.orderRoomType = {
            id: GenerateCodePayService.generateCodeBooking('TTTT', $scope.roomTypes.id),
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
            $scope.orderRoomType.userId = user.id;
        }

        $scope.orderDetailsHotel = $scope.roomTypes.map(function(roomType) {
            return {
                roomTypeId: roomType.id,
                customerName: roomType.paymentHotelCustomer.customerName,
                customerEmail: roomType.paymentHotelCustomer.customerEmail,
                amount: roomType.amountRoomSelected,
                unitPrice: roomType.price
            };
        });


        console.log($scope.orderRoomType);
        console.log($scope.orderDetailsHotel);
        OrderHotelService.createOrderHotelWithVNPay($scope.orderRoomType, $scope.orderDetailsHotel).then(function successCallBack(response) {
            if (response.status === 200) {
                toastAlert('success', 'Đặt khách sạn thành công !');
            }
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