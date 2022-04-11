const ref = firebase.database().ref("Game");

const creategame = document.querySelector(".creategame");

// ฟังค์ชันสร้าง เลขห้อง
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


// ตัวอย่างดึงข้อมูล
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
// ฟังค์์ชั่นสร้างห้อง
function Create() {
    window.location.href = `game.html?id=${makeid(10)}`
}

// ค่า id key
const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), })
console.log(params.id);
const roomcodeDisplay = document.querySelector("#roomcodeDisplay")
roomcodeDisplay.innerHTML = `Your room code is : <p id="copycode" style="color: red; display: inline-block">${params.id}</p>`

const refroom = firebase.database().ref('Game/' + 'Roomlist/');


ref.on('value', (snapshot) => {
    // then(function (dataSnapshot) {
    //     dataSnapshot.forEach(function(childSnapshot) {
    //         var childkey = childSnapshot.key;
    //         var childData = childSnapshot.val();
    //         // console.log(childkey);

    //     });
});
// เอา key ห้องแต่ละอย่างใส่ไปใน array
var ListRoom = [];
function ReadList(snapshot) {
    snapshot.forEach((data) => {
        const Room = data.key;
        ListRoom.push(Room)
    });
};
ref.on('value', snapshot => {
    ReadList(snapshot)

})
// ปุ่มในหน้า่ main menu
function joinToggle() {
    var joinDiv = document.getElementById('joinDiv');
    joinDiv.classList.toggle("gone");
}

console.log(ListRoom);
// เช็ตห้องว่าตรงไหม main menu
const roominput = document.querySelector('#roominput');
// roominput.addEventListener('button', gotoroom);
function join() {
    ListRoom.forEach((roomid) => {
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

function Cancel() {
    window.location.href = `jimmy.html`;
    var refroomdelete = firebase.database().ref(`Game/` + `${params.id}`);
    refroomdelete.remove();
}
// ฟังก์ชันท์ Copy text
// function copytext(element) {
//     var $temp = $("<input>");
//     $("body").append($temp);
//     $temp.val($(element).text()).select();
//     document.execCommand("copy");
//     $temp.remove();
//   }