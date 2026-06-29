document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Typing Animation
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");

    const textArray = ["Creative Graphic Designer", "Editorial Aesthetics Expert", "Brand Identity Specialist"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            cursorSpan.classList.remove("typing");
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            cursorSpan.classList.remove("typing");
            textArrayIndex++;
            if(textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    if(textArray.length) setTimeout(type, newTextDelay + 250);

    // 2. Sticky Navbar & Back to Top Button
    const header = document.getElementById("header");
    const backToTop = document.getElementById("back-to-top");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
            backToTop.classList.add("show");
        } else {
            header.classList.remove("scrolled");
            backToTop.classList.remove("show");
        }
    });

    // 3. Mobile Menu Hamburger
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-links li a");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
    });

    links.forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        });
    });

    // 4. Scroll Spy (Active Navbar Link)
    const sections = document.querySelectorAll("section");
    const navItems = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute("id");
            }
        });

        navItems.forEach(item => {
            item.classList.remove("active");
            if (item.getAttribute("href").includes(current)) {
                item.classList.add("active");
            }
        });
    });

    // 5. Scroll Animations (Intersection Observer)
    const animateElements = document.querySelectorAll(".animate-up");
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
            }
        });
    }, {
        threshold: 0.1
    });

    animateElements.forEach(el => observer.observe(el));

    // 6. Project Filtering System
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(button => button.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
                    card.classList.remove("hide");
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.8)";
                    setTimeout(() => {
                        card.classList.add("hide");
                    }, 400);
                }
            });
        });
    });

    // 7. Lightbox Gallery
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".lightbox-close");
    const projectImages = document.querySelectorAll(".project-img img");

    projectImages.forEach(img => {
        img.addEventListener("click", () => {
            lightbox.classList.add("active");
            lightboxImg.src = img.src;
            document.body.style.overflow = "hidden";
        });
    });

    closeBtn.addEventListener("click", closeLightbox);
    
    lightbox.addEventListener("click", (e) => {
        if (e.target !== lightboxImg) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox.classList.contains("active")) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove("active");
        document.body.style.overflow = "auto";
    }

    // 8. Contact Form - FIXED WITH BACKEND API
    const form = document.getElementById("contact-form");
    
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            let isValid = true;
            
            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const message = document.getElementById("message");

            const setError = (element) => {
                element.parentElement.classList.add("error");
                isValid = false;
            };
            const clearError = (element) => {
                element.parentElement.classList.remove("error");
            };

            if (name.value.trim() === "") setError(name);
            else clearError(name);

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) setError(email);
            else clearError(email);

            if (message.value.trim() === "") setError(message);
            else clearError(message);

            if (isValid) {
                try {
                    const response = await fetch('http://localhost:5000/api/contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: name.value.trim(),
                            email: email.value.trim(),
                            message: message.value.trim()
                        })
                    });

                    if (response.ok) {
                        const result = await response.json();
                        console.log('Message sent:', result);
                        
                        const btn = form.querySelector('button');
                        const originalText = btn.textContent;
                        btn.textContent = "Message Sent! ✓";
                        btn.style.backgroundColor = "#4CAF50";
                        
                        setTimeout(() => {
                            form.reset();
                            btn.textContent = originalText;
                            btn.style.backgroundColor = "";
                        }, 3000);
                    } else {
                        alert('❌ Error: ' + response.statusText);
                    }
                } catch (error) {
                    console.error('Error sending message:', error);
                    alert('❌ Error sending message. Make sure backend is running on port 5000');
                }
            }
        });
    }

    // 9. Auto-Update Copyright Year
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 10. Lazy Load Images
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    img.style.opacity = '1';
                    imageObserver.unobserve(img);
                }
            });
        });
        images.forEach(img => {
            img.style.opacity = '0.5';
            imageObserver.observe(img);
        });
    }

});
