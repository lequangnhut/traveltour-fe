travel_app.service('AccountServiceAD', function ($http) {
    let API_ACCOUNT = BASE_API + 'superadmin/account/';

    /**
     * API lấy tất cả danh sách tài khoản
     */
    this.findAllAccountStaff = function () {
        return $http({
            method: 'GET',
            url: API_ACCOUNT + 'find-all-account-staff'
        })
    };

    this.findAllAccountAgent = function () {
        return $http({
            method: 'GET',
            url: API_ACCOUNT + 'find-all-account-agent'
        })
    };
});