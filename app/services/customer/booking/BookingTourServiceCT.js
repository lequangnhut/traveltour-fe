travel_app.service('BookingTourServiceCT', function ($http) {

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

    this.redirectMomo = function (price, bookingTourId) {
        return $http({
            method: 'POST',
            url: BASE_API + 'momo/submit-payment',
            params: {
                price: price,
                bookingTourId: bookingTourId,
            }
        });
    }

    this.redirectZALOPay = function (paymentData) {
        return $http({
            method: 'POST',
            url: BASE_API + 'zalopay/submit-payment',
            data: paymentData
        });
    }

    this.createBookTour = function (bookingDto) {
        return $http({
            method: 'POST',
            url: API_BOOKING + 'create-book-tour',
            data: bookingDto
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
})