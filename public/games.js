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



ref.on('value', snapshot => {


})