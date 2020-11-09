const addNote = document.getElementById('addNote')
const notesContainer = document.getElementById('notesContainer')
const addNoteModal = document.getElementById('addNoteModal')
const addNoteForm = document.getElementById('addNoteForm')
const noteTitleInput = document.getElementById('noteTitleInput')
const noteBodyInput = document.getElementById('noteBodyInput')

addNoteForm.onsubmit = (e) => {
    e.preventDefault();
    // Traer el banco de notas de localStorage,
    // o array vacio por defecto en caso que no exista.
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const title = noteTitleInput.value;
    const body = noteBodyInput.value;
    //const division = divisionInput.value;

    // Agregar una nota al array .
    notes.push({
        title,
        body,
        //division: division,
    })

    // Guardar el banco de notas en localStorage.
    const notesJson = JSON.stringify(notes);
    localStorage.setItem('notes', notesJson);

    // Limpiar todos los campos del formulario con reset().
    addNoteForm.reset();
    // Cerrar el modal
    $(addNoteModal).modal('hide')
    displayNotes();
}

function displayNotes() {
    // Banco de notas desde de localStorage.
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const content = [];

    for (let i = 0; i < notes.length; i++) {
        // Guardamos los datos de usuario en note.
        const note = notes[i];
        // Creamos en un string el esqueleto de la nota,
        // luego el contenido que ingreso el usuario.
        const newNote = `
        <div class="col-4">
            <div class="card text-white bg-warning mb-3 mx-2 h-100">
                <div class="card-header">${note.title}</div>
                <div class="card-body">
                    <h5 class="card-title">${note.title}</h5>
                    <p class="card-text">${note.body}</p>
                </div>
            </div>
        </div>
        `
        // Agregamos el string de la nota al array content.
        content.push(newNote)
    }
    // Unimos todas las notas en un solo string con join(),
    // y lo insertamos en el contenido de la tabla.
    notesContainer.innerHTML = content.join('')
}

displayNotes();