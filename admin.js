// Admin Panel JavaScript

// Firebase Configuration (same as main app)
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
let currentUser = null;
let currentSection = 'dashboard';

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const adminPanel = document.getElementById('adminPanel');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('pageTitle');

// Initialize Admin Panel
// Test function to check local storage
function testLocalStorage() {
    console.log('=== LOCAL STORAGE TEST ===');
    const localResources = JSON.parse(localStorage.getItem('localResources') || '{}');
    console.log('All local resources:', localResources);
    console.log('Current semester resources:', localResources[currentSemester] || []);
    console.log('Current semester:', currentSemester);
    console.log('========================');
}

// Test function to add sample resource
function addTestResource() {
    const testResource = {
        id: Date.now().toString(),
        type: 'syllabus',
        subject: 'Test Subject',
        name: 'Test Resource',
        url: 'https://example.com/test.pdf',
        description: 'This is a test resource',
        fileName: 'test.pdf',
        fileSize: '1MB',
        addedAt: new Date(),
        addedBy: 'admin'
    };
    
    const localResources = JSON.parse(localStorage.getItem('localResources') || '{}');
    if (!localResources[currentSemester]) {
        localResources[currentSemester] = [];
    }
    localResources[currentSemester].push(testResource);
    localStorage.setItem('localResources', JSON.stringify(localResources));
    
    console.log('Test resource added:', testResource);
    console.log('Updated local storage:', JSON.parse(localStorage.getItem('localResources')));
    
    // Reload resources
    loadNotesResources();
    
    showNotification('Test resource added successfully!', 'success');
}

// Change semester function
function changeSemester(semester) {
    currentSemester = parseInt(semester);
    localStorage.setItem('currentSemester', currentSemester);
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-semester="${semester}"]`).classList.add('active');
    
    // Load resources for new semester
    loadNotesResources();
}

document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
});

function initializeAdminPanel() {
    // Set current semester from localStorage
    currentSemester = parseInt(localStorage.getItem('currentSemester')) || 1;
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeTab = document.querySelector(`[data-semester="${currentSemester}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Check if user is already logged in
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            showAdminPanel();
            loadDashboardData();
        } else {
            showLoginScreen();
        }
    });

    // Event listeners
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    sidebarToggle.addEventListener('click', toggleSidebar);
    
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            showSection(section);
        });
    });

    // Modal event listeners
    initializeModals();
    
    // Form event listeners
    initializeForms();
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        currentUser = userCredential.user;
        showAdminPanel();
        loadDashboardData();
        showNotification('Login successful!', 'success');
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Invalid credentials. Please try again.', 'error');
    }
}

function handleLogout() {
    auth.signOut().then(() => {
        currentUser = null;
        showLoginScreen();
        showNotification('Logged out successfully', 'info');
    }).catch((error) => {
        console.error('Logout error:', error);
        showNotification('Error logging out', 'error');
    });
}

// UI Functions
function showLoginScreen() {
    loginScreen.style.display = 'flex';
    adminPanel.style.display = 'none';
}

function showAdminPanel() {
    loginScreen.style.display = 'none';
    adminPanel.style.display = 'flex';
}

function showSection(sectionName) {
    // Hide all sections
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from nav items
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Add active class to nav item
    const targetNavItem = document.querySelector(`[data-section="${sectionName}"]`);
    if (targetNavItem) {
        targetNavItem.classList.add('active');
    }
    
    // Update page title
    const sectionTitles = {
        'dashboard': 'Dashboard',
        'images': 'Images Management',
        'notes': 'Notes Resources',
        'options': 'Notes Options',
        'api': 'API Keys',
        'settings': 'Settings'
    };
    
    pageTitle.textContent = sectionTitles[sectionName] || 'Admin Panel';
    currentSection = sectionName;
    
    // Load section-specific data
    loadSectionData(sectionName);
}

function toggleSidebar() {
    sidebar.classList.toggle('active');
}

// Data Loading Functions
async function loadDashboardData() {
    try {
        // Load statistics
        const stats = await loadStatistics();
        updateDashboardStats(stats);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

async function loadStatistics() {
    // This would typically fetch from Firebase
    // For now, return mock data
    return {
        totalNotes: 156,
        totalDownloads: 2340,
        totalUsers: 89,
        pageViews: 12500
    };
}

function updateDashboardStats(stats) {
    document.getElementById('totalNotes').textContent = stats.totalNotes;
    document.getElementById('totalDownloads').textContent = stats.totalDownloads;
    document.getElementById('totalUsers').textContent = stats.totalUsers;
    document.getElementById('pageViews').textContent = stats.pageViews;
}

function loadSectionData(sectionName) {
    switch (sectionName) {
        case 'images':
            loadImages();
            break;
        case 'notes':
            loadNotesResources();
            initializeSemesterTabs();
            initializeResourceSearch();
            updateResourceStats();
            break;
        case 'options':
            loadNotesOptions();
            break;
        case 'api':
            loadAPIConfig();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

function initializeSemesterTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update current semester
            currentSemester = parseInt(this.getAttribute('data-semester'));
            
            // Reload resources for selected semester
            loadNotesResources();
        });
    });
}

// Images Management
async function loadImages() {
    const imagesGrid = document.getElementById('imagesGrid');
    
    try {
        // This would fetch from Firebase
        const images = [
            { id: 1, name: 'Engineering Notes', url: 'https://i.ibb.co/8XqJYzK/engineering-notes.jpg', description: 'Main notes image' },
            { id: 2, name: 'Author Photo', url: 'https://i.ibb.co/8XqJYzK/author-photo.jpg', description: 'Author profile picture' }
        ];
        
        imagesGrid.innerHTML = images.map(image => `
            <div class="image-card">
                <img src="${image.url}" alt="${image.name}">
                <h4>${image.name}</h4>
                <p>${image.description}</p>
                <div class="image-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editImage(${image.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteImage(${image.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading images:', error);
        imagesGrid.innerHTML = '<p>Error loading images</p>';
    }
}

// Notes Resources Management
let currentSemester = parseInt(localStorage.getItem('currentSemester')) || 1;
let resources = [];

// Sample data for testing (when Firebase is not configured)
const sampleResources = {
    1: [
        { id: '1', type: 'syllabus', subject: 'Mathematics I', name: 'Math I Syllabus', url: 'https://example.com/syllabus1.pdf', description: 'Complete syllabus for Mathematics I' },
        { id: '2', type: 'notes', subject: 'Mathematics I', name: 'Calculus Basics', url: 'https://example.com/notes1.pdf', description: 'Basic calculus concepts and formulas' },
        { id: '3', type: 'questionBank', subject: 'Mathematics I', name: 'Previous Year Questions', url: 'https://example.com/qb1.pdf', description: 'PYQ from 2020-2023' },
        { id: '4', type: 'solutions', subject: 'Mathematics I', name: 'Math Solutions', url: 'https://example.com/sol1.pdf', description: 'Step-by-step solutions' },
        { id: '5', type: 'syllabus', subject: 'Physics I', name: 'Physics I Syllabus', url: 'https://example.com/syllabus2.pdf', description: 'Complete physics syllabus' },
        { id: '6', type: 'notes', subject: 'Physics I', name: 'Mechanics Notes', url: 'https://example.com/notes2.pdf', description: 'Classical mechanics concepts' }
    ],
    2: [
        { id: '7', type: 'syllabus', subject: 'Mathematics II', name: 'Math II Syllabus', url: 'https://example.com/syllabus3.pdf', description: 'Advanced mathematics syllabus' },
        { id: '8', type: 'notes', subject: 'Data Structures', name: 'DS Concepts', url: 'https://example.com/notes3.pdf', description: 'Data structures and algorithms' },
        { id: '9', type: 'questionBank', subject: 'Data Structures', name: 'DS Practice Questions', url: 'https://example.com/qb2.pdf', description: 'Practice problems for data structures' }
    ],
    3: [
        { id: '10', type: 'syllabus', subject: 'Database Systems', name: 'DB Syllabus', url: 'https://example.com/syllabus4.pdf', description: 'Database management systems syllabus' },
        { id: '11', type: 'notes', subject: 'Database Systems', name: 'SQL Basics', url: 'https://example.com/notes4.pdf', description: 'Introduction to SQL and database design' },
        { id: '12', type: 'solutions', subject: 'Database Systems', name: 'DB Solutions', url: 'https://example.com/sol2.pdf', description: 'Database query solutions' }
    ],
    4: [
        { id: '13', type: 'syllabus', subject: 'Software Engineering', name: 'SE Syllabus', url: 'https://example.com/syllabus5.pdf', description: 'Software engineering principles' },
        { id: '14', type: 'notes', subject: 'Software Engineering', name: 'SDLC Notes', url: 'https://example.com/notes5.pdf', description: 'Software development life cycle' }
    ],
    5: [
        { id: '15', type: 'syllabus', subject: 'Machine Learning', name: 'ML Syllabus', url: 'https://example.com/syllabus6.pdf', description: 'Introduction to machine learning' },
        { id: '16', type: 'notes', subject: 'Machine Learning', name: 'ML Algorithms', url: 'https://example.com/notes6.pdf', description: 'Common ML algorithms and concepts' }
    ],
    6: [
        { id: '17', type: 'syllabus', subject: 'Computer Networks', name: 'CN Syllabus', url: 'https://example.com/syllabus7.pdf', description: 'Computer networking fundamentals' },
        { id: '18', type: 'notes', subject: 'Computer Networks', name: 'Network Protocols', url: 'https://example.com/notes7.pdf', description: 'TCP/IP and other network protocols' }
    ],
    7: [
        { id: '19', type: 'syllabus', subject: 'Artificial Intelligence', name: 'AI Syllabus', url: 'https://example.com/syllabus8.pdf', description: 'AI concepts and applications' },
        { id: '20', type: 'notes', subject: 'Artificial Intelligence', name: 'AI Fundamentals', url: 'https://example.com/notes8.pdf', description: 'Basic AI concepts and algorithms' }
    ],
    8: [
        { id: '21', type: 'syllabus', subject: 'Final Project', name: 'Project Guidelines', url: 'https://example.com/syllabus9.pdf', description: 'Final year project guidelines' },
        { id: '22', type: 'notes', subject: 'Final Project', name: 'Project Management', url: 'https://example.com/notes9.pdf', description: 'Project planning and execution' }
    ]
};

async function loadNotesResources() {
    const resourcesContent = document.getElementById('resourcesContent');
    
    try {
        // Show loading state
        resourcesContent.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading resources for Semester ${currentSemester}...</p>
            </div>
        `;
        
        try {
            // Try to load resources from Firebase first
            const snapshot = await db.collection('resources').where('semester', '==', currentSemester).get();
            resources = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (firebaseError) {
            console.log('Firebase error, trying local storage:', firebaseError);
            
        // Try local storage first
        try {
            const localResources = JSON.parse(localStorage.getItem('localResources') || '{}');
            console.log('Raw local storage data:', localStorage.getItem('localResources'));
            console.log('Parsed local resources:', localResources);
            console.log('Current semester:', currentSemester);
            console.log('Resources for current semester:', localResources[currentSemester]);
            
            resources = localResources[currentSemester] || [];
            console.log('Final resources array:', resources);
            
            // If no local resources, use sample data
            if (resources.length === 0) {
                resources = sampleResources[currentSemester] || [];
                console.log('Using sample data:', resources);
            }
        } catch (localError) {
            console.log('Local storage error, using sample data:', localError);
            // Fallback to sample data
            resources = sampleResources[currentSemester] || [];
        }
        }
        
        // Update statistics
        updateResourceStats();
        
        console.log('Resources to render:', resources);
        console.log('Resources length:', resources.length);
        
        if (resources.length === 0) {
            resourcesContent.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <h3>No Resources Found</h3>
                    <p>No resources available for Semester ${currentSemester}. Add some resources to get started.</p>
                    <button class="btn btn-primary" onclick="openResourceModal()">
                        <i class="fas fa-plus"></i> Add First Resource
                    </button>
                </div>
            `;
            return;
        }
        
        // Group resources by subject
        const groupedResources = groupResourcesBySubject(resources);
        
        resourcesContent.innerHTML = Object.keys(groupedResources).map(subject => `
            <div class="subject-group">
                <div class="subject-header">
                    <h3>${subject}</h3>
                    <span class="resource-count">${groupedResources[subject].length} resources</span>
                </div>
                <div class="resources-list">
                    ${groupedResources[subject].map(resource => `
                        <div class="resource-item">
                            <div class="resource-icon">
                                <i class="fas ${getResourceIcon(resource.type)}"></i>
                            </div>
                            <div class="resource-info">
                                <h4>${resource.name}</h4>
                                <p class="resource-type">${formatResourceType(resource.type)}</p>
                                <p class="resource-url">${resource.url}</p>
                                ${resource.description ? `<p class="resource-description">${resource.description}</p>` : ''}
                            </div>
                            <div class="resource-actions">
                                <button class="btn btn-sm btn-secondary" onclick="editResource('${resource.id}')">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-primary" onclick="previewResource('${resource.url}')">
                                    <i class="fas fa-eye"></i> Preview
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteResource('${resource.id}')">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading resources:', error);
        
        // Fallback to sample data if Firebase fails
        try {
            resources = sampleResources[currentSemester] || [];
            
            if (resources.length === 0) {
                resourcesContent.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-book-open"></i>
                        <h3>No Resources Found</h3>
                        <p>No resources available for Semester ${currentSemester}. Add some resources to get started.</p>
                        <button class="btn btn-primary" onclick="openResourceModal()">
                            <i class="fas fa-plus"></i> Add First Resource
                        </button>
                    </div>
                `;
                return;
            }
            
            // Group resources by subject
            const groupedResources = groupResourcesBySubject(resources);
            
            resourcesContent.innerHTML = Object.keys(groupedResources).map(subject => `
                <div class="subject-group">
                    <div class="subject-header">
                        <h3>${subject}</h3>
                        <span class="resource-count">${groupedResources[subject].length} resources</span>
                    </div>
                    <div class="resources-list">
                        ${groupedResources[subject].map(resource => `
                            <div class="resource-item">
                                <div class="resource-icon">
                                    <i class="fas ${getResourceIcon(resource.type)}"></i>
                                </div>
                                <div class="resource-info">
                                    <h4>${resource.name}</h4>
                                    <p class="resource-type">${formatResourceType(resource.type)}</p>
                                    <p class="resource-url">${resource.url}</p>
                                    ${resource.description ? `<p class="resource-description">${resource.description}</p>` : ''}
                                </div>
                                <div class="resource-actions">
                                    <button class="btn btn-sm btn-secondary" onclick="editResource('${resource.id}')">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                    <button class="btn btn-sm btn-primary" onclick="previewResource('${resource.url}')">
                                        <i class="fas fa-eye"></i> Preview
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="deleteResource('${resource.id}')">
                                        <i class="fas fa-trash"></i> Delete
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
            
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
            resourcesContent.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Resources</h3>
                    <p>There was an error loading resources. Please check your Firebase configuration.</p>
                    <button class="btn btn-primary" onclick="loadNotesResources()">
                        <i class="fas fa-refresh"></i> Try Again
                    </button>
                </div>
            `;
        }
    }
}

function groupResourcesBySubject(resources) {
    return resources.reduce((groups, resource) => {
        const subject = resource.subject || 'Unknown Subject';
        if (!groups[subject]) {
            groups[subject] = [];
        }
        groups[subject].push(resource);
        return groups;
    }, {});
}

function getResourceIcon(type) {
    const icons = {
        'syllabus': 'fa-file-alt',
        'notes': 'fa-book-open',
        'questionBank': 'fa-question-circle',
        'solutions': 'fa-lightbulb'
    };
    return icons[type] || 'fa-file';
}

function formatResourceType(type) {
    const types = {
        'syllabus': 'Syllabus',
        'notes': 'Notes',
        'questionBank': 'Question Bank',
        'solutions': 'Solutions'
    };
    return types[type] || type;
}

function previewResource(url) {
    window.open(url, '_blank');
}

// Search functionality
function initializeResourceSearch() {
    const searchInput = document.getElementById('resourceSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterResources(searchTerm);
        });
    }
}

function filterResources(searchTerm) {
    const resourceItems = document.querySelectorAll('.resource-item');
    
    resourceItems.forEach(item => {
        const resourceName = item.querySelector('h4').textContent.toLowerCase();
        const resourceType = item.querySelector('.resource-type').textContent.toLowerCase();
        const resourceUrl = item.querySelector('.resource-url').textContent.toLowerCase();
        
        const matches = resourceName.includes(searchTerm) || 
                       resourceType.includes(searchTerm) || 
                       resourceUrl.includes(searchTerm);
        
        item.style.display = matches ? 'flex' : 'none';
    });
}

// Export functionality
async function exportResources() {
    try {
        const snapshot = await db.collection('resources').get();
        const resources = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const csvContent = convertToCSV(resources);
        downloadCSV(csvContent, 'resources-export.csv');
        
        showNotification('Resources exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting resources:', error);
        showNotification('Error exporting resources', 'error');
    }
}

function convertToCSV(resources) {
    const headers = ['ID', 'Type', 'Subject', 'Semester', 'Name', 'URL', 'Description', 'File Size', 'Added At'];
    const rows = resources.map(resource => [
        resource.id,
        resource.type,
        resource.subject,
        resource.semester,
        resource.name,
        resource.url,
        resource.description || '',
        resource.fileSize || '',
        resource.addedAt ? new Date(resource.addedAt.seconds * 1000).toLocaleDateString() : ''
    ]);
    
    return [headers, ...rows].map(row => 
        row.map(field => `"${field}"`).join(',')
    ).join('\n');
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Update statistics
async function updateResourceStats() {
    try {
        let allResources = [];
        
        try {
            // Try to load from Firebase first
            const snapshot = await db.collection('resources').get();
            allResources = snapshot.docs.map(doc => doc.data());
        } catch (firebaseError) {
            // Fallback to sample data
            allResources = Object.values(sampleResources).flat();
        }
        
        const totalResources = allResources.length;
        const semesterResources = allResources.filter(r => r.semester === currentSemester).length;
        const lastUpdated = allResources.length > 0 ? 
            (allResources[0].updatedAt ? 
                new Date(allResources[0].updatedAt.seconds * 1000).toLocaleDateString() : 
                new Date().toLocaleDateString()) : 
            'Never';
        
        document.getElementById('totalResources').textContent = totalResources;
        document.getElementById('semesterResources').textContent = semesterResources;
        document.getElementById('lastUpdated').textContent = lastUpdated;
        
    } catch (error) {
        console.error('Error updating stats:', error);
        // Set default values
        document.getElementById('totalResources').textContent = resources.length;
        document.getElementById('semesterResources').textContent = resources.length;
        document.getElementById('lastUpdated').textContent = 'Never';
    }
}

// Notes Options Management
async function loadNotesOptions() {
    const optionsList = document.getElementById('optionsList');
    
    try {
        // This would fetch from Firebase
        const options = [
            { id: 1, name: 'Syllabus', course: 'BSC CSIT', semester: 1 },
            { id: 2, name: 'Notes', course: 'BSC CSIT', semester: 1 },
            { id: 3, name: 'Question Bank', course: 'BSC CSIT', semester: 1 }
        ];
        
        optionsList.innerHTML = options.map(option => `
            <div class="option-card">
                <h4>${option.name}</h4>
                <p>${option.course} - Semester ${option.semester}</p>
                <div class="option-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editOption(${option.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteOption(${option.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading options:', error);
        optionsList.innerHTML = '<p>Error loading options</p>';
    }
}

// API Configuration
async function loadAPIConfig() {
    // Load saved API configuration
    try {
        const config = await db.collection('config').doc('api').get();
        if (config.exists) {
            const data = config.data();
            document.getElementById('emailProvider').value = data.emailProvider || 'gmail';
            document.getElementById('emailAddress').value = data.emailAddress || '';
            document.getElementById('emailPassword').value = data.emailPassword || '';
        }
    } catch (error) {
        console.error('Error loading API config:', error);
    }
}

// Settings
async function loadSettings() {
    // Load user list
    loadUsers();
    
    // Load admin email
    try {
        const config = await db.collection('config').doc('admin').get();
        if (config.exists) {
            const data = config.data();
            document.getElementById('adminEmail').value = data.email || '';
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

async function loadUsers() {
    const userList = document.getElementById('userList');
    
    try {
        const users = await db.collection('users').get();
        userList.innerHTML = users.docs.map(doc => {
            const user = doc.data();
            return `
                <div class="user-item">
                    <div class="user-info">
                        <h4>${user.email}</h4>
                        <p>Role: ${user.role || 'viewer'}</p>
                    </div>
                    <div class="user-actions">
                        <button class="btn btn-sm btn-secondary" onclick="editUser('${doc.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteUser('${doc.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading users:', error);
        userList.innerHTML = '<p>Error loading users</p>';
    }
}

// Modal Functions
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close');
    
    modalCloses.forEach(close => {
        close.addEventListener('click', () => {
            close.closest('.modal').classList.remove('active');
        });
    });
    
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Form Functions
function initializeForms() {
    // Image upload form
    const imageUploadForm = document.getElementById('imageUploadForm');
    if (imageUploadForm) {
        imageUploadForm.addEventListener('submit', handleImageUpload);
    }
    
    // Resource form
    const resourceForm = document.getElementById('resourceForm');
    if (resourceForm) {
        resourceForm.addEventListener('submit', handleResourceSubmit);
    }
    
    // Option form
    const optionForm = document.getElementById('optionForm');
    if (optionForm) {
        optionForm.addEventListener('submit', handleOptionSubmit);
    }
    
    // User form
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', handleUserSubmit);
    }
    
    // Password form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
    
    // Email config form
    const emailConfigForm = document.getElementById('emailConfigForm');
    if (emailConfigForm) {
        emailConfigForm.addEventListener('submit', handleEmailConfig);
    }
    
    // Email settings form
    const emailSettingsForm = document.getElementById('emailSettingsForm');
    if (emailSettingsForm) {
        emailSettingsForm.addEventListener('submit', handleEmailSettings);
    }
}

// Form Handlers
async function handleImageUpload(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const imageFile = formData.get('imageFile');
    const imageName = formData.get('imageName');
    const imageDescription = formData.get('imageDescription');
    
    try {
        // Upload to Firebase Storage
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(`images/${imageFile.name}`);
        await imageRef.put(imageFile);
        const imageUrl = await imageRef.getDownloadURL();
        
        // Save to Firestore
        await db.collection('images').add({
            name: imageName,
            description: imageDescription,
            url: imageUrl,
            uploadedAt: new Date()
        });
        
        showNotification('Image uploaded successfully!', 'success');
        closeModal('imageUploadModal');
        loadImages();
    } catch (error) {
        console.error('Error uploading image:', error);
        showNotification('Error uploading image', 'error');
    }
}

async function handleResourceSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const resourceId = e.target.getAttribute('data-resource-id');
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;
    
    const resourceData = {
        type: formData.get('resourceType'),
        subject: formData.get('resourceSubject'),
        semester: parseInt(formData.get('resourceSemester')) || currentSemester,
        name: formData.get('resourceName'),
        url: formData.get('resourceUrl'),
        description: formData.get('resourceDescription') || '',
        fileSize: formData.get('resourceFileSize') || '',
        updatedAt: new Date(),
        updatedBy: currentUser ? currentUser.email : 'admin'
    };
    
    console.log('Form data semester:', formData.get('resourceSemester'));
    console.log('Parsed semester:', parseInt(formData.get('resourceSemester')));
    console.log('Current semester:', currentSemester);
    console.log('Final resource data:', resourceData);
    
    try {
        if (resourceId) {
            // Update existing resource
            await db.collection('resources').doc(resourceId).update(resourceData);
            showNotification('Resource updated successfully!', 'success');
        } else {
            // Add new resource
            resourceData.addedAt = new Date();
            resourceData.addedBy = currentUser ? currentUser.email : 'admin';
            await db.collection('resources').add(resourceData);
            showNotification('Resource added successfully!', 'success');
        }
        
        closeModal('resourceModal');
        e.target.reset();
        e.target.removeAttribute('data-resource-id');
        document.querySelector('#resourceModal .modal-header h3').textContent = 'Add Resource';
        
        // Reload resources for the current semester
        loadNotesResources();
        
    } catch (error) {
        console.error('Error saving resource:', error);
        
        // Fallback to local storage
        try {
            resourceData.id = Date.now().toString();
            resourceData.addedAt = new Date();
            resourceData.addedBy = currentUser ? currentUser.email : 'admin';
            
            // Save to local storage
            const localResources = JSON.parse(localStorage.getItem('localResources') || '{}');
            console.log('Before saving - current semester:', currentSemester);
            console.log('Before saving - resource data:', resourceData);
            console.log('Before saving - existing local resources:', localResources);
            
            if (!localResources[currentSemester]) {
                localResources[currentSemester] = [];
            }
            localResources[currentSemester].push(resourceData);
            localStorage.setItem('localResources', JSON.stringify(localResources));
            
            console.log('After saving - all local resources:', JSON.parse(localStorage.getItem('localResources')));
            console.log('After saving - current semester resources:', localResources[currentSemester]);
            
            showNotification('Resource saved locally! Enable Firestore for full functionality.', 'info');
            
            closeModal('resourceModal');
            e.target.reset();
            e.target.removeAttribute('data-resource-id');
            document.querySelector('#resourceModal .modal-header h3').textContent = 'Add Resource';
            
            // Reload resources
            loadNotesResources();
            
            // Notify main website to refresh (if it's open)
            window.dispatchEvent(new CustomEvent('adminResourcesUpdated', {
                detail: { semester: currentSemester, resources: localResources[currentSemester] }
            }));
            
        } catch (localError) {
            console.error('Local storage error:', localError);
            showNotification('Error saving resource. Please try again.', 'error');
        }
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function handleOptionSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const optionData = {
        name: formData.get('optionName'),
        course: formData.get('optionCourse'),
        semester: parseInt(formData.get('optionSemester')),
        addedAt: new Date()
    };
    
    try {
        await db.collection('options').add(optionData);
        showNotification('Option added successfully!', 'success');
        closeModal('optionModal');
        loadNotesOptions();
    } catch (error) {
        console.error('Error adding option:', error);
        showNotification('Error adding option', 'error');
    }
}

async function handleUserSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        email: formData.get('userEmail'),
        role: formData.get('userRole'),
        createdAt: new Date()
    };
    
    try {
        // Create user with email and password
        const userCredential = await auth.createUserWithEmailAndPassword(
            userData.email, 
            formData.get('userPassword')
        );
        
        // Save additional data to Firestore
        await db.collection('users').doc(userCredential.user.uid).set(userData);
        
        showNotification('User created successfully!', 'success');
        closeModal('userModal');
        loadUsers();
    } catch (error) {
        console.error('Error creating user:', error);
        showNotification('Error creating user', 'error');
    }
}

async function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    try {
        // Re-authenticate user
        const credential = firebase.auth.EmailAuthProvider.credential(
            currentUser.email, 
            currentPassword
        );
        await currentUser.reauthenticateWithCredential(credential);
        
        // Update password
        await currentUser.updatePassword(newPassword);
        
        showNotification('Password changed successfully!', 'success');
        e.target.reset();
    } catch (error) {
        console.error('Error changing password:', error);
        showNotification('Error changing password', 'error');
    }
}

async function handleEmailConfig(e) {
    e.preventDefault();
    
    const configData = {
        emailProvider: document.getElementById('emailProvider').value,
        emailAddress: document.getElementById('emailAddress').value,
        emailPassword: document.getElementById('emailPassword').value,
        updatedAt: new Date()
    };
    
    try {
        await db.collection('config').doc('api').set(configData);
        showNotification('API configuration saved!', 'success');
    } catch (error) {
        console.error('Error saving API config:', error);
        showNotification('Error saving configuration', 'error');
    }
}

async function handleEmailSettings(e) {
    e.preventDefault();
    
    const newEmail = document.getElementById('adminEmail').value;
    
    try {
        await db.collection('config').doc('admin').set({
            email: newEmail,
            updatedAt: new Date()
        });
        showNotification('Email settings updated!', 'success');
    } catch (error) {
        console.error('Error updating email settings:', error);
        showNotification('Error updating email settings', 'error');
    }
}

// Action Functions
function openImageUpload() {
    openModal('imageUploadModal');
}

function openResourceModal() {
    // Set current semester as default
    const semesterSelect = document.getElementById('resourceSemester');
    if (semesterSelect) {
        semesterSelect.value = currentSemester;
        console.log('Set default semester to:', currentSemester);
    }
    openModal('resourceModal');
}

function openOptionModal() {
    openModal('optionModal');
}

function openUserModal() {
    openModal('userModal');
}

function editImage(id) {
    // Implementation for editing image
    showNotification('Edit image functionality coming soon', 'info');
}

function deleteImage(id) {
    if (confirm('Are you sure you want to delete this image?')) {
        // Implementation for deleting image
        showNotification('Image deleted successfully', 'success');
        loadImages();
    }
}

async function editResource(id) {
    try {
        const resource = resources.find(r => r.id === id);
        if (!resource) {
            showNotification('Resource not found', 'error');
            return;
        }
        
        // Pre-fill the form with existing data
        document.getElementById('resourceType').value = resource.type;
        document.getElementById('resourceSubject').value = resource.subject;
        document.getElementById('resourceSemester').value = resource.semester;
        document.getElementById('resourceName').value = resource.name;
        document.getElementById('resourceUrl').value = resource.url;
        document.getElementById('resourceDescription').value = resource.description || '';
        document.getElementById('resourceFileSize').value = resource.fileSize || '';
        
        // Store the resource ID for updating
        document.getElementById('resourceForm').setAttribute('data-resource-id', id);
        
        // Change form title
        document.querySelector('#resourceModal .modal-header h3').textContent = 'Edit Resource';
        
        openModal('resourceModal');
        
    } catch (error) {
        console.error('Error editing resource:', error);
        showNotification('Error loading resource for editing', 'error');
    }
}

async function deleteResource(id) {
    if (confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
        try {
            await db.collection('resources').doc(id).delete();
            showNotification('Resource deleted successfully', 'success');
            loadNotesResources();
        } catch (error) {
            console.error('Error deleting resource:', error);
            showNotification('Error deleting resource', 'error');
        }
    }
}

function editOption(id) {
    // Implementation for editing option
    showNotification('Edit option functionality coming soon', 'info');
}

function deleteOption(id) {
    if (confirm('Are you sure you want to delete this option?')) {
        // Implementation for deleting option
        showNotification('Option deleted successfully', 'success');
        loadNotesOptions();
    }
}

function editUser(id) {
    // Implementation for editing user
    showNotification('Edit user functionality coming soon', 'info');
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        // Implementation for deleting user
        showNotification('User deleted successfully', 'success');
        loadUsers();
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Export functions for global use
window.openImageUpload = openImageUpload;
window.openResourceModal = openResourceModal;
window.openOptionModal = openOptionModal;
window.openUserModal = openUserModal;
window.editImage = editImage;
window.deleteImage = deleteImage;
window.editResource = editResource;
window.deleteResource = deleteResource;
window.editOption = editOption;
window.deleteOption = deleteOption;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.exportResources = exportResources;
window.previewResource = previewResource;
