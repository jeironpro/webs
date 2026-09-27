document.getElementById('control').addEventListener('click', function() {
    var header = document.querySelector('header');
    var textoElementos = document.querySelectorAll('li span');
    var icono = document.querySelector('.control i');

    if (icono.classList.contains('fa-chevron-left')) {
        header.style.width = '55px';
        textoElementos.forEach(elemento => {
            elemento.style.display = 'none';
        });
        icono.classList.remove('fa-chevron-left');
        icono.classList.add('fa-chevron-right');
    } else  {
        header.style.width = '180px';
        icono.classList.remove('fa-chevron-right');
        icono.classList.add('fa-chevron-left');
    }

    header.addEventListener('transitionend', function() {
        textoElementos.forEach(elemento => {
            if (header.style.width === '55px') {
                elemento.style.display = 'none';
            } else {
                elemento.style.display = 'flex';
            }
        });
    })
})