travel_app.service("PaymentMethodServiceCT", function ($http) {
    API_PAYMENT_METHOD = BASE_API + 'customer/payment-methods/';

    this.findAllPaymentMethod = function () {
        return $http({
            method: 'GET',
            url: API_PAYMENT_METHOD + 'findAllPaymentMethod'
        });
    }
})