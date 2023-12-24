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
