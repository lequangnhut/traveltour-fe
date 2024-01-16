travel_app.service('DecentralizationServiceAD', function ($http) {

    let API_SUPERADMIN = BASE_API + 'superadmin/decentralization/';

    /**
     * API lấy danh sách quyền nhân viên
     */
    this.findAllDecentralizationStaff = function () {
        return $http({
            method: 'GET',
            url: API_SUPERADMIN + 'find-role-staff'
        })
    };

    /**
     * API lấy danh sách quyền đối tác
     */
    this.findAllDecentralizationAgent = function () {
        return $http({
            method: 'GET',
            url: API_SUPERADMIN + 'find-role-agent'
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
