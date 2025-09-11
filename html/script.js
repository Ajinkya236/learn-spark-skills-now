// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    initializeApp();
});

// Initialize app functionality
function initializeApp() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Toggle icon between menu and X
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.setAttribute('data-lucide', 'menu');
            } else {
                icon.setAttribute('data-lucide', 'x');
            }
            lucide.createIcons();
        });
    }

    // Initialize sidebar
    initializeSidebar();
    
    // Initialize smooth scrolling for anchor links
    initializeSmoothScrolling();
    
    // Initialize form handlers
    initializeForms();
    
    // Initialize tooltips and interactive elements
    initializeInteractiveElements();
}

// Sidebar functionality
function initializeSidebar() {
    // Set active menu items based on current page
    const currentPath = window.location.pathname;
    const sidebarLinks = document.querySelectorAll('.sidebar-menu-item, .sidebar-submenu-item');
    
    sidebarLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath || 
            (currentPath.includes(link.getAttribute('href')) && link.getAttribute('href') !== '/')) {
            link.classList.add('active');
            
            // If it's a submenu item, open the parent group
            if (link.classList.contains('sidebar-submenu-item')) {
                const parentSubmenu = link.closest('.sidebar-submenu');
                if (parentSubmenu) {
                    parentSubmenu.classList.add('open');
                    const parentButton = parentSubmenu.previousElementSibling;
                    if (parentButton) {
                        const chevron = parentButton.querySelector('[data-lucide="chevron-right"]');
                        if (chevron) {
                            chevron.style.transform = 'rotate(90deg)';
                        }
                    }
                }
            }
        }
    });
}

// Toggle sidebar group
function toggleSidebarGroup(button) {
    const submenu = button.nextElementSibling;
    const chevron = button.querySelector('[data-lucide="chevron-right"]');
    
    if (submenu) {
        submenu.classList.toggle('open');
        
        if (chevron) {
            if (submenu.classList.contains('open')) {
                chevron.style.transform = 'rotate(90deg)';
            } else {
                chevron.style.transform = 'rotate(0deg)';
            }
        }
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
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
}

// Form handling
function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    });
}

// Handle form submissions
function handleFormSubmission(form) {
    // Basic form validation
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            showError(field, 'This field is required');
        } else {
            field.classList.remove('error');
            hideError(field);
        }
    });
    
    if (isValid) {
        // Show success message
        showToast('Form submitted successfully!', 'success');
        
        // Reset form
        form.reset();
    }
}

// Show error message for field
function showError(field, message) {
    let errorElement = field.parentElement.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message text-sm text-red-600 mt-1';
        field.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

// Hide error message for field
function hideError(field) {
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Toast notifications
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg animate-fade-in`;
    toast.style.cssText = `
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        max-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
    `;
    
    toast.textContent = message;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        color: white;
        font-size: 1.25rem;
        cursor: pointer;
        line-height: 1;
        padding: 0;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    closeBtn.addEventListener('click', () => {
        removeToast(toast);
    });
    
    toast.appendChild(closeBtn);
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeToast(toast);
    }, 5000);
}

// Remove toast
function removeToast(toast) {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (toast.parentElement) {
            toast.parentElement.removeChild(toast);
        }
    }, 300);
}

// Interactive elements
function initializeInteractiveElements() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = 'var(--shadow-elegant)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)';
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentElement) {
                    ripple.parentElement.removeChild(ripple);
                }
            }, 600);
        });
    });
}

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .error {
        border-color: #ef4444 !important;
        background-color: rgba(239, 68, 68, 0.05);
    }
    
    .toast {
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search functionality (if needed)
function initializeSearch() {
    const searchInputs = document.querySelectorAll('[data-search]');
    
    searchInputs.forEach(input => {
        const searchHandler = debounce((e) => {
            const query = e.target.value.toLowerCase();
            const target = document.querySelector(input.dataset.search);
            
            if (target) {
                const items = target.querySelectorAll('[data-searchable]');
                items.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    if (text.includes(query)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        }, 300);
        
        input.addEventListener('input', searchHandler);
    });
}

// Theme handling (if dark mode support is needed)
function initializeTheme() {
    const themeToggle = document.querySelector('[data-theme-toggle]');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            
            // Save preference
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }
}

// Navigation helpers
function navigateTo(path) {
    window.location.href = path;
}

// Data formatting utilities
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Export functions for global use
window.toggleSidebarGroup = toggleSidebarGroup;
window.showToast = showToast;
window.navigateTo = navigateTo;
window.formatDate = formatDate;
window.formatNumber = formatNumber;