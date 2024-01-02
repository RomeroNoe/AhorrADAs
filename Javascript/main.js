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

const allOperations = getData("operations") || []

/* RENDERIZADAS*/

const renderOperations = (operations) => {
    for (const operation of operations) {
        $(".tbody-info-render").innerHTML += `
        <tr>
            <td>${operation.descripcion}</td>
            <td>${operation.categoria}</td>
            <td>${operation.fecha}</td>
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
        descripcion: $("#input-description-text").value,
        categoria: $("#select-category").value,
        fecha: $("#op-input-date").value,
        monto: $("#input-amount").value
    }
    $
}

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