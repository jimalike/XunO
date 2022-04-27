const ref = firebase.database().ref("Game");
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', createUser);

const signupFeedback = document.querySelector('#feedback-msg-signup');
const signupModal = new bootstrap.Modal(document.querySelector('#modal-signup'));
const modal_bd = document.querySelectorAll('.modal-backdrop');
//Create a password-based account
function createUser(event) {
    event.preventDefault();
    const email = signupForm['input-email-signup'].value;
    const password = signupForm['input-password-signup'].value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
            const currentUser = firebase.auth().currentUser;
            var user = firebase.auth().currentUser;
            var ref = firebase.database().ref()
            var user_data = {
                email : currentUser.email,
                win : '0',
            }
            ref.child('user/' + user.uid).set(user_data)
            window.location.href = `jimmy.html`;
        })
        .catch((error) => {
            signupFeedback.style = `color:crimson`;
            signupFeedback.innerHTML = ` ${error.message}`;
            signupForm.reset();
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

//Login
const loginbtn = document.querySelector('#btnLogin');
loginbtn.addEventListener('click', loginUser);

const loginFeedback = document.querySelector('#feedback-msg-login');
// const loginModal = new bootstrap.Modal(document.querySelector('#modal-login'));

function loginUser(event) {
    event.preventDefault();
    console.log("hello!");
    const email = document.querySelector('#input-email-login');
    console.log(email);
    const password = document.querySelector('#input-password-login');
    console.log(password);
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then(() => {
            loginFeedback.style = `color:green`;
            loginFeedback.innerHTML = `Login successed.`;
            setTimeout(function() {
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
        document.querySelector('#user-profile-name').innerHTML = user.email;
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