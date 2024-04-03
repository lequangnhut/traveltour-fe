travel_app.service("OrderHotelServiceAG", function($http, $q) {
    let API_ORDER_HOTEL = BASE_API + 'agent/order-hotel/';

    this.findAllOrderHotel = function (page, size, sortField, sortDirection, searchTerm, hotelId) {
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
                isDelete: false
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };
})