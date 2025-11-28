// ===================================
// Portfolio Website - Interactive JavaScript
// ===================================

// Wait for DOM to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio website loaded successfully');
    
    // Initialize all functions
    initSmoothScrolling();
    initMobileMenu();
    initProjectFilter();
    initLightbox();
    initFormValidation();
    initScrollAnimations();
});

// ===================================
// Smooth Scrolling for Navigation Links
// ===================================
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    if (navLinks.length === 0) {
        console.warn('No navigation links found for smooth scrolling');
        return;
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    toggleMenu();
                }
                
                console.log(`Scrolled to section: ${targetId}`);
            } else {
                console.error(`Target section not found: ${targetId}`);
            }
        });
    });
    
    console.log('Smooth scrolling initialized');
}

// ===================================
// Mobile Navigation Menu Toggle
// ===================================
function initMobileMenu() {
    const nav = document.querySelector('nav');
    
    if (!nav) {
        console.warn('Navigation element not found');
        return;
    }
    
    // Check if hamburger already exists
    let hamburger = document.querySelector('.hamburger');
    
    if (!hamburger) {
        // Create hamburger menu button only if it doesn't exist
        hamburger = document.createElement('button');
        hamburger.classList.add('hamburger');
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = `
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        `;
        
        // Insert hamburger after logo
        const logo = nav.querySelector('.logo');
        if (logo) {
            logo.parentNode.insertBefore(hamburger, logo.nextSibling);
        }
    }
    
    // Add click event listener
    hamburger.addEventListener('click', toggleMenu);
    
    console.log('Mobile menu initialized');
}

function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (!navMenu || !hamburger) {
        console.error('Navigation menu or hamburger button not found');
        return;
    }
    
    // Toggle active class
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Update ARIA attribute
    const isExpanded = navMenu.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isExpanded);
    
    console.log(`Menu toggled: ${isExpanded ? 'open' : 'closed'}`);
}

// ===================================
// Project Filter Functionality
// ===================================
function initProjectFilter() {
    const projectsSection = document.querySelector('.projects-section');
    
    if (!projectsSection) {
        console.warn('Projects section not found');
        return;
    }
    
    // Create filter buttons
    const filterContainer = document.createElement('div');
    filterContainer.classList.add('project-filters');
    filterContainer.innerHTML = `
        <button class="filter-btn active" data-filter="all">All Projects</button>
        <button class="filter-btn" data-filter="html">HTML/CSS</button>
        <button class="filter-btn" data-filter="javascript">JavaScript</button>
        <button class="filter-btn" data-filter="react">React</button>
    `;
    
    // Insert filter buttons before projects grid
    const projectsGrid = projectsSection.querySelector('.projects-grid');
    if (projectsGrid) {
        projectsSection.insertBefore(filterContainer, projectsGrid);
    }
    
    // Add event listeners to filter buttons
    const filterButtons = filterContainer.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterProjects(filter);
            
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    console.log('Project filter initialized');
}

function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');
    
    if (projectCards.length === 0) {
        console.warn('No project cards found to filter');
        return;
    }
    
    console.log(`Filtering projects by category: ${category}`);
    
    projectCards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease';
        } else {
            const techTags = card.querySelectorAll('.tech-tag');
            let hasCategory = false;
            
            techTags.forEach(tag => {
                const tagText = tag.textContent.toLowerCase();
                if (tagText.includes(category.toLowerCase())) {
                    hasCategory = true;
                }
            });
            
            if (hasCategory) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// ===================================
// Lightbox for Project Images
// ===================================
function initLightbox() {
    // Create lightbox modal
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image lightbox');
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
            <img src="" alt="" class="lightbox-image">
            <div class="lightbox-caption"></div>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    // Add click event to all project images
    const projectImages = document.querySelectorAll('.project-image');
    projectImages.forEach(image => {
        image.style.cursor = 'pointer';
        image.addEventListener('click', function() {
            openLightbox(this.src, this.alt);
        });
    });
    
    // Close lightbox on background click or close button
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close lightbox on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    console.log('Lightbox initialized');
}

function openLightbox(imageSrc, imageAlt) {
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    
    if (!lightbox || !lightboxImage) {
        console.error('Lightbox elements not found');
        return;
    }
    
    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageAlt;
    lightboxCaption.textContent = imageAlt;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    console.log('Lightbox opened');
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    
    if (!lightbox) {
        console.error('Lightbox not found');
        return;
    }
    
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    
    console.log('Lightbox closed');
}

// ===================================
// Form Validation for Contact Form
// ===================================
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) {
        console.warn('Contact form not found');
        return;
    }
    
    // Get form elements
    const nameInput = contactForm.querySelector('#name');
    const emailInput = contactForm.querySelector('#email');
    const subjectInput = contactForm.querySelector('#subject');
    const messageInput = contactForm.querySelector('#message');
    
    if (!nameInput || !emailInput || !subjectInput || !messageInput) {
        console.error('Form inputs not found');
        return;
    }
    
    // Add real-time validation
    nameInput.addEventListener('blur', () => validateField(nameInput, 'name'));
    emailInput.addEventListener('blur', () => validateField(emailInput, 'email'));
    subjectInput.addEventListener('blur', () => validateField(subjectInput, 'subject'));
    messageInput.addEventListener('blur', () => validateField(messageInput, 'message'));
    
    // Add input event listeners for real-time feedback
    nameInput.addEventListener('input', () => clearError(nameInput));
    emailInput.addEventListener('input', () => clearError(emailInput));
    subjectInput.addEventListener('input', () => clearError(subjectInput));
    messageInput.addEventListener('input', () => clearError(messageInput));
    
    // Handle form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('Form submission attempted');
        
        // Validate all fields
        const isNameValid = validateField(nameInput, 'name');
        const isEmailValid = validateField(emailInput, 'email');
        const isSubjectValid = validateField(subjectInput, 'subject');
        const isMessageValid = validateField(messageInput, 'message');
        
        if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            // All fields are valid
            handleFormSubmission(contactForm);
        } else {
            console.warn('Form validation failed');
            showFormMessage('Please correct the errors before submitting.', 'error');
        }
    });
    
    console.log('Form validation initialized');
}

function validateField(field, fieldType) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    clearError(field);
    
    // Validation rules
    switch(fieldType) {
        case 'name':
            if (value.length === 0) {
                errorMessage = 'Name is required';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
                isValid = false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value.length === 0) {
                errorMessage = 'Email is required';
                isValid = false;
            } else if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;
            
        case 'subject':
            if (value.length === 0) {
                errorMessage = 'Subject is required';
                isValid = false;
            } else if (value.length < 3) {
                errorMessage = 'Subject must be at least 3 characters';
                isValid = false;
            }
            break;
            
        case 'message':
            if (value.length === 0) {
                errorMessage = 'Message is required';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters';
                isValid = false;
            }
            break;
    }
    
    // Display error if validation failed
    if (!isValid) {
        showFieldError(field, errorMessage);
        console.log(`Validation failed for ${fieldType}: ${errorMessage}`);
    } else {
        console.log(`Validation passed for ${fieldType}`);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    
    if (!formGroup) {
        console.error('Form group not found for field');
        return;
    }
    
    // Add error class to field
    field.classList.add('error');
    
    // Create and add error message
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('field-error');
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');
    
    formGroup.appendChild(errorDiv);
}

function clearError(field) {
    const formGroup = field.closest('.form-group');
    
    if (!formGroup) return;
    
    // Remove error class
    field.classList.remove('error');
    
    // Remove error message
    const errorDiv = formGroup.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function handleFormSubmission(form) {
    console.log('Form is valid, processing submission...');
    
    // Get form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    console.log('Form data:', data);
    
    // Simulate form submission (replace with actual API call)
    showFormMessage('Thank you! Your message has been sent successfully.', 'success');
    
    // Reset form after successful submission
    setTimeout(() => {
        form.reset();
        hideFormMessage();
    }, 3000);
}

function showFormMessage(message, type) {
    // Remove existing message
    hideFormMessage();
    
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('form-message', type);
    messageDiv.textContent = message;
    messageDiv.setAttribute('role', 'alert');
    
    contactForm.insertBefore(messageDiv, contactForm.firstChild);
    
    console.log(`Form message displayed: ${message} (${type})`);
}

function hideFormMessage() {
    const message = document.querySelector('.form-message');
    if (message) {
        message.remove();
    }
}

// ===================================
// Scroll Animations
// ===================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                console.log('Element animated:', entry.target.className);
            }
        });
    }, observerOptions);
    
    // Observe sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    console.log('Scroll animations initialized');
}

// ===================================
// Utility Functions for Debugging
// ===================================
function debugLog(message, data) {
    console.log(`[DEBUG] ${message}`, data || '');
}

// Error handler for global errors
window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.message);
    console.error('Error location:', e.filename, 'Line:', e.lineno);
});

console.log('All portfolio scripts loaded successfully');