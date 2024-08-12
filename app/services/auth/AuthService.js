travel_app.service('AuthService', function ($http, $window, LocalStorageService) {

    let API_AUTH = BASE_API + 'auth/';

    /**
     * @message API register account
     */
    this.registerAuth = function (registerData) {
        return $http({
            method: 'POST',
            url: API_AUTH + 'register',
            data: registerData
        })
    };

    /**
     * @message API login with JWT
     */
    this.loginAuth = function (loginData) {
        return $http({
            method: 'POST',
            url: API_AUTH + 'login',
            data: loginData
        })
    };

    /**
     * @message API check token login with JWT
     */
    this.checkToken = function (token) {
        const tokenString = JSON.stringify(token);
        const tokenObject = JSON.parse(tokenString);
        const jwtToken = tokenObject.token;

        return $http({
            method: 'GET',
            url: API_AUTH + 'request-client',
            headers: {
                'Authorization': jwtToken
            }
        });
    };

    /**
     * @message API find user login google
     */
    this.userLoginGoogle = function () {
        return $http({
            method: 'GET',
            url: API_AUTH + 'login-google-get-user'
        });
    };

    /**
     * @message API find by email
     */
    this.findByEmail = function (email) {
        return $http({
            method: 'GET',
            url: API_AUTH + 'find-by-email/' + email,
            param: 'email' + email
        });
    };

    /**
     * @message API find by token
     */
    this.findByToken = function (token) {
        return $http({
            method: 'GET',
            url: API_AUTH + 'find-by-token/' + token,
            param: 'email' + token
        });
    };

    /**
     * @message API check duplicate email
     */
    this.checkExistEmail = function (email) {
        return $http({
            method: 'GET',
            url: API_AUTH + 'check-duplicate-email/' + email,
            param: 'email' + email
        })
    }

    /**
     * @message API check duplicate phone
     */
    this.checkExistPhone = function (phone) {
        return $http({
            method: 'GET',
            url: API_AUTH + 'check-duplicate-phone/' + phone,
            param: 'phone' + phone
        })
    }

    /**
     * @message API check duplicate phone
     */
    this.checkExistCard = function (card) {
        return $http({
            method: 'GET',
            url: API_AUTH + 'check-duplicate-card/' + card,
            param: 'cardId' + card
        })
    }

    /**
     * @message Get and Set Data in local stored
     */
    this.setAuthData = function (token, user) {
        LocalStorageService.encryptLocalData(token, 'token', 'encryptToken');
        LocalStorageService.encryptLocalData(JSON.stringify(user), 'user', 'encryptUser');
    };

    this.clearAuthData = function () {
        LocalStorageService.remove('token');
        LocalStorageService.remove('user');
    };

    this.getToken = function () {
        return LocalStorageService.decryptLocalData('token', 'encryptToken');
    };

    this.getUser = function () {
        return JSON.parse(LocalStorageService.decryptLocalData('user', 'encryptUser'));
    };
});
