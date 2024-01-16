travel_app.controller('TripControllerAG', function ($scope, $http) {
    $scope.agent = {
        id_trans: null,
        transportation: null,
        date_trip_start: null,
        date_trip_end: null,
        ticket_type: null,
        departure_provinces: null,
        destination_provinces: null,
        price: null,
        seat_number: null,
        active: null
    }

    $scope.validateDates = function () {
        var start = new Date($scope.agent.date_trip_start);
        var end = new Date($scope.agent.date_trip_end);
        var now = new Date();

        // Kiểm tra nếu ngày / giờ về phải trước ngày / giờ đi
        if (start >= end) {
            $scope.form_trips.date_trip_end.$setValidity('dateRange', false);
        } else {
            $scope.form_trips.date_trip_end.$setValidity('dateRange', true);
        }

        // Kiểm tra nếu ngày / giờ đi là ngày / giờ quá khứ
        if (start <= now) {
            $scope.form_trips.date_trip_start.$setValidity('futureDate', false);
        } else {
            $scope.form_trips.date_trip_start.$setValidity('futureDate', true);
        }
    };

    $scope.$watch('agent.date_trip_start', function () {
        $scope.validateDates();
    });

    $scope.$watch('agent.date_trip_end', function () {
        $scope.validateDates();
    });

    /**
     * API lấy dữ liệu tỉnh thành và fill dữ liệu lên select
     */
    $http.get('/lib/address/data.json').then(function (response) {
        $scope.provinces = response.data;
    });

    $scope.createTrip = function () {
        console.log($scope.agent)
    }
});
