travel_app.controller('BookingTourCusController', function ($scope, $sce, $location, $window, $routeParams, $anchorScroll, AuthService, LocalStorageService, BookingTourServiceCT, GenerateCodePayService) {
    $anchorScroll();

    let user = AuthService.getUser();
    let tourDetailId = $routeParams.id;

    if (!user) {
        LocalStorageService.set('redirectAfterLogin', $location.path());
    }

    $scope.checkPrivatePolicy = false;
    $scope.selectedPaymentMethod = '';
    $scope.selectedContent = '';

    $scope.bookingCustomerList = [];

    $scope.paymentMethods = {
        VNPay: "TravelTour chấp nhận thanh toán bằng các thẻ ATM nội địa do các ngân hàng tại Việt Nam phát hành. Thẻ ghi nợ nội địa (thẻ ATM): Vietcombank, Vietinbank, DongA , VIBank, Techcombank, HDBank, Tienphong Bank, Military Bank, VietA Bank, Maritime Bank, Eximbank, SHB, Sacombank,  NamA Bank,...(23 Ngân hàng)",
        ZaloPay: "TravelTour chấp nhận thanh toán bằng ZaloPay.",
        Momo: "TravelTour chấp nhận thanh toán bằng Ví điện tử Momo. (*) Hạn mức tối đa là 20.000.000 VND",
        Travel: "Quý khách vui lòng đến các văn phòng TravelTour để thanh toán và nhận vé."
    };

    $scope.service = {
        discountCode: null,
        paymentMethod: null
    }

    $scope.bookings_tour = {
        id: null,
        userId: null,
        tourDetailId: tourDetailId,
        customerName: null,
        customerCitizenCard: null,
        customerPhone: null,
        customerEmail: null,
        capacityAdult: null,
        capacityKid: null,
        capacityBaby: null,
        orderTotal: null,
        paymentMethod: null,
        orderCode: null,
        orderNote: null
    }

    $scope.bookings_tour_customer = {
        id: null,
        bookingTourId: null,
        customerName: null,
        customerBirth: null,
        customerPhone: null
    }

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.showContent = function (paymentMethod) {
        $scope.selectedContent = $sce.trustAsHtml($scope.paymentMethods[paymentMethod]);
    };

    $scope.isBirthDateInvalid = function (birthDate) {
        let selectedDate = new Date(birthDate);
        let currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() - 2);
        return selectedDate >= currentDate;
    };

    $scope.init = function () {
        let dataBooking = LocalStorageService.get('dataBooking');
        let bookingTicket = LocalStorageService.get('bookingTicket');

        if (dataBooking === null && bookingTicket === null) {
            toastAlert('warning', 'Booking không tồn tại !');
            $location.path('/home');
            return;
        }

        $scope.ticket = LocalStorageService.get('dataBooking').ticket;
        $scope.totalPrice = LocalStorageService.get('dataBooking').totalPrice;
        $scope.tourDetail = LocalStorageService.get('dataBooking').tourDetail;
        $scope.provinceName = LocalStorageService.get('dataBooking').provinceName;

        $scope.totalQuantity = Object.values($scope.ticket).reduce((total, value) => total + parseInt(value), 0);
        $scope.ticketArray = Array.from({length: $scope.totalQuantity}, (_, index) => index);
    }

    $scope.submitDiscountCode = function () {
        let discountCode = $scope.service.discountCode;
    }

    $scope.acceptPassForm = function () {
        if (!$scope.service.paymentMethod) {
            centerAlert('Xác nhận !', 'Vui lòng chọn phương thức thanh toán.', 'warning')
        } else if ($scope.checkPrivatePolicy === false) {
            centerAlert('Xác nhận !', 'Vui lòng chấp nhận điều khoản, điều kiện.', 'warning')
        } else {
            LocalStorageService.set('serviceCustomer', $scope.service);
            $location.path('/tours/tour-detail/' + $scope.tourDetail.id + '/booking-tour/customer-information');
        }
    };

    $scope.submitBooking = function () {
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

        $scope.addCustomerToList();
    }

    $scope.addCustomerToList = function () {
        let widgets = document.querySelectorAll('.sidebar-widget.category-widget.mb-30');
        widgets.forEach(function (widget, index) {
            let customer = {};

            let inputs = widget.querySelectorAll('input[type="text"], input[type="date"], input[type="tel"]');
            let hasValidData = false;
            inputs.forEach(function (input) {
                let key = input.getAttribute('name').replace('customer', '');
                let value = input.value;
                if (value.trim() !== '') {
                    hasValidData = true;
                }
                customer[key] = value;
            });

            if (hasValidData) {
                $scope.bookingCustomerList.push(customer);
            }
        });
    };

    $scope.init();

    // ======= Từ chổ này viết hàm để gọi vào submitBooking =======
    $scope.paymentTravel = function () {
        $scope.isLoading = true;

        if (user !== null) {
            $scope.bookings_tour.userId = user.id;
        }

        let ticket = $scope.ticket;
        let email = $scope.bookings_tour.customerEmail;
        let totalPrice = $scope.totalPrice;
        let tourDetail = $scope.tourDetail;

        $scope.bookings_tour.id = GenerateCodePayService.generateCodeBooking('VPO', tourDetail.id);
        $scope.bookings_tour.capacityAdult = ticket.adults;
        $scope.bookings_tour.capacityKid = ticket.children;
        $scope.bookings_tour.capacityBaby = ticket.baby;
        $scope.bookings_tour.orderTotal = totalPrice;
        $scope.bookings_tour.paymentMethod = 0; // 0: travel
        $scope.bookings_tour.orderCode = GenerateCodePayService.generateCodePayment('VPO');

        let bookingDto = {
            bookingToursDto: $scope.bookings_tour,
            bookingTourCustomersDto: $scope.bookingCustomerList
        }

        function confirmBookTour() {
            BookingTourServiceCT.createBookTour(bookingDto).then(function successCallBack(response) {
                if (response.status === 200) {
                    let bookingTicket = response.data.data.bookingToursDto;
                    LocalStorageService.set('bookingTicket', bookingTicket);

                    toastAlert('success', 'Đặt tour thành công !');
                    $location.path('/tours/tour-detail/' + tourDetail.id + '/booking-tour/customer-information/check-information');
                    $scope.bookingCustomerList.splice(0, $scope.bookingCustomerList.length);
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn địa chỉ email: ' + email + ' là chính xác không ?', confirmBookTour);
    }

    $scope.paymentVNPay = function () {
        $scope.isLoading = true;

        if (user !== null) {
            $scope.bookings_tour.userId = user.id;
        }

        let ticket = $scope.ticket;
        let email = $scope.bookings_tour.customerEmail;
        let totalPrice = $scope.totalPrice;
        let tourDetail = $scope.tourDetail;
        let bookingTourId = GenerateCodePayService.generateCodeBooking('VNPAY', tourDetail.id);

        $scope.bookings_tour.id = bookingTourId;
        $scope.bookings_tour.capacityAdult = ticket.adults;
        $scope.bookings_tour.capacityKid = ticket.children;
        $scope.bookings_tour.capacityBaby = ticket.baby;
        $scope.bookings_tour.orderTotal = totalPrice;
        $scope.bookings_tour.paymentMethod = 1; // 1: VNPay
        $scope.bookings_tour.orderCode = GenerateCodePayService.generateCodePayment('VNPAY');

        function confirmBookTour() {
            let bookingDto = {
                bookingToursDto: $scope.bookings_tour,
                bookingTourCustomersDto: $scope.bookingCustomerList
            }

            BookingTourServiceCT.redirectVNPay(totalPrice, bookingTourId).then(function successCallBack(response) {
                if (response.status === 200) {
                    LocalStorageService.set('bookingDto', bookingDto);
                    LocalStorageService.set('bookingTicket', bookingDto.bookingToursDto);

                    $window.location.href = response.data.redirectUrl;
                    $scope.bookingCustomerList.splice(0, $scope.bookingCustomerList.length);
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn địa chỉ email: ' + email + ' là chính xác không ?', confirmBookTour);
    }

    $scope.paymentZaLoPay = function () {
        $scope.isLoading = true;

        if (user !== null) {
            $scope.bookings_tour.userId = user.id;
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

        function confirmBookTour() {
            let paymentData = {
                amount: totalPrice,
                bookingTourId: bookingTourId
            }

            BookingTourServiceCT.redirectZALOPay(paymentData).then(function successCallBack(response) {
                if (response.status === 200) {
                    $window.location.href = response.data.data;
                    $scope.bookingCustomerList.splice(0, $scope.bookingCustomerList.length);
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn địa chỉ email: ' + email + ' là chính xác không ?', confirmBookTour);
    }

    $scope.paymentMomo = function () {
        $scope.isLoading = true;

        if (user !== null) {
            $scope.bookings_tour.userId = user.id;
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

        function confirmBookTour() {
            let bookingDto = {
                bookingToursDto: $scope.bookings_tour,
                bookingTourCustomersDto: $scope.bookingCustomerList
            }

            BookingTourServiceCT.redirectMomo(totalPrice, bookingTourId).then(function successCallBack(response) {
                if (response.status === 200) {
                    LocalStorageService.set('bookingDto', bookingDto);
                    LocalStorageService.set('bookingTicket', bookingDto.bookingToursDto);

                    $window.location.href = response.data.redirectUrl;
                    $scope.bookingCustomerList.splice(0, $scope.bookingCustomerList.length);
                } else {
                    $location.path('/admin/page-not-found')
                }
            }, errorCallback).finally(function () {
                $scope.isLoading = false;
            });
        }

        confirmAlert('Bạn có chắc chắn địa chỉ email: ' + email + ' là chính xác không ?', confirmBookTour);
    }

    $scope.$on('$routeChangeStart', function (event, next, current) {
        if (next.controller !== 'BookingSuccessControllerCT' && next.controller !== 'LoginController') {
            LocalStorageService.remove('redirectAfterLogin');
        }
    });
});
