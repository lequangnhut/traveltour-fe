travel_app.service('VisitLocationTypeServiceAD', function ($http, $q) {

    let API_TYPE = BASE_API + 'admin/type/';

    /**
     * API lấy tất cả danh sách tour
     */
    this.findAllType = function (page, size, sortBy, sortDir, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_TYPE + 'find-all-visit-location-type',
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

    /**
     * API tạo loại lưu trú mới
     */
    this.createThisType = function (data) {
        return $http({
            method: 'POST',
            url: API_TYPE + 'create-visit-location-type',
            data: data
        })
    };

    /**
     * API update loại lưu trú mới
     */
    this.updateThisType = function (data) {
        return $http({
            method: 'PUT',
            url: API_TYPE + 'update-visit-location-type',
            data: data
        })
    };

    /**
     * API delete loại lưu trú mới
     */
    this.deleteThisType = function (id) {
        return $http({
            method: 'DELETE',
            url: API_TYPE + 'delete-visit-location-type/' + id
        })
    };

    /**
     * API tìm bằng id
     */
    this.findById = function (id) {
        return $http({
            method: 'GET',
            url: API_TYPE + 'find-visit-location-type-by-id/' + id
        })
    };

    /**
     * API check trùng tên loại lưu trú
     */
    this.checkExistTypeName = function (name) {
        return $http({
            method: 'GET',
            url: API_TYPE + 'check-duplicate-visit-location-type-name/' + name,
            param: 'name' + name
        })
    }

    this.checkTypeIsWorking = function (id) {
        return $http({
            method: 'GET',
            url: API_TYPE + 'check-visit-location-type-working/' + id,
            param: 'id' + id
        })
    }


});
