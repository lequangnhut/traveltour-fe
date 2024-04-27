travel_app.service('HistoryOrderServiceCUS', function ($http, $q) {

    let API_HISTORY_ORDER = BASE_API + 'customer/customer-order-booking/';

    this.getAllById = function (page, size, sortBy, sortDir, orderStatus, userId) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_HISTORY_ORDER + 'find-all-booking-tour/' + userId,
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                orderStatus: orderStatus || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.getTourDetails = function (id) {
        return $http({
            method: 'GET',
            url: API_HISTORY_ORDER + 'find-tour-detail-by-id/' + id
        })
    }

    this.cancelBookingTour = function (id, noted) {
        const deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: API_HISTORY_ORDER + 'delete-booking-tour-customer/' + id,
            params: {noted: noted},
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    this.getAllHotelByInfo = function (page, size, sortBy, sortDir, orderHotelStatus, userId) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_HISTORY_ORDER + 'find-all-booking-tour-hotel/' + userId,
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                orderHotelStatus: orderHotelStatus || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.getAllOrderHotelByInfo = function (page, size, sortBy, sortDir, orderStatus, userId) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_HISTORY_ORDER + 'find-all-order-hotel/' + userId,
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                orderStatus: orderStatus || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.getHotels = function (roomTypeId) {
        return $http({
            method: 'GET',
            url: API_HISTORY_ORDER + 'find-hotel-by-room/' + roomTypeId
        })
    }

    this.getRoomTypes = function (roomTypeId) {
        return $http({
            method: 'GET',
            url: API_HISTORY_ORDER + 'find-room-by-roomId/' + roomTypeId
        })
    }

    this.getOrderDetails = function (orderHotelsId) {
        return $http({
            method: 'GET',
            url: API_HISTORY_ORDER + 'find-order-detail-by-ordersId/' + orderHotelsId
        })
    }

    this.getAllOrderTransByInfo = function (page, size, sortBy, sortDir, orderStatus, userId) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_HISTORY_ORDER + 'find-all-order-trans/' + userId,
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                orderStatus: orderStatus || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.getOrderTransDetails = function (orderId) {
        return $http({
            method: 'GET',
            url: API_HISTORY_ORDER + 'find-trans-detail-by-ordersId/' + orderId
        })
    }

    this.getAllOrderVisitByInfo = function (page, size, sortBy, sortDir, orderStatus, userId) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_HISTORY_ORDER + 'find-all-order-visits/' + userId,
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                orderStatus: orderStatus || null
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.getOrderVisitDetails = function (orderHotelsId) {
        return $http({
            method: 'GET',
            url: API_HISTORY_ORDER + 'find-visit-detail-by-ordersId/' + orderHotelsId
        })
    }

    this.cancelHotel = function (id, noted) {
        const deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: API_HISTORY_ORDER + 'delete-booking-hotel-customer/' + id,
            params: {noted: noted},
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    this.cancelVisit = function (id, noted) {
        const deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: API_HISTORY_ORDER + 'delete-booking-visit-customer/' + id,
            params: {noted: noted},
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    this.cancelTrans = function (id, noted) {
        const deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: API_HISTORY_ORDER + 'delete-booking-trans-customer/' + id,
            params: {noted: noted},
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
});