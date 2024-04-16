travel_app.service('UserCommentsService', function ($http) {
    let API_USER_COMMENTS = BASE_API + 'customer/rating/rating-services/';

    this.findByOrderIdRating = function (orderId) {
        return $http({
            method: 'GET',
            url: API_USER_COMMENTS + 'findByOrderIdRating',
            params: {
                orderId: orderId
            }
        });
    }

    this.findCommentsByServiceId = function (serviceId, sortDirection, size, page) {
        return $http({
            method: 'GET',
            url: API_USER_COMMENTS + 'findCommentsByServiceId',
            params: {
                serviceId: serviceId,
                sortDirection: sortDirection,
                dateCreated: 'dateCreated',
                page: page,
                size: size
            }
        })
    }
    this.insertUserComments = function (data) {
        return $http({
            method: 'POST',
            url: API_USER_COMMENTS + 'insert',
            data: data
        })
    }

    this.updateUserComments = function (data) {
        return $http({
            method: 'PUT',
            url: API_USER_COMMENTS + 'update',
            data: data
        })
    }

    this.deleteUserComments = function (id) {
        return $http({
            method: 'DELETE',
            url: API_USER_COMMENTS + 'delete'
        })
    }
})