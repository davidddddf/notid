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
        createdAt: Date.now(),
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