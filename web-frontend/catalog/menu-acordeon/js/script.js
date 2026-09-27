document.addEventListener('DOMContentLoaded', function() {
    const elementos = document.querySelectorAll('li');

    elementos.forEach(function(element) {
        element.addEventListener('click', function() {
            const activos = this.classList.contains('activo');

                elementos.forEach(function(activo) {
                    activo.classList.remove('activo');
                });

                if (!activos) {
                    this.classList.add('activo');
                }
        });
    });
});