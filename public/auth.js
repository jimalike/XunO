const reffer = firebase.database().ref("Game");

const signupFeedback = document.querySelector('#feedback-msg-signup');
const signupModal = new bootstrap.Modal(document.querySelector('#modal-signup'));
const modal_bd = document.querySelectorAll('.modal-backdrop');
//Create a password-based account

function createUser() {
    username = document.getElementById('input-username-signup').value;
    email = document.getElementById('input-email-signup');
    password = document.getElementById('input-password-signup');
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then(() => {
            var user = firebase.auth().currentUser;
            var user_data = {
                username: `${username}`,
                email: user.email,
                win: 0,
                loss: 0,
                allmatch: 0,
                winrate: 0,
            }
            reffer.child('user/' + user.uid).set(user_data)
            window.location.href = `jimmy.html`;
            console.log(username+password+email);
        })
        .catch((error) => {
            signupFeedback.style = `color:crimson`;
            signupFeedback.innerHTML = ` ${error.message}`;
            document.getElementById('input-username-signup').value = '';
            email.value = '';
            password.value = '';
        });
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log('User: ', user)
        setupUI(user)
    } else {
        console.log('Unavailable user')
    }
});

//Logout
const btnLogout = document.querySelector('#btnLogout');
btnLogout.addEventListener('click', () => {
    firebase.auth().signOut();
    console.log('Logout Complete.');
})

const loginbtn = document.querySelector('#btnLogin');
loginbtn.addEventListener('click', loginUser);

//Login
// const loginModal = new bootstrap.Modal(document.querySelector('#modal-login'));

function loginUser() {
    const loginFeedback = document.querySelector('#feedback-msg-login');
    const email = document.querySelector('#input-email-login');
    console.log(email);
    const password = document.querySelector('#input-password-login');
    console.log(password);
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then(() => {
            loginFeedback.style = `color:green`;
            loginFeedback.innerHTML = `Login successed.`;
            setTimeout(function () {
                window.location.href = `jimmy.html`;
            }, 1500);
        })
        .catch((error) => {
            loginFeedback.style = `color:crimson; display:block`;
            loginFeedback.innerHTML = `${error.message}`;
            // loginForm.reset();
            email.value = "";
            password.value = "";
        });
}

const btnCancel = document.querySelectorAll('.btn-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
        signupForm.reset();
        loginForm.reset();
        signupFeedback.innerHTML = ``
        loginFeedback.innerHTML = ``
    })
})


firebase.auth().onAuthStateChanged((user) => {
    setupUI(user);
    // playerCheck();
    // gameStateCheck();


});



function getUser() {
    const user1 = firebase.auth().currentUser;
    // console.log('User1: ', user1);
    return user1
}


const logoutItems = document.querySelectorAll('.logged-out');
const loginItems = document.querySelectorAll('.logged-in');
// const btnItems = document.querySelectorAll('.logged-out');
// const playGame = document.querySelectorAll('.play-game');

function setupUI(user) {
    if (user) {
        reffer.once('value', snapshot => {
            const username = firebase.auth().currentUser;
            uname = snapshot.child(`user`).child(username.uid).child('username').val();
            document.querySelector('#user-profile-uname').innerHTML = ` User : ${uname}  `;
        });
        document.querySelector('#user-profile-name').innerHTML = ` Email : ${user.email}`;
        loginItems.forEach(item => item.style.display = 'inline-block');
        logoutItems.forEach(item => item.style.display = 'none');
        // btnItems.forEach(item => item.style.display = 'none');
        // playGame.forEach(item => item.style.display = 'inline-block');
        // waitStatus.style.display = "none";
        // document.querySelector('#game-body').style.display = 'block';
    } else {
        loginItems.forEach(item => item.style.display = 'none');
        logoutItems.forEach(item => item.style.display = 'inline-block');
        // btnItems.forEach(item => item.style.display = 'inline-block');
        // waitStatus.style.display = "inline-block";
        // playGame.forEach(item => item.style.display = 'none');
    }
}