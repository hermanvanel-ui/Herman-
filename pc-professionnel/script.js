/**
 * PC Professionnel - Script Principal
 * Gestion de l'interactivité du formulaire et du slider
 */

document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // GESTION DU SLIDER DE MONTANT
    // ========================================
    const slider = document.getElementById('montant');
    const montantDisplay = document.getElementById('montantDisplay');

    if (slider && montantDisplay) {
        // Mise à jour en temps réel du montant affiché
        slider.addEventListener('input', function() {
            const value = this.value;
            montantDisplay.textContent = value + '€';
        });

        // Initialisation de l'affichage au chargement
        montantDisplay.textContent = slider.value + '€';
    }

    // ========================================
    // GESTION DU FORMULAIRE
    // ========================================
    const form = document.getElementById('participationForm');
    const successMessage = document.getElementById('successMessage');

    if (form) {
        form.addEventListener('submit', function(e) {
            // Ne pas empêcher la soumission par défaut
            // Netlify Forms gère automatiquement la soumission

            // Afficher le message de succès après un court délai
            // pour que Netlify ait le temps de traiter
            setTimeout(function() {
                // Cacher le formulaire
                form.style.display = 'none';

                // Afficher le message de succès
                if (successMessage) {
                    successMessage.style.display = 'block';
                }

                // Scroll vers le message de succès
                successMessage.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 100);
        });

        // Validation avant soumission
        form.addEventListener('submit', function(e) {
            const identite = document.getElementById('identite').value;
            const montant = document.getElementById('montant').value;

            if (!identite) {
                e.preventDefault();
                alert('Merci de sélectionner qui vous êtes (Papa ou Maman)');
                return false;
            }

            // On autorise un montant de 0€
            if (montant === null || montant === undefined) {
                e.preventDefault();
                alert('Merci d\'indiquer un montant');
                return false;
            }
        }, true); // Capturer en phase de capture pour valider avant la soumission Netlify
    }

    // ========================================
    // SMOOTH SCROLL POUR LES ANCRES
    // ========================================
    const navLinks = document.querySelectorAll('.nav-link, a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Vérifier que c'est bien une ancre interne
            if (href && href.startsWith('#') && href.length > 1) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault();

                    // Scroll smooth vers l'élément
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Mettre à jour l'URL sans recharger la page
                    history.pushState(null, null, href);
                }
            }
        });
    });

    // ========================================
    // ANIMATION AU SCROLL (Optionnel)
    // ========================================
    // Observer pour animer les éléments au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Appliquer l'animation aux cartes et sections
    const animatedElements = document.querySelectorAll('.usage-card, .component-detail, .faq-item, .upgrade-card');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ========================================
    // HIGHLIGHT NAVIGATION ACTIVE
    // ========================================
    // Mettre en évidence le lien de navigation correspondant à la section visible
    const sections = document.querySelectorAll('section[id]');

    function highlightNavigation() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Retirer la classe active de tous les liens
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Ajouter la classe active au lien correspondant
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Écouter le scroll avec throttling pour optimiser les performances
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(highlightNavigation, 50);
    });

    // ========================================
    // ACCESSIBILITÉ - FOCUS VISIBLE
    // ========================================
    // Améliorer la visibilité du focus pour la navigation au clavier
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // ========================================
    // INITIALISATION
    // ========================================
    console.log('✅ Site PC Professionnel initialisé avec succès');

    // Vérifier si Netlify Forms est correctement configuré
    if (form && form.hasAttribute('data-netlify')) {
        console.log('✅ Netlify Forms détecté et configuré');
    }
});

// ========================================
// GESTION DES ERREURS GLOBALES
// ========================================
window.addEventListener('error', function(e) {
    console.error('Erreur détectée:', e.error);
});

// ========================================
// PRÉVENTION DU DOUBLE SUBMIT
// ========================================
document.addEventListener('submit', function(e) {
    const submitButton = e.target.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Envoi en cours...';

        // Réactiver après 3 secondes en cas d'erreur
        setTimeout(function() {
            submitButton.disabled = false;
            submitButton.textContent = 'Valider et envoyer';
        }, 3000);
    }
});
