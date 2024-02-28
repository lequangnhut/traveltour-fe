travel_app.controller('BookingSuccessControllerCT', function ($scope, $location, $anchorScroll, LocalStorageService) {
    $anchorScroll();

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
    }

    $scope.goHome = function () {

    }

    $scope.init();

    $scope.$on('$destroy', function () {
        LocalStorageService.remove('dataBooking');
        LocalStorageService.remove('bookingTicket');
    });
})