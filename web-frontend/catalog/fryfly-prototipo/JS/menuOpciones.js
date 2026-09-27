document.addEventListener('DOMContentLoaded', function() {
    
    function verificarClick(event) {
        event.preventDefault();

        var opcionSeleccionada = event.currentTarget.id;
        window.location.href = '../HTML/menuopciones.html?opcion=' + opcionSeleccionada;
    }

    var opciones = document.querySelectorAll('.opcion');
    opciones.forEach(function(opcion) {
        opcion.addEventListener('click', verificarClick);
    })
})

document.addEventListener("DOMContentLoaded", function() {
    const cardMostrar = 7;
    let index = 0;

    function mostrarCards() {
        const cards = document.querySelectorAll('.card-opcion');
        const totalCards = cards.length;

        cards.forEach((card, numero) => {
            let nuevoIndex = (index + numero) % totalCards;

            if (nuevoIndex < 0) {
                nuevoIndex += totalCards;
            }

            if (nuevoIndex < cardMostrar && nuevoIndex < totalCards) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
            card.style.order = nuevoIndex;
        });
    }

    function mostrarSiguiente() {
        const cards = document.querySelectorAll('.card-opcion');

        if (cards.length === 7) {
            return;
        }

        index = (index + 1) % cards.length;
        mostrarCards();

        if (index === 0) {
            index = cards.length;
        }
    }

    function mostrarAnterior() {
        const cards = document.querySelectorAll('.card-opcion');
        
        if (cards.length === 7) {
            return;
        }

        index = (index - 1 + cards.length) % cards.length;
        mostrarCards();

        if (index === cards.length - 1) {
            index = -1;
        }
    }

    function mostrarImagenesOpcion(opcion) {
        var imagenes = [];

        if (opcion === 'hamburguesas') {
            imagenes = [
                'hamburguesaclasica.jpg',
                'hamburguesacheeseburger.jpg',
                'hamburguesavegetariana.jpg',
                'hamburguesapollo.jpg',
                'hamburguesatocino.jpg',
                'hamburguesagourmet.jpg',
                'hamburguesabbq.jpg',
                'hamburguesadobletriple.jpg',
            ];
        } else if (opcion === 'hotdogs') {
            imagenes = [
                'hotdogclasico.jpg',
                'hotdogchilidog.jpg',
                'hotdogmexicano.jpg',
                'hotdogchicagostyle.jpg',
                'hotdogqueso.jpg',
                'hotdoghawaiano.jpg',
                'hotdogvegetariano.jpg',
            ];
        } else if (opcion === 'pizzas') {
            imagenes = [
                'pizzapepperoni.jpg',
                'pizzahawaiana.jpg',
                'pizzabbq.jpg',
                'pizzapollo.jpg',
                'pizzacuatrosquesos.jpg',
                'pizzamarinara.jpg',
                'pizzamargarita.jpg',
                'pizzavegetariana.jpg',
            ];
        } else if (opcion === 'sushis') {
            imagenes = [
                'sushinigiri.jpg',
                'sushimaki.jpg',
                'sushisashimi.jpg',
                'sushitemaki.jpg',
                'sushiuramaki.jpg',
                'sushigunkan.jpg',
                'sushioshizushi.jpg',
                'sushichirashi.jpg',
            ];
        } else if (opcion === 'carnes') {
            imagenes = [
                'pollofrito.jpg',
                'pechugaplancha.jpg',
                'pechurina.jpg',
                'chuletares.jpg',
                'costillares.jpg',
                'churrascores.jpg',
                'costillacerdo.jpg',
                'tocino.jpg',
                'churrascocerdo.jpg',
            ];
        } else if (opcion === 'ensaladas') {
            imagenes = [
                'ensaladacesar.jpg',
                'ensaladagriega.jpg',
                'ensaladacaprese.jpg',
                'ensaladafrutas.jpg',
                'ensaladawaldorf.jpg',
                'ensaladaquinoa.jpg',
                'ensaladapollo.jpg',
                'ensaladaatun.jpg',
            ];
        } else if (opcion === 'postres') {
            imagenes = [
                'bizcochos.jpg',
                'helados.jpg',
                'cheesecakes.jpg',
                'tiramisus.jpg',
                'cupcakes.jpg',
                'flanes.jpg',
                'galletascaseras.jpg',
            ];
        } else if (opcion === 'bebidas') {
            imagenes = [
                'agua.jpg',
                'cafe.jpg',
                'refrescos.jpg',
                'jugos.jpg',
                'batidos.jpg',
                'cervezas.jpg',
                'cocteles.jpg',
            ];
        }

        var subOpciones = document.querySelector('.sub-opciones');

        imagenes.forEach(function(imagen) {
            var cardOpcion = document.createElement('div');
            cardOpcion.classList.add('card-opcion');
            cardOpcion.style.backgroundImage = `url('../IMG/${opcion}/${imagen}')`;

            subOpciones.appendChild(cardOpcion);
        });
        mostrarCards();
    }
    document.querySelector('.siguiente').addEventListener('click', mostrarSiguiente);
    document.querySelector('.anterior').addEventListener('click', mostrarAnterior);

    function obtenerParametro(nombre) {
        var parametros = new URLSearchParams(window.location.search);
        return parametros.get(nombre);
    }

    function actualizarContenido(opcion) {
        let tituloInfo = document.getElementById('titulo-info');
        let subtituloInfo = document.getElementById('subtitulo-info');
        let contenidoInfo = document.getElementById('contenido-info');
        let imagenOpcion = document.getElementById('imagen-opcion');

        if (opcion === 'hamburguesas') {
            document.title = 'Menú de Hamburguesas';
            tituloInfo.textContent = 'Las Hamburguesas mas deliciosas';
            subtituloInfo.textContent = 'las tenemos nosotros.';
            contenidoInfo.textContent = 'Aqui encontraras los diferentes tipos de hamburguesas que tenemos para ti como lo son: Hamburguesa Clásica, Cheeseburger, Vegetariana, Pollo, Tocino, Gourmet, BBQ y Doble o Triple y más.';
            imagenOpcion.src = '../ICONS/hamburguesa.png';
        } else if (opcion === 'hotdogs') {
            document.title = 'Menú de Hot Dogs';
            tituloInfo.textContent = 'Los Hot Dogs mas deliciosos';
            subtituloInfo.textContent = 'los tenemos nosotros.';
            contenidoInfo.textContent = 'Aqui encontraras los diferentes tipos de hot dogs que tenemos para ti como lo son: Hot Dog Clasico, Chili Dog, Mexicano, Chicago-Style, Con Queso, Hawaiano, Vegetariano y más.';
            imagenOpcion.src = '../ICONS/hot-dog.png';
        } else if (opcion === 'pizzas') {
            document.title = 'Menú de Pizzas';
            tituloInfo.textContent = 'Las Pizzas mas deliciosas';
            subtituloInfo.textContent = 'las tenemos nosotros.';
            contenidoInfo.textContent = 'Aqui encontraras los diferentes tipos de pizzas que tenemos para ti como lo son: Pizza de Pepperoni, Hawaiana, BBQ, Pollo, Cuatros Quesos, Marinara, Margarita, Vegetariana y más.';
            imagenOpcion.src = '../ICONS/pizza.png';
        } else if (opcion === 'sushis') {
            document.title = 'Menú de Sushis';
            tituloInfo.textContent = 'Los Sushis mas deliciosos';
            subtituloInfo.textContent = 'los tenemos nosotros.';
            contenidoInfo.textContent = 'Aqui encontraras los diferentes tipos de sushis que tenemos para ti como lo son: Sushi Nigiri, Maki, Sashimi, Temaki, Uramaki, GunKan, Oshizushi, Chirashi y más.';
            imagenOpcion.src = '../ICONS/sushi.png';
        } else if (opcion === 'carnes') {
            document.title = 'Menú de Carnes'
            tituloInfo.textContent = 'Las Carnes mas deliciosas';
            subtituloInfo.textContent = 'las tenemos nosotros.';
            contenidoInfo.textContent = 'Aqui encontraras los diferentes tipos de carnes que tenemos para ti como lo son: Pollo (Frito, Pechuga a La Plancha, Pechurina), Res (Chuleta, Costilla, Churrasco), Cerdo (Costilla, Tocino, Churrasco) y sus respectivas variedades.';
            imagenOpcion.src = '../ICONS/carne.png';
        } else if (opcion === 'ensaladas') {
            document.title = 'Menú de Ensaladas'
            tituloInfo.textContent = 'Las Ensaladas mas deliciosas';
            subtituloInfo.textContent = 'las tenemos nosotros.';
            contenidoInfo.textContent = 'Aqui encontraras los diferentes tipos de ensaladas que tenemos para ti como lo son: Ensaladas César, Griega, Caprese, de Frutas, Waldorf, Quinoa, de Pollo, de Atún y más.';
            imagenOpcion.src = '../ICONS/ensalada.png';
        } else if (opcion === 'postres') {
            document.title = 'Menú de Postres'
            tituloInfo.textContent = 'Los Postres mas deliciosos';
            subtituloInfo.textContent = 'los tenemos nosotros.';
            contenidoInfo.textContent = 'Aqui encontraras los diferentes tipos de postres que tenemos para ti como lo son: Bizcochos, Helados, CheeseCakes, Tiramisús, CupCakes, Flanes, Galletas Caseras y más.';
            imagenOpcion.src = '../ICONS/postre.png';
        } else if (opcion === 'bebidas') {
            document.title = 'Menú de Bebidas'
            tituloInfo.textContent = 'Las Bebidas mas deliciosas';
            subtituloInfo.textContent = 'las tenemos nosotros.';
            contenidoInfo.textContent = 'Aqui encontraras los diferentes tipos de bebidas que tenemos para ti como lo son: Agua, Café, Refrescos, Jugos, Batidos, Cervezas, Cócteles y más.';
            imagenOpcion.src = '../ICONS/bebida.png';
        }
        mostrarImagenesOpcion(opcion);
    }

    var opcionSeleccionada = obtenerParametro('opcion');
    if (opcionSeleccionada) {
        actualizarContenido(opcionSeleccionada);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var cardOpciones = document.querySelectorAll('.card-opcion');

    cardOpciones.forEach(function(card) {
        card.addEventListener('click', function() {
            var nombreImagen = card.style.backgroundImage.replace(/\)$/, '').split('/').pop().replace(/"|"/g, '').replace('.jpg', '');

            var modalNombre = document.getElementById('nombre-opcion');
            var modalIngredientes = document.getElementById('ingredientes-opcion');
            var modalImagen = document.querySelector('.img-card');

            // HAMBURGUESAS
            if (nombreImagen === 'hamburguesaclasica') {
                modalNombre.textContent = 'Hamburguesa Clasica';                
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'hamburguesacheeseburger') {
                modalNombre.textContent = 'Hamburguesa Cheeseburger';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();    
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'hamburguesavegetariana') {
                modalNombre.textContent = 'Hamburguesa Vegetariana';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'hamburguesapollo') {
                modalNombre.textContent = 'Hamburguesa De Pollo';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'hamburguesatocino') {
                modalNombre.textContent = 'Hamburguesa De Tocino';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'hamburguesagourmet') {
                modalNombre.textContent = 'Hamburguesa Gourmet';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'hamburguesabbq') {
                modalNombre.textContent = 'Hamburguesa BBQ';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'hamburguesadobletriple') {
                modalNombre.textContent = 'Hamburguesa Doble o Triple';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } // HOT DOGS
              else if (nombreImagen === 'hotdogclasico') {
                modalNombre.textContent = 'Hot Dog Clasico';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'hotdogchilidog') {
                modalNombre.textContent = 'Hot Dog Chili Dog';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'hotdogmexicano') {
                modalNombre.textContent = 'Hot Dog Mexicano';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'hotdogchicagostyle') {
                modalNombre.textContent = 'Hot Dog Chicago-Style';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'hotdogqueso') {
                modalNombre.textContent = 'Hot Dog Con Queso';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'hotdoghawaiano') {
                modalNombre.textContent = 'Hot Dog Hawaiano';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'hotdogvegetariano') {
                modalNombre.textContent = 'Hot Dog Vegetariano';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } // PIZZAS
              else if (nombreImagen === 'pizzapepperoni') {
                modalNombre.textContent = 'Pizza De Pepperoni';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'pizzahawaiano') {
                modalNombre.textContent = 'Pizza Hawaiano';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'pizzabbq') {
                modalNombre.textContent = 'Pizza BBQ';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'pizzapollo') {
                modalNombre.textContent = 'Pizza De Pollo';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'pizzacuatrosquesos') {
                modalNombre.textContent = 'Pizza Cuatros Quesos';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'pizzamarinara') {
                modalNombre.textContent = 'Pizza Marinara';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'pizzamargarita') {
                modalNombre.textContent = 'Pizza Margarita';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'pizzavegetariana') {
                modalNombre.textContent = 'Pizza Vegetariana';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } // SUSHIS
              else if (nombreImagen === 'sushinigiri') {
                modalNombre.textContent = 'Sushi Nigiri';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'sushimaki') {
                modalNombre.textContent = 'Sushi Maki';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'sushisashimi') {
                modalNombre.textContent = 'Sushi Sashimi';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'sushitemaki') {
                modalNombre.textContent = 'Sushi Temaki';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'sushiuramaki') {
                modalNombre.textContent = 'Sushi Uramaki';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'sushigunkan') {
                modalNombre.textContent = 'Sushi GunKan';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'sushioshizushi') {
                modalNombre.textContent = 'Sushi Oshizushi';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'sushichirashi') {
                modalNombre.textContent = 'Sushi Chirashi';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } // CARNES
              else if (nombreImagen === 'pollofrito') {
                modalNombre.textContent = 'Pollo Frito';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'pechugaplancha') {
                modalNombre.textContent = 'Pechuga a La Plancha';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'pechurina') {
                modalNombre.textContent = 'Pechurina';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'chuletares') {
                modalNombre.textContent = 'Chuleta De Res';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'costillares') {
                modalNombre.textContent = 'Costilla De Res';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'churrascores') {
                modalNombre.textContent = 'Churrasco De Res';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'costillacerdo') {
                modalNombre.textContent = 'Costilla De Cerdo';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'tocino') {
                modalNombre.textContent = 'Tocino';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'churrascocerdo') {
                modalNombre.textContent = 'Churrasco De Cerdo';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } // ENSALADAS
              else if (nombreImagen === 'ensaladacesar') {
                modalNombre.textContent = 'Ensalada Cesar';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'ensaladagriega') {
                modalNombre.textContent = 'Ensalada Griega';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'ensaladacaprese') {
                modalNombre.textContent = 'Ensalada Caprese';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'ensaladafrutas') {
                modalNombre.textContent = 'Ensalada De Frutas';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'ensaladawaldorf') {
                modalNombre.textContent = 'Ensalada Waldorf';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'ensaladaquinoa') {
                modalNombre.textContent = 'Ensalada Quinoa';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'ensaladapollo') {
                modalNombre.textContent = 'Ensalada De Pollo';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'ensaladaatun') {
                modalNombre.textContent = 'Ensalada De Atun';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } // POSTRES
              else if (nombreImagen === 'bizcochos') {
                modalNombre.textContent = 'Bizcochos';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'helados') {
                modalNombre.textContent = 'Helados';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'cheesecakes') {
                modalNombre.textContent = 'CheeseCakes';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'tiramisus') {
                modalNombre.textContent = 'Tiramisus';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'cupcakes') {
                modalNombre.textContent = 'CupCakes';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'flanes') {
                modalNombre.textContent = 'Flanes';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'galletascaseras') {
                modalNombre.textContent = 'Galletas Caseras';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } // BEBIDAS
              else if (nombreImagen === 'agua') {
                modalNombre.textContent = 'Agua';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'cafe') {
                modalNombre.textContent = 'Cafe';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'refrescos') {
                modalNombre.textContent = 'Refrescos';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'jugos') {
                modalNombre.textContent = 'Jugos';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'batidos') {
                modalNombre.textContent = 'Batidos';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'cervezas') {
                modalNombre.textContent = 'Cervezas';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } else if (nombreImagen === 'cocteles') {
                modalNombre.textContent = 'Cocteles';
                modalImagen.style.backgroundImage = card.style.backgroundImage;
                mostrarModal();
                mostrarIngredientes(nombreImagen, modalIngredientes)
            } 
        });
    });
});

function mostrarIngredientes(nombreImagen, modalIngredientes) {
    var ingredientes = [];

    switch (nombreImagen) {
        // HAMBURGUESAS
        case 'hamburguesaclasica':
            ingredientes = ['Carne de res','Queso','Lechuga','Tomate','Pepinillo','Cebolla','Ketchup','Mayonesa','Mostaza'];
            break
        case 'hamburguesacheeseburger':
            ingredientes = ['Carne de res','Quesos','Lechuga','Tomate','Pepinillo','Cebolla','Ketchup','Mayonesa','Mostaza'];
            break
        case 'hamburguesavegetariana':
            ingredientes = ['Frijoles','Queso veget','Lechuga','Pepinillo','Cebolla Roja','Ketchup','Mayonesa veget','Mostaza'];
            break
        case 'hamburguesapollo':
            ingredientes = ['Pechuga pollo','Queso','Lechuga','Tomate','Pepinillo','Cebolla','Ketchup','Mayonesa','Mostaza'];
            break
        case 'hamburguesatocino':
            ingredientes = ['Carne de res','Tocino','Queso','Lechuga','Tomate','Pepinillo','Cebolla','Ketchup','Mayonesa','Mostaza'];
            break
        case 'hamburguesagourmet':
            ingredientes = ['Carne de res','Queso Gourmet','Tocino','Huevo Frito','Lechuga','Tomate','Pepinillo','Cebolla','Ketchup','Mayonesa','Mostaza'];
            break
        case 'hamburguesabbq':
            ingredientes = ['Carne de res','Salsa BBQ','Tocino','Queso','Lechuga','Tomate','Pepinillo','Cebolla','Ketchup','Mayonesa','Mostaza'];
            break
        case 'hamburguesadobletriple':
            ingredientes = ['2·3-Carne de res','2·3-Quesos','2·3-Lechuga','2·3-Tomate','2·3-Pepinillo','2·3-Cebolla','2·3-Ketchup','2·3-Mayonesa','2·3-Mostaza','Doble','?','Triple'];
            break
        // HOTS DOGS
        case 'hotdogclasico':
            ingredientes = ['Salchicha','Repollo','Cebolla picada','Tomate picado','Ketchup','Mayonesa','Mostaza','Salsa picante'];
            break
        case 'hotdogchilidog':
            ingredientes = ['Salchicha','Chili carne','Queso rallado','Jalapeños','Salsa picante','Cebolla picada','Ketchup','Mayonesa','Mostaza'];
            break
        case 'hotdogmexicano':
            ingredientes = ['Salchicha','Tocino','Guacamole','Salsa picante','Crema mexicana','Queso rallado','Cebolla picada','Tomate picado','Cilantro picado','Ketchup','Mayonesa','Mostaza'];
            break
        case 'hotdogchicagostyle':
            ingredientes = ['Salchicha','Chile','Pimiento verde','Cebolla picada','Tomate picado','Pepinillos picado','Ketchup','Mayonesa','Mostaza'];
            break
        case 'hotdogqueso':
            ingredientes = ['Salchicha','Quesos','Cebolla picada','Tomate picado','Pepinillos picado','Ketchup','Mayonesa','Mostaza'];
            break
        case 'hotdoghawaiano':
            ingredientes = ['Salchica','Piña picada','Salsa teriyaki','Cebolla picada','Tomate picado','Ketchup','Mayonesa','Mostaza'];
            break
        case 'hotdogvegetariano':
            ingredientes = ['Salchcica Veget','Salsa teriyaki','Cebolla roja','Aguacate','Espinacas','Aceite de oliva','Ketchup','Mayonesa','Mostaza'];
            break
        // PIZZAS
        // case 'pizzapepperoni':
        //     ingredientes = [];
        //     break
        // case 'pizzahawaiano':
        //     ingredientes = [];
        //     break
        // case 'pizzabbq':
        //     ingredientes = [];
        //     break
        // case 'pizzapollo':
        //     ingredientes = [];
        //     break
        // case 'pizzacuatrosquesos':
        //     ingredientes = [];
        //     break
        // case 'pizzamarinara':
        //     ingredientes = [];
        //     break
        // case 'pizzamargarita':
        //     ingredientes = [];
        //     break
        // case 'pizzavegetariana':
        //     ingredientes = [];
        //     break
        // SUSHIS
        case 'sushinigiri':
            ingredientes = ['Salmon','Wasabi','Algas nori','Salsa de soja','Jengibre (gari)','Sesemo tostado'];
            break
        case 'sushimaki':
            ingredientes = ['Camaron','Algas nori','Queso crema','Aguacate','Zanahoria','Pepino','Wasabi','Jengibre (gari)'];
            break
        case 'sushisashimi':
            ingredientes = ['Hamachi (pez limon)','Wasabi','Salsa de soja','Jengibre (gari)'];
            break
        case 'sushitemaki':
            ingredientes = ['Atun','Algas nori','Aguacate','Zanahoria','Pepino','Queso crema','Wasabi','Jengibre (gari)'];
            break
        case 'sushiuramaki':
            ingredientes = ['Salmon','Algas nori','Aguacate','Zanahoria','Pepino','Queso crema','Wasabi','Jengibre (gari)','Cebollino','Salsa de soja'];
            break
        case 'sushigunkan':
            ingredientes = ['tartar','tobiko','Algas nori','Aguacate','Zanahoria','Pepino','Queso crema','Wasabi','Jengibre (gari)','Cebollino','Salsa de soja'];
            break
        case 'sushioshizushi':
            ingredientes = ['Marisco','Algas nori','Tobiko','Pepino','Wasabi','Salsa de soja','Jengibre (gari)'];
            break
        case 'sushichirashi':
            ingredientes = ['vieiras','Mariscos','Tobiko','Tamago','Wasabi','Salsa de soja','Jengibre (gari)'];
            break
        // CARNES
        // case 'pollofrito':
        //     ingredientes = [];
        //     break
        // case 'pechugaplancha':
        //     ingredientes = [];
        //     break
        // case 'pechurina':
        //     ingredientes = [];
        //     break
        // case 'chuletares':
        //     ingredientes = [];
        //     break
        // case 'costillares':
        //     ingredientes = [];
        //     break
        // case 'churrascores':
        //     ingredientes = [];
        //     break
        // case 'costillacerdo':
        //     ingredientes = [];
        //     break
        // case 'tocino':
        //     ingredientes = [];
        //     break
        // case 'churrascocerdo':
        //     ingredientes = [];
        //     break
        // ENSALADAS
        case 'ensaladacesar':
            ingredientes = ['Lechuga romana','Crutones','Queso parmesano','Aderezo cesar','Pimienta negra'];
            break
        case 'ensaladagriega':
            ingredientes = ['Tomate','Pepino','Cebolla roja','Aceitunas','Queso feta','Pimientos','Aceite de oliva','Vinagre de vino','Oregano seco','Sal','Pimienta'];
            break
        case 'ensaladacaprese':
            ingredientes = ['Tomate','Mozzarella','Albahaca','Aceite de oliva','Vinagre balsamico','Sal','Pimienta'];
            break
        case 'ensaladafrutas':
            ingredientes = ['Fresa','Uva','Piña','Melon','Sandia','Kiwi','Mango','Guineo','Naranja','Manzana','Pera','Miel','Coco Rallado','Jugo de limon'];
            break
        case 'ensaladawaldorf':
            ingredientes = ['Manzana','Apio','Nueces','Uvas','Mayonesa','Jugo de limon','Sal','Pimienta'];
            break
        case 'ensaladaquinoa':
            ingredientes = ['Quinoa','Pepino','Tomate','Aguacate','Zanahoria rallada','Nueces','Aderezo'];
            break
        case 'ensaladapollo':
            ingredientes = ['Pechuga','Lechuga','Zanahoria rallada','Tomate','Pepino','Aguacate','Brocoli','Aderezo'];
            break
        case 'ensaladaatun':
            ingredientes = ['Atun','Lechuga','Tomate','Pepino','Zanahoria rallada','Aceituna','Aderezo'];
            break
        // POSTRES
        // case 'bizcochos':
        //     ingredientes = [];
        //     break
        // case 'helados':
        //     ingredientes = [];
        //     break
        // case 'cheesecakes':
        //     ingredientes = [];
        //     break
        // case 'tiramisus':
        //     ingredientes = [];
        //     break
        // case 'cupcakes':
        //     ingredientes = [];
        //     break
        // case 'flanes':
        //     ingredientes = [];
        //     break
        // case 'galletascaseras':
        //     ingredientes = [];
        //     break
        // BEBIDAS
        // case 'agua':
        //     ingredientes = [];
        //     break
        // case 'cafe':
        //     ingredientes = [];
        //     break
        // case 'refrescos':
        //     ingredientes = [];
        //     break
        // case 'jugos':
        //     ingredientes = [];
        //     break
        // case 'batidos':
        //     ingredientes = [];
        //     break
        // case 'cervezas':
        //     ingredientes = [];
        //     break
        // case 'cocteles':
        //     ingredientes = [];
        //     break
    }

    modalIngredientes.textContent = '';

    ingredientes.forEach(function(ingrediente) {
        var li = document.createElement('li');

        li.textContent = ingrediente;
        li.className = 'ingrediente';

        li.onclick = function() {
            li.classList.toggle("seleccionado");
        }

        modalIngredientes.appendChild(li);
    });
}

// function ordenar() {
//     var sesionIniciada = localStorage.getItem('sesionIniciada');
//     if (sesionIniciada !== 'true') {
//         window.location.href = 'login.html';
//     }
// }

function mostrarModal() {
    document.getElementById('modalOpcion').style.display = 'block';
    document.getElementById('modalOpcionOverlay').style.display = 'block';
}

function cerrarModal() {
    var modalOlvCon = document.getElementById('modalOpcion');

    modalOlvCon.style.display = 'none';

    document.getElementById('modalOpcionOverlay').style.display = 'none';
}