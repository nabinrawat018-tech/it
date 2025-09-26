// Notes Page JavaScript

// Load resources from admin panel
function loadResourcesFromAdmin() {
    try {
        const localResources = JSON.parse(localStorage.getItem('localResources') || '{}');
        console.log('Loaded resources from admin panel:', localResources);
        return localResources;
    } catch (error) {
        console.error('Error loading resources from admin panel:', error);
        return {};
    }
}

// Update semester status based on available resources
function updateSemesterStatus() {
    const resources = loadResourcesFromAdmin();
    
    // Update each semester card
    for (let semester = 1; semester <= 8; semester++) {
        const semesterCard = document.querySelector(`[data-semester="${semester}"]`);
        if (semesterCard) {
            const status = semesterCard.querySelector('.semester-status');
            const resourceCount = resources[semester] ? resources[semester].length : 0;
            
            if (resourceCount > 0) {
                status.textContent = `${resourceCount} Resources Available`;
                status.className = 'semester-status available';
            } else {
                status.textContent = 'No Resources Yet';
                status.className = 'semester-status not-available';
            }
        }
    }
}

// Function to open semester page
function openSemester(semesterNumber) {
    const semesterCard = event.currentTarget;
    const status = semesterCard.querySelector('.semester-status');
    
    // Check if semester is available
    if (status.classList.contains('not-available')) {
        showNotification('This semester is not available yet', 'error');
        return;
    }
    
    if (status.classList.contains('coming-soon')) {
        showNotification('This semester is coming soon', 'info');
        return;
    }
    
    // Redirect to semester page
    window.location.href = `semester.html?sem=${semesterNumber}`;
}

// Function to open academic calendar
function openCalendar() {
    window.location.href = 'calendar.html';
}

// Initialize notes page
document.addEventListener('DOMContentLoaded', function() {
    initializeNotesPage();
});

function initializeNotesPage() {
    // Update semester status based on admin resources
    updateSemesterStatus();
    
    // Listen for admin panel updates
    window.addEventListener('adminResourcesUpdated', function(event) {
        console.log('Admin resources updated:', event.detail);
        updateSemesterStatus();
    });
    
    // Add click animations to semester cards
    const semesterCards = document.querySelectorAll('.semester-card');
    semesterCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Add hover effects
    semesterCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Export functions for global use
window.openSemester = openSemester;
window.openCalendar = openCalendar;
