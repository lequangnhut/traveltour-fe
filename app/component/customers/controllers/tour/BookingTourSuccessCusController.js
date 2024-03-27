travel_app.controller('BookingTourSuccessCusController', function ($scope, $location, $routeParams, LocalStorageService) {

    $scope.init = function () {
        let dataBooking = LocalStorageService.get('dataBooking');
        let bookingTicket = LocalStorageService.get('bookingTicket');

        if (dataBooking === null && bookingTicket === null) {
            toastAlert('warning', 'Booking không tồn tại !');
            $location.path('/tours');
            return;
        }

        $scope.ticket = dataBooking.ticket;
        $scope.tourDetail = dataBooking.tourDetail;
        $scope.provinceName = dataBooking.provinceName;
        $scope.bookingTicket = bookingTicket;

        if ($routeParams.orderStatus && $routeParams.paymentMethod) {
            $scope.orderStatus = parseInt(atob($routeParams.orderStatus));
            $scope.paymentMethodTour = atob($routeParams.paymentMethod);
        } else {
            $scope.orderStatus = 0;
            $scope.paymentMethodTour = 'VPO';
        }

        let unitPrice = $scope.tourDetail.unitPrice;
        let amountAdults = $scope.ticket.adults;
        let amountChildren = $scope.ticket.children;

        $scope.totalPrice = (amountAdults * unitPrice) + (amountChildren * (unitPrice * 0.3));
        $scope.totalTikets = parseInt($scope.ticket.adults) + parseInt($scope.ticket.children) + parseInt($scope.ticket.baby);
    }

    $scope.init();

    $scope.$on('$destroy', function () {
        LocalStorageService.remove('dataBooking');
        LocalStorageService.remove('bookingTicket');
        LocalStorageService.remove('paymentProcessed');
    });
})