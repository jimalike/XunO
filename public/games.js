const ref = firebase.database().ref("Game");

const creategame = document.querySelector(".creategame");


function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
        Playerx =
            console.log(currentUser.email);
    }
    ref.child(result).update({
        PlayerX: currentUser.email,
        PlayerXuid: currentUser.uid,
        PlayerO: 0,
        PlayerOuid: 0,
    });
    return result;
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        var uid = user.uid;
        var email = user.email
        console.log(uid)
        console.log(email)
        // ...
    } else {
        // User is signed out
        // ...
    }
});
// firebase.auth().onAuthStateChange((user) => {
//     setupUI(user);
// })
// ref.child('Roomnumber').writeUserData({
//     Roomnumber: params.id,
// });

function Create() {
    // console.log("โหล")
    window.location.href = `game.html?id=${makeid(10)}`
}

// const currentUser = firebase.auth().currentUser;
//     console.log('[Join] Current user:', currentUser)

const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
console.log(params.id);

const refroom = firebase.database().ref('Game/' + 'Roomlist/');


ref.on('value', (snapshot) => {
    // then(function (dataSnapshot) {
    //     dataSnapshot.forEach(function(childSnapshot) {
    //         var childkey = childSnapshot.key;
    //         var childData = childSnapshot.val();
    //         // console.log(childkey);

    //     });
});
var jim = [];
function ReadList(snapshot) {
    snapshot.forEach((data) => {
        const Room = data.key;
        jim.push(Room)
        console.log(Room);
    });
};
ref.on('value', snapshot => {
    ReadList(snapshot)

})

function joinToggle() {
    var joinDiv = document.getElementById('joinDiv');
    joinDiv.classList.toggle("gone");
}

console.log(jim);
const roominput = document.querySelector('#roominput');
// roominput.addEventListener('button', gotoroom);
function join() {
    jim.forEach((roomid) => {
        if (roominput.value === roomid) {
            const currentUser = firebase.auth().currentUser;
            ref.child(roominput.value).update({
                PlayerO: currentUser.email,
                PlayerOuid: currentUser.uid,
            });
            window.location.href = `game.html?id=${roomid}`;
        }

    });

}