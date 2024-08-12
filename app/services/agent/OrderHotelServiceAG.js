travel_app.service("OrderHotelServiceAG", function($http, $q) {
    let API_ORDER_HOTEL = BASE_API + 'agent/order-hotel/';

    this.findAllOrderHotel = function (page, size, sortField, sortDirection, searchTerm, hotelId, filter, orderStatus) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_ORDER_HOTEL + 'findAllOrderHotel',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortField || 'id',
                sortDir: sortDirection || 'asc',
                searchTerm: searchTerm || '',
                hotelId: hotelId,
                isDelete: false,
                filter: filter || 0,
                orderStatus: orderStatus || ''
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findOrderHotelById = function (orderId) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_ORDER_HOTEL + 'findOrderHotelById',
            params: {
                orderId: orderId
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    }

    this.confirmInvoiceByOrderId = function (orderId) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_ORDER_HOTEL + 'confirmInvoiceByIdOrder',
            params: {
                orderId: orderId
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    }

    this.cancelInvoiceByOrderId = function (orderId, cancelReason) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_ORDER_HOTEL + 'cancelInvoiceByIdOrder',
            params: {
                orderId: orderId,
                cancelReason: cancelReason
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    }
})