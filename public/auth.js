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
            signupFeedback.style = `color:green`;
            signupFeedback.innerHTML = ` Signup completed`;
            setTimeout(function() { signupModal.hide(); }, 1000);
            setTimeout(function() {
                signupForm.reset();
                signupFeedback.innerHTML = ``
            }, 1000);
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
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', loginUser);

const loginFeedback = document.querySelector('#feedback-msg-login');
const loginModal = new bootstrap.Modal(document.querySelector('#modal-login'));

function loginUser(event) {
    event.preventDefault();
    const email = loginForm['input-email-login'].value;
    const password = loginForm['input-password-login'].value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            loginFeedback.style = `color:green`;
            loginFeedback.innerHTML = `Login successed.`;
            setTimeout(function() {
                loginModal.hide();
                console.log(loginModal)
            }, 1000);
            setTimeout(function() {
                loginForm.reset();
                loginFeedback.innerHTML = ``
            }, 1000);
            window.location.href = `jimmy.html`;
        })
        .catch((error) => {
            loginFeedback.style = `color:crimson`;
            loginFeedback.innerHTML = `${error.message}`;
            loginForm.reset();
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