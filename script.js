// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJnQD7C20jVbrq5-2bV_wF3kGoB-j6PPY",
    authDomain: "itnotessolution.firebaseapp.com",
    projectId: "itnotessolution",
    storageBucket: "itnotessolution.firebasestorage.app",
    messagingSenderId: "646168108069",
    appId: "1:646168108069:web:dc0a48fbf1368571ccb3cc",
    measurementId: "G-L57W2FVTXB"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Global Variables
let currentTheme = 'dark';

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('.nav');
const contactForm = document.getElementById('contactForm');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeContactForm();
    initializeScrollEffects();
    initializeAnimations();
});

// Theme Toggle Functionality
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });
}

function setTheme(theme) {
    currentTheme = theme;
    document.body.className = theme;
    
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-moon';
    } else {
        icon.className = 'fas fa-sun';
    }
}

// Navigation Functionality
function initializeNavigation() {
    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Contact Form Functionality
function initializeContactForm() {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            timestamp: new Date()
        };
        
        try {
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="loading"></span> Sending...';
            submitBtn.disabled = true;
            
            // Save to Firebase
            await db.collection('contacts').add(data);
            
            // Show success message
            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
        } catch (error) {
            console.error('Error sending message:', error);
            showNotification('Error sending message. Please try again.', 'error');
            
            // Reset button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
        }
    });
}

// Scroll Effects
function initializeScrollEffects() {
    // Header background on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.8)';
        }
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    });
}

// Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .notes-box, .contact-form').forEach(el => {
        observer.observe(el);
    });
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function openNotesPage() {
    window.location.href = 'notes.html';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Search Functionality
function initializeSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    searchOverlay.innerHTML = `
        <div class="search-container">
            <input type="text" placeholder="Search notes, subjects, or topics..." class="search-input">
            <button class="search-close">&times;</button>
            <div class="search-results"></div>
        </div>
    `;
    
    document.body.appendChild(searchOverlay);
    
    searchBtn.addEventListener('click', function() {
        searchOverlay.classList.add('active');
        searchOverlay.querySelector('.search-input').focus();
    });
    
    searchOverlay.querySelector('.search-close').addEventListener('click', function() {
        searchOverlay.classList.remove('active');
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchOverlay.classList.remove('active');
        }
    });
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSearch);

// Admin Panel Functions
function checkAdminAccess() {
    const adminLink = document.querySelector('.admin-link');
    if (adminLink) {
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Check if user is authenticated
            if (auth.currentUser) {
                window.location.href = 'admin.html';
            } else {
                showAdminLoginModal();
            }
        });
    }
}

function showAdminLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'admin-login-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Admin Login</h2>
            <form id="adminLoginForm">
                <div class="form-group">
                    <input type="email" id="adminEmail" required>
                    <label for="adminEmail">Email</label>
                </div>
                <div class="form-group">
                    <input type="password" id="adminPassword" required>
                    <label for="adminPassword">Password</label>
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
            </form>
            <button class="modal-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    modal.querySelector('#adminLoginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = modal.querySelector('#adminEmail').value;
        const password = modal.querySelector('#adminPassword').value;
        
        try {
            await auth.signInWithEmailAndPassword(email, password);
            window.location.href = 'admin.html';
        } catch (error) {
            showNotification('Invalid credentials', 'error');
        }
    });
    
    // Close modal
    modal.querySelector('.modal-close').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Initialize admin access check
document.addEventListener('DOMContentLoaded', checkAdminAccess);

// Export functions for use in other files
window.scrollToSection = scrollToSection;
window.openNotesPage = openNotesPage;
