    travel_app.service('ToursServiceAD', function ($http, $q) {
        let API_TOUR = BASE_API + 'staff/tour/';

        /**
         * API lấy tất cả danh sách tour
         */
        this.findAllTours = function (page, size, sortBy, sortDir, searchTerm) {
            const deferred = $q.defer();
            $http({
                method: 'GET',
                url: API_TOUR + 'find-all-tours',
                params: {
                    page: page || 0,
                    size: size || 5,
                    sortBy: sortBy || 'id',
                    sortDir: sortDir || 'asc',
                    searchTerm: searchTerm || ''
                }
            }).then(deferred.resolve, deferred.reject);
            return deferred.promise;
        };
            this.findAllToursSelect = function () {
            const deferred = $q.defer();
            $http({
                method: 'POST',
                url: API_TOUR + 'find-all-tours'
            }).then(deferred.resolve, deferred.reject);
            return deferred.promise;
        };


        /**
         * API tìm tour theo id
         */
        this.findTourById = function (id) {
            const deferred = $q.defer();
            $http({
                method: 'GET',
                url: API_TOUR + 'find-by-id/' + id
            }).then(deferred.resolve, deferred.reject);
            return deferred.promise;
        };


        /**
         * API tạo tour mới
         */
        this.createTour = function (tourDto) {
            return $http({
                method: 'POST',
                url: API_TOUR + 'create-tour',
                headers: {'Content-Type': undefined},
                data: tourDto,
                transformRequest: angular.identity
            })
        };


        /**
         * API update tour
         */
        this.updateTour = function (id, tourData) {
            const deferred = $q.defer();
            $http({
                method: 'PUT',
                url: API_TOUR + 'update-tour/' + id,
                data: tourData,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };


        /**
         * API Hủy Kích Hoạt Tour
         */
        this.deactivateTour = function (id) {
            const deferred = $q.defer();
            $http({
                method: 'DELETE',
                url: API_TOUR + 'deactivate-tour/' + id
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };


    });