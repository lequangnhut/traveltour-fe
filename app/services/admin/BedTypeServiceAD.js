travel_app.service('BedTypeServiceAD', function ($http, $q) {

    let API_TYPE = BASE_API + 'admin/type/';

    /**
     * API show list
     */
    this.findAllType = function (page, size, sortBy, sortDir, searchTerm) {
        const deferred = $q.defer();
        $http({
            method: 'GET',
            url: API_TYPE + 'find-all-bed-type',
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
     * API tạo loại
     */
    this.createThisType = function (data) {
        return $http({
            method: 'POST',
            url: API_TYPE + 'create-bed-type',
            data: data
        })
    };

    /**
     * API update loại
     */
    this.updateThisType = function (data) {
        return $http({
            method: 'PUT',
            url: API_TYPE + 'update-bed-type',
            data: data
        })
    };

    /**
     * API delete loại
     */
    this.deleteThisType = function (id) {
        return $http({
            method: 'DELETE',
            url: API_TYPE + 'delete-bed-type/' + id
        })
    };

    /**
     * API tìm bằng id
     */
    this.findById = function (id) {
        return $http({
            method: 'GET',
            url: API_TYPE + 'find-bed-type-by-id/' + id
        })
    };

    /**
     * API check trùng tên loại
     */
    this.checkExistTypeName = function (name) {
        return $http({
            method: 'GET',
            url: API_TYPE + 'check-duplicate-bed-type-name/' + name,
            param: 'name' + name
        })
    }

    this.checkTypeIsWorking = function (id) {
        return $http({
            method: 'GET',
            url: API_TYPE + 'check-bed-type-working/' + id,
            param: 'id' + id
        })
    }
});
