// Notas
const addNote = document.getElementById('addNote')
const notesContainer = document.getElementById('notesContainer')
const addNoteModal = document.getElementById('addNoteModal')
const addNoteForm = document.getElementById('addNoteForm')
const noteTitleInput = document.getElementById('noteTitleInput')
const noteBodyInput = document.getElementById('noteBodyInput')
let editNoteId = ''
const editNoteForm = document.getElementById('editNoteForm')
//Modal de edición
const editNoteTitleInput = document.getElementById('editNoteTitleInput')
const editNoteBodyInput = document.getElementById('editNoteBodyInput')
//Búsqueda
const searchTop = document.getElementById('searchTop');
const searchForm = document.getElementById('searchForm');
//Categorias
const sidebarCategorias = document.getElementById('sidebarCategorias')

//
//Categorias
//Categoria por defecto
const defaultCategory = [{
    name: "Sin categoria",
    description: "Categoría por defecto",
    color: "brown",
    icon: "horse",
    id: "__________"
}]

const categories = JSON.parse(localStorage.getItem('categories')) || localStorage.setItem('categories', JSON.stringify(defaultCategory))
// if(categories && true){
//     localStorage.setItem('categories', JSON.stringify(defaultCategory));
// }

const addCategory = document.getElementById('addCategory')
const addCategoryModal = document.getElementById('addCategoryModal')
const addCategoryForm = document.getElementById('addCategoryForm')
const categoryNameInput = document.getElementById('categoryNameInput')
const categoryDescriptionInput = document.getElementById('categoryDescriptionInput')

//Función para generar ID aleatorio
const generateId = function() {
    return '_' + Math.random().toString(36).substr(2,9);
}

//Crear nueva nota
addNoteForm.onsubmit = (e) => {
    e.preventDefault();
    // Traer el banco de notas de localStorage,
    // o array vacío por defecto en caso que no exista.
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const body = noteBodyInput.value;    
    const title = noteTitleInput.value;
    //Traigo también el array de categorías, necesario para el select de categorías
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
        lastUpdate: moment().format('lll')
    })

    // Guardar el banco de notas en localStorage.
    const notesJson = JSON.stringify(notes);
    localStorage.setItem('notes', notesJson);

    console.log("addNoteForm.onsubmit -> notes", notes);

    // Limpiar todos los campos del formulario con reset().
    addNoteForm.reset();
    // Cerrar el modal
    $(addNoteModal).modal('hide')
    displayAllNotes();
}

// Función para obtener modal de notas
const getModal = (note) => {
return `<!-- Modal -->
<div class="modal fade" id="modal${note.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header bg-modal">
                <h2 class="modal-title" id="exampleModalLabel">${note.title}</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body bg-modal">
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
            <button type="button" id="editNoteButton" onclick="loadEditForm('${note.id}')" class="btn btn-info" data-toggle="modal" data-target="#editNoteModal"><i class="fas fa-edit"></i></button>
            <button onclick="deleteNote('${note.id}')" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>
</div>
`
}

//Función para cargar los valores en el modal para editar nota
const loadEditForm = (noteId) => {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes.find((v) => v.id ===noteId);
    editNoteTitleInput.value = note.title;
    editNoteBodyInput.value = note.body;
    //Almaceno el ID de la ultima nota modificada
    editNoteId = noteId;

}

editNoteForm.onsubmit = (e) => {
    e.preventDefault()
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const body = editNoteBodyInput.value;    
    const title = editNoteTitleInput.value;

    //Actualizo propiedades de la nota
    const updatedNote = notes.map((v) => {
        if (v.id === editNoteId){
            const note = {
                //Usando spread sintax para copiar las propiedades
                ...v,
                title: title,
                body: body,
                lastUpdate: moment().format('lll')
            }
            return note
        } else {
            return v;
        }
    })
    //Guardo la actualización en LS
    const notesJson = JSON.stringify(updatedNote)
    localStorage.setItem('notes', notesJson);
    editNoteForm.reset();
    displayAllNotes();

    $('.modal-backdrop').remove();
    $(editNoteModal).modal('hide')
}

function displayAllNotes() {
    // Banco de notas desde de localStorage.
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const content = [];

    displayNotes(notes)
}

//Anadir nueva nota en pantalla
function displayNotes(notes) {
    // Banco de notas desde de localStorage.
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const content = [];
    
    for (let i = 0; i < notes.length; i++) {
        // Guardamos los datos de usuario en note.
        const note = notes[i];
        const categoryAux = note.category;
        const categoryColor = categories.filter((u) => ((u.name === categoryAux) ))
        //Transformo el atributo note.createdAt a un formato mas comodo

        // Creamos en un string el esqueleto de la nota,
        // luego el contenido que ingreso el usuario.
        const newNote = `
        <div class="col-12 col-md-6 col-lg-4 my-2" style="min-height:1px;">
        <div class="card text-white bg-light h-100" >
        <button class="p-0 border-0 bg-transparent" id="button${note.id}" data-toggle="modal" data-target="#modal${note.id}">
        <div class="card-header bg-${categoryColor[0].color}">${note.title}</div>
        </button>
        <div class="card-body text-dark">
        <h5 class="card-title">${note.title}</h5>
        <p class="card-text">${note.body}</p>
        </div>
        
        </div>
        </div>
        ${getModal(note)}
        `
        console.log("displayNotes -> categoryAux[0].color", categoryAux[0].color)
        
        // Agregamos el string de la nota al array content.
        content.push(newNote)
    }
    // Unimos todas las notas en un solo string con join(),
    // y lo insertamos en el contenido de la tabla.
    notesContainer.innerHTML = content.join('')
}

displayAllNotes();

//Crear nueva categoria

addCategoryForm.onsubmit = (e) => {
    e.preventDefault();
    noteCategoriesSelect = document.getElementById('noteCategoriesSelect')
    // Traer el banco de categorías de localStorage.
    const categories = JSON.parse(localStorage.getItem('categories'));
    console.log("categories", categories)
    const name = categoryNameInput.value;
    const description = categoryDescriptionInput.value;
    const categoryColor = getSelectedCheckbox('gridRadiosColor')
    const categoryIcon = getSelectedCheckbox('gridRadiosIcon')
    const id = generateId()

    // Agregar una categoría al array de categorías
    categories.push({
        name,
        description,
        color: categoryColor,
        icon: categoryIcon,
        id,
    })

    // Añadir la categoría como opción al select
    const newOption = document.createElement('option')
    newOption.textContent = `${name}`;
    noteCategoriesSelect.appendChild(newOption);

    // Añadir la categoría en sidebar
    const newCat = document.createElement('li')
    newCat.innerHTML= `
    <li id="item${id}">
        <div class="d-flex justify-content-between">
            <button class="btn notid-btn-stone border-0" type="button" data-toggle="collapse" data-target="#${id}" 
            aria-expanded="false" aria-controls="collapseExample">
                ${name}
            </button>
            
            <button class="btn notid-btn-mist border-0" onclick="deleteCategory('${id}')"><i class="fas fa-times"></i></button>
        </div>
        <div class="collapse notid-sidebar-category" id="${id}">
            <div class="card card-body bg-transparent">
                ${description}
                <button class="btn notid-btn-stone border-0" type="button" onclick="categoryFilter('${name}')">
                Filtrar
                </button>
            </div>
        </div>
    </li>
`;
sidebarCategorias.appendChild(newCat);

    // Guardar el banco de categorias en localStorage.
    const categoriesJson = JSON.stringify(categories);
    localStorage.setItem('categories', categoriesJson);

    console.log("addCategoryForm.onsubmit -> categories", categories);

    //displaycategories();

    // Limpiar todos los campos del formulario con reset().
    addCategoryForm.reset();
    // Cerrar el modal
    $(addCategoryModal).modal('hide')
}


function getSelectedCheckbox(name) {
    const checked = document.querySelectorAll(`input[name="${name}"]:checked`)[0].value;
    return checked;
}

//Función para borrar nota y su modal
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
    displayAllNotes();
    $(modalToDelete).modal('hide')
}

//Búsqueda
searchForm.onsubmit = (e) => {
    e.preventDefault();
    // Guardar en una constante el banco de notas
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    // Transformar en minúsculas la palabra buscada y guardarla en una variable.
    const term = searchTop.value.toLowerCase();
    console.log("term", term);
    // Guardar el array resultante de aplicar el método filter sobre el array de usuarios,
    // filtrando para obtener solo los que incluyen la palabra buscada.
    const filteredNotes = notes.filter((u) => (
        // Usar el método toLowerCase() para transformar el nombre y apellido a minúscula,
        // y el método includes() que evalúa si se incluye o no la palabra buscada.
        u.title.toLowerCase().includes(term) || u.body.toLowerCase().includes(term)
    ))
    // Llamar a la función displayNotes, pasando por parámetros la lista filtrada de usuarios.
    displayNotes(filteredNotes);
        console.log(`Se cargó la lista filtrada de usuarios en la tabla. ${filteredNotes.length} resultados encontrados. 🧐`);
}

//Filtro por categorias
categoryFilter = (categoryName) => {
    // Guardar en una constante el banco de notas
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const filteredNotes = notes.filter((u) => ((u.category === categoryName) ))
    console.log("filteredNotes", filteredNotes)
    // Llamar a la función displayNotes, pasando por parámetros la lista filtrada de usuarios.
    displayNotes(filteredNotes);
        console.log(`Se cargó la lista filtrada de usuarios en la tabla. ${filteredNotes.length} resultados encontrados. 🧐`);
}