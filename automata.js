class CellularAutomata {
    constructor() {
        // Color palettes with improved contrast - keeping only the most effective ones
        this.colorPalettes = [
            // Dark palettes with high contrast
            {
                background: '#001833',
                dots: '#222222',
                stroke: '#00FFFF', // Pure cyan
                circleFill: '#006600',
                isDark: true
            },
            {
                background: '#0a0a0a',
                dots: '#1a1a1a',
                stroke: '#FF00FF', // Pure magenta
                circleFill: '#660066',
                isDark: true
            },
            {
                background: '#1A1A1D',
                dots: '#2D2D30',
                stroke: '#FF0000', // Pure red
                circleFill: '#660000',
                isDark: true
            },
            // Light palettes with good contrast
            {
                background: '#ffffff',
                dots: '#cccccc',
                stroke: '#0000FF', // Pure blue
                circleFill: '#000099',
                isDark: false
            },
            {
                background: '#F7F7F7',
                dots: '#E5E5E5',
                stroke: '#FF0066', // Bright pink
                circleFill: '#990033',
                isDark: false
            }
        ];

        // Select random palette first
        this.currentPalette = this.colorPalettes[Math.floor(Math.random() * this.colorPalettes.length)];
        
        // Update CSS variable for menu color
        document.documentElement.style.setProperty('--menu-color', this.currentPalette.stroke);

        // Initialize font loading
        this.fontLoaded = false;
        this.loadImpactFont();
        
        // Initialize canvas dimensions first
        this.canvas = document.getElementById('background');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Text animation properties
        this.text = ["HI YOU!"];
        this.textSize = Math.min(this.canvas.width * 0.75, this.canvas.height) * 0.4;
        this.letterMask = [];
        
        // Logo properties
        this.logo = new Image();
        this.logoLoaded = false;
        this.logoSize = Math.min(this.canvas.width, this.canvas.height) * 0.15; // Reduced to 15%
        
        // Load appropriate logo based on palette darkness
        this.loadLogo();
        
        // Set up dynamic logo and popup
        this.updateFirstWindowLogo();
        this.setupPopup();
        
        // Initialize grid properties
        this.cells = [];
        this.previousGen = []; // Store previous generation for mirror CA
        this.redPath = []; // Simplified path structure
        this.path = []; // Store complete path
        this.cellSize = 6;
        this.rows = Math.ceil(this.canvas.height / this.cellSize);
        this.columns = Math.ceil(this.canvas.width / this.cellSize);
        
        // Updated rules list including mirror-friendly rules
        const rules = [133, 144, 175, 218, 216, 90, 26, 73, 126, 168, 110, 180, 12, 17, 99, 11, 184, 30, 55, 129, 60, 15, 65];
        this.rule = rules[Math.floor(Math.random() * rules.length)];
        this.ruleArray = this.getRuleArray(this.rule);
        
        // Randomly choose between simple and mirror CA
        this.isMirrorCA = Math.random() < 0.5;
        console.log(`Using ${this.isMirrorCA ? 'Mirror' : 'Simple'} CA with rule ${this.rule}`);
        
        // Pathfinder animation
        this.currentPathRow = 0;
        this.currentPathCol = 0;
        this.pathDelay = 50;
        this.pathSpeed = 2;
        this.frameCount = 0;
        
        // Circle animation properties
        const margin = 50;
        const radius = 100;
        this.circle = {
            radius: radius,
            x: margin + radius,
            y: margin + radius,
            dy: 8,
            targetY: this.canvas.height - margin - radius,
            margin: margin,
            isMoving: true
        };
        
        // Animation properties
        this.textAnimationProgress = 0;
        this.textAnimationSpeed = 12;
        this.textComplete = false;
        this.textAnimationDelay = 5;
        this.isAnimationFrozen = false;
        this.pathComplete = false;
        
        // Add skip animation handler
        this.setupSkipAnimation();
        
        // Initialize everything with proper font loading
        this.init();
        this.loadFontAndInit(); // Load font first, then create letter mask
        this.animate();
    }

    setupSkipAnimation() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.textComplete) {
                // Skip to end of animation
                this.circle.y = this.circle.targetY;
                this.circle.isMoving = false;
                this.textAnimationProgress = this.canvas.height;
                this.textComplete = true;
                
                // Show content immediately
                document.querySelector('header').classList.add('visible');
                const content = document.querySelector('.content');
                content.classList.add('visible');
                content.scrollIntoView({ behavior: 'smooth' });
                
                // Draw final state directly
                this.drawFinalState();
                
                // Stop animation loop
                cancelAnimationFrame(this.animationFrame);
            }
        });
    }

    async loadImpactFont() {
        try {
            const font = new FontFace('Impact', 'url(fonts/impact.ttf)');
            await document.fonts.add(font);
            this.fontLoaded = true;
            console.log('Impact font loaded successfully');
            
            // Create letter mask after font is loaded
            this.createLetterMask();
            
            // Update the context font immediately
            if (this.ctx) {
                this.ctx.font = `${this.textSize}px Impact`;
            }
        } catch (error) {
            console.error('Error loading Impact font:', error);
            this.fontLoaded = true; // Set to true to allow fallback to system font
            this.createLetterMask(); // Still create mask with fallback font
        }
    }

    loadLogo() {
        this.logo.onload = () => {
            this.logoLoaded = true;
            console.log('Logo loaded successfully');
        };
        this.logo.onerror = (e) => {
            console.error('Error loading logo:', e);
        };
        const logoPath = this.currentPalette.isDark ? 'logo/logo_blue_filled.png' : 'logo/logo.png';
        console.log('Loading logo from:', logoPath);
        this.logo.src = logoPath;
    }

    createLetterMask() {
        // Wait for font to load before creating mask
        if (!this.fontLoaded) {
            setTimeout(() => this.createLetterMask(), 100);
            return;
        }

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        
        // Set font and measure text with larger size
        tempCtx.font = `${this.textSize}px Impact`;
        console.log('Using font:', `${this.textSize}px Impact`);
        tempCtx.textBaseline = 'middle';
        tempCtx.textAlign = 'center';
        tempCtx.fillStyle = 'white';
        
        // Calculate vertical positioning
        const lineHeight = this.textSize * 1.1;
        const totalHeight = lineHeight * this.text.length;
        const startY = (tempCanvas.height - totalHeight) / 2;
        
        // Draw each line of text
        this.text.forEach((line, index) => {
            const y = startY + (lineHeight * index) + (lineHeight / 2);
            tempCtx.fillText(line, tempCanvas.width / 2, y);
        });
        
        // Create mask array matching the grid size
        this.letterMask = Array(this.rows).fill().map(() => Array(this.columns).fill(0));
        
        // Get image data
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const data = imageData.data;
        
        // Create the mask
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const x = col * this.cellSize;
                const y = row * this.cellSize;
                
                // Check if this cell is part of a letter
                let isLetter = false;
                let isBorder = false;
                
                // Sample multiple points within the cell
                for (let dy = 0; dy < this.cellSize; dy++) {
                    for (let dx = 0; dx < this.cellSize; dx++) {
                        const pixelX = x + dx;
                        const pixelY = y + dy;
                        if (pixelX < tempCanvas.width && pixelY < tempCanvas.height) {
                            const i = (pixelY * tempCanvas.width + pixelX) * 4;
                            if (data[i + 3] > 0) {
                                isLetter = true;
                                // Check if it's a border pixel
                                if (!isBorder) {
                                    for (let by = -1; by <= 1; by++) {
                                        for (let bx = -1; bx <= 1; bx++) {
                                            const bi = ((pixelY + by) * tempCanvas.width + (pixelX + bx)) * 4;
                                            if (bi >= 0 && bi < data.length && data[bi + 3] === 0) {
                                                isBorder = true;
                                                break;
                                            }
                                        }
                                        if (isBorder) break;
                                    }
                                }
                            }
                        }
                    }
                }
                
                // Store in mask: 2 for border, 1 for fill, 0 for nothing
                this.letterMask[row][col] = isBorder ? 2 : (isLetter ? 1 : 0);
            }
        }
    }

    drawGrid() {
        // Clear the canvas with background color
        this.ctx.fillStyle = this.currentPalette.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw all cells
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                if (this.cells[row][col] === 1) {
                    const x = col * this.cellSize;
                    const y = row * this.cellSize;
                    
                    let color = this.currentPalette.dots;
                    let isStroke = false;
                    
                    // Check if cell is part of the path
                    const isInPath = this.redPath.some(pos => 
                        pos.row === row && pos.col === col
                    );
                    
                    if (isInPath) {
                        color = this.currentPalette.stroke;
                        isStroke = true;
                    } else if (!this.circle.isMoving && this.letterMask[row] && this.letterMask[row][col] > 0) {
                        if (y <= this.textAnimationProgress) {
                            if (this.letterMask[row][col] === 2) {
                                color = this.currentPalette.stroke;
                                isStroke = true;
                            } else {
                                color = this.currentPalette.circleFill;
                            }
                        }
                    } else {
                        // Check if cell is part of the circle
                        const centerX = x + this.cellSize/2;
                        const centerY = y + this.cellSize/2;
                        const distanceToCircle = Math.sqrt(
                            Math.pow(centerX - this.circle.x, 2) + 
                            Math.pow(centerY - this.circle.y, 2)
                        );
                        
                        if (distanceToCircle <= this.circle.radius) {
                            color = this.currentPalette.circleFill;
                        } else if (Math.abs(distanceToCircle - this.circle.radius) < this.cellSize) {
                            color = this.currentPalette.stroke;
                            isStroke = true;
                        }
                    }
                    
                    this.drawDot(this.ctx, x, y, color, isStroke ? 1.2 : 1);
                }
            }
        }
    }

    drawDot(ctx, x, y, color, scale = 1) {
        ctx.beginPath();
        const radius = (this.cellSize / 3) * scale;
        const randomOffset = (Math.random() * 0.3 + 0.8);
        const finalRadius = radius * randomOffset;
        
        const offsetX = (Math.random() - 0.5) * (this.cellSize / 5);
        const offsetY = (Math.random() - 0.5) * (this.cellSize / 5);
        
        ctx.arc(
            x + this.cellSize/2 + offsetX, 
            y + this.cellSize/2 + offsetY, 
            finalRadius, 
            0, 
            Math.PI * 2
        );
        
        ctx.fillStyle = color;
        ctx.fill();
    }

    setupRuleInput() {
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const newRule = prompt('Enter rule number (0-255):', this.rule);
                if (newRule !== null) {
                    const ruleNum = parseInt(newRule);
                    if (!isNaN(ruleNum) && ruleNum >= 0 && ruleNum <= 255) {
                        this.rule = ruleNum;
                        this.ruleArray = this.getRuleArray(this.rule);
                        this.init();
                    }
                }
            }
        });
    }

    getRuleArray(ruleNumber) {
        const binary = ruleNumber.toString(2).padStart(8, '0');
        return binary.split('').map(bit => parseInt(bit));
    }

    init() {
        this.columns = Math.ceil(this.canvas.width / this.cellSize);
        this.rows = Math.ceil(this.canvas.height / this.cellSize);
        
        // Initialize grid
        this.generateGrid();
        // Draw the complete CA
        this.drawGrid();
        // Find and draw path
        this.findPath();
    }

    generateGrid() {
        // Initialize first row
        this.cells = new Array(this.rows);
        this.previousGen = new Array(this.rows); // Initialize previousGen array
        
        // Generate first row randomly
        this.cells[0] = new Array(this.columns).fill(0)
            .map(() => Math.random() < 0.3 ? 1 : 0);
        this.previousGen[0] = new Array(this.columns).fill(0); // First previous generation is all zeros
        
        // Generate subsequent rows
        for (let row = 1; row < this.rows; row++) {
            this.previousGen[row] = [...this.cells[row - 1]]; // Store current generation as previous
            this.cells[row] = this.getNextGeneration(this.cells[row-1], this.previousGen[row-1]);
        }
    }

    getNextGeneration(currentRow, previousRow) {
        const newRow = [];
        for (let i = 0; i < this.columns; i++) {
            const left = currentRow[i - 1] || 0;
            const center = currentRow[i];
            const right = currentRow[i + 1] || 0;
            
            const pattern = (left << 2) | (center << 1) | right;
            let newState = this.ruleArray[7 - pattern];
            
            // If using mirror CA and the cell in the previous generation was alive,
            // invert the new state
            if (this.isMirrorCA && previousRow && previousRow[i] === 1) {
                newState = 1 - newState; // Invert the state (0->1, 1->0)
            }
            
            newRow[i] = newState;
        }
        return newRow;
    }

    findPath() {
        // Find top to bottom path
        const middleCol = Math.floor(this.columns / 2);
        this.path = this.findPathFromStart(0, middleCol);
        this.redPath = []; // Clear current path for animation
    }

    findPathFromStart(startRow, startCol) {
        const path = [];
        
        // Find starting point
        if (this.cells[startRow][startCol] === 1) {
            path.push({row: startRow, col: startCol});
        } else {
            let offset = 1;
            const maxOffset = this.columns / 2;
            
            while (offset < maxOffset) {
                if (startCol + offset < this.columns && this.cells[startRow][startCol + offset] === 1) {
                    path.push({row: startRow, col: startCol + offset});
                    break;
                } else if (startCol - offset >= 0 && this.cells[startRow][startCol - offset] === 1) {
                    path.push({row: startRow, col: startCol - offset});
                    break;
                }
                offset++;
            }
        }

        // Find complete path
        while (path.length > 0) {
            const current = path[path.length - 1];
            const row = current.row;
            const col = current.col;
            
            // Check if we've reached the bottom
            if (row >= this.rows - 1) {
                break;
            }
            
            const moves = [
                {row: row + 1, col: col},     // Down
                {row: row + 1, col: col - 1}, // Down-left
                {row: row + 1, col: col + 1}, // Down-right
                {row: row, col: col - 1},     // Left
                {row: row, col: col + 1}      // Right
            ];
            
            let moved = false;
            for (const move of moves) {
                if (move.row >= 0 && move.row < this.rows && 
                    move.col >= 0 && move.col < this.columns && 
                    this.cells[move.row][move.col] === 1) {
                    path.push(move);
                    moved = true;
                    break;
                }
            }
            
            if (!moved) break;
        }
        
        return path;
    }

    updatePath() {
        if (this.frameCount < this.pathDelay) {
            this.frameCount++;
            return;
        }
        
        // Update path animation
        if (this.redPath.length < this.path.length) {
            this.redPath.push(this.path[this.redPath.length]);
        }
    }

    updateCircle() {
        if (!this.circle.isMoving) return;
        
        this.circle.y += this.circle.dy;
        
        if (this.circle.y >= this.circle.targetY) {
            this.circle.y = this.circle.targetY;
            this.circle.isMoving = false;
            // Start text animation immediately
            this.textAnimationProgress = 0;
            // Show content sooner
            setTimeout(() => {
                document.querySelector('header').classList.add('visible');
            }, 300); // Reduced delay
        }
    }

    animate() {
        // Clear background
        this.ctx.fillStyle = this.currentPalette.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid and update animations
        if (!this.textComplete) {
            // Draw normal grid
            this.drawGrid();
            
            if (this.circle.isMoving) {
                this.updateCircle();
                this.updatePath();
            } else {
                this.textAnimationProgress += this.textAnimationSpeed;
                
                if (this.textAnimationProgress >= this.canvas.height) {
                    this.textComplete = true;
                    document.querySelector('header').classList.add('visible');
                    const content = document.querySelector('.content');
                    content.classList.add('visible');
                    content.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            // Continue animation
            this.animationFrame = requestAnimationFrame(() => this.animate());
        } else {
            // Final state: draw blurred background with clear text
            this.drawFinalState();
        }
    }

    drawPath() {
        if (this.path.length > 0) {
            this.path.forEach(pos => {
                this.drawDot(
                    pos.col * this.cellSize,
                    pos.row * this.cellSize,
                    this.currentPalette.stroke,
                    1.2
                );
            });
        }
    }

    updateFirstWindowLogo() {
        const logoImg = document.querySelector('.dynamic-logo');
        if (logoImg) {
            const logoPath = this.currentPalette.isDark ? 'logo/logo_blue_filled.png' : 'logo/logo.png';
            logoImg.src = logoPath;
        }
        // Update menu color when palette changes
        document.documentElement.style.setProperty('--menu-color', this.currentPalette.stroke);
    }

    setupPopup() {
        const logo = document.getElementById('first-window-logo');
        const popup = document.querySelector('.contact-popup');
        const overlay = document.querySelector('.popup-overlay');
        const closeBtn = document.querySelector('.popup-close');

        if (logo && popup && overlay && closeBtn) {
            const closePopup = () => {
                popup.classList.remove('active');
                overlay.classList.remove('active');
            };

            logo.addEventListener('click', () => {
                popup.classList.add('active');
                overlay.classList.add('active');
            });

            closeBtn.addEventListener('click', closePopup);
            overlay.addEventListener('click', closePopup);
        }
    }

    loadFontAndInit() {
        this.createLetterMask();
    }

    drawFinalState() {
        // Create temporary canvas for background
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        
        // Clear both canvases
        tempCtx.fillStyle = this.currentPalette.background;
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        this.ctx.fillStyle = this.currentPalette.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // First pass: Draw background cells on temp canvas (excluding path)
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                if (this.cells[row][col] === 1) {
                    const x = col * this.cellSize;
                    const y = row * this.cellSize;
                    
                    const centerX = x + this.cellSize/2;
                    const centerY = y + this.cellSize/2;
                    const distanceToCircle = Math.sqrt(
                        Math.pow(centerX - this.circle.x, 2) + 
                        Math.pow(centerY - this.circle.y, 2)
                    );
                    
                    const isCircleStroke = Math.abs(distanceToCircle - this.circle.radius) < this.cellSize;
                    const isTextStroke = this.letterMask[row] && this.letterMask[row][col] === 2;
                    const isCircle = distanceToCircle <= this.circle.radius;
                    const isText = this.letterMask[row] && this.letterMask[row][col] === 1;
                    
                    // Check if cell is part of the path
                    const isPath = this.redPath.some(pos => 
                        pos.row === row && pos.col === col
                    );
                    
                    // Only draw background dots (not path, circle, or text)
                    if (!isPath && !isCircleStroke && !isTextStroke && !isCircle && !isText) {
                        this.drawDot(tempCtx, x, y, this.currentPalette.dots, 1);
                    }
                }
            }
        }
        
        // Apply blur to background only
        tempCtx.filter = 'blur(2px)';
        tempCtx.drawImage(tempCanvas, 0, 0);
        tempCtx.filter = 'none';
        
        // Draw blurred background to main canvas
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.drawImage(tempCanvas, 0, 0);
        
        // Second pass: Draw path, text, and circle on main canvas (unblurred)
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                if (this.cells[row][col] === 1) {
                    const x = col * this.cellSize;
                    const y = row * this.cellSize;
                    
                    const centerX = x + this.cellSize/2;
                    const centerY = y + this.cellSize/2;
                    const distanceToCircle = Math.sqrt(
                        Math.pow(centerX - this.circle.x, 2) + 
                        Math.pow(centerY - this.circle.y, 2)
                    );
                    
                    const isCircleStroke = Math.abs(distanceToCircle - this.circle.radius) < this.cellSize;
                    const isTextStroke = this.letterMask[row] && this.letterMask[row][col] === 2;
                    
                    // Draw path first
                    const isPath = this.redPath.some(pos => 
                        pos.row === row && pos.col === col
                    );
                    
                    if (isPath) {
                        this.drawDot(this.ctx, x, y, this.currentPalette.stroke, 1.2);
                    } else if (isCircleStroke || isTextStroke) {
                        this.drawDot(this.ctx, x, y, this.currentPalette.stroke, 1.2);
                    } else if (distanceToCircle <= this.circle.radius) {
                        this.drawDot(this.ctx, x, y, this.currentPalette.circleFill, 1);
                    } else if (this.letterMask[row] && this.letterMask[row][col] === 1) {
                        this.drawDot(this.ctx, x, y, this.currentPalette.circleFill, 1);
                    }
                }
            }
        }
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    new CellularAutomata();
});

// Start
new CellularAutomata(); 