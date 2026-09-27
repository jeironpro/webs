document.addEventListener('DOMContentLoaded', function() {
    var sesionIniciada = localStorage.getItem('sesionIniciada');
    var items = document.getElementById('items');
    var loguearse = document.getElementById('loguearse');
    var paginaPedidos = document.getElementById('pagina-pedidos');

    if (sesionIniciada === 'true') {
        items.style.display = 'flex';
        loguearse.style.display = 'none';
        paginaPedidos.style.display = 'flex';
    } else {
        items.style.display = 'none';
        loguearse.style.display = 'block';
        paginaPedidos.style.display = 'none';
    }
});

function cerrarSesion() {
    localStorage.removeItem('sesionIniciada');

    window.location.href = 'login.html';
}