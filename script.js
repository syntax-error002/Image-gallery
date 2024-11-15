class Gallery {
    constructor() {
        this.gallery = document.getElementById('gallery');
        this.uploadZone = document.getElementById('uploadZone');
        this.fileInput = document.getElementById('fileInput');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImg = document.getElementById('lightboxImage');
        this.currentImageIndex = 0;
        this.images = [];

        this.initializeEventListeners();
        this.loadInitialImages();
    }

    initializeEventListeners() {
        // Upload zone events
        this.uploadZone.addEventListener('click', () => this.fileInput.click());
        this.uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadZone.classList.add('dragover');
        });
        this.uploadZone.addEventListener('dragleave', () => {
            this.uploadZone.classList.remove('dragover');
        });
        this.uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadZone.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });
        this.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

        // Lightbox events
        document.querySelector('.lightbox .close').addEventListener('click', () => {
            this.lightbox.style.display = 'none';
        });
        document.querySelector('.nav-btn.prev').addEventListener('click', () => this.navigateImage(-1));
        document.querySelector('.nav-btn.next').addEventListener('click', () => this.navigateImage(1));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.style.display === 'block') {
                if (e.key === 'ArrowLeft') this.navigateImage(-1);
                if (e.key === 'ArrowRight') this.navigateImage(1);
                if (e.key === 'Escape') this.lightbox.style.display = 'none';
            }
        });
    }

    async loadInitialImages() {
        // Load some initial random images
        const imagePromises = Array.from({ length: 12 }, (_, i) => {
            const height = 300 + Math.floor(Math.random() * 300);
            return this.loadImage(`https://picsum.photos/400/${height}?random=${i}`);
        });

        const images = await Promise.all(imagePromises);
        images.forEach(img => this.addImageToGallery(img.src));
    }

    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }

    handleFiles(files) {
        [...files].forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => this.addImageToGallery(e.target.result);
                reader.readAsDataURL(file);
            }
        });
    }

    addImageToGallery(src) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = src;
        
        item.appendChild(img);
        this.gallery.appendChild(item);
        this.images.push(src);

        item.addEventListener('click', () => {
            this.currentImageIndex = this.images.indexOf(src);
            this.showLightbox(src);
        });
    }

    showLightbox(src) {
        this.lightboxImg.src = src;
        this.lightbox.style.display = 'block';
    }

    navigateImage(direction) {
        this.currentImageIndex = (this.currentImageIndex + direction + this.images.length) % this.images.length;
        this.showLightbox(this.images[this.currentImageIndex]);
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Gallery();
}); 