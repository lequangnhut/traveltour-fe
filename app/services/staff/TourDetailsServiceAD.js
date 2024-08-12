travel_app.service('TourDetailsServiceAD', function ($http, $q) {
    let API_TOUR_DETAIL = BASE_API + 'staff/tour-detail/';

    this.findAllTourDetails = function (page, size, sortBy, sortDir, sortDate, tourDetailStatus, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_TOUR_DETAIL + 'find-all-tourDetail',
            params: {
                page: page || 0,
                size: size || 10,
                sortBy: sortBy || sortDate,
                sortDir: sortDir || 'desc',
                searchTerm: searchTerm || '',
                tourDetailStatus: tourDetailStatus || '',
            }
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findAllTourDetailSelect = function () {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_TOUR_DETAIL + 'find-all-tourDetail-select',
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findTourDetailById = function (id) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_TOUR_DETAIL + 'find-by-id/' + id
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findAllJoinBooking = () => {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_TOUR_DETAIL + 'find-all-join-booking'
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.findTourDestinationByTourDetailById = function (tourDetailId) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_TOUR_DETAIL + 'find-tour-destination-by-tour-detail-id/' + tourDetailId
        }).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };

    this.createTourDetail = function (tourDetailsDto) {
        return $http({
            method: 'POST',
            url: API_TOUR_DETAIL + 'create-tourDetail',
            headers: {'Content-Type': undefined},
            data: tourDetailsDto,
            transformRequest: angular.identity
        });
    };

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

    this.deactivateTourDetail = function (tourDetail, tourDetailNotes) {
        const deferred = $q.defer();
        $http({
            method: 'DELETE',
            url: API_TOUR_DETAIL + 'delete-tourDetail',
            params: {
                tourDetail: tourDetail,
                tourDetailNotes: tourDetailNotes
            }
        }).then(function (response) {
            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    this.createTourDetailImage = function (tourDetailId, formData) {
        return $http({
            method: 'POST',
            url: API_TOUR_DETAIL + 'create-tour-detail-image/' + tourDetailId,
            data: formData,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        });
    };

    this.createTourDestination = function (dataProvince, tourDetailId) {
        return $http({
            method: 'POST',
            url: API_TOUR_DETAIL + 'create-tour-destination/' + tourDetailId,
            data: dataProvince
        });
    };

    this.updateTourDetailImage = function (tourDetailImagesDto) {
        return $http({
            method: 'PUT',
            url: API_TOUR_DETAIL + 'update-tour-detail-image',
            data: tourDetailImagesDto
        });
    };
});
