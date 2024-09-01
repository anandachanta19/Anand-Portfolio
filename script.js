document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.section');
    const menuItems = document.querySelectorAll('.nav-links .opt, .dropdown-menu .opt');
    let activeSection = null;

    function typeWriter(element, text, speed, callback) {
        let i = 0;
        let promptDisplayed = false;
        element.innerHTML = '';

        const interval = setInterval(function () {
            if (i < text.length) {
                if (!promptDisplayed && text.startsWith('cd')) {
                    element.innerHTML = 'ubuntu@anand:~$ ';
                    promptDisplayed = true;
                } else if (!promptDisplayed && text.startsWith('sudo apt update')) {
                    element.innerHTML += '<br>ubuntu@anand:~$ ';
                    promptDisplayed = true;
                }
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
                if (callback) callback();
            }
        }, speed);
    }

    function showSectionContent(section) {
        const terminal = section.querySelector('.terminal code');
        const content = section.querySelector('.section-content');
        const text = terminal.innerText;

        console.log(`Animating section: ${section.id}`);
        terminal.innerHTML = '';
        content.classList.add('hidden'); // Hide content before animation

        typeWriter(terminal, text, 50, function () {
            content.classList.remove('hidden'); // Show content after typing
        });
    }

    function triggerAnimationForSection(section) {
        if (section && section !== activeSection) {
            activeSection = section;
            showSectionContent(section);
        }
    }

    // Initial display of the 'home' section
    function showInitialSection() {
        const initialSection = document.getElementById('home');
        if (initialSection) {
            initialSection.classList.add('active');
            triggerAnimationForSection(initialSection);
        }
    }

    // Set up observers for all sections (desktop and mobile views)
    sections.forEach(section => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log(`Section ${section.id} is in viewport`);
                    triggerAnimationForSection(section);
                    observer.unobserve(section); // Unobserve to prevent re-triggering
                }
            });
        }, { threshold: 0.5 });

        observer.observe(section);
    });

    // Handle clicks on menu items (both mobile and desktop)
    menuItems.forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                console.log(`Navigating to section: ${targetId}`);
                
                // Hide all sections and deactivate them
                sections.forEach(sec => sec.classList.remove('active'));

                // Show and animate the target section
                targetSection.classList.add('active');
                targetSection.scrollIntoView({ behavior: 'smooth' });
                triggerAnimationForSection(targetSection);
            }

            document.querySelector('.dropdown-menu').classList.remove('active');
        });
    });

    // Toggle dropdown menu for mobile view
    const menuToggle = document.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', function () {
        document.querySelector('.dropdown-menu').classList.toggle('active');
    });

    // Show the initial section with animation
    showInitialSection();
});
