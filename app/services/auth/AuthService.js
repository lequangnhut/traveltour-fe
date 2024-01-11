travel_app.service('AuthService', function ($http, $window) {

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
     * @message Login with Google
     */
    this.loginWithGoogle = function () {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/oauth2/authorization/google'
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
     * @message Get and Set Data in local stored
     */
    this.setAuthData = function (token, user) {
        $window.localStorage.setItem('token', token);
        $window.localStorage.setItem('user', JSON.stringify(user));
    };

    this.clearAuthData = function () {
        $window.localStorage.removeItem('token');
        $window.localStorage.removeItem('user');
    };

    this.getToken = function () {
        return $window.localStorage.getItem('token');
    };

    this.getUser = function () {
        return JSON.parse($window.localStorage.getItem('user'));
    };
});
