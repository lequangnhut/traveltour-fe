travel_app.controller('BookingSuccessControllerCT', function ($scope, $location, $routeParams, $anchorScroll, BookingTourServiceCT, LocalStorageService) {
    $anchorScroll();

    let bookingTourId = $routeParams.orderInfo;
    $scope.transactionId = $routeParams.transactionId;

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
        $scope.totalPrice = LocalStorageService.get('dataBooking').totalPrice;
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
                } else if (paymentMethod === 'MOMO') {
                    // Xử lý thanh toán MoMo
                }
            }
        }
    }

    $scope.submitBookingVNPay = function () {
        let transactionId = $routeParams.transactionId;
        let bookingDto = LocalStorageService.get('bookingDto');

        BookingTourServiceCT.createBookTourVNPay(bookingDto, transactionId).then(function successCallBack(response) {
            if (response.status === 200) {
                if (transactionId != 0) {
                    toastAlert('success', 'Đặt tour thành công !');
                } else {
                    toastAlert('success', 'Thanh toán thất bại !');
                }
                LocalStorageService.set('paymentProcessed', true);
            } else {
                $location.path('/admin/page-not-found');
            }
        }, errorCallback);
    };

    $scope.init();

    $scope.$on('$destroy', function () {
        LocalStorageService.remove('dataBooking');
        LocalStorageService.remove('bookingTicket');
        LocalStorageService.remove('paymentProcessed');
    });
})