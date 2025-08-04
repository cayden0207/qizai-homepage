class QIMemeGenerator {
    constructor() {
        this.canvas = document.getElementById('memeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentImage = null;
        this.loadDefaultImage();
        this.setupEventListeners();
    }

    loadDefaultImage() {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            this.currentImage = img;
            this.drawImage();
            this.generateMeme(); // Auto-generate on load
        };
        // Using a placeholder image URL - replace with your cat.jpg
        img.onerror = () => {
            console.error('Failed to load image. Please ensure cat.jpg is in the same folder.');
            // Create a placeholder canvas
            this.canvas.width = 800;
            this.canvas.height = 800;
            this.ctx.fillStyle = '#f0f0f0';
            this.ctx.fillRect(0, 0, 800, 800);
            this.ctx.fillStyle = '#666';
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('请将 cat.jpg 放在同一文件夹', 400, 400);
        };
        img.src = 'cat.jpg';
    }

    setupEventListeners() {
        const generateBtn = document.getElementById('generateBtn');
        const downloadBtn = document.getElementById('downloadBtn');

        generateBtn.addEventListener('click', () => this.generateMeme());
        downloadBtn.addEventListener('click', () => this.downloadMeme());
    }

    drawImage() {
        if (!this.currentImage) return;

        // Set canvas size to match image
        this.canvas.width = this.currentImage.width;
        this.canvas.height = this.currentImage.height;

        // Draw the image
        this.ctx.drawImage(this.currentImage, 0, 0);
    }

    generateMeme() {
        if (!this.currentImage) {
            return;
        }

        // Redraw the original image
        this.drawImage();

        // Generate random QI value
        const qiValue = Math.floor(Math.random() * 999) + 1;

        // Get random positions for all text elements
        const positions = this.getRandomPositions();

        // Your specified colors
        const colors = [
            { main: '#91c4f6', shadow: '#5a8fd8' }, // Light blue
            { main: '#d9d9d9', shadow: '#a8a8a8' }, // Light gray
            { main: '#ffde59', shadow: '#ffcc00' }, // Yellow
            { main: '#cb6ce6', shadow: '#a842c4' }, // Purple
            { main: '#ff5757', shadow: '#ff2222' }  // Red
        ];

        // Shuffle colors
        for (let i = colors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [colors[i], colors[j]] = [colors[j], colors[i]];
        }

        // Draw multiple QI+value combinations
        const numTexts = 3 + Math.floor(Math.random() * 3); // 3-5 texts
        
        for (let i = 0; i < Math.min(numTexts, positions.length); i++) {
            const pos = positions[i];
            const color = colors[i % colors.length];
            const randomValue = Math.floor(Math.random() * 999) + 1;
            
            // Randomly choose format
            const formats = [
                `QI+${randomValue}`,
                `QI+${randomValue}`,
                `躺赢+${randomValue}`,
                `躺赢+${randomValue}`
            ];
            
            const text = formats[Math.floor(Math.random() * formats.length)];
            const fontSize = 50 + Math.random() * 30; // 50-80px
            
            this.drawStyledText(text, pos.x, pos.y, fontSize, color.main, color.shadow);
        }
    }

    drawNeonText(text, x, y, fontSize, color1, color2) {
        this.ctx.save();
        
        // Set font with DynaPuff
        this.ctx.font = `900 ${fontSize}px DynaPuff, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Create gradient
        const gradient = this.ctx.createLinearGradient(
            x - fontSize, y - fontSize,
            x + fontSize, y + fontSize
        );
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        
        // Draw multiple layers for neon effect
        // Simple glow effect
        this.ctx.shadowColor = color1;
        this.ctx.shadowBlur = 20;
        this.ctx.fillStyle = gradient;
        this.ctx.fillText(text, x, y);
        
        this.ctx.restore();
    }

    drawStyledText(text, x, y, fontSize, color, shadowColor) {
        this.ctx.save();
        
        // Set font
        this.ctx.font = `900 ${fontSize}px DynaPuff, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Draw multiple layers for neon effect
        // Outer glow (largest)
        this.ctx.shadowColor = shadowColor;
        this.ctx.shadowBlur = 25;
        this.ctx.fillStyle = shadowColor;
        this.ctx.fillText(text, x, y);
        
        // Middle glow
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
        
        // Inner glow
        this.ctx.shadowBlur = 5;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
        
        // Core text (bright white center)
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = '#ffffff';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.strokeText(text, x, y);
        this.ctx.fillText(text, x, y);
        
        this.ctx.restore();
    }

    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    getRandomPositions() {
        const positions = [];
        const margin = 150;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Create a grid of possible positions
        const gridSize = 5;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const x = margin + (width - 2 * margin) * (i / (gridSize - 1));
                const y = margin + (height - 2 * margin) * (j / (gridSize - 1));
                
                // Add some randomness
                positions.push({
                    x: x + (Math.random() - 0.5) * 100,
                    y: y + (Math.random() - 0.5) * 100
                });
            }
        }
        
        // Shuffle positions
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        
        return positions;
    }

    downloadMeme() {
        if (!this.currentImage) {
            alert('请先生成表情包 / Please generate a meme first');
            return;
        }

        const link = document.createElement('a');
        const timestamp = new Date().getTime();
        link.download = `qi_meme_${timestamp}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QIMemeGenerator();
});