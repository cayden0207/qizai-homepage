class HomepageAnimation {
    constructor() {
        this.canvas = document.getElementById('heroCanvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.animationId = null;
            this.setupCanvas();
            this.startAnimation();
        }
    }

    setupCanvas() {
        // Set canvas size
        this.canvas.width = 400;
        this.canvas.height = 400;
        
        // Create gradient background
        const gradient = this.ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
        gradient.addColorStop(0, '#4ade80');
        gradient.addColorStop(1, '#22c55e');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, 400, 400);
        
        // Draw a simple cat silhouette
        this.drawCatSilhouette();
        
        // Initialize QI text positions
        this.qiTexts = [
            { text: 'QI+777', x: 80, y: 80, color: '#91c4f6', size: 40, opacity: 1 },
            { text: '躺赢+888', x: 300, y: 150, color: '#cb6ce6', size: 35, opacity: 1 },
            { text: 'QI+999', x: 150, y: 320, color: '#ffde59', size: 45, opacity: 1 }
        ];
    }

    drawCatSilhouette() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.lineWidth = 2;
        
        // Simple cat shape
        this.ctx.beginPath();
        // Body
        this.ctx.ellipse(200, 250, 60, 80, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Head
        this.ctx.beginPath();
        this.ctx.ellipse(200, 170, 45, 40, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Ears
        this.ctx.beginPath();
        this.ctx.moveTo(170, 150);
        this.ctx.lineTo(180, 130);
        this.ctx.lineTo(190, 150);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.moveTo(210, 150);
        this.ctx.lineTo(220, 130);
        this.ctx.lineTo(230, 150);
        this.ctx.fill();
        
        // Paws
        this.ctx.beginPath();
        this.ctx.ellipse(170, 320, 15, 25, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.ellipse(230, 320, 15, 25, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }

    drawGlowText(text, x, y, size, color, opacity) {
        this.ctx.save();
        
        // Set font
        this.ctx.font = `900 ${size}px DynaPuff, Arial, sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.globalAlpha = opacity;
        
        // Draw glow layers
        // Outer glow
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 20;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
        
        // Inner glow
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(text, x, y);
        
        this.ctx.restore();
    }

    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, 400, 400);
        
        // Redraw background
        const gradient = this.ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
        gradient.addColorStop(0, '#4ade80');
        gradient.addColorStop(1, '#22c55e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, 400, 400);
        
        // Redraw cat
        this.drawCatSilhouette();
        
        // Animate QI texts
        const time = Date.now() * 0.001;
        
        this.qiTexts.forEach((qi, index) => {
            // Floating animation
            const floatY = qi.y + Math.sin(time + index) * 5;
            
            // Pulsing opacity
            const pulseOpacity = 0.7 + Math.sin(time * 2 + index) * 0.3;
            
            this.drawGlowText(qi.text, qi.x, floatY, qi.size, qi.color, pulseOpacity);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    startAnimation() {
        this.animate();
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    new HomepageAnimation();
    
    // CA Copy functionality
    const copyBtn = document.querySelector('.ca-copy-btn');
    const caInput = document.querySelector('.ca-input');
    
    if (copyBtn && caInput) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(caInput.value);
                copyBtn.textContent = 'Copied!';
                copyBtn.style.background = 'linear-gradient(45deg, #00ff88, #22c55e)';
                
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                    copyBtn.style.background = 'linear-gradient(45deg, #ffde59, #f5c842)';
                }, 2000);
            } catch (err) {
                // Fallback for older browsers
                caInput.select();
                document.execCommand('copy');
                copyBtn.textContent = 'Copied!';
                
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                }, 2000);
            }
        });
    }
    
    // Video Gallery functionality
    const videoItems = document.querySelectorAll('.video-item');
    const indicators = document.querySelectorAll('.indicator');
    const galleryContainer = document.querySelector('.gallery-container');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentIndex = 1; // Start with middle video (index 1)
    let isTransitioning = false;
    
    if (videoItems.length > 0) {
        // Initialize gallery positions
        updateGalleryPositions(currentIndex);
        
        // Handle play button clicks - only for active video
        document.querySelectorAll('.play-button').forEach((playBtn, index) => {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (index === currentIndex) { // Only allow play on active video
                    const video = videoItems[index].querySelector('.video-player');
                    
                    if (video.paused) {
                        video.play().then(() => {
                            playBtn.style.display = 'none';
                        }).catch(error => {
                            console.log('Video play failed:', error);
                            playBtn.style.display = 'flex';
                        });
                    } else {
                        video.pause();
                        playBtn.style.display = 'flex';
                    }
                }
            });
        });
        
        // Handle video clicks for play/pause - only for active video
        document.querySelectorAll('.video-player').forEach((video, index) => {
            video.addEventListener('click', (e) => {
                e.stopPropagation();
                if (index === currentIndex) { // Only allow play on active video
                    const playBtn = videoItems[index].querySelector('.play-button');
                    
                    if (video.paused) {
                        video.play().then(() => {
                            playBtn.style.display = 'none';
                        }).catch(error => {
                            console.log('Video play failed:', error);
                            playBtn.style.display = 'flex';
                        });
                    } else {
                        video.pause();
                        playBtn.style.display = 'flex';
                    }
                }
            });
            
            // Show play button when video ends
            video.addEventListener('ended', () => {
                const playBtn = videoItems[index].querySelector('.play-button');
                playBtn.style.display = 'flex';
            });
            
            // Handle video loading errors
            video.addEventListener('error', () => {
                console.log('Video loading error for video', index + 1);
            });
        });
        
        // Handle video item clicks for navigation
        videoItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (index !== currentIndex && !isTransitioning) {
                    navigateToVideo(index);
                }
            });
        });
        
        // Handle indicator clicks
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (index !== currentIndex && !isTransitioning) {
                    navigateToVideo(index);
                }
            });
        });
        
        // Handle navigation button clicks with infinite looping
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (!isTransitioning) {
                    const nextIndex = currentIndex === 0 ? videoItems.length - 1 : currentIndex - 1;
                    navigateToVideo(nextIndex);
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (!isTransitioning) {
                    const nextIndex = currentIndex === videoItems.length - 1 ? 0 : currentIndex + 1;
                    navigateToVideo(nextIndex);
                }
            });
        }
        
        // Navigation function
        function navigateToVideo(targetIndex) {
            if (isTransitioning) return;
            
            isTransitioning = true;
            currentIndex = targetIndex;
            
            // Pause all videos except the active one
            videoItems.forEach((item, index) => {
                const video = item.querySelector('.video-player');
                const playBtn = item.querySelector('.play-button');
                if (index !== currentIndex) {
                    video.pause();
                    playBtn.style.display = 'flex';
                }
            });
            
            updateGalleryPositions(currentIndex);
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
            
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }
        
        // Update positions function
        function updateGalleryPositions(activeIndex) {
            videoItems.forEach((item, index) => {
                item.classList.remove('active');
                
                if (index === activeIndex) {
                    // Center/active position
                    item.style.transform = 'scale(1) translateX(0) rotateY(0deg)';
                    item.style.zIndex = '10';
                    item.style.opacity = '1';
                    item.style.width = '220px';
                    item.style.height = '390px';
                    item.classList.add('active');
                } else if (index < activeIndex) {
                    // Left position
                    item.style.transform = 'scale(0.8) translateX(-200px) rotateY(15deg)';
                    item.style.zIndex = '1';
                    item.style.opacity = '0.6';
                    item.style.width = '180px';
                    item.style.height = '320px';
                } else {
                    // Right position
                    item.style.transform = 'scale(0.8) translateX(200px) rotateY(-15deg)';
                    item.style.zIndex = '1';
                    item.style.opacity = '0.6';
                    item.style.width = '180px';
                    item.style.height = '320px';
                }
            });
        }
        
        // Touch/swipe support
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        
        galleryContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = false;
        });
        
        galleryContainer.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            
            const diffX = Math.abs(startX - currentX);
            const diffY = Math.abs(startY - currentY);
            
            // If horizontal movement is greater than vertical, prevent scrolling
            if (diffX > diffY && diffX > 10) {
                e.preventDefault();
                isDragging = true;
            }
        }, { passive: false });
        
        galleryContainer.addEventListener('touchend', (e) => {
            if (!startX || !startY || !isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only respond to horizontal swipes with infinite looping
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - go to next (with wrap around)
                    const nextIndex = currentIndex === videoItems.length - 1 ? 0 : currentIndex + 1;
                    navigateToVideo(nextIndex);
                } else if (diffX < 0) {
                    // Swipe right - go to previous (with wrap around)
                    const nextIndex = currentIndex === 0 ? videoItems.length - 1 : currentIndex - 1;
                    navigateToVideo(nextIndex);
                }
            }
            
            startX = 0;
            startY = 0;
            isDragging = false;
        });
        
        // Keyboard navigation with infinite looping
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && !isTransitioning) {
                const nextIndex = currentIndex === 0 ? videoItems.length - 1 : currentIndex - 1;
                navigateToVideo(nextIndex);
            } else if (e.key === 'ArrowRight' && !isTransitioning) {
                const nextIndex = currentIndex === videoItems.length - 1 ? 0 : currentIndex + 1;
                navigateToVideo(nextIndex);
            }
        });
    }
    
    // Smooth scrolling for navigation links
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
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all feature cards and gallery items
    document.querySelectorAll('.feature-card, .gallery-item, .step').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // QI Generator functionality
    class QIGenerator {
        constructor() {
            this.canvas = document.getElementById('qiCanvas');
            this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
            this.generateBtn = document.getElementById('generateBtn');
            this.downloadBtn = document.getElementById('downloadBtn');
            
            if (this.canvas && this.ctx) {
                this.init();
            }
        }
        
        init() {
            // Set canvas size
            this.canvas.width = 500;
            this.canvas.height = 500;
            
            // Load cat image
            this.catImage = new Image();
            this.catImage.src = 'cat.jpg';
            this.catImage.onload = () => {
                this.generateMeme();
            };
            
            // Event listeners
            if (this.generateBtn) {
                this.generateBtn.addEventListener('click', () => this.generateMeme());
            }
            
            if (this.downloadBtn) {
                this.downloadBtn.addEventListener('click', () => this.downloadMeme());
            }
        }
        
        generateMeme() {
            if (!this.ctx || !this.catImage.complete) return;
            
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw cat image
            this.ctx.drawImage(this.catImage, 0, 0, this.canvas.width, this.canvas.height);
            
            // Generate random QI texts
            this.addRandomQITexts();
        }
        
        addRandomQITexts() {
            const colors = ['#91c4f6', '#d9d9d9', '#ffde59', '#cb6ce6', '#ff5757'];
            const qiCount = Math.floor(Math.random() * 2) + 3; // 3-4 QI texts
            const placedTexts = []; // Track placed text positions
            
            // Define center cat area to avoid (approximately where the cat is)
            const catArea = {
                x: this.canvas.width * 0.3,
                y: this.canvas.height * 0.3,
                width: this.canvas.width * 0.4,
                height: this.canvas.height * 0.4
            };
            
            for (let i = 0; i < qiCount; i++) {
                const qi = Math.floor(Math.random() * 999) + 1;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const shadowColor = this.getShadowColor(color);
                const isQI = Math.random() > 0.5;
                const text = isQI ? `QI+${qi}` : `躺赢运气+${qi}`;
                const fontSize = Math.floor(Math.random() * 18) + 25; // Reduced by 30%: 25-42px
                
                // Try to find a non-overlapping position
                let position = this.findNonOverlappingPosition(text, fontSize, placedTexts, catArea);
                if (position) {
                    placedTexts.push({
                        x: position.x,
                        y: position.y,
                        width: position.width,
                        height: position.height
                    });
                    
                    this.drawStyledText(text, position.x, position.y, fontSize, color, shadowColor);
                }
            }
        }
        
        findNonOverlappingPosition(text, fontSize, placedTexts, catArea) {
            const maxAttempts = 50;
            
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                // Generate random position with margins
                const margin = 60;
                const x = Math.random() * (this.canvas.width - margin * 2) + margin;
                const y = Math.random() * (this.canvas.height - margin * 2) + margin;
                
                // Estimate text dimensions
                const textWidth = text.length * fontSize * 0.6; // Approximate width
                const textHeight = fontSize * 1.2; // Approximate height with line spacing
                
                const textBounds = {
                    x: x - textWidth / 2,
                    y: y - textHeight / 2,
                    width: textWidth,
                    height: textHeight
                };
                
                // Check if overlaps with cat area
                if (this.isOverlapping(textBounds, catArea)) {
                    continue;
                }
                
                // Check if overlaps with existing texts
                let overlapping = false;
                for (const placedText of placedTexts) {
                    if (this.isOverlapping(textBounds, placedText)) {
                        overlapping = true;
                        break;
                    }
                }
                
                if (!overlapping) {
                    return {
                        x: x,
                        y: y,
                        width: textWidth,
                        height: textHeight
                    };
                }
            }
            
            return null; // Couldn't find a suitable position
        }
        
        isOverlapping(rect1, rect2) {
            return !(rect1.x + rect1.width < rect2.x || 
                    rect2.x + rect2.width < rect1.x || 
                    rect1.y + rect1.height < rect2.y || 
                    rect2.y + rect2.height < rect1.y);
        }
        
        getShadowColor(color) {
            const shadowColors = {
                '#91c4f6': '#5B8FC8',
                '#d9d9d9': '#A0A0A0',
                '#ffde59': '#E5C030',
                '#cb6ce6': '#A050C0',
                '#ff5757': '#D04040'
            };
            return shadowColors[color] || '#000000';
        }
        
        drawStyledText(text, x, y, fontSize, color, shadowColor) {
            // Set font
            this.ctx.font = `900 ${fontSize}px DynaPuff, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            // Outer glow
            this.ctx.shadowColor = shadowColor;
            this.ctx.shadowBlur = 25;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
            this.ctx.fillStyle = shadowColor;
            this.ctx.fillText(text, x, y);
            
            // Middle glow
            this.ctx.shadowBlur = 10;
            this.ctx.fillStyle = color;
            this.ctx.fillText(text, x, y);
            
            // Inner text
            this.ctx.shadowBlur = 5;
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillText(text, x, y);
            
            // Reset shadow
            this.ctx.shadowBlur = 0;
        }
        
        downloadMeme() {
            const link = document.createElement('a');
            link.download = `qizai-meme-${Date.now()}.png`;
            link.href = this.canvas.toDataURL();
            link.click();
        }
    }
    
    // Initialize QI Generator
    new QIGenerator();
});