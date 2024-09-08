const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

registerLink.addEventListener('click', ()=> {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', ()=> {
    wrapper.classList.remove('active');
});

btnPopup.addEventListener('click', ()=> {
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', ()=> {
    wrapper.classList.remove('active-popup');
    wrapper.classList.remove('active');
});

document.querySelector('.form-box.login').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      
      if (response.ok) {  // Dies prüft, ob der Status-Code 200-299 ist
        //alert(data.message || 'Login erfolgreich');

        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        window.location.href = 'home.html';
      } else {
        alert(data.message || 'Login fehlgeschlagen');
      }
    } catch (error) {
      console.error('Fehler beim Login:', error);
      alert('Ein Fehler ist aufgetreten');
    }
});

  document.querySelector('.form-box.register').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('register_username').value;
    const password = document.getElementById('register_password').value;
    const password_repeat = document.getElementById('register_password_confirm').value;
  
    if (password !== password_repeat) {
      alert('Passwörter stimmen nicht überein');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/api/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, password_repeat }),
      });
  
      const data = await response.json();
      
      if (data.success) {
        alert('Registrierung erfolgreich');
        
      } else {
        alert(data.message || 'Registrierung fehlgeschlagen');
      }
    } catch (error) {
      console.error('Fehler bei der Registrierung:', error);
      alert('Ein Fehler ist aufgetreten');
    }
  });

  function logout() {
    // Token und Benutzerdaten aus dem localStorage entfernen
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Benutzer zur Login-Seite umleiten
    window.location.href = 'index.html'; // oder der Name Ihrer Login-Seite
}

// Event-Listener für den Logout-Button hinzufügen
document.getElementById('logoutBtn').addEventListener('click', logout);