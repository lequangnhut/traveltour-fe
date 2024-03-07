travel_app.controller('BookingSuccessCusController', function ($scope, $location, $routeParams, BookingTourCusService, LocalStorageService) {
    let bookingTourId = $routeParams.orderInfo;
    $scope.transactionId = $routeParams.transactionId;
    $scope.totalPrice = $routeParams.totalPrice;

    function errorCallback() {
        $location.path('/admin/internal-server-error')
    }

    $scope.init = function () {
        let dataBooking = LocalStorageService.get('dataBooking');
        let bookingTicket = LocalStorageService.get('bookingTicket');

        if (dataBooking === null && bookingTicket === null) {
            toastAlert('warning', 'Booking không tồn tại !');
            $location.path('/home');
            return;
        }

        $scope.ticket = LocalStorageService.get('dataBooking').ticket;
        $scope.tourDetail = LocalStorageService.get('dataBooking').tourDetail;
        $scope.provinceName = LocalStorageService.get('dataBooking').provinceName;
        $scope.bookingTicket = LocalStorageService.get('bookingTicket');

        let paymentProcessed = LocalStorageService.get('paymentProcessed');

        if (paymentProcessed) {
            return;
        }

        if (bookingTourId) {
            let index = bookingTourId.indexOf('-');

            if (index !== -1) {
                let paymentMethod = bookingTourId.substring(0, index);

                if (paymentMethod === 'VNPAY' && !paymentProcessed) {
                    $scope.submitBookingVNPay();
                } else if (paymentMethod === 'ZALOPAY') {
                    // Xử lý thanh toán ZaloPay
                } else if (paymentMethod === 'MOMO' && !paymentProcessed) {
                    $scope.submitBookingMomo();
                }
            }
        }
    }

    $scope.submitBookingVNPay = function () {
        let transactionId = $routeParams.transactionId;
        let bookingDto = LocalStorageService.get('bookingDto');

        BookingTourCusService.createBookTourVNPay(bookingDto, transactionId).then(function successCallBack(response) {
            if (response.status === 200) {
                LocalStorageService.set('paymentProcessed', true);
            } else {
                $location.path('/admin/page-not-found');
            }
        }, errorCallback);
    };

    $scope.submitBookingMomo = function () {
        let transactionId = parseInt($routeParams.transactionId);
        let bookingDto = LocalStorageService.get('bookingDto');

        BookingTourCusService.createBookTourMomo(bookingDto, transactionId).then(function successCallBack(response) {
            if (response.status === 200) {
                LocalStorageService.set('paymentProcessed', true);
            } else {
                $location.path('/admin/page-not-found');
            }
        }, errorCallback);
    }

    $scope.init();

    $scope.$on('$destroy', function () {
        LocalStorageService.remove('dataBooking');
        LocalStorageService.remove('bookingTicket');
        LocalStorageService.remove('paymentProcessed');
    });
})