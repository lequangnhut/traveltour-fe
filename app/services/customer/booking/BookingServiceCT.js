travel_app.service('BookingServiceCT', function ($http) {

    let API_BOOKING = BASE_API + 'book-tour/';

    this.redirectVNPay = function (totalPrice, orderId) {
        return $http({
            method: 'POST',
            url: BASE_API + 'vnpay/submit-payment',
            params: {
                price: totalPrice,
                orderInfo: orderId,
            }
        });
    }

    this.createBookTour = function (bookingDto) {
        return $http({
            method: 'POST',
            url: API_BOOKING + 'create-book-tour',
            data: bookingDto
        });
    }
})