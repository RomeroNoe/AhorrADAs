/* UTILITIES */

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


//Date

// const setDate = () => {
//     const dateInputs = $$("input[type='date']")
//     for (const date of dateInputs) {
//         date.valueAsDate = new Date()
//     }
// }

// const today = new Date()
// const date = new Date(today.getFullYear(), today.getMonth(), today.getDate())
// $("#op-input-date").valueAsDate = date  //Label fecha / Nueva Operación


// const firstDayOfTheMonth = new Date(today.getFullYear(), today.getMonth(), 1)
// $("#since-filter").valueAsDate = firstDayOfTheMonth  //Label Desde / Filtros, es para que aparezca el dia actual cuando se abre el almanaque

/* RENDERS*/

const renderOperations = (operations) => {
    for (const operation of operations) {
        $(".tbody-info-render").innerHTML += `
        <tr>
            <td>${operation.description}</td>
            <td>${operation.category}</td>
            <td>${operation.day}</td>
            <td>${operation.amount}</td>
            <td>
                <button class="btn btn-edit text-teal-500 hover:text-black" onclick="editForm('${operation.id}')">Editar</i></button>
                <button type="button" class="btn btn-remove text-teal-500 hover:text-black" onclick="ejecutionDeleteBtn('${operation.id}','${operation.description}')" data-bs-toggle="modal" data-bs-target="#delete-modal">Eliminar</i></button>
            </td>
        </tr>
        `
    }
}


/* Data handlers */
const operationsPlaceholder = []
const categoriesPlaceholder = []


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


//Operations

const getOperationById = (operationId) => getOperations().find(({id}) => id === operationId)
/* Add new operation */

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

   `<tr>
        <td class="text-center border-r-6 p-3max-w-[150px]">${operation.description}</td>
        <td class="text-center border-r-6 p-3">
            <p class="bg-slate-300 text-center rounded-md">${categoryName(operation.categoria)}</p>
         </td>
        <td class="text-center border-r-6 p-3">${operation.day}</td>
        <td class="text-center border-r-6 p-3" id="num-amount">${operation.amount}</td>
        <td class="p-3 flex flex-col">
            <button class="bg-slate-300 text-center mb-1 border-r-6 rounded-md" onclick="ejecutionOfNewOp('${operation.id}')">Editar</button>
            <button class="bg-slate-300 text-center border-r-6 rounded-md" onclick="ejecutionDeleteBtn('${operation.id}', '${operation.description}')">Eliminar</button>
        </td>
    </tr>
    <tr class="m-28 border-2 border-slate-300"></tr> 
    `
  }
}

// Delete operation

const ejecutionDeleteBtn = (operationId, operationDescription) => {
    $(".btn-remove").setAttribute("data-id", operationId);
    $(".description").innerText = `${operationDescription}`;
    $(".btn-remove").addEventListener("click", () => {
        const operationId = $(".btn-remove").getAttribute("data-id")
        deleteOperation(operationId);
        showOperations(getData("operations"));

    });
}

const deleteOperation = (operationId) => {
    const currentData = getData("operations").filter(operation => operation.id != operationId);
    setData("operations", currentData);
    window.location.reload()

}

// Edit Form

const editForm = (operationId) => {
    hideElement([".section-filtros-balance-operaciones", "#btn-add-newOp"])
    showElement([".section-newOperation", ".btn-confirm-edit"])
    $(".btn-confirm-edit").setAttribute("data-id", operationId)
    const operationEdit = getData("operations").find(operation => operation.id === operationId)
    $("#input-description-text").value = operationEdit.description
    $("#select-category").value = operationEdit.category
    $("#op-input-date").value = operationEdit.day
    $("#input-amount").value = operationEdit.amount
    $("#select-type").value = operationEdit.type

}




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


//Obtener categoría por ID

const getCategoryNameById = (categoryId) => {
    const categorySelected = getCategories().find(({id}) => id === categoryId)
    return categorySelected ? categorySelected.name : ''
}

//Add  New Category

const addNewCategory = (categories) => {
    const categoryName = $("#input-add").value
    if (categoryName) {
        const newCategory = {
            id: randomId(),
            name: categoryName,
        }
        const updatedCategories = [...getCategories(), newCategory]
        updateData(updatedCategories, getOperations())
        $("#input-add").value = "" 
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

//Edit Category

const viewEditCategory = (categoryId) => {
    hiddenElement(["#section-newOperation", "#section-reports", "#section-categories", "#section-balance"])
    $("#edit-category-section").classList.remove('hidden')

    const categoryToEdit = getData("categories").find(category => category.id === categoryId);
    $("#edit-input-category").value = categoryToEdit.categoryName;
    $("#edit-category-btn").setAttribute("id-category-selected", categoryId);
}

const confirmEditCategory = () => {
    const categoryId = $("#edit-btn-category").getAttribute("id-category-selected");
    const updatedCategories = getData("categories").map(category => {
        if (category.id === categoryId) {
            category.categoryName = $("#edit-input-category").value;
        }
        return category;
    });
    
    setData('categories', updatedCategories);
    categoriesList(categories)
}


/*BALANCE*/

const balanceCostProfit = (array, tipo) => {

    const filterOperation = array.filter((arr) => {
        return arr.tipo === tipo && arr
    })
    const spent = filterOperation.reduce((acc, arr) => {
        return acc + Number(arr.monto)
    }, 0)
    return spent
}
// Irena: Lo comente porque estaba rompiendo la funcion de los botones
// const totalBalance = balanceCostProfit(operations, "revenue") - balanceCostProfit(operations, "spent")

const updatedBalance = () => {
    $("#total-profit").innerHTML = `+$${balanceCostProfit(operations, "revenue")}`
    $("#total-cost").innerHTML = `+$${balanceCostProfit(operations, "spent")}`
    $("#total").innerHTML = `$${totalBalance}`
}

const resetBalance = () => {
    $("#total-profit").innerHTML = `+$0`
    $("#total-cost").innerHTML = `+$0`
    $("#total").innerHTML = `$0`
}

const renderBalance = () => {
    if(getData("operationsLS") === "[]"){
        resetBalance()
    }
    else {
        updatedBalance()
    }
}

const calculateBalance = (transactions) => {
    const totalIncome = total("Ganancia", transactions)
    const totalExpense = total("Gasto", transactions)
    const totalBalance = totalIncome - totalExpense

    return { totalIncome, totalExpense, totalBalance }
}



/* EVENTS */

const initializeApp = () => {
    setData("operations", allOperations) 
    setData("categories", allCategories)
    renderOperations(allOperations) 
    addNewCategory(allCategories)
 
    // Navigation 

    $("#btn-newOp").addEventListener("click", () => {
        showElement([".section-newOperation", "#btn-add-newOp"])
        hideElement([".section-filtros-balance-operaciones", ".btn-confirm-edit"])
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

    // Action buttons

    $("#btn-cancel-newOp").addEventListener("click", () => {
        hideElement([".section-newOperation"])
        showElement([".section-filtros-balance-operaciones"])
    })

    $("#btn-add-newOp").addEventListener("click", (e) => {
        e.preventDefault()
        const currentData = getData("operations")
        currentData.push(saveOperation())
        setData("operations", currentData)
        hideElement([".section-newOperation"])
        showElement([".section-filtros-balance-operaciones"])
        window.location.reload()
    })

    $(".btn-confirm-edit").addEventListener("click", (e) => {
        e.preventDefault()
        const operationId = $(".btn-confirm-edit").getAttribute("data-id")
        const currentData = getData("operations").map( operation => {
            if(operation.id === operationId) {
                return saveOperation(operationId)
            }
            return operation
        })
        setData("operations", currentData )
        window.location.reload()

    })

    $("#btn-add-categories").addEventListener("click", (e) => {
        e.preventDefault()
        addNewCategory();
    })




}

window.addEventListener("load", initializeApp)



//Reports

// Total de ganancias, gastos y balance por mes
const totalAmountByMonth = () => {
    return getTransactions().reduce((acc, transaction) => {
        const { day, amount, type } = transaction
        const transactionAmount = type === 'Ganancia' ? amount : -amount
        const year = new Date(day).getFullYear()
        const month = new Date(day).getMonth()

        if (!acc[year]) {
            acc[year] = {}
        }
        if (!acc[year][month]) {
            acc[year][month] = {
                totalIncome: 0,
                totalExpense: 0,
                totalBalance: 0,
            }
        }
        if (type === 'Ganancia') {
            acc[year][month].totalIncome += amount
        } else {
            acc[year][month].totalExpense += amount
        }
        acc[year][month].totalBalance += transactionAmount
        return acc
    }, {})
}

// Categoría con mayor valor
const totalAmountByCategory = () => {
    return getTransactions().reduce((acc, transaction) => {
        const { category, amount, type } = transaction
        const transactionAmount = type === 'Ganancia' ? amount : -amount

        if (!acc[category]) {
            acc[category] = {
                totalIncome: 0,
                totalExpense: 0,
                totalBalance: 0,
            }
        }
        if (type === 'Ganancia') {
            acc[category].totalIncome += amount
        } else {
            acc[category].totalExpense += amount
        }
        acc[category].totalBalance += transactionAmount
        return acc
    }, {})
}


// Mes con mayor valor
const monthWithMaxValue = (property) => {
    const totalAmounts = totalAmountByMonth()
    let maxMonth = { year: null, month: null }
    let maxAmount = null

    for (const year in totalAmounts) {
        for (const month in totalAmounts[year]) {
            const currentAmount = totalAmounts[year][month][property]
            if (maxAmount === null || currentAmount > maxAmount) {
                maxAmount = currentAmount
                maxMonth = { year, month }
            }
        }
    }
    return { maxMonth, maxAmount }
}

// Categoría -> mayor ganancia
const renderCategoryWithMaxIncome = () => renderCategorySummary("Categoría con mayor ganancia", "totalIncome", 1)

// Categoría -> mayor gasto
const renderCategoryWithMaxExpense = () => renderCategorySummary("Categoría con mayor gasto", "totalExpense", -1)

// Categoría -> mayor balance
const renderCategoryWithMaxBalance = () => renderCategorySummary("Categoría con mayor balance", "totalBalance", 0)

// Mes -> mayor ganancia
const renderMonthWithMaxIncome = () => renderMonthSummary("Mes con mayor ganancia", "totalIncome", 1)

// Mes -> mayor gasto
const renderMonthWithMaxExpense = () => renderMonthSummary("Mes con mayor gasto", "totalExpense", -1)



// Carga por categorías NECESITA TAILWIND
const renderTotalCategories = () => {
    const totalsByCategory = totalAmountByCategory()
    cleanContainer(".reports-categories")
    for (const category in totalsByCategory) {
        const { totalIncome, totalExpense, totalBalance } = totalsByCategory[category]
        $(".reports-categories").innerHTML += `
            <tr>
                <td class="">${getCategoryNameById(category)}</td>
                <td class="">+$${totalIncome.toFixed(2)}</td>
                <td class="">-$${totalExpense.toFixed(2)}</td>
                <td class="">$${totalBalance.toFixed(2)}</td>
            </tr>`
    }
}

// Carga por mes NECESITA TAILWIND
const renderTotalMonths = () => {
    const totalsByMonth = totalAmountByMonth()
    cleanContainer(".reports-months")
    for (const year in totalsByMonth) {
        for (const month in totalsByMonth[year]) {
            const { totalIncome, totalExpense, totalBalance } = totalsByMonth[year][month]
            $(".reports-months").innerHTML += `
                <tr>
                    <td class="">${getMonthWithYear(month, year)}</td>
                    <td class="">+$${totalIncome.toFixed(2)}</td>
                    <td class="">-$${totalExpense.toFixed(2)}</td>
                    <td class="">$${totalBalance.toFixed(2)}</td>
                </tr>`
        }
    }
}

// Actualiza reportes

const updateReports = () => {
    const transactions = getTransactions()
    const hasIncome = transactions.some(({type}) => type === 'Ganancia')
    const hasExpense = transactions.some(({type}) => type === 'Gasto')

    if (hasIncome && hasExpense) {
        showElement([".has-reports"])
        hideElement([".none-reports"])
        renderSummary()
        renderTotalCategories()
        renderTotalMonths()
    } else {
        showElement([".none-reports"])
        hideElement([".has-reports"])
    }
}

//commit 6-1"Funcionalidades de Reportes, Tabla de reportes a rendeerizar en el html, Editar categoría en el html y funcionalidad en js, reder/total/reset/update de balance"