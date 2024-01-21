travel_app.service('TourDetailsServiceAD', function ($http, $q) {
    let API_TOUR_DETAIL = BASE_API + 'staff/tour-detail/';

    // API lấy tất cả danh sách chi tiết tour
    this.findAllTourDetails = function (page, size, sortBy, sortDir, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_TOUR_DETAIL + 'find-all-tourDetail',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || ''
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    // API tìm chi tiết tour theo id
    this.findTourDetailById = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_TOUR_DETAIL + 'find-by-id/' + id
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    // API tạo chi tiết tour mới
    this.createTourDetail = function (tourDetailsDto) {
        return $http({
            method: 'POST',
            url: API_TOUR_DETAIL + 'create-tourDetail',
            headers: {'Content-Type': undefined},
            data: tourDetailsDto,
            transformRequest: angular.identity
        });
    };

    // API cập nhật chi tiết tour
    this.updateTourDetail = function (id, tourDetailsDto) {
        const deferred = $q.defer();
        $http({
            method: 'PUT',
            url: API_TOUR_DETAIL + 'update-tourDetail/' + id,
            data: tourDetailsDto,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    // API xóa chi tiết tour
    this.deactivateTourDetail = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: API_TOUR_DETAIL + 'delete-tourDetail/' + id
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
});
