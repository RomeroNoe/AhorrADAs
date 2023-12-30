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

const getData = (key) => JSON.parse(localStorage.getItem(key))
const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data))

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
                <button class="btn btn-success">Editar</i></button>
                <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delete-modal">Eliminar</i></button>
            </td>
        </tr>
        `
    }
}



/* EVENTOS */

const initializeApp = () => {
 
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
        const newOperation = saveOperation()
    })

}
// a mi me sale error: window is not defined, no se por que
window.addEventListener("load", initializeApp)

/* Data handlers */
const operationsPlaceholder = []

const saveOperation = (operationID) => {
    return{
        id: operationID ? operationID : randomId(),
        descripcion: $("#input-description-text").value,
        categoria: $("#select-category").value,
        fecha: $("#op-input-date").value,
        monto: $("#input-amount").value
    }
}

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