// Advanced interactions and animations

class LandingPageAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupParticles();
        this.setupTypewriter();
        this.setupScrollProgress();
        this.setupMagneticButtons();
        this.setupParallax();
    }

    // Floating particles background
    setupParticles() {
        const hero = document.querySelector('.hero');
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        hero.appendChild(particlesContainer);

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 10 + 10;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.animationDuration = `${animationDuration}s`;
            
            particlesContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, animationDuration * 1000);
        };

        // Create particles periodically
        setInterval(createParticle, 300);
    }

    // Typewriter effect for hero title
    setupTypewriter() {
        const title = document.querySelector('.hero-content h1');
        if (!title) return;

        const text = title.textContent;
        title.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typewriter effect after a short delay
        setTimeout(typeWriter, 500);
    }

    // Scroll progress indicator
    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        });
    }

    // Magnetic effect for buttons
    setupMagneticButtons() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Parallax scrolling effect
    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-visual');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
}

// Advanced scroll animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupCounterAnimations();
        this.setupStaggeredAnimations();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, this.observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        element.classList.add('visible');
        
        // Add different animation types based on element
        if (element.classList.contains('feature-card')) {
            this.animateCard(element);
        } else if (element.classList.contains('stat-item')) {
            this.animateCounter(element);
        }
    }

    animateCard(card) {
        const delay = Array.from(card.parentNode.children).indexOf(card) * 100;
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, delay);
    }

    animateCounter(statItem) {
        const h3 = statItem.querySelector('h3');
        const finalText = h3.textContent;
        let target = 0;
        
        if (finalText.includes('K')) {
            target = parseInt(finalText) * 1000;
        } else if (finalText.includes('%')) {
            target = parseFloat(finalText);
        } else if (finalText.includes('★')) {
            target = parseFloat(finalText);
        }
        
        this.countUp(h3, 0, target, 2000, finalText);
    }

    countUp(element, start, end, duration, format) {
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (end - start) * this.easeOutCubic(progress);
            
            if (format.includes('K')) {
                element.textContent = `${Math.floor(current / 1000)}K+`;
            } else if (format.includes('%')) {
                element.textContent = `${current.toFixed(1)}%`;
            } else if (format.includes('★')) {
                element.textContent = `${current.toFixed(1)}★`;
            } else if (format.includes('ms')) {
                element.textContent = `${Math.floor(current)}ms`;
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    setupStaggeredAnimations() {
        const staggerContainers = document.querySelectorAll('.features-grid, .installation-steps');
        
        staggerContainers.forEach(container => {
            const items = container.children;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        Array.from(items).forEach((item, index) => {
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, index * 150);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(container);
        });
    }
}

// Performance optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeScrollPerformance();
        this.preloadCriticalAssets();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('loading');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    optimizeScrollPerformance() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Scroll-based animations go here
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    preloadCriticalAssets() {
        const criticalAssets = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
        ];
        
        criticalAssets.forEach(asset => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = asset;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }
}

// Initialize all enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LandingPageAnimations();
    new ScrollAnimations();
    new PerformanceOptimizer();
    
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add loading state management
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LandingPageAnimations,
        ScrollAnimations,
        PerformanceOptimizer
    };
}
