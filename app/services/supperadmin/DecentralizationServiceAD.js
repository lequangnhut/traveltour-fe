travel_app.service('DecentralizationServiceAD', function ($http) {
    let API_SUPERADMIN = BASE_API + 'superadmin/decentralization/';

    /**
     * API lấy danh sách quyền nhân viên
     */
    this.findAllDecentralizationStaff = function (page, size, sortBy, sortDir, searchTerm) {
        return $http({
            method: 'GET',
            url: API_SUPERADMIN + 'find-role-staff',
            params: {
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || ''
            }
        })
    };

    /**
     * API lấy danh sách quyền đối tác
     */
    this.findAllDecentralizationAgent = function (page, size, sortBy, sortDir, searchTerm) {
        return $http({
            method: 'GET',
            url: API_SUPERADMIN + 'find-role-agent',
            params: {
                page: page || 0,
                size: size || 5,
                sortBy: sortBy || 'id',
                sortDir: sortDir || 'asc',
                searchTerm: searchTerm || ''
            }
        })
    };

    /**
     * API cập nhật quyền
     */
    this.updateDecentralization = function (userId, dataRole) {
        return $http({
            method: 'PUT',
            url: API_SUPERADMIN + 'update-role/' + userId,
            data: dataRole,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    };
});
