// script.js - Funcionalidades para WebCraft Studio

// ============================================
// 1. FUNCIONES BÁSICAS
// ============================================

// Actualizar el año de copyright automáticamente
function updateCopyrightYear() {
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
}

// Suavizar el desplazamiento al hacer clic en los enlaces del menú
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Cerrar menú en móviles
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarToggler && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    });
}

// Añadir clase activa a los enlaces de navegación
function setupActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    window.addEventListener('scroll', function () {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ============================================
// 2. CARRUSEL DE HABILIDADES
// ============================================

function setupSkillsCarousel() {
    // La animación del carrusel ahora se maneja completamente con CSS (Marquee)
    // para garantizar un funcionamiento fluido en todos los dispositivos.
    // El código JS anterior intentaba controlar un slider con botones que no existen en el HTML.
    console.log('Skills carousel inicializado (CSS Marquee mode)');
}

// ============================================
// 3. FORMULARIO DE CONTACTO CON EMAILJS
// ============================================

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) {
        console.error('Formulario de contacto no encontrado');
        return;
    }

    // Verificar que EmailJS esté disponible
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS no está cargado. Verifica que el script esté incluido en el HTML.');
        return;
    }

    // Inicializar EmailJS con tu Public Key
    emailjs.init("dwf1Mds3uEJ4hiPJi");

    // Elemento para mostrar mensajes
    const formMessage = document.createElement('div');
    formMessage.id = 'formMessage';
    formMessage.style.cssText = `
        display: none;
        margin: 15px 0;
        padding: 12px;
        border-radius: 8px;
        font-weight: 500;
        text-align: center;
    `;
    contactForm.appendChild(formMessage);

    const submitBtn = contactForm.querySelector('button[type="submit"]');

    // Mostrar mensajes
    function showFormMessage(text, type = 'success') {
        formMessage.textContent = text;
        formMessage.style.display = 'block';

        if (type === 'success') {
            formMessage.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
            formMessage.style.color = '#22c55e';
            formMessage.style.border = '1px solid #22c55e';
        } else {
            formMessage.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            formMessage.style.color = '#ef4444';
            formMessage.style.border = '1px solid #ef4444';
        }

        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }

    // Validación de email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Estado para prevenir múltiples envíos
    let isSubmitting = false;

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (isSubmitting) return;
        isSubmitting = true;

        // Obtener valores
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validaciones
        if (!name || !email || !subject || !message) {
            showFormMessage('Por favor, completa todos los campos obligatorios.', 'error');
            isSubmitting = false;
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage('Por favor, ingresa un correo electrónico válido.', 'error');
            isSubmitting = false;
            return;
        }

        // Actualizar botón
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';

        try {

            // Combinar toda la información
            const fullMessage = `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`;
            // Parámetros para EmailJS
            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: fullMessage,
                to_email: 'universomaat444@gmail.com'
            };

            console.log('Enviando email con parámetros:', templateParams);

            // Enviar con EmailJS
            const response = await emailjs.send(
                'service_vtr9gw7',   // Service ID
                'template_msf8xvp',  // Template ID
                templateParams
            );

            console.log('Email enviado exitosamente:', response);

            // Mostrar éxito
            showFormMessage('¡Mensaje enviado exitosamente! Te responderemos pronto.', 'success');

            // Resetear formulario
            contactForm.reset();

        } catch (error) {
            console.error('Error al enviar email:', error);

            let errorMessage = 'Error al enviar el mensaje. Por favor, intenta nuevamente.';

            if (error.status === 0) {
                errorMessage = 'Error de conexión. Verifica tu internet.';
            } else if (error.text) {
                errorMessage = `Error: ${error.text}`;
            }

            showFormMessage(errorMessage, 'error');

        } finally {
            // Restaurar botón
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// ============================================
// 8. FUNCIONES PARA MODAL DE BIENVENIDA
// ============================================

function setupWelcomeModal() {
    const welcomeModal = document.getElementById('welcomeModal');
    const playMelodyBtn = document.getElementById('playMelodyBtn');
    const continueBtn = document.getElementById('continueBtn');
    const brandAudio = document.getElementById('brandMelodyAudio');

    // Forzar que el modal se muestre siempre al cargar la página
    // Eliminamos la lógica de sessionStorage que verificaba si ya se había visto
    // const modalShown = sessionStorage.getItem('welcomeModalShown');

    // Aseguramos que el modal no tenga la clase hidden al iniciar
    welcomeModal.classList.remove('hidden');

    // Función para cerrar modal
    function closeModal() {
        // No guardamos estado en sessionStorage para que vuelva a salir al recargar
        // sessionStorage.setItem('welcomeModalShown', 'true');
        welcomeModal.classList.add('hidden');
    }

    // Botón para reproducir melody
    playMelodyBtn.addEventListener('click', function () {
        closeModal();

        // Reproducir audio
        brandAudio.currentTime = 0;
        brandAudio.play().catch(function (error) {
            console.log('No se pudo reproducir el audio:', error);
        });
    });

    // Botón para continuar sin audio
    continueBtn.addEventListener('click', function () {
        closeModal();
    });

    // Cerrar modal si se hace clic fuera (opcional)
    welcomeModal.addEventListener('click', function (e) {
        if (e.target === welcomeModal) {
            closeModal();
        }
    });
}



// ============================================
// 4. INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM cargado - Inicializando funcionalidades...');

    // Verificar que EmailJS esté disponible
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS no está disponible aún. Espere a que se cargue.');
    }

    updateCopyrightYear();
    setupSmoothScrolling();
    setupActiveNavLinks();
    setupSkillsCarousel();
    setupContactForm();
    setupWelcomeModal();


    // Efecto de carga para imágenes
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.classList.add('fade-in');
    });
});

// También inicializar cuando la ventana se carga completamente
window.addEventListener('load', function () {
    console.log('Página completamente cargada');

    // Verificar EmailJS nuevamente
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS NO se cargó. Verifica:');
        console.error('1. ¿El script está en el HTML?');
        console.error('2. ¿Hay errores de red?');
        console.error('3. ¿La URL del script es correcta?');
    } else {
        console.log('EmailJS está disponible:', typeof emailjs);
    }
});