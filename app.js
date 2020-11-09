// Notas
const addNote = document.getElementById('addNote')
const notesContainer = document.getElementById('notesContainer')
const addNoteModal = document.getElementById('addNoteModal')
const addNoteForm = document.getElementById('addNoteForm')
const noteTitleInput = document.getElementById('noteTitleInput')
const noteBodyInput = document.getElementById('noteBodyInput')

//
//Categorias
//Categoria por defecto
const defaultCategory = [{
    name: "Sin categoria",
    description: "Categoria por defecto",
    color: "brown",
    icon: "horse"
}]
localStorage.setItem('categories', JSON.stringify(defaultCategory));

const addCategory = document.getElementById('addCategory')
const addCategoryModal = document.getElementById('addCategoryModal')
const addCategoryForm = document.getElementById('addCategoryForm')
const categoryNameInput = document.getElementById('categoryNameInput')
const categoryDescriptionInput = document.getElementById('categoryDescriptionInput')

//Funcion para generar ID aleatorio
const generateId = function() {
    return '_' + Math.random().toString(36).substr(2,9);
}

//Crear nueva nota
addNoteForm.onsubmit = (e) => {
    e.preventDefault();
    // Traer el banco de notas de localStorage,
    // o array vacio por defecto en caso que no exista.
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const body = noteBodyInput.value;
    const title = noteTitleInput.value;
    //Traigo tambien el array de categorias, necesario para el select de categorias
    const categories = JSON.parse(localStorage.getItem('categories'));
    const noteCategoriesSelect = document.getElementById('noteCategoriesSelect').options.selectedIndex;
    const category = categories[noteCategoriesSelect].name;

    // Agregar una nota al array .
    notes.push({
        title,
        body,
        category,
        id: generateId(),
        createdAt: moment().format('lll'),
        lastUpdate: Date.now()
    })

    // Guardar el banco de notas en localStorage.
    const notesJson = JSON.stringify(notes);
    localStorage.setItem('notes', notesJson);

    console.log("addNoteForm.onsubmit -> notes", notes);

    // Limpiar todos los campos del formulario con reset().
    addNoteForm.reset();
    // Cerrar el modal
    $(addNoteModal).modal('hide')
    displayNotes();
}

//Anadir nueva nota en pantalla
function displayNotes() {
    // Banco de notas desde de localStorage.
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const content = [];

    for (let i = 0; i < notes.length; i++) {
        // Guardamos los datos de usuario en note.
        const note = notes[i];
        //Transformo el atributo note.createdAt a un formato mas comodo

        // Creamos en un string el esqueleto de la nota,
        // luego el contenido que ingreso el usuario.
        const newNote = `
        <div class="col-4">
        <div class="card text-white bg-warning h-100">
            <button class="p-0 border-0 bg-transparent" id="button${note.id}" data-toggle="modal" data-target="#modal${note.id}">
                <div class="card-header">${note.title}</div>
                <div class="card-body">
                    <h5 class="card-title">${note.title}</h5>
                    <p class="card-text">${note.body}</p>
                </div>
                <div class="card-footer border-0" style="backgorund-color: inherit;"> <div>
                </button>
        </div>
        </div>
        <!-- Modal -->
                <div class="modal fade" id="modal${note.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header bg-modal">
                                <h2 class="modal-title" id="exampleModalLabel">${note.title}</h2>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body bg-modal" style="word-wrap: break-word;">
                                <h5 class="modal-title" id="exampleModalLabel">${note.category}</h5>
                                <small id="noteBodyHelp" class="form-text text-muted">
                                Creado en ${note.createdAt}.
                                </small>
                                <br>
                                <p>${note.body}</p>
                                <hr>
                                <small id="noteBodyHelp" class="form-text text-muted">
                                Ultima modificación: ${note.createdAt}.
                                </small>
                            </div>
                            <div class="modal-footer bg-modal">
                            <button onclick="deleteNote('${note.id}')" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                            </div>
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

//Crear nueva categoria

addCategoryForm.onsubmit = (e) => {
    e.preventDefault();
    noteCategoriesSelect = document.getElementById('noteCategoriesSelect')
    // Traer el banco de categorias de localStorage.
    const categories = JSON.parse(localStorage.getItem('categories'));
    console.log("categories", categories)
    const name = categoryNameInput.value;
    const description = categoryDescriptionInput.value;
    const categoryColor = getSelectedCheckbox('gridRadiosColor')
    const categoryIcon = getSelectedCheckbox('gridRadiosIcon')

    // Agregar una nota al array de categorias
    categories.push({
        name,
        description,
        color: categoryColor,
        icon: categoryIcon
    })

    // Añadir la categoria como opcion
    const newOption = document.createElement('option')
    newOption.textContent = `${name}`
    noteCategoriesSelect.appendChild(newOption);

    // Guardar el banco de categorias en localStorage.
    const categoriesJson = JSON.stringify(categories);
    localStorage.setItem('categories', categoriesJson);

    console.log("addCategoryForm.onsubmit -> categories", categories);

    // Limpiar todos los campos del formulario con reset().
    addCategoryForm.reset();
    // Cerrar el modal
    $(addCategoryModal).modal('hide')
}

function getSelectedCheckbox(name) {
    const checked = document.querySelectorAll(`input[name="${name}"]:checked`)[0].value;
    return checked;
}

//Funcion para borrar nota y su modal
function deleteNote(noteId) {
    const modalToDelete = document.getElementById('modal'+noteId)
    // Traer el banco de notas de localStorage.
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    // Eliminar la nota, usando filter() para filtrar por le Id
    // recibido como parámetro.
    const filteredNotes = notes.filter((note) => note.id !== noteId);
    // Guardar el banco actualizado en localStorage.
    const notesJson = JSON.stringify(filteredNotes);
    localStorage.setItem('notes', notesJson);
    // Actualizar la lista de notas en html llamando a la función displayNotes(). 
    displayNotes();
    $(modalToDelete).modal('hide')
}