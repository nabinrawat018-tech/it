// Semester Page JavaScript

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

// Convert admin resources to semester data format
function convertAdminResourcesToSemesterData(adminResources, semesterNumber) {
    const semesterResources = adminResources[semesterNumber] || [];
    
    // Group resources by subject
    const subjectsMap = {};
    
    semesterResources.forEach(resource => {
        const subjectName = resource.subject;
        if (!subjectsMap[subjectName]) {
            subjectsMap[subjectName] = {
                name: subjectName,
                code: subjectName.replace(/\s+/g, '').toUpperCase().substring(0, 7),
                resources: {
                    syllabus: [],
                    notes: [],
                    questionBank: [],
                    solutions: []
                }
            };
        }
        
        // Add resource to appropriate category
        const resourceItem = {
            name: resource.name,
            url: resource.url,
            type: 'pdf'
        };
        
        switch (resource.type) {
            case 'syllabus':
                subjectsMap[subjectName].resources.syllabus.push(resourceItem);
                break;
            case 'notes':
                subjectsMap[subjectName].resources.notes.push(resourceItem);
                break;
            case 'questionBank':
                subjectsMap[subjectName].resources.questionBank.push(resourceItem);
                break;
            case 'solutions':
                subjectsMap[subjectName].resources.solutions.push(resourceItem);
                break;
        }
    });
    
    return Object.values(subjectsMap);
}

// Sample data for subjects (this would come from Firebase in production)
const semesterData = {
    1: {
        title: "First Semester",
        subjects: [
            {
                name: "Mathematics I",
                code: "MATH101",
                resources: {
                    syllabus: [
                        { name: "Mathematics I Syllabus", url: "https://example.com/syllabus1.pdf", type: "pdf" }
                    ],
                    notes: [
                        { name: "Calculus Basics", url: "https://example.com/notes1.pdf", type: "pdf" },
                        { name: "Linear Algebra", url: "https://example.com/notes2.pdf", type: "pdf" },
                        { name: "Differential Equations", url: "https://example.com/notes3.pdf", type: "pdf" }
                    ],
                    questionBank: [
                        { name: "Previous Year Questions 2023", url: "https://example.com/qb1.pdf", type: "pdf" },
                        { name: "Practice Questions Set 1", url: "https://example.com/qb2.pdf", type: "pdf" }
                    ],
                    solutions: [
                        { name: "Solution Manual", url: "https://example.com/solutions1.pdf", type: "pdf" }
                    ]
                }
            },
            {
                name: "Physics I",
                code: "PHYS101",
                resources: {
                    syllabus: [
                        { name: "Physics I Syllabus", url: "https://example.com/syllabus2.pdf", type: "pdf" }
                    ],
                    notes: [
                        { name: "Mechanics", url: "https://example.com/notes4.pdf", type: "pdf" },
                        { name: "Thermodynamics", url: "https://example.com/notes5.pdf", type: "pdf" },
                        { name: "Waves and Oscillations", url: "https://example.com/notes6.pdf", type: "pdf" }
                    ],
                    questionBank: [
                        { name: "Physics Questions 2023", url: "https://example.com/qb3.pdf", type: "pdf" },
                        { name: "Practice Problems", url: "https://example.com/qb4.pdf", type: "pdf" }
                    ],
                    solutions: [
                        { name: "Physics Solutions", url: "https://example.com/solutions2.pdf", type: "pdf" }
                    ]
                }
            },
            {
                name: "Programming Fundamentals",
                code: "CSC101",
                resources: {
                    syllabus: [
                        { name: "Programming Syllabus", url: "https://example.com/syllabus3.pdf", type: "pdf" }
                    ],
                    notes: [
                        { name: "C Programming Basics", url: "https://example.com/notes7.pdf", type: "pdf" },
                        { name: "Data Types and Variables", url: "https://example.com/notes8.pdf", type: "pdf" },
                        { name: "Control Structures", url: "https://example.com/notes9.pdf", type: "pdf" }
                    ],
                    questionBank: [
                        { name: "Programming Questions", url: "https://example.com/qb5.pdf", type: "pdf" },
                        { name: "Code Practice", url: "https://example.com/qb6.pdf", type: "pdf" }
                    ],
                    solutions: [
                        { name: "Code Solutions", url: "https://example.com/solutions3.pdf", type: "pdf" }
                    ]
                }
            }
        ]
    },
    2: {
        title: "Second Semester",
        subjects: [
            {
                name: "Mathematics II",
                code: "MATH102",
                resources: {
                    syllabus: [{ name: "Mathematics II Syllabus", url: "https://example.com/syllabus4.pdf", type: "pdf" }],
                    notes: [
                        { name: "Advanced Calculus", url: "https://example.com/notes10.pdf", type: "pdf" },
                        { name: "Vector Calculus", url: "https://example.com/notes11.pdf", type: "pdf" },
                        { name: "Complex Analysis", url: "https://example.com/notes12.pdf", type: "pdf" }
                    ],
                    questionBank: [
                        { name: "Math II Questions 2023", url: "https://example.com/qb7.pdf", type: "pdf" },
                        { name: "Advanced Problems", url: "https://example.com/qb8.pdf", type: "pdf" }
                    ],
                    solutions: [
                        { name: "Math II Solutions", url: "https://example.com/solutions4.pdf", type: "pdf" }
                    ]
                }
            },
            {
                name: "Data Structures",
                code: "CSC102",
                resources: {
                    syllabus: [{ name: "Data Structures Syllabus", url: "https://example.com/syllabus5.pdf", type: "pdf" }],
                    notes: [
                        { name: "Arrays and Lists", url: "https://example.com/notes13.pdf", type: "pdf" },
                        { name: "Stacks and Queues", url: "https://example.com/notes14.pdf", type: "pdf" },
                        { name: "Trees and Graphs", url: "https://example.com/notes15.pdf", type: "pdf" }
                    ],
                    questionBank: [
                        { name: "DS Questions 2023", url: "https://example.com/qb9.pdf", type: "pdf" },
                        { name: "Algorithm Problems", url: "https://example.com/qb10.pdf", type: "pdf" }
                    ],
                    solutions: [
                        { name: "DS Solutions", url: "https://example.com/solutions5.pdf", type: "pdf" }
                    ]
                }
            }
        ]
    }
    // Add more semesters as needed
};

// Initialize semester page
document.addEventListener('DOMContentLoaded', function() {
    initializeSemesterPage();
});

function initializeSemesterPage() {
    // Get semester number from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const semesterNumber = parseInt(urlParams.get('sem')) || 1;
    
    // Update page title
    const semesterTitle = document.getElementById('semesterTitle');
    
    // Check if admin resources exist for this semester
    const adminResources = loadResourcesFromAdmin();
    const hasAdminResources = adminResources[semesterNumber] && adminResources[semesterNumber].length > 0;
    
    if (hasAdminResources) {
        semesterTitle.textContent = `Semester ${semesterNumber}`;
        loadSubjects(semesterNumber);
    } else {
        const semesterInfo = semesterData[semesterNumber];
        if (semesterInfo) {
            semesterTitle.textContent = semesterInfo.title;
            loadSubjects(semesterNumber);
        } else {
            semesterTitle.textContent = `Semester ${semesterNumber}`;
            showNotification('Semester data not available', 'error');
        }
    }
    
    // Listen for admin panel updates
    window.addEventListener('adminResourcesUpdated', function(event) {
        console.log('Admin resources updated:', event.detail);
        if (event.detail.semester === semesterNumber) {
            loadSubjects(semesterNumber);
        }
    });
}

function loadSubjects(semesterNumber) {
    const subjectsGrid = document.getElementById('subjectsGrid');
    
    // First try to load from admin panel
    const adminResources = loadResourcesFromAdmin();
    let subjects = [];
    
    if (adminResources[semesterNumber] && adminResources[semesterNumber].length > 0) {
        console.log('Loading subjects from admin panel');
        subjects = convertAdminResourcesToSemesterData(adminResources, semesterNumber);
    } else {
        console.log('Loading subjects from sample data');
        const semesterInfo = semesterData[semesterNumber];
        subjects = semesterInfo ? semesterInfo.subjects : [];
    }
    
    if (!subjects || subjects.length === 0) {
        subjectsGrid.innerHTML = '<p class="text-center">No subjects available for this semester.</p>';
        return;
    }
    
    subjectsGrid.innerHTML = subjects.map(subject => `
        <div class="subject-card">
            <div class="subject-header">
                <h3>${subject.name}</h3>
                <span class="subject-code">${subject.code}</span>
            </div>
            <div class="subject-resources">
                <div class="resource-section">
                    <h4><i class="fas fa-file-alt"></i> Syllabus</h4>
                    <div class="resource-list">
                        ${subject.resources.syllabus.map(resource => `
                            <a href="${resource.url}" target="_blank" class="resource-item">
                                <i class="fas fa-download"></i>
                                ${resource.name}
                            </a>
                        `).join('')}
                    </div>
                </div>
                
                <div class="resource-section">
                    <h4><i class="fas fa-book-open"></i> Notes</h4>
                    <div class="resource-list">
                        ${subject.resources.notes.map(resource => `
                            <a href="${resource.url}" target="_blank" class="resource-item">
                                <i class="fas fa-download"></i>
                                ${resource.name}
                            </a>
                        `).join('')}
                    </div>
                </div>
                
                <div class="resource-section">
                    <h4><i class="fas fa-question-circle"></i> Question Bank</h4>
                    <div class="resource-list">
                        ${subject.resources.questionBank.map(resource => `
                            <a href="${resource.url}" target="_blank" class="resource-item">
                                <i class="fas fa-download"></i>
                                ${resource.name}
                            </a>
                        `).join('')}
                    </div>
                </div>
                
                <div class="resource-section">
                    <h4><i class="fas fa-lightbulb"></i> Solutions</h4>
                    <div class="resource-list">
                        ${subject.resources.solutions.map(resource => `
                            <a href="${resource.url}" target="_blank" class="resource-item">
                                <i class="fas fa-download"></i>
                                ${resource.name}
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Export functions for global use
window.loadSubjects = loadSubjects;
