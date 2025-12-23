// ========== FIREBASE CONFIGURATION (UPDATED WITH YOUR KEYS) ==========
const firebaseConfig = {
    apiKey: "AIzaSyAFMw9j2sAw3KFjlYNjejHR_MIEgz6gJ6c",
    authDomain: "protfolio-d737e.firebaseapp.com",
    projectId: "protfolio-d737e",
    storageBucket: "protfolio-d737e.firebasestorage.app",
    messagingSenderId: "190076759622",
    appId: "1:190076759622:web:c899a00da91d3e4e56e447",
    measurementId: "G-XKVZRNBVV3"
};

/**
 * ⚠️ BHAI DHAYAN DEN:
 * Admin mode toggle karne ke liye: Ctrl + Alt + A
 */

console.log("🚀 Admin Core: System loading...");

// Protocol Check
if (window.location.protocol === 'file:') {
    console.error("❌ ERROR: Aap file ko direct open kar rahe hain! Modules ko chalane ke liye VS Code ka 'Live Server' use karein.");
}

// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const appId = 'protfolio-d737e'; 

let stealthBtn, modalOverlay, step1, step2, step3, saveBtn, adminStatus;
let editModeActive = false;
let fullEditActive = false;

function initElements() {
    stealthBtn = document.getElementById('admin-stealth-btn');
    modalOverlay = document.getElementById('admin-modal-overlay');
    step1 = document.getElementById('admin-step-1');
    step2 = document.getElementById('admin-step-2');
    step3 = document.getElementById('admin-step-3');
    saveBtn = document.getElementById('admin-save-btn');
    adminStatus = document.getElementById('admin-status-indicator');
    
    return !!(stealthBtn && modalOverlay);
}

// ========== LAYER 1: TOGGLE SHORTCUT (Ctrl + Alt + A) ==========
document.addEventListener('keydown', (e) => {
    const isAPressed = e.key.toLowerCase() === 'a' || e.code === 'KeyA';
    
    if (e.ctrlKey && e.altKey && isAPressed) {
        e.preventDefault(); 
        
        if (editModeActive) {
            console.log("🔒 Deactivating Admin Mode via Shortcut...");
            disableAdminMode();
        } else {
            console.log("🕵️ Stealth Protocol: Activation Shortcut Detected!");
            if (!stealthBtn || !modalOverlay) initElements();
            
            if (stealthBtn) {
                // Toggle stealth button visibility
                const isHidden = stealthBtn.classList.contains('hidden');
                if (isHidden) {
                    stealthBtn.classList.remove('hidden');
                    stealthBtn.style.display = 'block';
                    console.log("✅ Admin Access Button visible. Click it to login.");
                } else {
                    stealthBtn.classList.add('hidden');
                    stealthBtn.style.display = 'none';
                    console.log("🙈 Admin Access Button hidden.");
                }
            }
        }
    }
});

// ========== AUTH STATE OBSERVER ==========
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("👤 Session active for:", user.email);
        if (!stealthBtn) initElements();
        enableAdminMode();
    } else {
        disableAdminMode();
    }
});

// ========== MODAL LOGIC ==========
document.addEventListener('click', (e) => {
    if (e.target.closest('#admin-stealth-btn')) {
        if (auth.currentUser) {
            if (editModeActive) disableAdminMode();
            else enableAdminMode();
        } else openModal();
    }
});

function openModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove('hidden');
        showStep(1);
    }
}

function closeModals() { 
    if (modalOverlay) modalOverlay.classList.add('hidden'); 
}

// Button Events
document.addEventListener('click', (e) => {
    if (e.target.id === 'btn-yes-admin') showStep(2);
    if (e.target.id === 'btn-no-admin') closeModals();
    if (e.target.id === 'btn-check-riddle') {
        const riddleInput = document.getElementById('riddle-input');
        if (riddleInput && riddleInput.value.toLowerCase().trim() === 'hello world') {
            showStep(3);
        } else { 
            const error = document.getElementById('riddle-error');
            if (error) error.classList.remove('hidden'); 
            setTimeout(closeModals, 1500); 
        }
    }
});

document.addEventListener('submit', async (e) => {
    if (e.target.id === 'admin-login-form') {
        e.preventDefault();
        const email = document.getElementById('admin-email').value;
        const pass = document.getElementById('admin-pass').value;
        const errorMsg = document.getElementById('login-error');

        try {
            await signInWithEmailAndPassword(auth, email, pass);
            closeModals();
            enableAdminMode();
        } catch (error) {
            if (errorMsg) {
                errorMsg.innerText = "Error: " + error.code;
                errorMsg.classList.remove('hidden');
            }
        }
    }
});

function showStep(num) {
    if (!step1) initElements();
    const steps = [step1, step2, step3];
    steps.forEach((el, i) => {
        if (el) el.classList.toggle('hidden', i !== num - 1);
    });
}

// ========== ADVANCED ADMIN MODE (ENABLE/DISABLE) ==========

function enableAdminMode() {
    editModeActive = true;
    if (!stealthBtn) initElements();
    
    // UI Update
    if (stealthBtn) {
        stealthBtn.classList.remove('hidden');
        stealthBtn.style.display = 'block';
        stealthBtn.innerHTML = '🔓 EXIT ADMIN';
        stealthBtn.style.color = '#10b981';
    }
    // show only admin/nav controls; save button appears when edit mode is active
    if (saveBtn) saveBtn.classList.add('hidden');
    if (document.getElementById('nav')) document.getElementById('nav').classList.add('admin-active');
    const editBtn = document.getElementById('admin-edit-btn');
    if (editBtn) { editBtn.classList.remove('hidden'); editBtn.style.display = 'inline-flex'; }
    if (adminStatus) adminStatus.classList.remove('hidden');

    // Content Editing Activate (More Robust)
    const editables = document.querySelectorAll('[data-editable]');
    editables.forEach(el => {
        el.contentEditable = "true";
        el.classList.add('admin-editable-highlight');
        el.style.border = "2px dashed #10b981"; // Direct style for visibility
        el.title = "Click to edit this content";
    });
    
    console.log("🔓 ADMIN MODE ACTIVATED: Site is now editable.");
}

function disableAdminMode() {
    editModeActive = false;
    if (!stealthBtn) initElements();

    // UI Reset
    if (stealthBtn) {
        stealthBtn.classList.add('hidden');
        stealthBtn.style.display = 'none';
        stealthBtn.innerHTML = '🔒 ADMIN ACCESS';
        stealthBtn.style.color = '';
    }
    if (saveBtn) saveBtn.classList.add('hidden');
    if (adminStatus) adminStatus.classList.add('hidden');
    if (document.getElementById('nav')) document.getElementById('nav').classList.remove('admin-active');
    const editBtn = document.getElementById('admin-edit-btn');
    if (editBtn) { editBtn.classList.add('hidden'); editBtn.style.display = 'none'; }

    // exit full edit if active
    if (fullEditActive) toggleFullEditMode(false);

    // Content Editing Deactivate
    const editables = document.querySelectorAll('[data-editable]');
    editables.forEach(el => {
        el.contentEditable = "false";
        el.classList.remove('admin-editable-highlight');
        el.style.border = "none"; 
        el.title = "";
    });

    console.log("🔒 ADMIN MODE DEACTIVATED: Elements locked.");
}

// Toggle full-page edit mode (makes most elements contentEditable)
function toggleFullEditMode(forceState) {
    const state = typeof forceState === 'boolean' ? forceState : !fullEditActive;
    fullEditActive = state;

    // show/hide save button
    if (saveBtn) {
        if (fullEditActive) { saveBtn.classList.remove('hidden'); saveBtn.style.display = 'inline-flex'; }
        else { saveBtn.classList.add('hidden'); saveBtn.style.display = 'none'; }
    }

    // pick elements to make editable: skip scripts, styles, inputs, buttons, links
    const selector = 'body *:not(script):not(style):not(link):not(meta):not(head):not(input):not(textarea):not(select):not(button):not(a)';
    const nodes = Array.from(document.querySelectorAll(selector));
    nodes.forEach((el, idx) => {
        if (state) {
            el.contentEditable = 'true';
            el.classList.add('admin-editable-highlight');
            // ensure element has a data-key so it can be saved
            if (!el.getAttribute('data-key')) {
                const genKey = `auto_${el.tagName.toLowerCase()}_${idx}`;
                el.setAttribute('data-key', genKey);
            }
        } else {
            el.contentEditable = 'false';
            el.classList.remove('admin-editable-highlight');
        }
    });
}

// ========== DATABASE SYNC (SAVE/LOAD) ==========

document.addEventListener('click', async (e) => {
    if (e.target.id === 'admin-edit-btn') {
        if (!auth.currentUser) return;
        toggleFullEditMode();
        return;
    }

    if (e.target.id === 'admin-save-btn') {
        if (!auth.currentUser) return;
        const sBtn = e.target;
        sBtn.innerText = "Saving...";
        sBtn.disabled = true;

        const contentData = {};
        // collect any element that is explicitly editable or currently contentEditable
        const candidates = Array.from(document.querySelectorAll('[data-editable], [contenteditable="true"]'));
        candidates.forEach((el, i) => {
            let key = el.getAttribute('data-key');
            if (!key) {
                key = `auto_${el.tagName.toLowerCase()}_${i}`;
                el.setAttribute('data-key', key);
            }
            contentData[key] = el.innerText;
        });

        try {
            const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'site_content', 'main_page');
            await setDoc(docRef, contentData, { merge: true });
            sBtn.innerText = "✓ Saved!";
            setTimeout(() => {
                sBtn.innerText = "SAVE CHANGES";
                sBtn.disabled = false;
            }, 2000);
        } catch (error) {
            console.error("Firebase Save Error:", error);
            sBtn.innerText = "❌ Error";
            sBtn.disabled = false;
        }
    }
});

async function loadContentFromDB() {
    try {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'site_content', 'main_page');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("📥 Loading content from Database...");
            const data = docSnap.data();
            Object.keys(data).forEach(key => {
                const el = document.querySelector(`[data-key="${key}"]`);
                if (el) el.innerText = data[key];
            });
        }
    } catch (error) {
        console.error("Load Error:", error);
    }
}

window.addEventListener('load', () => {
    initElements();
    loadContentFromDB();
});