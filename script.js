// DOM Elements
const envelope = document.getElementById('envelope');
const envelopeFlap = document.getElementById('envelopeFlap');
const envelopeView = document.getElementById('envelopeView');
const letterView = document.getElementById('letterView');
const typedText = document.getElementById('typedText');
const showGalleryBtn = document.getElementById('showGalleryBtn');
const galleryView = document.getElementById('galleryView');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const playMusicBtn = document.getElementById('playMusicBtn');
const heartsContainer = document.getElementById('heartsContainer');
const cursorHeart = document.getElementById('cursorHeart');

// Message to type
const birthdayMessage = `My sweetheart 💖,

I want you to know how special you are to me as you celebrate another year of your wonderful life 🎉. Your love 💕 is the best gift I've ever received 🎁, your laughter 😂 is the sweetest melody I've ever heard, and your smile 😊 makes my darkest days 🌈 brighter.

Being with you feels like a blessing every single moment 🙏. Every memory I have of you, from our stupid jokes 🤪 to our meaningful conversations 💬, from peaceful evenings 🌙 to daring days 🌍, will always be engraved in my heart 💞.

You deserve to be happy, so I hope you have the happiest birthday ever 🎂. I hope this year brings you lots of happiness 😄, wonderful chances 🎊, and lots of reasons to be happy 😊

I love you more than words can express, today and always 💖.

Forever yours,❤️ Akash Halder`;

// Typewriter effect
let messageIndex = 0;
let typingSpeed = 40; 

function typeWriter() {
    if (messageIndex < birthdayMessage.length) {
        typedText.innerHTML += birthdayMessage.charAt(messageIndex);
        messageIndex++;
        
        // Scroll to keep text in view as it types
        typedText.scrollTop = typedText.scrollHeight;
        
        // Slow down for punctuation
        const currentChar = birthdayMessage.charAt(messageIndex - 1);
        const delay = ['.', '!', '?', ','].includes(currentChar) ? typingSpeed * 8 : typingSpeed;
        
        setTimeout(typeWriter, delay);
    } else {
        // Show hearts after message completes
        startHeartsAnimation();
        // Launch confetti
        if (typeof startConfetti === 'function') {
            startConfetti();
        }
    }
}

// Envelope animation with GSAP
envelope.addEventListener('click', () => {
    // Use GSAP for flap animation
    gsap.to(envelopeFlap, {
        rotationX: 180,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
            // Add open class after flap animation
            envelope.classList.add('open');
            
            // Transition to letter view after envelope opens
            setTimeout(() => {
                gsap.to(envelopeView, {
                    opacity: 0,
                    y: -50,
                    duration: 0.8,
                    onComplete: () => {
                        envelopeView.style.display = 'none';
                        // Override the !important style
                        letterView.style.cssText = "display: flex !important";
                        gsap.fromTo(letterView, 
                            { opacity: 0, y: 50 },
                            { opacity: 1, y: 0, duration: 1, onComplete: typeWriter }
                        );
                    }
                });
            }, 600);
        }
    });
});

// Gallery button
showGalleryBtn.addEventListener('click', () => {
    if (galleryView.style.display === 'none' || getComputedStyle(galleryView).display === 'none') {
        // Override the !important style
        galleryView.style.cssText = "display: block !important";
        gsap.fromTo(galleryView, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5 }
        );
        showGalleryBtn.textContent = 'Hide Memories';
        
        // Launch confetti when showing gallery
        if (typeof startConfetti === 'function') {
            startConfetti();
        }
    } else {
        gsap.to(galleryView, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            onComplete: () => {
                galleryView.style.cssText = "display: none !important";
                showGalleryBtn.textContent = 'View Our Memories';
            }
        });
    }
});

// Music controls
let isMusicPlaying = false;
let playAttemptInProgress = false;

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
        playMusicBtn.textContent = 'Play Our Song';
        isMusicPlaying = false;
    } else {
        playMusic();
        isMusicPlaying = true;
    }
}

function playMusic() {
    // Prevent multiple simultaneous play attempts
    if (playAttemptInProgress) return;
    
    playAttemptInProgress = true;
    
    // Update UI first
    musicToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/><path d="M8 17V5l12-2v12"/></svg>';
    playMusicBtn.textContent = 'Pause Our Song';
    
    // Use a Promise to properly handle async play
    bgMusic.play()
        .then(() => {
            // Success - music is playing
            playAttemptInProgress = false;
        })
        .catch(error => {
            console.log("Auto-play was prevented. Will try again on user interaction:", error);
            playAttemptInProgress = false;
            
            // Set up a one-time click handler to try playing again
            const unlockAudio = () => {
                // Only attempt if user intended music to be playing
                if (!isMusicPlaying) return;
                
                bgMusic.play()
                    .then(() => {
                        // Successfully playing now
                        document.removeEventListener('click', unlockAudio);
                    })
                    .catch(err => {
                        console.log("Still couldn't play audio:", err);
                    });
            };
            
            document.addEventListener('click', unlockAudio, { once: true });
        });
}

musicToggle.addEventListener('click', toggleMusic);
playMusicBtn.addEventListener('click', toggleMusic);

// Hearts animation
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 15 + 10) + 'px';
    heartsContainer.appendChild(heart);
    
    gsap.fromTo(heart, 
        { 
            y: '100vh',
            opacity: Math.random() * 0.3 + 0.7
        },
        { 
            y: '-100px',
            duration: Math.random() * 5 + 5,
            opacity: 0,
            ease: 'power1.out',
            onComplete: () => {
                heart.remove();
            }
        }
    );
}

function startHeartsAnimation() {
    setInterval(createHeart, 300);
}

// Cursor heart effect
document.addEventListener('mousemove', (e) => {
    cursorHeart.style.left = e.pageX + 'px';
    cursorHeart.style.top = e.pageY + 'px';
});

document.addEventListener('mousedown', () => {
    gsap.to(cursorHeart, { opacity: 1, scale: 1.5, duration: 0.2 });
    setTimeout(() => {
        gsap.to(cursorHeart, { opacity: 0, scale: 1, duration: 0.2 });
    }, 200);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Ensure letter view is hidden by CSS and not JS
    // The !important in CSS should prevent any flashes
    
    // Clear any text that might be showing
    typedText.innerHTML = '';
    
    // Set up autoplay for music
    isMusicPlaying = true;
    
    // Wait a short delay before attempting to play music
    // This helps avoid conflicts with browser initialization
    setTimeout(() => {
        playMusic();
    }, 500);
    
    // Preload animation
    gsap.from(envelope, { 
        y: 50, 
        opacity: 0, 
        duration: 1.5, 
        ease: 'elastic.out(1, 0.5)' 
    });
    
    // Add subtle floating effect to envelope
    gsap.to(envelope, {
        y: '10px',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}); 