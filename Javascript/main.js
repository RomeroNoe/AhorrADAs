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

const getData = (key) => JSON.parse(localStorage.getItem(key))
const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data))


const operations = [
    {
        descripcion: "Pizza",
        categoria: "Comida",
        cecha: 05/12/2023,
        monto: -10

    },
    {
        descripcion: "Gasolina",
        categoria: "Auto",
        fecha: 07/12/2023,
        monto: -50

    },
    {
        descripcion: "Salario",
        categoria: "Ingresos",
        fecha: 29/12/2023,
        monto: 1500

    }

]

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
// renderOperations(operations)

/* EVENTOS */

const initializeApp = () => {
    // console.log("initializeApp called")
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
