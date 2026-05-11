//window.addEventListener('scroll', function() {
//    const nav = document.querySelector('.glass-nav');
   // if (nav) {
    //    if (window.scrollY > 50) {
    //        nav.classList.add('nav-active');
     //   } else {
     //       nav.classList.remove('nav-active');
      //  }
   // }
///})




// Fecha o menu ao clicar em um link
const swiper = new Swiper('.showcase-slider', {
        loop: true,
        effect: 'fade', // Efeito de transição imersivo
        fadeEffect: {
            crossFade: true
        },
        speed: 1000,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.custom-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // Seleciona todos os itens do FAQ
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;

        // Fecha outros itens abertos (Opcional - Estilo acordeão único)
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            }
        });

        // Alterna a classe ativa no item clicado
        faqItem.classList.toggle('active');

        // Controla a animação de altura (max-height dinâmico)
        const answer = faqItem.querySelector('.faq-answer');
        if (faqItem.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
            answer.style.maxHeight = null;
        }
    });
});