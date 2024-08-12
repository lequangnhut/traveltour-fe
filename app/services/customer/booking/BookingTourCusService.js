travel_app.service('BookingTourCusService', function ($http) {

    let API_BOOKING = BASE_API + 'customer/booking-tour/';

    this.createBookTour = function (bookingDto) {
        return $http({
            method: 'POST',
            url: API_BOOKING + 'create-book-tour',
            data: bookingDto
        });
    }

    this.redirectVNPay = function (bookingDto) {
        return $http({
            method: 'POST',
            url: API_BOOKING + 'vnpay/submit-payment',
            data: bookingDto
        });
    }

    this.redirectMomo = function (bookingDto) {
        return $http({
            method: 'POST',
            url: API_BOOKING + 'momo/submit-payment',
            data: bookingDto
        });
    }

    this.redirectZALOPay = function (paymentData) {
        return $http({
            method: 'POST',
            url: API_BOOKING + 'zalopay/submit-payment',
            data: paymentData
        });
    }
})