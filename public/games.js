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
        Playerx = console.log(currentUser.email);
    }
    ref.child(result).update({
        PlayerX: currentUser.email,
        PlayerXuid: currentUser.uid,
        PlayerO: "",
        PlayerOuid: "",
        turn: "X",
        state: "normal",
    });
    return result;
}


// ตัวอย่างดึงข้อมูล
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        var uid = user.uid;
        var email = user.email
        // console.log(uid)
        // console.log(email)
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
// id key ห้อง 
if (roomcodeDisplay != null) {
    roomcodeDisplay.innerHTML = `Your room code is : <p id="copycode" style="color: red; display: inline-block">${params.id}</p>`;
}

const refroom = firebase.database().ref('Game/' + 'Roomlist/');


// เอา key ห้องแต่ละอย่างใส่ไปใน array
var jim = [];
function ReadList(snapshot) {
    snapshot.forEach((data) => {
        const Room = data.key;
        jim.push(Room)
    });
};
ref.on('value', snapshot => {
    ReadList(snapshot)
});
console.log(jim);
// ปุ่มในหน้า่ main menu
function joinToggle() {
    var joinDiv = document.getElementById('joinDiv');
    joinDiv.classList.toggle("gone");
}

// เช็ตห้องว่าตรงไหม main menu
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

function Cancel() {
    window.location.href = `jimmy.html`;
    var refroomdelete = firebase.database().ref(`Game/` + `${params.id}`);
    refroomdelete.remove();
}

ref.on('value', snapshot => {
    Playerx = snapshot.child(`${params.id}`).child('PlayerX').val();
    Playero = snapshot.child(`${params.id}`).child('PlayerO').val();
    const currentUser = firebase.auth().currentUser;
    const wait = document.querySelectorAll('.wait');
    const waitpanel = document.querySelectorAll('#waitpanel');
    // console.log(currentUser.email);
    if (Playero == "") {
        wait.forEach(item => item.style.display = 'none');
        waitpanel.forEach(item => item.style.display = 'flex');
        // console.log("robo");
        // console.log(currentUser.email);
    }
    else {
        wait.forEach(item => item.style.display = 'flex');
        waitpanel.forEach(item => item.style.display = 'none');
        // console.log("robologin")
    }
});
// ฟังก์ชันท์ Copy text
// function copytext(element) {
//     var $temp = $("<input>");
//     $("body").append($temp);
//     $temp.val($(element).text()).select();
//     document.execCommand("copy");
//     $temp.remove();
//   }
countx = 0;
counto = 0;
//  ฟังก์ชันใส่ x o บน ตาราง
function buttonXO(btn) {
    // checkWin();
    var gameState = '';
    let turn = `turn`;
    const currentUser = firebase.auth().currentUser;
    plus = 1;
    ref.once('value', snapshot => {
        turn = snapshot.child(`${params.id}`).child('turn').val();
        btnID = btn.getAttribute('id');
        Playerx = snapshot.child(`${params.id}`).child('PlayerX').val();
        Playero = snapshot.child(`${params.id}`).child('PlayerO').val();
        state = snapshot.child(`${params.id}`).child('state').val();
        //check player X Y to put X, Y inner button (Update Realtime by using database)
        if (turn == 'X' && btn.querySelector('.display-4').innerHTML == '' && state == 'normal') {
            btn.querySelector('.display-4').innerHTML = 'X';
            ref.child(`${params.id}`).update({
                turn: `O`,
            });
            ref.child(`${params.id}`).child('table').update({
                [btnID]: `X`,
            })
        }
        if (turn == 'O' && btn.querySelector('.display-4').innerHTML == '' && state == 'normal') {
            btn.querySelector('.display-4').innerHTML = 'O';
            ref.child(`${params.id}`).update({
                turn: `X`,
            });
            ref.child(`${params.id}`).child('table').update({
                [btnID]: `O`,
            })
        }
        // ลง 2 ที เป็นตาของ X
        if (turn == 'X' && btn.querySelector('.display-4').innerHTML == '' && state == 'draw2') {
            if (countx != 1) {
                countx += plus;
                btn.querySelector('.display-4').innerHTML = 'X';
                ref.child(`${params.id}`).update({
                    turn: `X`,
                });
                ref.child(`${params.id}`).child('table').update({
                    [btnID]: `X`,
                })
                console.log(countx);
            }
            else if (countx == 1) {
                ref.child(`${params.id}`).child('table').update({
                    [btnID]: `X`,
                })
                ref.child(`${params.id}`).update({
                    turn: `O`,
                    state: 'normal',
                });
                countx = 0;
                document.querySelector("#cardEffect").innerHTML = "";
                document.querySelector('#randombtn').disabled = false;
            }
        }
        // ลง 2 ที เป็นตาของ O
        if (turn == 'O' && btn.querySelector('.display-4').innerHTML == '' && state == 'draw2') {
            if (counto != 1) {
                counto += plus;
                btn.querySelector('.display-4').innerHTML = 'X';
                ref.child(`${params.id}`).update({
                    turn: `O`,
                });
                ref.child(`${params.id}`).child('table').update({
                    [btnID]: `O`,
                })
                console.log(counto);
            }
            else if (counto == 1) {
                btn.querySelector('.display-4').innerHTML = 'X';
                ref.child(`${params.id}`).child('table').update({
                    [btnID]: `O`,
                })
                console.log(counto);
                ref.child(`${params.id}`).update({
                    turn: `X`,
                    state: 'normal',
                });
                counto = 0;
                document.querySelector("#cardEffect").innerHTML = "";
                document.querySelector('#randombtn').disabled = false;
            }
        }
        // delete x turn
        if (turn == 'X' && btn.querySelector('.display-4').innerHTML == 'O' && state == 'delete') {
            btn.querySelector('.display-4').innerHTML = '';
            ref.child(`${params.id}`).update({
                turn: `O`,
                state: 'normal',
            });
            ref.child(`${params.id}`).child('table').update({
                [btnID]: ``,
            })
            document.querySelector("#cardEffect").innerHTML = "";
            document.querySelector('#randombtn').disabled = false;
        }
        // delete O turn
        if (turn == 'O' && btn.querySelector('.display-4').innerHTML == 'X' && state == 'delete') {
            btn.querySelector('.display-4').innerHTML = '';
            ref.child(`${params.id}`).update({
                turn: `X`,
                state: 'normal',
            });
            ref.child(`${params.id}`).child('table').update({
                [btnID]: ``,
            })
            document.querySelector("#cardEffect").innerHTML = "";
            document.querySelector('#randombtn').disabled = false;
        }
    });
}

// function checkWin() {
//     ref.once('value', snapshot => {
//         if()
//     });
// }

// Update key to table by get data from database
const btn_table = document.querySelectorAll('.table-col');
ref.on('value', snapshot => {
    for (let i = 0; i < btn_table.length; i++) {
        let btn = btn_table[i].getAttribute('id');
        let symbol = snapshot.child(`${params.id}`).child('table').child(btn).val();
        if (symbol) {
            document.getElementById(btn).querySelector('.display-4').innerHTML = symbol;
        } else {
            document.getElementById(btn).querySelector('.display-4').innerHTML = '';
        }
    }
});


// randoming cards สุ่มการ์ด

const cardtype = ["draw2", "skip","delete"];
function randomCard() {
    var display = cardtype[Math.floor(Math.random() * 3)];
    document.querySelector("#cardEffect").innerHTML = display;
    console.log(display);
    // สุ่มได้ ลง 2 ที
    if (display == "draw2") {
        // btn_table.forEach(item => item.removeAttribute("onclick"));
        // btn_table.forEach(item => item.onclick = draw())
        ref.child(`${params.id}`).update({
            state: `draw2`,
        });
        document.querySelector('#randombtn').disabled = true;
    }
    // สุ่มได้ข้ามเทิร์น
    if (display == "skip") {
        ref.once('value', snapshot => {
            turn = snapshot.child(`${params.id}`).child('turn').val();
            if (turn == 'O') {
                ref.child(`${params.id}`).update({
                    turn: `X`,
                });
            }
            if (turn == 'X') {
                ref.child(`${params.id}`).update({
                    turn: `O`,
                });
            }
        });
        // document.querySelector("#cardEffect").innerHTML = "";
    }
    // สุ่มได้ลบ 1 ตัว
    if (display == "delete") {
        ref.once('value', snapshot => {
            turn = snapshot.child(`${params.id}`).child('turn').val();
            // เช็คว่าแต่ละแถวมีตัวที่จะให้ลบไหม ถ้าไม่มีให้เปลี่ยนเทิร์น
            for (let i = 0; i < btn_table.length; i++) {
                let btn = btn_table[i].getAttribute('id');
                let symbol = snapshot.child(`${params.id}`).child('table').child(btn).val();
                // เทิร์น ของ X ลบ O ออก
                if (symbol == "O" && turn == 'X') {
                    ref.child(`${params.id}`).update({
                        state: `delete`,
                        turn: `X`,
                    });
                }
                else if (symbol == "X" && turn == 'O') {
                    ref.child(`${params.id}`).update({
                        state: `delete`,
                        turn: `O`,
                    });
                }
                // else if (symbol != "O" && turn == 'X') {
                //     ref.child(`${params.id}`).update({
                //         turn: `O`,
                //     });
                //     document.querySelector('#randombtn').disabled = false;
                // }
                // else if (symbol != "X" && turn == 'O') {
                //     ref.child(`${params.id}`).update({
                //         turn: `X`,
                //     });
                //     document.querySelector('#randombtn').disabled = false;
                // }
            }
        });
        document.querySelector('#randombtn').disabled = true;
    }
}