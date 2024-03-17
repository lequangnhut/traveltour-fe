travel_app.service('OTPService', function () {

    this.generateOTP = function () {
        let otp = Math.floor(100000 + Math.random() * 900000);
        return otp.toString();
    };
})