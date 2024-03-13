travel_app.controller('HotelPaymentControllerAD', function ($scope, $location, $routeParams, $sce, OrderHotelServiceAD, OrderHotelDetailServiceAD, CustomerServiceAD, TourDetailsServiceAD, LocalStorageService, GenerateCodePayService) {
    $scope.showActivities = false;
    const tourDetailId = $routeParams.tourDetailId;
    $scope.tourDetailId = tourDetailId;
    $scope.hotelId = $routeParams.hotelId;
    $scope.tourGuide = {};
    $scope.orderHotel = {};
    $scope.selectedRooms = JSON.parse(sessionStorage.getItem('selectedRooms')) || [];
    $scope.infoHotel = JSON.parse(sessionStorage.getItem('infoHotel')) || {};
    $scope.totalBeforeTax = 0;
    $scope.VATRate = 8; // 8% VAT
    $scope.discountRate = 0; // 0% Discount for now
    $scope.VATAmount = 0;
    $scope.discountAmount = 0;
    $scope.total = calculateTotal($scope.selectedRooms);

    $scope.checkPrivatePolicy = false;
    $scope.selectedPaymentMethod = '';
    $scope.selectedContent = '';

    $scope.service = {
        discountCode: null, paymentMethod: null
    }

    $scope.paymentMethods = {
        VNPay: "TravelTour chấp nhận thanh toán bằng các thẻ ATM nội địa do các ngân hàng tại Việt Nam phát hành. Thẻ ghi nợ nội địa (thẻ ATM): Vietcombank, Vietinbank, DongA , VIBank, Techcombank, HDBank, Tienphong Bank, Military Bank, VietA Bank, Maritime Bank, Eximbank, SHB, Sacombank,  NamA Bank,...(23 Ngân hàng)",
        ZaloPay: "TravelTour chấp nhận thanh toán bằng ZaloPay.",
        Momo: "TravelTour chấp nhận thanh toán bằng Ví điện tử Momo. (*) Hạn mức tối đa là 20.000.000 VND",
        Travel: "Quý khách vui lòng đến các văn phòng TravelTour để thanh toán và nhận vé."
    };

    function calculateTotal(rooms) {
        $scope.totalBeforeTax = rooms.reduce((acc, room) => acc + room.price * room.quantity, 0);
        $scope.VATAmount = $scope.totalBeforeTax * ($scope.VATRate / 100);
        $scope.discountAmount = $scope.totalBeforeTax * ($scope.discountRate / 100);

        return $scope.totalBeforeTax + $scope.VATAmount - $scope.discountAmount;
    }

    if (tourDetailId !== undefined && tourDetailId !== null && tourDetailId !== "") {
        TourDetailsServiceAD.findTourDetailById(tourDetailId).then(async response => {
            $scope.tourGuideId = response.data.data.guideId;
            if ($scope.tourGuideId) {
                const guideResponse = await CustomerServiceAD.findCustomerById($scope.tourGuideId);
                $scope.tourGuide = guideResponse.data.data;
                $scope.$apply()
            }
        })
    }

    $scope.ConfirmationOfCompleteBooking = () => {
        if (!$scope.service.paymentMethod) {
            centerAlert('Xác nhận !', 'Vui lòng chọn phương thức thanh toán.', 'warning')
        } else if ($scope.checkPrivatePolicy === false) {
            centerAlert('Xác nhận !', 'Vui lòng chấp nhận điều khoản, điều kiện.', 'warning')
        } else {
            LocalStorageService.set('serviceCustomer', $scope.service);
            confirmAlert('Bạn có chắc chắn muốn đặt phòng không ?', () => {
                $scope.submitBooking()
            });
        }
    }

    const errorCallback = () => {
        $location.path('/admin/internal-server-error')
    }

    //thanh toan
    $scope.submitDiscountCode = () => {
        let discountCode = $scope.service.discountCode;
    }

    $scope.showContent = (paymentMethod) => {
        $scope.selectedContent = $sce.trustAsHtml($scope.paymentMethods[paymentMethod]);
    };


    $scope.submitBooking = () => {
        let paymentMethod = LocalStorageService.get('serviceCustomer').paymentMethod;

        if (paymentMethod === 'Travel') {
            $scope.paymentTravel();
        } else if (paymentMethod === 'VNPay') {
            $scope.paymentVNPay();
        } else if (paymentMethod === 'ZaloPay') {
            $scope.paymentZaLoPay();
        } else if (paymentMethod === 'Momo') {
            $scope.paymentMomo();
        }

    }

    $scope.paymentTravel = () => {
        $scope.isLoading = true;

        $scope.orderHotel = {
            id: GenerateCodePayService.generateCodeBooking('TTTT', $scope.hotelId),
            userId: $scope.tourGuide.id,
            customerName: $scope.tourGuide.fullName,
            customerCitizenCard: $scope.tourGuide.citizenCard,
            customerPhone: $scope.tourGuide.phone,
            customerEmail: $scope.tourGuide.email,
            capacityAdult: $scope.infoHotel.capacityAdult,
            capacityKid: $scope.infoHotel.capacityKid,
            checkIn: JSON.parse(sessionStorage.getItem('infoHotel')).departureDate,
            checkOut: JSON.parse(sessionStorage.getItem('infoHotel')).arrivalDate,
            orderTotal: $scope.total,
            paymentMethod: 'TTTT',
            dateCreated: new Date(),
            orderStatus: 0, //cho thanh toan
        }

        let orderHotel = $scope.orderHotel;
        const dataOrderHotel = new FormData();

        dataOrderHotel.append("orderHotelsDto", new Blob([JSON.stringify(orderHotel)], {type: "application/json"}));
        dataOrderHotel.append("tourDetailId", tourDetailId);

        OrderHotelServiceAD.createOrderHotel(dataOrderHotel).then((repo) => {
            let orderHotelId = repo.data.data.id;
            $scope.selectedRooms.forEach(item => {
                let orderHotelDetail = {
                    orderHotelId: orderHotelId, roomTypeId: item.id, amount: item.quantity, unitPrice: item.price,
                }
                const dataOrderHotelDetail = new FormData();
                dataOrderHotelDetail.append("orderHotelDetailsDto", new Blob([JSON.stringify(orderHotelDetail)], {type: "application/json"}));
                OrderHotelDetailServiceAD.createOrderHotelDetail(dataOrderHotelDetail).then(() => {
                })
            })
            toastAlert('success', 'Thêm mới thành công !');
            $location.path(`/admin/detail-tour-list/${tourDetailId}/service-list/hotel-list`);
        }, errorCallback).finally(() => {
            $scope.isLoading = false;
        });
    }

    $scope.paymentVNPay = () => {
        // if (user !== null) {
        //     if (user.roles.some(role => role.nameRole === 'ROLE_CUSTOMER')) {
        //         $scope.bookings_tour.userId = user.id;
        //     } else {
        //         LocalStorageService.remove('user');
        //     }
        // }

        let ticket = $scope.ticket;
        let email = $scope.ticket;
        let totalPrice = $scope.ticket;
        let tourDetail = $scope.ticket;
        let bookingTourId = GenerateCodePayService.generateCodeBooking('VNPAY', 1);

        // $scope.bookings_tour.id = bookingTourId;
        // $scope.bookings_tour.capacityAdult = ticket.adults;
        // $scope.bookings_tour.capacityKid = ticket.children;
        // $scope.bookings_tour.capacityBaby = ticket.baby;
        // $scope.bookings_tour.orderTotal = totalPrice;
        // $scope.bookings_tour.paymentMethod = 1; // 1: VNPay
        // $scope.bookings_tour.orderCode = GenerateCodePayService.generateCodePayment('VNPAY');

        const confirmBookTour = () => {
            $scope.isLoading = true;

            let bookingDto = {
                bookingToursDto: $scope.bookings_tour, bookingTourCustomersDto: $scope.bookingCustomerList
            }

            BookingTourCusService.redirectVNPay(1, bookingTourId).then((response) => {
                if (response.status === 200) {
                    LocalStorageService.set('bookingDto', bookingDto);
                    LocalStorageService.set('bookingTicket', bookingDto.bookingToursDto);

                    $window.location.href = response.data.redirectUrl;
                    $scope.bookingCustomerList.splice(0, $scope.bookingCustomerList.length);
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn địa chỉ email: ' + email + ' là chính xác không ?', confirmBookTour);
    }

    $scope.paymentZaLoPay = () => {
        if (user !== null) {
            if (user.roles.some(role => role.nameRole === 'ROLE_CUSTOMER')) {
                $scope.bookings_tour.userId = user.id;
            } else {
                LocalStorageService.remove('user');
            }
        }

        let ticket = $scope.ticket;
        let email = $scope.bookings_tour.customerEmail;
        let totalPrice = $scope.totalPrice;
        let tourDetail = $scope.tourDetail;
        let bookingTourId = GenerateCodePayService.generateCodeBooking('ZALOPAY', tourDetail.id);

        $scope.bookings_tour.id = bookingTourId;
        $scope.bookings_tour.capacityAdult = ticket.adults;
        $scope.bookings_tour.capacityKid = ticket.children;
        $scope.bookings_tour.capacityBaby = ticket.baby;
        $scope.bookings_tour.orderTotal = totalPrice;
        $scope.bookings_tour.paymentMethod = 2; // 2: ZALOPAY
        $scope.bookings_tour.orderCode = GenerateCodePayService.generateCodePayment('ZALOPAY');

        const confirmBookTour = () => {
            $scope.isLoading = true;

            let paymentData = {
                amount: totalPrice, bookingTourId: bookingTourId
            }

            BookingTourCusService.redirectZALOPay(paymentData).then((response) => {
                if (response.status === 200) {
                    $window.location.href = response.data.data;
                    $scope.bookingCustomerList.splice(0, $scope.bookingCustomerList.length);
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn địa chỉ email: ' + email + ' là chính xác không ?', confirmBookTour);
    }

    $scope.paymentMomo = () => {
        if (user !== null) {
            if (user.roles.some(role => role.nameRole === 'ROLE_CUSTOMER')) {
                $scope.bookings_tour.userId = user.id;
            } else {
                LocalStorageService.remove('user');
            }
        }

        let ticket = $scope.ticket;
        let email = $scope.bookings_tour.customerEmail;
        let totalPrice = $scope.totalPrice;
        let tourDetail = $scope.tourDetail;
        let bookingTourId = GenerateCodePayService.generateCodeBooking('MOMO', tourDetail.id);

        $scope.bookings_tour.id = bookingTourId;
        $scope.bookings_tour.capacityAdult = ticket.adults;
        $scope.bookings_tour.capacityKid = ticket.children;
        $scope.bookings_tour.capacityBaby = ticket.baby;
        $scope.bookings_tour.orderTotal = totalPrice;
        $scope.bookings_tour.paymentMethod = 3; // 3: MOMO
        $scope.bookings_tour.orderCode = GenerateCodePayService.generateCodePayment('MOMO');

        const confirmBookTour = () => {
            $scope.isLoading = true;

            let bookingDto = {
                bookingToursDto: $scope.bookings_tour, bookingTourCustomersDto: $scope.bookingCustomerList
            }

            BookingTourCusService.redirectMomo(tourDetail.id, bookingTourId).then((response) => {
                if (response.status === 200) {
                    LocalStorageService.set('bookingDto', bookingDto);
                    LocalStorageService.set('bookingTicket', bookingDto.bookingToursDto);

                    $window.location.href = response.data.redirectUrl;
                    $scope.bookingCustomerList.splice(0, $scope.bookingCustomerList.length);
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback).finally(() => {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn địa chỉ email: ' + email + ' là chính xác không ?', confirmBookTour);
    }

    $scope.$on('$routeChangeStart', (event, next, current) => {
        if (next.controller !== 'BookingTourCusController' && next.controller !== 'LoginController') {
            LocalStorageService.remove('redirectAfterLogin');
        }
    });

});
