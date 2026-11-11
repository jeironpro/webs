document.addEventListener('DOMContentLoaded', function() {
    const sesionIniciada = localStorage.getItem('sesionIniciada');
    const items = document.getElementById('items');
    const loguearse = document.getElementById('loguearse');
    const paginaPedidos = document.getElementById('pagina-pedidos');

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