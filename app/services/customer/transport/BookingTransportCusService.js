travel_app.service('BookingTransportCusService', function ($http) {
    let API_BOOKING_TRANSPORT = BASE_API + 'customer/transport/';

    this.createBookingTransport = function (orderTransport, seatNumber) {
        return $http({
            method: 'POST',
            url: API_BOOKING_TRANSPORT + 'create-booking-transport/' + seatNumber,
            data: orderTransport
        });
    }
})