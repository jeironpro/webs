function menu() {
    var ul = document.querySelector('nav ul');
    var items = document.getElementById('contenedor-items');
    var iconoBurger = document.getElementById('icono-burger');
    var main = document.querySelector('main');

    ul.classList.toggle('active');
    items.classList.toggle('active');


    if (ul.classList.contains('active')) {
        iconoBurger.classList.remove('fa-burger');
        iconoBurger.classList.add('fa-x');
        iconoBurger.style.fontSize = '19px';
        iconoBurger.style.marginTop = '5px';
        main.style.marginTop = '200px';
    } else {
        iconoBurger.classList.remove('fa-x');
        iconoBurger.classList.add('fa-burger');
        iconoBurger.style.fontSize = '21px';
    }
}