// Diese Funktion überprüft, ob ein Benutzer eingeloggt ist
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        // Wenn kein Token vorhanden ist, zur Login-Seite umleiten
        window.location.href = 'index.html'; // oder der Name Ihrer Login-Seite
    }
}

// Führen Sie diese Funktion aus, wenn die Seite geladen wird
window.addEventListener('load', checkAuth);

// Logout-Funktion (wie oben beschrieben)
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Event-Listener für den Logout-Button
document.getElementById('logoutBtn').addEventListener('click', logout);