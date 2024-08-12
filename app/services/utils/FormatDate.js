travel_app.service("FormatDateService", function () {

    this.formatDate = function (time) {
        return moment(time).format('HH:mm'); // Định dạng theo giờ và phút
    };

    this.convertStringToTime = function (timeArray) {
        if (Array.isArray(timeArray) && timeArray.length === 2) {
            var dateObject = new Date();
            dateObject.setHours(timeArray[0], timeArray[1], 0, 0);
            return dateObject;
        } else {
            return null;
        }
    };
})