// Fügen Sie diese Funktionen am Anfang der Datei hinzu
function getToken() {
  return localStorage.getItem('token');
}

function fetchTasks() {
  fetch('http://localhost:3000/api/tasks', {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  })
    .then(response => response.json())
    .then(tasks => {
      const itemList = document.getElementById("itemList");
      itemList.innerHTML = '';
      tasks.forEach(task => addItemToList(task.id, task.task_description, task.is_completed));
      updateItemCount();
      updateCheckedCount();
    })
    .catch(error => console.error('Error:', error));
}

// Ersetzen Sie die bestehende addItem Funktion durch diese
function addItem() {
  const input = document.getElementById("inputText");
  const text = input.value.trim();
  if (text !== "") {
    fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ task: text })
    })
      .then(response => response.json())
      .then(data => {
        addItemToList(data.id, text, false);
        input.value = "";
        updateItemCount();
      })
      .catch(error => console.error('Error:', error));
  } else {
    alert("Bitte geben Sie einen Artikel ein.");
  }
}

// Fügen Sie diese neue Funktion hinzu
function addItemToList(id, text, isCompleted) {
  const itemList = document.getElementById("itemList");
  const newRow = itemList.insertRow();
  const cell1 = newRow.insertCell(0);
  const cell2 = newRow.insertCell(1);
  const cell3 = newRow.insertCell(2);
  
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isCompleted;
  checkbox.onclick = function() {
    updateTaskStatus(id, this.checked);
  };
  
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Löschen";
  deleteButton.id = "deleteButtonId";
  deleteButton.onclick = function() {
    deleteTask(id, newRow);
  };
  
  cell1.appendChild(checkbox);
  cell2.textContent = text;
  cell3.appendChild(deleteButton);
}

// Fügen Sie diese neuen Funktionen hinzu
function updateTaskStatus(id, isCompleted) {
  fetch(`http://localhost:3000/api/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ is_completed: isCompleted })
  })
    .then(response => response.json())
    .then(() => updateCheckedCount())
    .catch(error => console.error('Error:', error));
}

function deleteTask(id, row) {
  fetch(`http://localhost:3000/api/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  })
    .then(response => response.json())
    .then(() => {
      row.remove();
      updateItemCount();
      updateCheckedCount();
    })
    .catch(error => console.error('Error:', error));
}

// Ändern Sie die window.onload Funktion
window.onload = function() {
  fetchTasks();
  handleWindowSize();
};

function handleWindowSize() {
  let container = document.getElementById('footer');
  if (container && window.innerWidth <= 700) {
    container.parentElement.removeChild(container);
  }
}