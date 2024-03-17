travel_app.service('RegisterAgenciesCusService', function ($http) {

    let API_AGENCIES = BASE_API + 'customer/agencies/';

    this.submitEmailAgencies = function (agenciesData) {
        return $http({
            method: 'POST',
            url: API_AGENCIES + 'submit-email',
            data: agenciesData
        });
    }

    this.findByCodeOTPAndEmail = function (codeOTP, email) {
        return $http({
            method: 'GET',
            url: API_AGENCIES + 'find-by-otp/' + codeOTP + '/' + email
        });
    }

    this.submitRegisterAgencies = function (dataAccount) {
        return $http({
            method: 'POST',
            url: API_AGENCIES + 'register-agencies',
            data: dataAccount
        });
    }
})