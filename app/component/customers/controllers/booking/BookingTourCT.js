travel_app.controller('BookingTourCT', function ($scope, $sce, $location, $routeParams, $anchorScroll, AuthService, LocalStorageService) {
    $anchorScroll();

    $scope.checkPrivatePolicy = false;
    $scope.selectedPaymentMethod = '';
    $scope.selectedContent = '';

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
        tourDetailId: null,
        customerName: null,
        customerCitizenCard: null,
        customerPhone: null,
        customerEmail: null,
        capacityAdult: null,
        capacityKid: null,
        capacityBaby: null,
        orderTotal: null,
        orderCode: null,
        dateCreated: null,
        orderStatus: null,
        orderNote: null,
    }

    $scope.bookings_tour_customer = {
        id: null,
        bookingTourId: null,
        customerName: null,
        customerBirth: null,
        customerPhone: null
    }

    $scope.showContent = function (paymentMethod) {
        $scope.selectedContent = $sce.trustAsHtml($scope.paymentMethods[paymentMethod]);
    };

    $scope.init = function () {
        // let userId = AuthService.getUser().id;
        // let tourDetailId = $routeParams.id;

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
            $location.path('/tour-detail/' + $scope.tourDetail.id + '/booking-tour/customer-information');
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
    }

    $scope.init();

    $scope.paymentTravel = function () {
        console.log($scope.bookings_tour)
        console.log($scope.bookings_tour_customer)
    }

    $scope.paymentVNPay = function () {

    }

    $scope.paymentZaLoPay = function () {

    }

    $scope.paymentMomo = function () {

    }
});
