function displayCategories() {
     // Banco de categorias desde de localStorage.
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const content = [];
    const selectContent = [];
    noteCategoriesSelect = document.getElementById('noteCategoriesSelect')
    // const name = categoryNameInput.value;
     // const description = categoryDescriptionInput.value;
    for (let i = 0; i < categories.length; i++) {
         // Guardamos los nombres de las categorias en category.
        const category = categories[i];

        const newCategory = `
        <li id="item${category.id}" class="category-item">
            <div class="d-flex justify-content-between">
                <button class="btn notid-btn-stone border-0" type="button" data-toggle="collapse" 
                data-target="#category${category.id}" aria-expanded="false" aria-controls="collapseExample">
                    ${category.name}
                </button>
                
                <button class="btn notid-btn-sidebar border-0 category-item-close" onclick="deleteCategory('${category.id}')" style="color = transparent;">
                <i class="fas fa-times"></i></button>
            </div>
            <div class="collapse notid-sidebar-category" id="category${category.id}">
                <div class="card card-body bg-transparent" style="word-wrap: break-word max-width:80%;">
                    ${category.description}
                </div
            </div>
        </li>
    `
         // Agregamos el string de la nota al array content.
        content.push(newCategory)

        // Añadir la categoría como opción al select
        const newOption = `
        <option>${category.name}</option>
        `
        selectContent.push(newOption)
    }
     // Unimos todas las notas en un solo string con join(),
     // y lo insertamos en el contenido de la tabla.
    sidebarCategorias.innerHTML = content.join('')
    noteCategoriesSelect.innerHTML = selectContent.join('')
}

displayCategories();

//Función para borrar categoria
function deleteCategory(categoryId) {
    // Traer el banco de categorías de localStorage.
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const notes = JSON.parse(localStorage.getItem('notes')) || []
    // Verificar que sea una categoría sin notas
    const categoryToDelete = categories.filter((category) => category.id === categoryId);
    const notesOn = notes.filter((note) => note.category === categoryToDelete[0].name);
    
    if(notesOn.length === 0){
        console.log("deleteCategory -> notesOn.length", notesOn.length)
        // Eliminar la categoría, usando filter() para filtrar por el Id
        // recibido como parámetro.
        const filteredCategories = categories.filter((category) => category.id !== categoryId);
        // Guardar el banco actualizado en localStorage.
        const categoriesJson = JSON.stringify(filteredCategories);
        localStorage.setItem('categories', categoriesJson);
        // Actualizar la lista de notas en html llamando a la función displayNotes(). 
        displayCategories();
    } else{
        alert('No puedes eliminar esta categoría porque contiene al menos una nota')
    }
}