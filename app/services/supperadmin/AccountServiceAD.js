travel_app.service('AccountServiceAD', function ($http) {
        let API_ACCOUNT = BASE_API + 'superadmin/account/';

    /**
     * API lấy tất cả danh sách tài khoản staff
     */
    this.findAllAccountStaff = function (page) {
        return $http({
            method: 'GET',
            url: API_ACCOUNT + 'find-all-account-staff?page=' + page
        })
    };

    /**
     * API lấy tất cả danh sách tài khoản agent
     */
    this.findAllAccountAgent = function (page) {
        return $http({
            method: 'GET',
            url: API_ACCOUNT + 'find-all-account-agent?page=' + page
        })
    };

    /**
     * API tìm bằng id
     */
    this.findById = function (id) {
        return $http({
            method: 'GET',
            url: API_ACCOUNT + 'find-by-id/' + id
        })
    };

    /**
     * API tạo tài khoản
     */
    this.create = function (dataAccount) {
        return $http({
            method: 'POST',
            url: API_ACCOUNT + 'create-account',
            data: dataAccount
        })
    };

    /**
     * API update tài khoản
     */
    this.update = function (dataAccount) {
        return $http({
            method: 'PUT',
            url: API_ACCOUNT + 'update-account',
            data: dataAccount
        })
    };

    /**
     * API delete tài khoản
     */
    this.delete = function (id) {
        return $http({
            method: 'DELETE',
            url: API_ACCOUNT + 'delete-account/' + id
        })
    };
});