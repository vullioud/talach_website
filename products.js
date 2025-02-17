// Use ES6+ modules
import { ProductCarousel } from './modules/carousel.js';

// Modern class implementation
class ProductManager {
    constructor() {
        this.products = document.querySelectorAll('.product-card');
        this.productsPerPage = 6;
        this.currentPage = 0;
        
        this.init();
    }
    
    init() {
        this.setupPagination();
        this.setupLazyLoading();
        this.initCarousels();
    }
    
    setupLazyLoading() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        }, options);
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            observer.observe(img);
        });
    }
    
    // ... rest of the class implementation
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ProductManager();
});

// Setup pagination
const productsPerPage = 6;  // Show more products per page
const products = document.querySelectorAll('.product-card');
const totalPages = Math.ceil(products.length / productsPerPage);
const pagination = document.querySelector('.pagination');

for (let i = 0; i < totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i + 1;
    button.addEventListener('click', () => showPage(i));
    pagination.appendChild(button);
}

function showPage(pageIndex) {
    const start = pageIndex * productsPerPage;
    const end = start + productsPerPage;
    
    // Make sure product-pages is visible
    document.querySelector('.product-pages').style.display = 'grid';
    
    products.forEach((product, index) => {
        product.style.display = (index >= start && index < end) ? 'block' : 'none';
    });
    
    // Update active button
    pagination.querySelectorAll('button').forEach((button, index) => {
        button.classList.toggle('active', index === pageIndex);
    });
}

// Show first page initially
showPage(0); 