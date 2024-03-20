var user = JSON.parse(window.localStorage.getItem('user'));

let stompClient = null;
let selectedUserId = null;

function connect() {
    if (user && user.id && user.fullName) {
        const socket = new SockJS('http://localhost:8080/api/v1/ws');

        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    } else {
        console.log('User information is not available or incomplete!');
    }
}

function onConnected() {
    stompClient.subscribe(`/user/${user.id}/queue/messages`, onMessageReceived);
    stompClient.subscribe(`/user/public`, onMessageReceived);

    stompClient.send("/app/user.userConnected",
        {},
        JSON.stringify({userId: user.id, fullName: user.fullName, role: user.roles[0].nameRole, avatar: user.avatar}));
}

async function onMessageReceived(payload) {

    console.log('Message received', payload);
}


function onError() {
    console.log('Không thể kết nối tới websocket vui lòng thử lại');
}

window.addEventListener('beforeunload', function (event) {
    stompClient.send("/app/user.disconnectUser", {},
        JSON.stringify({userId: user.id, fullName: user.fullName, role: user.roles[0].nameRole, avatar: user.avatar}));
});

window.addEventListener('unload', function (event) {
    stompClient.send("/app/user.disconnectUser", {},
        JSON.stringify({userId: user.id, fullName: user.fullName, role: user.roles[0].nameRole, avatar: user.avatar}));
});

connect();


