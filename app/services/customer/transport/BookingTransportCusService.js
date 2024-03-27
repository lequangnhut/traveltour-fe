travel_app.service('BookingTransportCusService', function ($http) {
    let API_BOOKING_TRANSPORT = BASE_API + 'customer/transport/';

    this.createBookingTransport = function (orderTransport, seatNumber) {
        return $http({
            method: 'POST',
            url: API_BOOKING_TRANSPORT + 'create-booking-transport/' + seatNumber,
            data: orderTransport
        });
    }

    this.redirectVNPayTransport = function (orderTransport, scheduleId, orderInfo, amountTicket, seatNumber) {
        return $http({
            method: 'POST',
            url: API_BOOKING_TRANSPORT + 'vnpay/submit-payment',
            data: orderTransport,
            params: {
                scheduleId: scheduleId,
                orderInfo: orderInfo,
                amountTicket: amountTicket,
                seatNumber: seatNumber
            }
        });
    }

    this.redirectMomoTransport = function (orderTransport, seatNumber) {
        return $http({
            method: 'POST',
            url: API_BOOKING_TRANSPORT + 'momo/submit-payment',
            data: orderTransport,
            params: {
                seatNumber: seatNumber
            }
        });
    }
})