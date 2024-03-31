travel_app.service('BookingLocationCusService', function ($http, $q) {

    let API_BOOKING = BASE_API + 'customer/booking-location/';

    this.redirectVNPay = function (data) {
        return $http({
            method: 'POST',
            url: API_BOOKING + 'vnpay/submit-payment',
            headers: {'Content-Type': undefined},
            data: data,
            transformRequest: angular.identity
        });
    }

    this.redirectMomo = function (data) {
        return $http({
            method: 'POST',
            url: API_BOOKING + 'momo/submit-payment',
            headers: {'Content-Type': undefined},
            data: data,
            transformRequest: angular.identity
        });
    }

    this.redirectZALOPay = function (paymentData) {
        return $http({
            method: 'POST',
            url: API_BOOKING + 'zalopay/submit-payment',
            data: paymentData
        });
    }

    this.createBookLocation = function (data) {
        return $http({
            method: 'POST',
            url: API_BOOKING + 'create-book-location',
            headers: {'Content-Type': undefined},
            data: data,
            transformRequest: angular.identity
        });
    }

    this.createBookTourVNPay = function (bookingDto, transactionId) {
        return $http({
            method: 'POST',
            url: API_BOOKING + 'create-book-tour-vnpay/' + transactionId,
            data: bookingDto
        });
    }

    this.createBookTourMomo = function (bookingDto, transactionId) {
        return $http({
            method: 'POST',
            url: API_BOOKING + 'create-book-tour-momo/' + transactionId,
            data: bookingDto
        });
    }

    this.findById = (id) => {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: BASE_API + 'customer/order-location/find-by-id/' + id
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };
})