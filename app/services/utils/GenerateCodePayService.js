travel_app.service('GenerateCodePayService', function () {

    this.generateCodeBooking = function (paymentMethod, tourDetailId) {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear().toString().substr(-2);

        const formattedMonth = month < 10 ? '0' + month : month;
        const formattedDay = day < 10 ? '0' + day : day;

        const randomSuffix = Math.floor(Math.random() * 10000);

        return `${paymentMethod}-${tourDetailId}-${formattedDay}${formattedMonth}${year}${randomSuffix}`;
    }

    this.generateCodePayment = function (paymentMethod) {
        const randomNumber = Math.floor(Math.random() * 1000000);
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        return `${paymentMethod}-${day}${month}${year}${randomNumber}`;
    };

    this.generateCodeBookingStaff =  (tourDetailId) => {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear().toString().substr(-2);

        const formattedMonth = month < 10 ? '0' + month : month;
        const formattedDay = day < 10 ? '0' + day : day;

        const randomSuffix = Math.floor(Math.random() * 10000);

        return `${tourDetailId}-${formattedDay}${formattedMonth}${year}${randomSuffix}`;
    }

    this.generateCodePaymentStaff =  () =>{
        const randomNumber = Math.floor(Math.random() * 1000000);
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        return `${day}${month}${year}${randomNumber}`;
    };
});