const ref = firebase.database().ref("Game");

const creategame = document.querySelector(".creategame");


function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    ref.child('Roomlist').push({
        Room: result
    });
    return result;
}

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


function ReadList(snapshot) {
    snapshot.forEach((data) => {
        const Room = data.val().Room;
        console.log(Room);
    });
};
ref.on('value', (snapshot) => {
    // then(function (dataSnapshot) {
    //     dataSnapshot.forEach(function(childSnapshot) {
    //         var childkey = childSnapshot.key;
    //         var childData = childSnapshot.val();
    //         // console.log(childkey);

    //     });
});

refroom.on('value', snapshot => {
    ReadList(snapshot)

})

function joinToggle() {
    var joinDiv = document.getElementById('joinDiv');
    joinDiv.classList.toggle("gone");
}