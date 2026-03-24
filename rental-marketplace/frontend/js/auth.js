import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCYqXL0smk2-pjMeIGQIuwerpYBGUwYFlc",
    authDomain: "pujitha-e16c6.firebaseapp.com",
    projectId: "pujitha-e16c6",
    storageBucket: "pujitha-e16c6.firebasestorage.app",
    messagingSenderId: "113627147747",
    appId: "1:113627147747:web:ea2e44bf1c75833d34c4d6",
    measurementId: "G-6M8HMCM7H8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Global State
window.API_URL = "http://localhost:5000/api";
window.currentUser = null;
window.dbUser = null;
window.authToken = null;

// Global Auth State Observer
onAuthStateChanged(auth, async (user) => {
    window.currentUser = user;
    const navLinks = document.getElementById("nav-links");

    if (user) {
        window.authToken = await user.getIdToken();

        try {
            // Sync user with Backend
            const res = await fetch(`${window.API_URL}/auth/sync`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${window.authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            
            if (!res.ok || !data.data) {
                console.error("Backend Sync Failed:", data.error || 'Unknown error');
                await signOut(auth);
                // Reset navbar to default
                if (navLinks) {
                    navLinks.innerHTML = `
                        <a href="index.html">Explore</a>
                        <a href="login.html" class="btn btn-primary" style="color: white;">Login / Sign Up</a>
                    `;
                }
                return;
            }

            window.dbUser = data.data;

            // Update Navbar
            if (navLinks) {
                let linksHtml = `<a href="index.html">Explore</a>`;
                if (window.dbUser.role === 'merchant') {
                    linksHtml += `<a href="dashboard.html">Dashboard</a>`;
                }
                if (window.dbUser.role === 'admin') {
                    linksHtml += `<a href="admin.html">Admin</a>`;
                }
                linksHtml += `
                    <a href="chat.html">Messages</a>
                    <a href="profile.html">Profile</a>
                    <button class="theme-toggle" id="theme-toggle" style="background: none; border: 1px solid var(--border); width: 40px; height: 40px; border-radius: 50%; cursor: pointer; color: var(--text-main); margin: 0 1rem; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-moon"></i>
                    </button>
                    <button class="btn btn-outline" id="logout-btn">Logout</button>
                `;
                navLinks.innerHTML = linksHtml;

                document.getElementById('logout-btn').onclick = () => {
                    signOut(auth).then(() => window.location.href = "index.html");
                };
            }
        } catch (err) {
            console.error("Backend Sync Error:", err);
        }
    } else {
        window.authToken = null;
        window.dbUser = null;

        if (navLinks) {
            navLinks.innerHTML = `
                <a href="index.html">Explore</a>
                <a href="login.html" class="btn btn-primary" style="color: white;">Login / Sign Up</a>
            `;
        }
    }

    // Theme Persistence & Logic
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const setupTheme = () => {
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            const updateIcon = (t) => {
                themeBtn.innerHTML = t === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            };
            updateIcon(document.documentElement.getAttribute('data-theme'));

            themeBtn.onclick = () => {
                const current = document.documentElement.getAttribute('data-theme');
                const target = current === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', target);
                localStorage.setItem('theme', target);
                updateIcon(target);
            };
        }
    };

    const setupMegaMenu = () => {
        const btn = document.getElementById('mega-menu-btn');
        if (!btn) return;

        // Inject Drawer if not present
        if (!document.getElementById('mega-menu-drawer')) {
            const drawer = document.createElement('div');
            drawer.id = 'mega-menu-drawer';
            drawer.className = 'mega-menu';
            drawer.innerHTML = `
                <div class="menu-title">
                    <span>Departments</span>
                    <i class="fas fa-times" id="close-menu" style="cursor:pointer; opacity:0.5;"></i>
                </div>
                <a href="#" class="menu-item"><i class="fas fa-bolt"></i> Electronics</a>
                <a href="#" class="menu-item"><i class="fas fa-tools"></i> Pro Tools</a>
                <a href="#" class="menu-item"><i class="fas fa-mountain"></i> Outdoor Gear</a>
                <a href="#" class="menu-item"><i class="fas fa-camera"></i> Photography</a>
                <a href="#" class="menu-item"><i class="fas fa-car"></i> Automotive</a>
                <a href="#" class="menu-item"><i class="fas fa-gamepad"></i> Gaming & VR</a>
                <div style="margin-top:2rem; padding-top:1rem; border-top:1px solid var(--border);">
                    <p style="font-size:0.7rem; font-weight:800; text-transform:uppercase; color:var(--text-muted); margin-bottom:1rem;">Account</p>
                    <a href="profile.html" class="menu-item"><i class="fas fa-user-circle"></i> My Account</a>
                    <a href="dashboard.html" class="menu-item"><i class="fas fa-box"></i> My Listings</a>
                </div>
            `;
            document.body.appendChild(drawer);

            const overlay = document.createElement('div');
            overlay.id = 'menu-overlay';
            overlay.className = 'menu-overlay';
            document.body.appendChild(overlay);

            btn.onclick = () => {
                drawer.classList.toggle('active');
                overlay.classList.toggle('active');

                if (drawer.classList.contains('active')) {
                    drawer.querySelectorAll('.menu-item').forEach((item, index) => {
                        item.style.animationDelay = `${0.1 + index * 0.05}s`;
                    });
                }
            };
            overlay.onclick = () => {
                drawer.classList.remove('active');
                overlay.classList.remove('active');
            };
            document.getElementById('close-menu').onclick = () => {
                drawer.classList.remove('active');
                overlay.classList.remove('active');
            };
        }
    };

    // Run setup immediately and on auth ready
    setupTheme();
    setupMegaMenu();
    window.dispatchEvent(new Event("authStateReady"));
});

export const googleLogin = () => signInWithPopup(auth, googleProvider);
export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, storage, signOut };
