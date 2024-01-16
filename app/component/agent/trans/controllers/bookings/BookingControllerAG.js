travel_app.controller('BookingControllerAG', function ($scope) {

    $scope.agent = {
        trip_code: null,
        ticket_number: null,
        full_name: null,
        id_card: null,
        phone: null,
        email: null,
        price: null,
        purchase_date: null,
        active: null,
        noted: null
    }

    $scope.createBookingForm = function () {
        console.log($scope.agent)
    }

    $scope.updateBookingForm = function () {
        console.log($scope.agent)
    }
});
