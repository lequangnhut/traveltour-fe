travel_app.service('TransportUtilityServiceAD', function ($http) {
    let API_TRANS_UTILITY = BASE_API + 'admin/type/transport-utilities/';

    this.findAllTransUtility = function (page, size, sortBy, sortDir, searchTerm) {
        return $http({
            method: 'GET',
            url: API_TRANS_UTILITY + 'find-all-transport-utilities',
            params: {
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || ''
            }
        });
    };

    this.findTransUtilityById = function (transUtilityId) {
        return $http({
            method: 'GET',
            url: API_TRANS_UTILITY + 'find-transport-utilities-by-id/' + transUtilityId
        });
    }

    this.createTransUtility = function (data) {
        return $http({
            method: 'POST',
            url: API_TRANS_UTILITY + 'create-transport-utilities',
            headers: {'Content-Type': undefined},
            data: data
        });
    }

    this.updateTransUtility = function (data) {
        return $http({
            method: 'PUT',
            url: API_TRANS_UTILITY + 'update-transport-utilities',
            headers: {'Content-Type': undefined},
            data: data
        });
    }

    this.deleteTransUtility = function (transUtilityId) {
        return $http({
            method: 'GET',
            url: API_TRANS_UTILITY + 'delete-transport-utilities/' + transUtilityId
        });
    }
});