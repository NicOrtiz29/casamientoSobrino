document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURACIÓN (Puedes cambiar esto) ---
    const weddingDate = new Date(2026, 1, 14, 18, 0, 0); // Formato: AÑO, MES (0-11), DÍA, HORA, MINUTO, SEGUNDO
    
    const eventDetails = {
        title: "Boda de Jazmín & Marcos",
        description: "¡Te esperamos para celebrar nuestra boda!",
        location: "Teatro Colón, Cerrito 628, Buenos Aires",
        startTime: weddingDate,
        // El evento dura 6 horas por defecto
        endTime: new Date(weddingDate.getTime() + 6 * 60 * 60 * 1000) 
    };


    // --- LÓGICA DE LA APLICACIÓN ---

    // 1. Cuenta Regresiva
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date();
        const diff = weddingDate.getTime() - now.getTime();

        if (diff <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown').innerHTML = '<h2 class="text-4xl font-serif text-emerald-800">¡Llegó el gran día!</h2>';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if(daysEl) daysEl.textContent = days;
        if(hoursEl) hoursEl.textContent = hours;
        if(minutesEl) minutesEl.textContent = minutes;
        if(secondsEl) secondsEl.textContent = seconds;
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();


    // 2. Copiar al Portapapeles
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetInputId = button.getAttribute('data-copy');
            const inputElement = document.getElementById(targetInputId);
            
            navigator.clipboard.writeText(inputElement.value).then(() => {
                const originalText = button.textContent;
                button.textContent = '¡Copiado!';
                button.disabled = true;
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 2000);
            }).catch(err => {
                console.error('Error al copiar:', err);
            });
        });
    });


    // 3. Generador de Evento para Calendario (Google Calendar)
    const calendarButton = document.getElementById('add-to-calendar');

    function generateGoogleCalendarUrl(details) {
        const formatDate = (date) => date.toISOString().replace(/-|:|\.\d+/g, '');

        const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
        const params = new URLSearchParams({
            text: details.title,
            dates: `${formatDate(details.startTime)}/${formatDate(details.endTime)}`,
            details: details.description,
            location: details.location,
            ctz: 'America/Argentina/Buenos_Aires'
        });
        return `${baseUrl}&${params.toString()}`;
    }

    if (calendarButton) {
        calendarButton.href = generateGoogleCalendarUrl(eventDetails);
    }

    // 4. Background Music Modal & Control
    const musicModal = document.getElementById('music-modal');
    const modalContent = document.getElementById('modal-content');
    const playMusicBtn = document.getElementById('play-music-btn');
    const noMusicBtn = document.getElementById('no-music-btn');
    const music = document.getElementById('background-music');
    const musicControl = document.getElementById('music-control');
    const musicToggle = document.getElementById('music-toggle');
    const musicOnIcon = document.getElementById('music-on-icon');
    const musicOffIcon = document.getElementById('music-off-icon');

    // Function to show the modal with a fade-in/scale-up effect
    const showModal = () => {
        if (musicModal && modalContent) {
            musicModal.classList.remove('opacity-0', 'pointer-events-none');
            // A small delay to allow the display property to change before starting the transition
            setTimeout(() => {
                modalContent.classList.remove('scale-95', 'opacity-0');
            }, 50);
        }
    };

    // Function to hide the modal
    const closeModal = () => {
        if (musicModal && modalContent) {
            modalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                musicModal.classList.add('opacity-0', 'pointer-events-none');
            }, 300); // Match duration in CSS
        }
    };

    if (musicModal) {
        // Show the modal when the page is loaded
        showModal();

        playMusicBtn.addEventListener('click', () => {
            music.play().catch(e => console.error("Error playing music:", e));
            closeModal();
            musicControl.classList.remove('hidden');
            setTimeout(() => musicControl.classList.remove('opacity-0'), 50); // Fade in control
            musicOnIcon.classList.remove('hidden');
            musicOffIcon.classList.add('hidden');
        });

        noMusicBtn.addEventListener('click', () => {
            closeModal();
        });

        musicToggle.addEventListener('click', () => {
            if (music.paused) {
                music.play();
                musicOnIcon.classList.remove('hidden');
                musicOffIcon.classList.add('hidden');
            } else {
                music.pause();
                musicOnIcon.classList.add('hidden');
                musicOffIcon.classList.remove('hidden');
            }
        });
    }