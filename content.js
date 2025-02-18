// Add quotes array at the top of the file
const quotes = [
    {
        text: "I wasn't meant for reality, but life came and found me.",
        author: "Fernando Pessoa"
    },
    {
        text: "My soul is impatient with itself, as with a bothersome child; its restlessness keeps growing and is forever the same.",
        author: "Fernando Pessoa"
    },
    {
        text: "I carry my awareness of defeat like a banner of victory.",
        author: "Fernando Pessoa"
    },
    {
        text: "We worship perfection because we can't have it; if we had it, we would reject it. Perfection is inhuman, because humanity is imperfect.",
        author: "Fernando Pessoa"
    },
    {
        text: "We all have two lives: The true, the one we dreamed of in childhood And go on dreaming of as adults in a substratum of mist; the false, the one we love when we live with others, the practical, the useful, the one we end up by being put in a coffin.",
        author: "Fernando Pessoa"
    },
    {
        text: "dubito ergo sum",
        author: ""
    },
    {
        text: "Where is my yesterday self?",
        author: ""
    },
    {
        text: "“Le Poète se fait voyant par un long, immense et raisonné dérèglement de tous les sens.”",
        author: "Arthur Rimbaud"
    },
    {
        text: "I am nothing. I'll never be anything. I couldn't want to be something. Apart from that, I have in me all the dreams in the world.",
        author: "Fernando Pessoa"
    },
    {
        text: "Literature is the most agreeable way of ignoring life.",
        author: "Fernando Pessoa"
    },
    {
        text: "My past is everything I failed to be.",
        author: "Fernando Pessoa"
    },
    {
        text: " ...all alike the Slaves of our respective Dimensional prejudices",
        author: "EA Abbott"
    },
    {
        text: "To write is to forget. Literature is the most agreeable way of ignoring life.",
        author: "Fernando Pessoa"
    },
    {
        text: "Art consists in making others feel what we feel.",
        author: "Fernando Pessoa"
    },
    {
        text: "The value of things is not the time they last, but the intensity with which they occur.",
        author: "Fernando Pessoa"
    },
    {
        text: "Life is what we make of it. Travel is the traveler. What we see isn't what we see but what we are.",
        author: "Fernando Pessoa"
    }, 
    {
        text: "“Un soir, j'ai assis la Beauté sur mes genoux. - Et je l'ai trouvée amère.",
        author: "Arthur Rimbaud"
    },
    {
        text: "“Les aubes sont navrantes. Toute lune est atroce et tout soleil amer.”",
        author: "Arthur Rimbaud"
    },
    {
        text: "Pour l'enfant, amoureux de cartes et d'estampes, L'univers est égal à son vaste appétit. Ah! que le monde est grand à la clarté des lampes! Aux yeux du souvenir que le monde est petit!",
        author: "Baudelaire"
    },
    {
        text: "Etonnants voyageurs! quelles nobles histoires Nous lisons dans vos yeux profonds comme les mers! Montrez-nous les écrins de vos riches mémoires, Ces bijoux merveilleux, faits d'astres et d'éthers.",
        author: "Baudelaire"
    }, 
    {
        text: "“La vie est un long fleuve tranquille.”",
        author: "Baudelaire"
    },

];

function getRandomQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    return `${quote.text}<br><span class="quote-author">— ${quote.author}</span>`;
}

// Content configuration
const sectionContent = {
    quote: {
        get text() {
            const quote = quotes[Math.floor(Math.random() * quotes.length)];
            return `<span class="quote-text">${quote.text}</span><br><span class="quote-author">— ${quote.author}</span>`;
        }
    },
    manifesto: {
        title: '<h3 style="font-family: var(--body-font)">TALACH ?</h3>',
        text: `<p>• <em>Travail à la Chaine</em> — A set of rules, for once not to limit but to expand. Not a boundary, but a starting point.</p>

        <p>• This project lives in the spirit of amateurism, making for the love of making. <em>Amateur</em>, from the French <em>aimer</em>, to love.</p>

        <p>• Simple algorithms shape the work. Sometimes self-contained, sometimes colliding with images, words, and worlds already spinning.</p>`
    },
    products1: {
        title: '<h3 style="font-family: var(--body-font)">Drawings</h3>',
        items: [
            {
                images: ['products_bike/luxor-drawing-171350_492.svg'],
                itemType: ''
            },
            {
                images: ['products_bike/luxor-drawing-165814_894.svg'],
                itemType: ''
            },
            {
                images: ['products_bike/luxor-drawing-165601_523.svg'],
                itemType: ''
            },
            {
                images: ['products_bike/luxor-drawing-143254_316.png'],
                itemType: ''
            },
            {
                images: ['products_bike/luxor-drawing-222951_155.png'],
                itemType: ''
            },
            {
                images: ['products_bike/luxor-drawing-201133_914.png'],
                itemType: ''
            },
            {
                images: ['products_bike/luxor-drawing-195701_447.png'],
                itemType: ''
            },
            {
                images: ['products_bike/luxor-drawing-190859_328.png'],
                itemType: ''
            },
            {
                images: ['products_bike/luxor-drawing-190833_256.png'],
                itemType: ''
            },
            {
                images: ['products_bike/luxor-drawing-185822_774.png'],
                itemType: ''
            }
        ]
    },
    products2: {
        title: '<h3 style="font-family: var(--body-font)">More Drawings</h3>',
        items: [
            {
                images: ['products_life/product1_pic1.png', 'products_life/product1_pic2.png'],
                itemType: ''
            },
            {
                images: ['products_life/product2_pic1.png'],
                itemType: ''
            },
            {
                images: ['products_life/product3_pic1.png'],
                itemType: ''
            },
            {
                images: ['products_life/product4_pic1.png', 'products_life/product4_pic2.png'],
                itemType: ''
            }
        ]
    },
    contact: {
        email: 'talach@posteo.net',
        links: [
            {
                text: 'github.com/vullioud',
                url: 'https://www.github.com/vullioud'
            }
        ]
    }
};

const productSizes = {
    tshirt: [''],
    poster: [''],
    default: ['']
};

function createProductCard(item) {
    const hasMultipleImages = item.images.length > 1;
    return `
        <div class="product-card" data-product='${JSON.stringify({...item, type: item.itemType})}'>
            <div class="carousel${hasMultipleImages ? ' multi-image' : ''}">
                <div class="carousel-images">
                    ${item.images.map(img => `<img src="${img}" alt="" loading="lazy">`).join('')}
                </div>
                ${hasMultipleImages ? `
                    <button class="carousel-button prev" aria-label="Previous image">←</button>
                    <button class="carousel-button next" aria-label="Next image">→</button>
                ` : ''}
            </div>
        </div>
    `;
}

// Update section content
function updateSectionContent() {
    // Update quote section
    const quoteSection = document.getElementById('quote');
    if (quoteSection) {
        const quoteContent = quoteSection.querySelector('.quote-text');
        if (quoteContent) {
            quoteContent.innerHTML = sectionContent.quote.text;
        }
    }

    // Update manifesto section
    const manifestoSection = document.getElementById('manifesto');
    if (manifestoSection) {
        const titleEl = manifestoSection.querySelector('.section-title');
        const textEl = manifestoSection.querySelector('.section-text');
        
        if (titleEl) {
            titleEl.innerHTML = `<h3>${sectionContent.manifesto.title}</h3>`;
        }
        
        if (textEl) {
            textEl.innerHTML = sectionContent.manifesto.text;
        }
    }

    // Update products sections
    ['products1', 'products2'].forEach(section => {
        const sectionEl = document.getElementById(section);
        if (!sectionEl) return;

        const titleEl = sectionEl.querySelector('.section-title');
        const productsContainer = sectionEl.querySelector('.product-grid');
        
        if (titleEl) {
            titleEl.innerHTML = sectionContent[section].title;
        }
        
        if (productsContainer && sectionContent[section].items) {
            productsContainer.innerHTML = sectionContent[section].items
                .map(item => createProductCard(item))
                .join('');
        }
    });

    // Update contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const titleEl = contactSection.querySelector('.section-title');
        const linksContainer = contactSection.querySelector('.contact-links');
        
        if (titleEl) {
            titleEl.innerHTML = `<h3>${sectionContent.contact.email}</h3>`;
        }
        
        if (linksContainer) {
            linksContainer.innerHTML = sectionContent.contact.links
                .map(link => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.text}</a>`)
                .join('');
        }
    }
}

// Initialize carousel functionality
function initializeCarousels() {
    document.querySelectorAll('.carousel.multi-image').forEach(carousel => {
        const images = carousel.querySelector('.carousel-images');
        const prevBtn = carousel.querySelector('.carousel-button.prev');
        const nextBtn = carousel.querySelector('.carousel-button.next');
        const totalImages = images.querySelectorAll('img').length;
        let currentIndex = 0;

        // Disable prev button initially
        if (prevBtn) {
            prevBtn.style.opacity = '0.5';
            prevBtn.style.pointerEvents = 'none';
        }

        function updateCarousel() {
            images.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            if (prevBtn) {
                prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
                prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
            }
            
            if (nextBtn) {
                nextBtn.style.opacity = currentIndex === totalImages - 1 ? '0.5' : '1';
                nextBtn.style.pointerEvents = currentIndex === totalImages - 1 ? 'none' : 'auto';
            }
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentIndex < totalImages - 1) {
                    currentIndex++;
                    updateCarousel();
                }
            });
        }

        // Initialize carousel state
        updateCarousel();
    });
}

// Add modal HTML to the document
document.body.insertAdjacentHTML('beforeend', `
    <div class="product-modal">
        <div class="product-modal-content">
            <button class="modal-close">×</button>
            <div class="product-modal-image">
                <img src="" alt="">
            </div>
            <div class="product-modal-details">
                <h2 class="product-modal-title"></h2>
                <p class="product-modal-description"></p>
                <div class="size-selector"></div>
                <button class="buy-button">Add to Cart</button>
            </div>
        </div>
    </div>
`);

// Add modal functionality
function initializeProductModal() {
    const modal = document.querySelector('.product-modal');
    const modalContent = modal.querySelector('.product-modal-content');
    const modalImage = modal.querySelector('.product-modal-image img');
    const modalTitle = modal.querySelector('.product-modal-title');
    const modalDescription = modal.querySelector('.product-modal-description');
    const sizeSelector = modal.querySelector('.size-selector');
    const buyButton = modal.querySelector('.buy-button');
    const closeButton = modal.querySelector('.modal-close');
    
    function openModal(product) {
        modalImage.src = product.images[0];
        modalTitle.textContent = product.title;
        modalDescription.textContent = product.description;
        
        // Set up size selector
        const sizes = productSizes[product.type] || productSizes.default;
        sizeSelector.innerHTML = sizes
            .map(size => `<button class="size-option" data-size="${size}">${size}</button>`)
            .join('');
            
        modal.classList.add('active');
    }
    
    function closeModal() {
        modal.classList.remove('active');
    }
    
    // Event Listeners
    document.addEventListener('click', e => {
        if (e.target.closest('.product-card')) {
            const product = JSON.parse(e.target.closest('.product-card').dataset.product);
            openModal(product);
        }
        
        if (e.target.matches('.size-option')) {
            sizeSelector.querySelectorAll('.size-option').forEach(btn => 
                btn.classList.remove('selected'));
            e.target.classList.add('selected');
        }
    });
    
    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });
    
    buyButton.addEventListener('click', () => {
        const selectedSize = sizeSelector.querySelector('.size-option.selected');
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        // Here you would integrate with your payment processing system
        alert('Proceeding to checkout...');
    });
}

// Initialize content when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateSectionContent();
    initializeCarousels();
    initializeProductModal();
    
    // Hide content initially
    const content = document.querySelector('.content');
    content.style.opacity = '0';
    content.style.visibility = 'hidden';
    
    // Show content after animation (3 seconds)
    setTimeout(() => {
        content.style.opacity = '1';
        content.style.visibility = 'visible';
        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';
        
        const canvas = document.getElementById('background');
        canvas.style.zIndex = '2';
        
        window.scrollTo({
            top: 0,
            behavior: 'auto'
        });
    }, 3000);
});

// Menu button functionality
document.querySelector('.menu-button').addEventListener('click', function() {
    const nav = document.querySelector('nav ul');
    nav.classList.toggle('visible');
    this.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const nav = document.querySelector('nav ul');
    const menuButton = document.querySelector('.menu-button');
    if (!nav.contains(event.target) && !menuButton.contains(event.target)) {
        nav.classList.remove('visible');
        menuButton.classList.remove('active');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close menu after clicking
            document.querySelector('nav ul').classList.remove('visible');
            document.querySelector('.menu-button').classList.remove('active');
        }
    });
}); 