const ADMIN_PASSWORD = "Tw!g@2#0!"; // The required password

document.addEventListener('DOMContentLoaded', () => {
    loadContent();
    setupNavigation();
});

function loadContent() {

    const savedHero = localStorage.getItem('portfolio_hero');
    const savedProjects = localStorage.getItem('portfolio_projects');
    const savedPlans = localStorage.getItem('portfolio_plans');
    const savedExperience = localStorage.getItem('portfolio_experience');
    const savedProfile = localStorage.getItem('portfolio_profile_img');

    if (savedHero) document.getElementById('hero').innerHTML = savedHero;
    if (savedProjects) document.getElementById('projects-grid').innerHTML = savedProjects;
    if (savedPlans) document.getElementById('plans-list').innerHTML = savedPlans;
    if (savedExperience) document.getElementById('experience').innerHTML = savedExperience; 
    
    // Profile Image Logic: Show only if saved, else show placeholder
    if (savedProfile) {
        const img = document.getElementById('profile-img');
        const placeholder = document.getElementById('profile-placeholder');
        img.src = savedProfile;
        img.style.display = 'block';
        placeholder.style.display = 'none';
    }

    // Restore saved project images
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        const savedImage = localStorage.getItem(`portfolio_project_img_${index}`);
        if (savedImage) {
            const img = card.querySelector('.project-img img');
            if (img) {
                img.src = savedImage;
            }
        }
        // Add data-project-index if not present
        const projectImgDiv = card.querySelector('.project-img');
        if (projectImgDiv && !projectImgDiv.hasAttribute('data-project-index')) {
            projectImgDiv.setAttribute('data-project-index', index);
        }
    });

    // Re-attach event listeners after loading HTML
    reattachFileListener();
}

// --- 1. Authentication Logic ---
function openLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
    document.getElementById('admin-password').value = ''; // clear field
    document.getElementById('login-error').style.display = 'none';
    document.getElementById('admin-password').focus();
}

function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}

function handleEnter(e) {
    if (e.key === 'Enter') checkPassword();
}

function checkPassword() {
    const input = document.getElementById('admin-password').value;
    if (input === ADMIN_PASSWORD) {
        closeLoginModal();
        enableEditMode(); // Password correct, enable editing
    } else {
        document.getElementById('login-error').style.display = 'block';
        document.getElementById('admin-password').value = '';
    }
}

// --- 2. Edit Mode Logic ---
let isEditMode = false;

function enableEditMode() {
    isEditMode = true;
    document.body.classList.add('editing-mode');
    const toggleBtn = document.getElementById('edit-toggle');
    const saveBtn = document.getElementById('save-btn');
    const addProjBtn = document.getElementById('add-proj-btn');
    const addPlanBtn = document.getElementById('add-plan-btn');

    toggleBtn.classList.add('active');
    saveBtn.style.display = 'block';
    addProjBtn.style.display = 'block';
    addPlanBtn.style.display = 'block';
    
    // Make text editable
    document.querySelectorAll('.editable').forEach(el => {
        el.contentEditable = "true";
    });
}

function toggleEditMode() {
    // This function is kept for the save button logic, but entry point is now Login
    isEditMode = !isEditMode;
    document.body.classList.toggle('editing-mode');
    const toggleBtn = document.getElementById('edit-toggle');
    const saveBtn = document.getElementById('save-btn');
    const addProjBtn = document.getElementById('add-proj-btn');
    const addPlanBtn = document.getElementById('add-plan-btn');

    if (isEditMode) {
        toggleBtn.classList.add('active');
        saveBtn.style.display = 'block';
        addProjBtn.style.display = 'block';
        addPlanBtn.style.display = 'block';
        
        document.querySelectorAll('.editable').forEach(el => {
            el.contentEditable = "true";
        });
    } else {
        toggleBtn.classList.remove('active');
        saveBtn.style.display = 'none';
        addProjBtn.style.display = 'none';
        addPlanBtn.style.display = 'none';
        
        document.querySelectorAll('.editable').forEach(el => {
            el.contentEditable = "false";
        });
    }
}

function saveData() {
    localStorage.setItem('portfolio_hero', document.getElementById('hero').innerHTML);
    localStorage.setItem('portfolio_projects', document.getElementById('projects-grid').innerHTML);
    localStorage.setItem('portfolio_plans', document.getElementById('plans-list').innerHTML);
    localStorage.setItem('portfolio_experience', document.getElementById('experience').innerHTML);

    alert('Portfolio saved locally! Changes will persist on this browser.');
    toggleEditMode(); // Exit edit mode
}

// --- 3. Profile Photo Upload ---
function triggerFileUpload() {
    if(isEditMode) {
        document.getElementById('file-upload').click();
    } else {
        alert("Please enable Edit Mode (Login) to upload a photo.");
    }
}

function reattachFileListener() {
    const fileInput = document.getElementById('file-upload');
    const profileImg = document.getElementById('profile-img');
    const placeholder = document.getElementById('profile-placeholder');
    
    if(!fileInput) return;

    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImg.src = e.target.result;
                profileImg.style.display = 'block';
                placeholder.style.display = 'none'; // Hide placeholder
                localStorage.setItem('portfolio_profile_img', e.target.result);
            }
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Project image upload listener
    setupProjectImageUpload();
}

// --- Project Image Upload ---
let currentProjectImageElement = null;

function triggerProjectImageUpload(element) {
    if(!isEditMode) {
        return;
    }
    currentProjectImageElement = element;
    document.getElementById('project-image-upload').click();
}

function setupProjectImageUpload() {
    const projectImageInput = document.getElementById('project-image-upload');
    if(!projectImageInput) return;

    // Remove old listeners to prevent duplicates
    const newInput = projectImageInput.cloneNode(true);
    projectImageInput.parentNode.replaceChild(newInput, projectImageInput);

    newInput.addEventListener('change', function() {
        if (this.files && this.files[0] && currentProjectImageElement) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = currentProjectImageElement.querySelector('img');
                if(img) {
                    img.src = e.target.result;
                    // Save to localStorage
                    const projectIndex = currentProjectImageElement.getAttribute('data-project-index');
                    if(projectIndex !== null) {
                        localStorage.setItem(`portfolio_project_img_${projectIndex}`, e.target.result);
                    }
                }
            }
            reader.readAsDataURL(this.files[0]);
        }
    });
}

// --- 4. Add Project Modal ---
function openProjectModal() {
    document.getElementById('project-modal').style.display = 'flex';
}
function closeProjectModal() {
    document.getElementById('project-modal').style.display = 'none';
}

function addProject() {
    const title = document.getElementById('new-proj-title').value;
    const desc = document.getElementById('new-proj-desc').value;
    let img = document.getElementById('new-proj-img').value;
    const tech = document.getElementById('new-proj-tech').value;
    const codeLink = document.getElementById('new-proj-code').value || '#';
    const demoLink = document.getElementById('new-proj-demo').value || '#';

    if (!title || !desc) {
        alert('Please fill in Title and Description');
        return;
    }

    if (!img) {
        const seed = Math.random().toString(36).substring(7);
        img = `https://picsum.photos/seed/${seed}/600/400`;
    }

    const techArray = tech.split(',').map(t => `<span class="tech-pill">${t.trim()}</span>`).join('');

    // Get next project index
    const projectCount = document.querySelectorAll('.project-card').length;

    const html = `
        <article class="glass-neon project-card">
            <div class="project-img" onclick="triggerProjectImageUpload(this)" data-project-index="${projectCount}">
                <img src="${img}" alt="${title}">
                <div class="edit-image-overlay">
                    <div class="edit-image-btn">
                        <i class="fas fa-camera"></i>
                        <span>Change Image</span>
                    </div>
                </div>
            </div>
            <div class="project-content">
                <h3 class="editable">${title}</h3>
                <p class="editable">${desc}</p>
                <div class="project-tech">
                    ${techArray}
                </div>
                <div class="project-actions">
                    <a href="${codeLink}" class="action-btn btn-code"><i class="fab fa-github"></i> Code</a>
                    <a href="${demoLink}" class="action-btn btn-demo"><i class="fas fa-rocket"></i> Demo</a>
                    <a href="#" class="action-btn btn-docs"><i class="fas fa-book"></i> Docs</a>
                </div>
            </div>
        </article>
    `;

    document.getElementById('projects-grid').insertAdjacentHTML('beforeend', html);
    closeProjectModal();
    document.getElementById('new-proj-title').value = '';
    document.getElementById('new-proj-desc').value = '';
    document.getElementById('new-proj-tech').value = '';
    document.getElementById('new-proj-img').value = '';
    setupProjectImageUpload();
}

// --- 5. Add Plan Logic ---
function addPlan() {
    const html = `
        <div class="plan-item">
            <div class="plan-icon"><i class="fas fa-star"></i></div>
            <div class="plan-text">
                <h4 class="editable" contenteditable="true">New Goal</h4>
                <p class="editable" contenteditable="true">Description of your new plan...</p>
            </div>
        </div>
    `;
    document.getElementById('plans-list').insertAdjacentHTML('beforeend', html);
}

// --- 6. Sidebar & Navigation ---
function setupNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
    });

    // Scroll Spy
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        const dots = document.querySelectorAll('.dot');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        dots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('onclick').includes(current)) {
                dot.classList.add('active');
            }
        });
    });
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Close modals if clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('login-modal');
    const projModal = document.getElementById('project-modal');
    if (event.target == loginModal) closeLoginModal();
    if (event.target == projModal) closeProjectModal();
}