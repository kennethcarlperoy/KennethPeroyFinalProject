// Auth Logic
const STORAGE_KEY = 'loggedInUser';
const USERS_KEY = 'registeredUsers';

// Helper functions
function getRegisteredUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

function getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEY);
    return user ? JSON.parse(user) : null;
}

// Check auth on main page
function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
    } else {
        // Update UI with user info if needed
        const userSpan = document.getElementById('username-display');
        if (userSpan) userSpan.textContent = user.username;
    }
}

// Login Logic
function handleLogin(e) {
    e.preventDefault();
    const usernameInput = document.getElementById('login-username').value;
    const passwordInput = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('login-error');

    // Default demo user
    const demoUser = { username: 'student', password: 'Student123!', email: 'student@example.com' };
    const users = getRegisteredUsers();
    
    const foundUser = users.find(u => 
        (u.username === usernameInput || u.email === usernameInput) && u.password === passwordInput
    ) || ((usernameInput === demoUser.username || usernameInput === demoUser.email) && passwordInput === demoUser.password ? demoUser : null);

    if (foundUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(foundUser));
        window.location.href = 'index.html';
    } else {
        errorMsg.style.display = 'block';
        errorMsg.textContent = 'Invalid credentials';
    }
}

// Register Logic
function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    const errorMsg = document.getElementById('reg-error');

    if (password !== confirm) {
        errorMsg.style.display = 'block';
        errorMsg.textContent = "Passwords don't match";
        return;
    }

    const users = getRegisteredUsers();
    if (users.some(u => u.username === username || u.email === email)) {
        errorMsg.style.display = 'block';
        errorMsg.textContent = "User already exists";
        return;
    }

    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Auto login
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    window.location.href = 'index.html';
}

function logout() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = 'login.html';
}

// Tab Switching
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    document.querySelector(`[onclick="switchTab('${tab}')"]`).classList.add('active');
    document.getElementById(`${tab}-form`).classList.add('active');
}

// Smooth Scroll
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Initialize based on page
document.addEventListener('DOMContentLoaded', () => {
    const isLoginPage = window.location.pathname.includes('login.html');
    
    if (!isLoginPage) {
        checkAuth();
        
        // Add logout listener
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) logoutBtn.addEventListener('click', logout);
        
        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Message Sent! Kenneth will get back to you soon.');
                e.target.reset();
            });
        }
    } else {
        // Login page listeners
        const loginForm = document.getElementById('login-form-el');
        if (loginForm) loginForm.addEventListener('submit', handleLogin);
        
        const regForm = document.getElementById('register-form-el');
        if (regForm) regForm.addEventListener('submit', handleRegister);
    }
});