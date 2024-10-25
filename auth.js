// Initialize Firebase (replace with your own config)
const firebaseConfig = {
    apiKey: "AIzaSyAAjT9cmvyFNVzahUNjCkKUriRr_1ukVxw",
	authDomain: "e-commerce-8f66d.firebaseapp.com",
	databaseURL: "https://e-commerce-8f66d-default-rtdb.firebaseio.com",
	projectId: "e-commerce-8f66d",
	storageBucket: "e-commerce-8f66d.appspot.com",
	messagingSenderId: "1003251890443",
	appId: "1:1003251890443:web:f9235d17e950baebcfca0e",
	measurementId: "G-C3G0GFFR73"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

// DOM Elements
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubmit = document.getElementById('auth-submit');
const authToggle = document.getElementById('auth-toggle');
const forgotPassword = document.getElementById('forgot-password');
const errorMessage = document.getElementById('error-message');

let isLoginMode = true;

// Event Listeners
authForm.addEventListener('submit', handleAuth);
authToggle.addEventListener('click', toggleAuthMode);
forgotPassword.addEventListener('click', handleForgotPassword);

// Functions
function handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (isLoginMode) {
        // Login
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                window.location.href = 'index.html';
            })
            .catch((error) => {
                showError(error.message);
            });
    } else {
        // Sign up
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed up
                window.location.href = 'index.html';
            })
            .catch((error) => {
                showError(error.message);
            });
    }
}

function toggleAuthMode(e) {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    if (isLoginMode) {
        authTitle.textContent = 'Login to TaskMaster';
        authSubmit.textContent = 'Login';
        authToggle.textContent = 'Sign up';
        forgotPassword.style.display = 'inline';
    } else {
        authTitle.textContent = 'Sign up for TaskMaster';
        authSubmit.textContent = 'Sign up';
        authToggle.textContent = 'Login';
        forgotPassword.style.display = 'none';
    }
    errorMessage.textContent = '';
}

function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    if (email) {
        auth.sendPasswordResetEmail(email)
            .then(() => {
                showError('Password reset email sent. Check your inbox.');
            })
            .catch((error) => {
                showError(error.message);
            });
    } else {
        showError('Please enter your email address.');
    }
}

function showError(message) {
    errorMessage.textContent = message;
}

// Check if user is already logged in
auth.onAuthStateChanged((user) => {
    if (user) {
        window.location.href = 'index.html';
    }
});