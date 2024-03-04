travel_app.service('ForgotPwService', function ($http) {
    let API_FORGOT = BASE_API + 'customer/forgot-pass/';

    this.getCaptchaImage = function () {
        return $http({
            method: 'GET',
            url: API_FORGOT + 'captcha',
            responseType: 'arraybuffer'
        }).then(function (response) {
                // Chuyển đổi dữ liệu hình ảnh sang base64
                var base64Image = 'data:image/jpeg;base64,' + arrayBufferToBase64(response.data);
                return base64Image;
        });
    };

    // Hàm chuyển đổi ArrayBuffer sang base64
    function arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    this.checkCaptcha = function (capCode) {
        return $http({
            method: 'GET',
            url: API_FORGOT + 'captcha/check-captcha/' + capCode,
            param: 'capCode' + capCode
        })
    }

    this.checkEMail = function (email) {
        return $http({
            method: 'GET',
            url: API_FORGOT + 'captcha/check-email/' + email,
            param: 'email' + email
        })
    }

    this.emailForgot = function (email, passwordData) {
        return $http({
            method: 'POST',
            url: API_FORGOT + 'captcha/' + email,
            data: passwordData
        })
    };

    this.updatePass = function (token, userData) {
        return $http({
            method: 'PUT',
            url: API_FORGOT + 'captcha/new-password/' + token,
            data: userData
        })
    };

    this.checkOldCode = function (token) {
        return $http({
            method: 'GET',
            url: BASE_API + 'account/forgot-pass/' + token,
            param: 'token' + token
        })
    };
});
