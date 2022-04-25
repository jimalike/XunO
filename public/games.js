const ref = firebase.database().ref("Game");
const creategame = document.querySelector(".creategame");
const display_turnstate = document.querySelector('.display-turnstate');
const card_text = document.querySelector('#cardEffect');


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
        display_turnstate: 'Turn Player X',
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
    var winner = snapshot.child(`${params.id}`).child('winner').val();
    const cardbox = document.querySelector(".cardbox")
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
        if (!winner) {
            cardbox.style.display = 'flex';
        }
        else {
            cardbox.style.display = 'none';
        }

    }
});


countx = 0;
counto = 0;
//  ฟังก์ชันใส่ x o บน ตาราง
function buttonXO(btn) {
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
        var winner = snapshot.child(`${params.id}`).child('winner').val();
        //check player X Y to put X, Y inner button (Update Realtime by using database)
        if (!winner) {
            if (turn == 'X' && btn.querySelector('.display-4').innerHTML == '' && state == 'normal') {
                // display_turnstate.innerHTML = 'Turn Player O';
                btn.querySelector('.display-4').innerHTML = 'X';
                ref.child(`${params.id}`).update({
                    turn: `O`,
                    display_turnstate: 'Turn Player O',
                });
                ref.child(`${params.id}`).child('table').update({
                    [btnID]: `X`,
                })
                checkWin();
            }
            if (turn == 'O' && btn.querySelector('.display-4').innerHTML == '' && state == 'normal') {
                // display_turnstate.innerHTML = 'Turn Player X';
                btn.querySelector('.display-4').innerHTML = 'O';
                ref.child(`${params.id}`).update({
                    turn: `X`,
                    display_turnstate: 'Turn Player X',
                });
                ref.child(`${params.id}`).child('table').update({
                    [btnID]: `O`,
                })
                checkWin();
            }
            // ลง 2 ที เป็นตาของ X
            if (turn == 'X' && btn.querySelector('.display-4').innerHTML == '' && state == 'draw2') {
                // display_turnstate.innerHTML = 'Turn Player X put your marks 1 time';
                if (countx != 1) {
                    countx += plus;
                    btn.querySelector('.display-4').innerHTML = 'X';
                    ref.child(`${params.id}`).update({
                        display_turnstate: 'Turn Player X put your marks 1 time',
                        turn: `X`,
                    });
                    ref.child(`${params.id}`).child('table').update({
                        [btnID]: `X`,
                    })
                    console.log(countx);
                    checkWin();
                }
                else if (countx == 1) {
                    // display_turnstate.innerHTML = 'Turn Player O';
                    ref.child(`${params.id}`).child('table').update({
                        [btnID]: `X`,
                    })
                    ref.child(`${params.id}`).update({
                        turn: `O`,
                        state: 'normal',
                        display_turnstate: 'Turn Player O',
                        card_text: "",
                    });
                    countx = 0;
                    checkWin();
                    // document.querySelector("#cardEffect").innerHTML = "";
                    document.querySelector('#randombtn').disabled = false;
                }
            }
            // ลง 2 ที เป็นตาของ O
            if (turn == 'O' && btn.querySelector('.display-4').innerHTML == '' && state == 'draw2') {
                if (counto != 1) {
                    // display_turnstate.innerHTML = 'Turn Player O put your marks 1 time';
                    counto += plus;
                    btn.querySelector('.display-4').innerHTML = 'X';
                    ref.child(`${params.id}`).update({
                        turn: `O`,
                        display_turnstate: 'Turn Player O put your marks 1 time',
                    });
                    ref.child(`${params.id}`).child('table').update({
                        [btnID]: `O`,
                    })
                    console.log(counto);
                    checkWin();
                }
                else if (counto == 1) {
                    // display_turnstate.innerHTML = 'Turn Player X';
                    btn.querySelector('.display-4').innerHTML = 'X';
                    ref.child(`${params.id}`).child('table').update({
                        [btnID]: `O`,
                    })
                    console.log(counto);
                    ref.child(`${params.id}`).update({
                        turn: `X`,
                        state: 'normal',
                        display_turnstate: 'Turn Player X',
                        card_text: "",
                    });
                    counto = 0;
                    checkWin();
                    // document.querySelector("#cardEffect").innerHTML = "";
                    document.querySelector('#randombtn').disabled = false;
                }
            }
            // delete x turn
            if (turn == 'X' && btn.querySelector('.display-4').innerHTML == 'O' && state == 'delete') {
                btn.querySelector('.display-4').innerHTML = '';
                ref.child(`${params.id}`).update({
                    turn: `O`,
                    state: 'normal',
                    display_turnstate: 'Turn Player O',
                    card_text: "",
                });
                ref.child(`${params.id}`).child('table').update({
                    [btnID]: ``,
                })
                checkWin();
                // document.querySelector("#cardEffect").innerHTML = "";
                document.querySelector('#randombtn').disabled = false;
            }
            // delete O turn
            if (turn == 'O' && btn.querySelector('.display-4').innerHTML == 'X' && state == 'delete') {
                btn.querySelector('.display-4').innerHTML = '';
                ref.child(`${params.id}`).update({
                    turn: `X`,
                    state: 'normal',
                    display_turnstate: 'Turn Player X',
                    card_text: "",
                });
                ref.child(`${params.id}`).child('table').update({
                    [btnID]: ``,
                })
                checkWin();
                // document.querySelector("#cardEffect").innerHTML = "";
                document.querySelector('#randombtn').disabled = false;
            }
            // ลงทับ เป็นตาของ X
            if (turn == 'X' && btn.querySelector('.display-4').innerHTML == 'O' && state == 'overlap') {
                btn.querySelector('.display-4').innerHTML = 'X';
                ref.child(`${params.id}`).update({
                    turn: `O`,
                    state: 'normal',
                    display_turnstate: 'Turn Player O',
                    card_text: "",
                });
                ref.child(`${params.id}`).child('table').update({
                    [btnID]: `X`,
                })
                // document.querySelector("#cardEffect").innerHTML = "";
                document.querySelector('#randombtn').disabled = false;
            }

            // ลงทับ เป็นตาของ  O
            if (turn == 'O' && btn.querySelector('.display-4').innerHTML == 'X' && state == 'overlap') {
                btn.querySelector('.display-4').innerHTML = 'O';
                ref.child(`${params.id}`).update({
                    turn: `X`,
                    state: 'normal',
                    display_turnstate: 'Turn Player X',
                    card_text: "",
                });
                ref.child(`${params.id}`).child('table').update({
                    [btnID]: `O`,
                })
                // document.querySelector("#cardEffect").innerHTML = "";
                document.querySelector('#randombtn').disabled = false;
            }
             // บังคับลง เป็นตาของ X
             if (turn == 'X' && btn.querySelector('.display-4').innerHTML == '' && state == 'force') {
                btn.querySelector('.display-4').innerHTML = 'O';
                ref.child(`${params.id}`).update({
                    turn: `O`,
                    state: 'normal',
                    display_turnstate: 'Turn Player O',
                    card_text: "",
                });
                ref.child(`${params.id}`).child('table').update({
                    [btnID]: `O`,
                })
                // document.querySelector("#cardEffect").innerHTML = "";
                document.querySelector('#randombtn').disabled = false;
            }

            // บังคับลง เป็นตาของ  O
            if (turn == 'O' && btn.querySelector('.display-4').innerHTML == '' && state == 'force') {
                btn.querySelector('.display-4').innerHTML = 'X';
                ref.child(`${params.id}`).update({
                    turn: `X`,
                    state: 'normal',
                    display_turnstate: 'Turn Player X',
                    card_text: "",
                });
                ref.child(`${params.id}`).child('table').update({
                    [btnID]: `X`,
                })
                // document.querySelector("#cardEffect").innerHTML = "";
                document.querySelector('#randombtn').disabled = false;
            }
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
    let state_text = snapshot.child(`${params.id}`).child('display_turnstate').val();
    display_turnstate.innerHTML = state_text;
    let cardtext = snapshot.child(`${params.id}`).child('card_text').val();
    card_text.innerHTML = cardtext;
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
const cardtype = ["draw2", "skip", "delete","overlap","force"];
function randomCard() {
    ref.once('value', snapshot => {
        turn = snapshot.child(`${params.id}`).child('turn').val();
        var winner = snapshot.child(`${params.id}`).child('winner').val();
        var display = cardtype[Math.floor(Math.random() * 5)];
        ref.child(`${params.id}`).update({
            card_text: display,
        });
        // document.querySelector("#cardEffect").innerHTML = display;
        console.log(display);
        if (!winner) {
            // สุ่มได้ ลง 2 ที
            if (display == "draw2") {
                ref.child(`${params.id}`).update({
                    state: `draw2`,
                });
                document.querySelector('#randombtn').disabled = true;
                if (turn == 'X') {
                    // display_turnstate.innerHTML = 'Turn Player X put your marks 2 times';
                    ref.child(`${params.id}`).update({
                        turn: `X`,
                        display_turnstate: 'Turn Player X put your marks 2 times',
                    });
                }
                if (turn == 'O') {
                    // display_turnstate.innerHTML = 'Turn Player O put your marks 2 times';
                    ref.child(`${params.id}`).update({
                        turn: `O`,
                        display_turnstate: 'Turn Player O put your marks 2 times',
                    });
                }
            }
            // สุ่มได้ข้ามเทิร์น
            if (display == "skip") {
                document.querySelector('#randombtn').disabled = false;
                if (turn == 'O') {
                    // display_turnstate.innerHTML = 'You draw skip now its turn X';
                    ref.child(`${params.id}`).update({
                        turn: `X`,
                        display_turnstate: 'You draw skip now its turn X',
                    });
                }
                if (turn == 'X') {
                    // display_turnstate.innerHTML = 'You draw skip now its turn O';
                    ref.child(`${params.id}`).update({
                        turn: `O`,
                        display_turnstate: 'You draw skip now its turn O',
                    });
                }
                // document.querySelector("#cardEffect").innerHTML = "";
            }
            // สุ่มได้ลบ 1 ตัว
            if (display == "delete") {
                turn = snapshot.child(`${params.id}`).child('turn').val();
                countxtodel = 0;
                countotodel = 0;
                // เช็คว่าแต่ละแถวมีตัวที่จะให้ลบไหม
                for (let i = 0; i < btn_table.length; i++) {
                    let btn = btn_table[i].getAttribute('id');
                    let symbol = snapshot.child(`${params.id}`).child('table').child(btn).val();
                    if (symbol == "X") {
                        countxtodel += 1;
                    }
                    if (symbol == "O") {
                        countotodel += 1;
                    }
                }
                if (turn == "X" && countotodel == 0) {
                    // display_turnstate.innerHTML = 'You not have anything to delete O now it turn O';
                    ref.child(`${params.id}`).update({
                        turn: `O`,
                        state: 'normal',
                        display_turnstate: 'You can not overlap now it turn O',

                    });
                    document.querySelector('#randombtn').disabled = false;
                }
                else if (turn == "O" && countxtodel == 0) {
                    // display_turnstate.innerHTML = 'You not have anything to delete X now it turn X';
                    ref.child(`${params.id}`).update({
                        turn: `X`,
                        state: 'normal',
                        display_turnstate: 'You can not overlap now it turn X',
                    });
                    document.querySelector('#randombtn').disabled = false;
                }
                else if (turn == "X" && countotodel != 0) {
                    // display_turnstate.innerHTML = 'Turn Player X delete 1 player O mark';
                    ref.child(`${params.id}`).update({
                        state: 'delete',
                        display_turnstate: 'Turn Player X overlap 1 player O mark',
                    });
                    document.querySelector('#randombtn').disabled = true;
                }
                else if (turn == "O" && countxtodel != 0) {
                    // display_turnstate.innerHTML = 'Turn Player O delete 1 player X mark';
                    ref.child(`${params.id}`).update({
                        state: 'delete',
                        display_turnstate: 'Turn Player O overlap 1 player X mark',
                    });
                    document.querySelector('#randombtn').disabled = true;
                }
            }
            // ลงทับ 1 ตัว
            if (display == "overlap") {
                turn = snapshot.child(`${params.id}`).child('turn').val();
                countxtoswap = 0;
                countotoswap = 0;
                // เช็คว่าแต่ละแถวมีตัวที่จะให้ทับไหม
                for (let i = 0; i < btn_table.length; i++) {
                    let btn = btn_table[i].getAttribute('id');
                    let symbol = snapshot.child(`${params.id}`).child('table').child(btn).val();
                    if (symbol == "X") {
                        countxtoswap += 1;
                    }
                    if (symbol == "O") {
                        countotoswap += 1;
                    }
                }
                if (turn == "X" && countotoswap == 0) {
                    ref.child(`${params.id}`).update({
                        turn: `O`,
                        state: 'normal',
                        display_turnstate: 'You can not overlap now it turn O',

                    });
                    document.querySelector('#randombtn').disabled = false;
                }
                else if (turn == "O" && countxtoswap == 0) {
                    ref.child(`${params.id}`).update({
                        turn: `X`,
                        state: 'normal',
                        display_turnstate: 'You can not overlap now it turn X',
                    });
                    document.querySelector('#randombtn').disabled = false;
                }
                else if (turn == "X" && countotoswap != 0) {
                    ref.child(`${params.id}`).update({
                        state: 'overlap',
                        display_turnstate: 'Turn Player X choose O to overlap',
                    });
                    document.querySelector('#randombtn').disabled = true;
                }
                else if (turn == "O" && countxtoswap != 0) {
                    ref.child(`${params.id}`).update({
                        state: 'overlap',
                        display_turnstate: 'Turn Player O choose X to overlap',
                    });
                    document.querySelector('#randombtn').disabled = true;
                }
            }
             // สุ่มได้ บังคับลงอีกฝ่าย 1 ที
             if (display == "force") {
                ref.child(`${params.id}`).update({
                    state: `force`,
                });
                document.querySelector('#randombtn').disabled = true;
                if (turn == 'X') {
                    // display_turnstate.innerHTML = 'Turn Player X put your marks 2 times';
                    ref.child(`${params.id}`).update({
                        turn: `X`,
                        display_turnstate: 'Turn Player X You force to mark O 1 time',
                    });
                }
                if (turn == 'O') {
                    // display_turnstate.innerHTML = 'Turn Player O put your marks 2 times';
                    ref.child(`${params.id}`).update({
                        turn: `O`,
                        display_turnstate: 'Turn Player O You force to mark X 1 time',
                    });
                }
            }
        }
        else {
            document.querySelector('#randombtn').disabled = true;
        }
    });
}


function checkWin() {
    // Checkdisplay();
    var datalist = [];
    const endgame = document.querySelector('#endgame');
    ref.once('value', snapshot => {
        turn = snapshot.child(`${params.id}`).child('turn').val();
        symbolcount = 0;
        for (let i = 0; i < btn_table.length; i++) {
            let btn = btn_table[i].getAttribute('id');
            let symbol = snapshot.child(`${params.id}`).child('table').child(btn).val();
            datalist[i] = symbol;
            if (symbol == "X" || symbol == "O") {
                symbolcount += 1;
            }
        }
        if (symbolcount == 25) {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Tie',
                winner: "Tie",
            });
            endgame.style.display = 'flex';
        }
        // check X //
        else if (datalist[0] == "X" && datalist[1] == "X" && datalist[2] == "X" && datalist[3] == "X" && datalist[4] == "X") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player X win',
                winner: "X",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[5] == "X" && datalist[6] == "X" && datalist[7] == "X" && datalist[8] == "X" && datalist[9] == "X") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player X win',
                winner: "X",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[10] == "X" && datalist[11] == "X" && datalist[12] == "X" && datalist[13] == "X" && datalist[14] == "X") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player X win',
                winner: "X",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[15] == "X" && datalist[16] == "X" && datalist[17] == "X" && datalist[18] == "X" && datalist[19] == "X") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player X win',
                winner: "X",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[20] == "X" && datalist[21] == "X" && datalist[22] == "X" && datalist[23] == "X" && datalist[24] == "X") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player X win',
                winner: "X",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[20] == "X" && datalist[21] == "X" && datalist[22] == "X" && datalist[23] == "X" && datalist[24] == "X") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player X win',
                winner: "X",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[0] == "X" && datalist[5] == "X" && datalist[10] == "X" && datalist[15] == "X" && datalist[20] == "X") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player X win',
                winner: "X",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[1] == "X" && datalist[6] == "X" && datalist[11] == "X" && datalist[16] == "X" && datalist[21] == "X") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player X win',
                winner: "X",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[2] == "X" && datalist[7] == "X" && datalist[12] == "X" && datalist[17] == "X" && datalist[22] == "X") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player X win',
                winner: "X",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[3] == "X" && datalist[8] == "X" && datalist[13] == "X" && datalist[18] == "X" && datalist[23] == "X") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player X win',
                winner: "X",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[4] == "X" && datalist[9] == "X" && datalist[14] == "X" && datalist[19] == "X" && datalist[24] == "X") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player X win',
                winner: "X",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[0] == "X" && datalist[6] == "X" && datalist[12] == "X" && datalist[18] == "X" && datalist[24] == "X") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player X win',
                winner: "X",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[4] == "X" && datalist[8] == "X" && datalist[12] == "X" && datalist[16] == "X" && datalist[20] == "X") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player X win',
                winner: "X",
            });
            endgame.style.display = 'flex';
        }
        // check O //
        else if (datalist[0] == "O" && datalist[1] == "O" && datalist[2] == "O" && datalist[3] == "O" && datalist[4] == "O") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player O win',
                winner: "O",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[5] == "O" && datalist[6] == "O" && datalist[7] == "O" && datalist[8] == "O" && datalist[9] == "O") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player O win',
                winner: "O",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[10] == "O" && datalist[11] == "O" && datalist[12] == "O" && datalist[13] == "O" && datalist[14] == "O") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player O win',
                winner: "O",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[15] == "O" && datalist[16] == "O" && datalist[17] == "O" && datalist[18] == "O" && datalist[19] == "O") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player O win',
                winner: "O",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[20] == "O" && datalist[21] == "O" && datalist[22] == "O" && datalist[23] == "O" && datalist[24] == "O") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player O win',
                winner: "O",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[20] == "O" && datalist[21] == "O" && datalist[22] == "O" && datalist[23] == "O" && datalist[24] == "O") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player O win',
                winner: "O",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[0] == "O" && datalist[5] == "O" && datalist[10] == "O" && datalist[15] == "O" && datalist[20] == "O") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player O win',
                winner: "O",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[1] == "O" && datalist[6] == "O" && datalist[11] == "O" && datalist[16] == "O" && datalist[21] == "O") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player O win',
                winner: "O",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[2] == "O" && datalist[7] == "O" && datalist[12] == "O" && datalist[17] == "O" && datalist[22] == "O") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player O win',
                winner: "O",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[3] == "O" && datalist[8] == "O" && datalist[13] == "O" && datalist[18] == "O" && datalist[23] == "O") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player O win',
                winner: "O",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[4] == "O" && datalist[9] == "O" && datalist[14] == "O" && datalist[19] == "O" && datalist[24] == "O") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player O win',
                winner: "O",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[0] == "O" && datalist[6] == "O" && datalist[12] == "O" && datalist[18] == "O" && datalist[24] == "O") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player O win',
                winner: "O",
            });
            endgame.style.display = 'flex';
        }
        else if (datalist[4] == "O" && datalist[8] == "O" && datalist[12] == "O" && datalist[16] == "O" && datalist[20] == "O") {
            ref.child(`${params.id}`).update({
                display_turnstate: 'Player O win',
                winner: "O",
            });
            endgame.style.display = 'flex';
        }
    });
}
// function Checkdisplay(){
//     ref.once('value', snapshot => {
//         var winner = snapshot.child(`${params.id}`).child('winner').val();
//         const cardbox = document.querySelector(".cardbox")
//         if (!winner){
//             cardbox.style.display = 'flex';
//         }
//         else{
//             cardbox.style.display = 'none';
//         }
//     })
// }
