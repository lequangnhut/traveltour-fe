travel_app.factory('GenerateCodeFactory', function () {
    return {
        generateOrderCode: function () {
            const randomNumber = Math.floor(Math.random() * 1000000);
            const currentDate = new Date();
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();

            const formattedDay = ('0' + day).slice(-2);
            const formattedMonth = ('0' + month).slice(-2);

            return 'VX' + year + formattedMonth + formattedDay + randomNumber;
        }
    };
});
