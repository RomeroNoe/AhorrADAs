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

/* EVENTOS */

const initializeApp = () => {
    console.log("initializeApp called")
    // Cambios de pantallas
    $("#categorias-sheet").addEventListener("click", () => {
        showElement(".section-categories");
        hideElement([".section-filtros", ".section-operaciones"]);
    });

    $("#reportes-sheet").addEventListener("click", () => {
        showElement(".section-operaciones");
        hideElement([".section-filtros", ".section-categories"]);
    });

    $("#filtros-sheet").addEventListener("click", () => {
        showElement(".section-filtros");
        hideElement([".section-categories", ".section-operaciones"]);
    });
};


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

         just(".tbody-info-render").innerHTML +=

    `<tr>
        <td class="text-center border-r-6 p-3 border-transparent max-w-[150px] whitespace-normal break-words">${operation.descripcion}</td>
        <td class="text-center border-r-6 p-3 border-transparent">
            <p class="bg-slate-300 text-center rounded-md">${categoryName(operation.categoria)}</p>
         </td>
        <td class="text-center border-r-6 p-3 border-transparent">${operation.fecha}</td>
        <td class="text-center border-r-6 p-3 border-transparent break-all" id="num-amount">${operation.monto}</td>
        <td class="p-3 flex flex-col">
            <button class="bg-slate-300 text-center mb-1 border-r-6 border-transparent rounded-md" onclick="ejecutionOfNewOp('${operation.id}')">Editar</button>
            <button class="bg-slate-300 text-center border-r-6 border-transparent rounded-md" onclick="ejecutionDeleteBtn('${operation.id}', '${operation.descripcion}')">Eliminar</button>
        </td>
    </tr>
    <tr class="m-28 border-2 border-slate-300"></tr> 
    `
  }
}