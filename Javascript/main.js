/* UTILIDADES */

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)


const randomId = () => self.crypto.randomUUID()

const showElement = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.remove('hidden')
    }
}

const hideElement = (selectors) => {
    for (const selector of selectors) {
        $(selector).classList.add('hidden')
    }
}
const cleanContainer = (selector) => $(selector).innerHTML = ""

/*LOCAL STORAGE */
// const getData = (key) => JSON.parse(localStorage.getItem(key)) //// a mi me sale error aqui: localStorage is not defined
// const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data))

// const allOperations = getData("operations") || [] //// a mi me sale error aqui: localStorage is not defined


// Irena: he encontrado una solucion para el localStorage, pero es diferente de lo que hemos hecho en la clase:
const getData = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
    }
};

const setData = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error writing to localStorage:', error);
    }
};


//Date

const setDate = () => {
    const dateInputs = $$("input[type='date']")
    for (const date of dateInputs) {
        date.valueAsDate = new Date()
    }
}

const today = new Date()
const date = new Date(today.getFullYear(), today.getMonth(), today.getDate())
$().valueAsDate = date  //acá va el for del label fecha en Nueva Operación


const firstDayOfTheMonth = new Date(today.getFullYear(), today.getMonth(), 1)
$().valueAsDate = firstDayOfTheMonth  //acá va el for del label Desde de los filtros, es para que aparezca el dia actual cuando se abre el almanaque


//Categories

const defaultCategories = [
            { id: randomId(), name: "Comida" },
            { id: randomId(), name: "Servicios" },
            { id: randomId(), name: "Salidas" },
            { id: randomId(), name: "Educación" },
            { id: randomId(), name: "Transporte" },
            { id: randomId(), name: "Trabajo" }       
]

const allCategories = getData("categories") || defaultCategories
const allOperations = getData("operations") || []


//Add  New Category

const addNewCategory = () => {
    const categoryName = $("#input-add").value
    if (categoryName) {
        const newCategory = {
            id: randomId(),
            name: categoryName,
        }
        const updatedCategories = [...getCategories(), newCategory]
        updateData(updatedCategories, getOperations())
        $("#input-add").value = "" //Acá también va el for del label Nombre del bloque de Categorías
    } else {
    }//En este estaba pensando agregarle un else para poner una ventana de error por si lo deja vacío
}

//Delete Category

const deleteCategory = (categoryId) => {
    const categoryName = getCategoryNameById(categoryId)
    const confirmation = confirm(`¿Estás seguro de eliminar la categoría "${categoryName}"?`)

    if (confirmation) {
        const updatedCategories = getCategories().filter(({id}) => id !== categoryId)
        const updatedOperations = getOperations().filter(({category}) => category !== categoryId)
        updateData(updatedCategories, updatedOperations)
    } else {
    }//Acá tambien podemos ponerle una ventana por si cancela el confirm. (algo tipo "Eliminación de categoria cancelada")
}


//Operations

const getOperationById = (operationId) => getOperations().find(({id}) => id === operationId)


/* RENDERIZADAS*/

const renderOperations = (operations) => {
    for (const operation of operations) {
        $(".tbody-info-render").innerHTML += `
        <tr>
            <td>${operation.description}</td>
            <td>${operation.category}</td>
            <td>${operation.day}</td>
            <td>${operation.monto}</td>
            <td>
                <button class="btn btn-edit" onclick="">Editar</i></button>
                <button type="button" class="btn btn-remove" data-bs-toggle="modal" data-bs-target="#delete-modal">Eliminar</i></button>
            </td>
        </tr>
        `
    }
}



/* Data handlers */
const operationsPlaceholder = []

const saveOperation = () => {
    return{
        id: randomId(),
        description: $("#input-description-text").value,
        category: $("#select-category").value,
        day: $("#op-input-date").value,
        amount: $("#input-amount").valueAsNumber,
        type: $("#select-type").value,
    }
}
//cambié nombres a inglés, y agregué el type

const editForm = () => {
    showElement([".section-newOperation"])
    hideElement([".section-filtros-balance-operaciones"])
    hideElement(["#btn-add-newOp"])
    showElement([".btn-confirm-edit"])


}


/* EVENTOS */

const initializeApp = () => {
    setData("operations", allOperations) 
    renderOperations(allOperations) 
 
    // Navigacion

    $("#btn-newOp").addEventListener("click", () => {
        showElement([".section-newOperation"])
        hideElement([".section-filtros-balance-operaciones"])
    })

    $("#categorias-sheet").addEventListener("click", () => {
        showElement([".section-categories"])
        hideElement([".section-filtros-balance-operaciones", ".section-newOperation", ".section-reports"])
    })

    $("#reportes-sheet").addEventListener("click", () => {
        showElement([".section-reports"])
        hideElement([".section-filtros-balance-operaciones", ".section-categories", ".section-newOperation"])
    })

    $("#balance-sheet").addEventListener("click", () => {
        hideElement([".section-categories", ".section-newOperation", ".section-reports"])
        showElement([".section-filtros-balance-operaciones"])
    })

    $("#btn-cancel-newOp").addEventListener("click", () => {
        hideElement([".section-newOperation"])
        showElement([".section-filtros-balance-operaciones"])
    })

    $("#btn-add-newOp").addEventListener("click", (e) => {
        e.preventDefault()
        const currentData = getData("operations")
        currentData.push(saveOperation())
        setData("operations", currentData)
    })

}
// a mi me sale error: window is not defined, no se por que
window.addEventListener("load", initializeApp)

/*NUEVA OPERACION */

const showOperations = (arrayOperations) => {
    $(".tbody-info-render").innerHTML = "" 
        if (!(arrayOperations.length > 0)) {
            $(".section-operaciones").classList.remove("hidden");
            $(".div-table-container").classList.add("hidden");
         }

    const categoryName = (idCategory) => {
        for(const category of getData("categories")){
          if(idCategory === category.id){
            return(category.category)
          }
        }
      }

    for (const operation of arrayOperations) {    
        $(".tbody-info-render").innerHTML +=

//HAY QUE ACOMODARLO *llora en tailwind*
   `<tr>
        <td class="text-center border-r-6 p-3max-w-[150px]">${operation.descripcion}</td>
        <td class="text-center border-r-6 p-3">
            <p class="bg-slate-300 text-center rounded-md">${categoryName(operation.categoria)}</p>
         </td>
        <td class="text-center border-r-6 p-3">${operation.fecha}</td>
        <td class="text-center border-r-6 p-3" id="num-amount">${operation.monto}</td>
        <td class="p-3 flex flex-col">
            <button class="bg-slate-300 text-center mb-1 border-r-6 rounded-md" onclick="ejecutionOfNewOp('${operation.id}')">Editar</button>
            <button class="bg-slate-300 text-center border-r-6 rounded-md" onclick="ejecutionDeleteBtn('${operation.id}', '${operation.descripcion}')">Eliminar</button>
        </td>
    </tr>
    <tr class="m-28 border-2 border-slate-300"></tr> 
    `
  }
}