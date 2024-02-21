travel_app.filter('timestampToDateString', function () {
    return function (timestamp) {
        const date = new Date(timestamp * 1000);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;
        return day + '/' + month + '/' + year;
    };
});

travel_app.filter('calculatePreviousDate', function () {
    return function (timestamp, days) {
        if (!timestamp) {
            return null;
        }

        const date = new Date(timestamp * 1000);

        date.setDate(date.getDate() - days);

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;

        return day + '/' + month + '/' + year;
    };
});

travel_app.filter('vietnameseDateTime', function () {
    return function (isoDateTime) {
        const date = new Date(isoDateTime);

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };
});

travel_app.filter('formatDateTime', function () {
    return function (apiDateTime) {
        const momentObj = moment(apiDateTime, 'YYYYMMDDHHmmss');

        return momentObj.format('DD/MM/YYYY HH:mm:ss');
    };
});

travel_app.filter('convertTime', function() {
    return function(timeArray) {
        if (Array.isArray(timeArray) && timeArray.length === 2) {
            var hours = timeArray[0];
            var minutes = timeArray[1];

            var formattedHours = (hours < 10) ? '0' + hours : hours;
            var formattedMinutes = (minutes < 10) ? '0' + minutes : minutes;

            return formattedHours + ':' + formattedMinutes;
        } else {
            return null;
        }
    };
});
