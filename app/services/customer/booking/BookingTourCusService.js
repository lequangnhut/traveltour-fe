travel_app.service('BookingTourCusService', function ($http) {

    let API_BOOKING = BASE_API + 'customer/booking-tour/';

    this.redirectVNPay = function (tourDetailId, orderId, ticketAdult, ticketChildren) {
        return $http({
            method: 'POST',
            url: API_BOOKING + 'vnpay/submit-payment',
            params: {
                tourDetailId: tourDetailId,
                orderInfo: orderId,
                ticketAdult: ticketAdult,
                ticketChildren: ticketChildren
            }
        });
    }

    this.redirectMomo = function (tourDetailId, bookingTourId, ticketAdult, ticketChildren) {
        return $http({
            method: 'POST',
            url: API_BOOKING + 'momo/submit-payment',
            params: {
                tourDetailId: tourDetailId,
                bookingTourId: bookingTourId,
                ticketAdult: ticketAdult,
                ticketChildren: ticketChildren
            }
        });
    }

    this.redirectZALOPay = function (paymentData) {
        return $http({
            method: 'POST',
            url: API_BOOKING + 'zalopay/submit-payment',
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