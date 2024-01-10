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

// Renders-Balance

const renderOperations = (operations) => {
    cleanContainer(".tbody-info-render")
    if (operations.length) {
        hideElement([".no-operations"])
        showElement([".div-table-container"])
    for (const operation of operations) {
        $(".tbody-info-render").innerHTML += `
        <tr>
            <td class="sm:px-6">${operation.description}</td>
            <td class="sm:px-6">${operation.category}</td>
            <td class="sm:px-6">${operation.day}</td>
            <td class="sm:px-6">${operation.amount}</td>
            <td>
                <button class="containerEditOperation-btn text-teal-500 hover:text-black" onclick="editForm('${operation.id}')">Editar</i></button>
                <button type="button" class="btn removeOperation-btn text-teal-500 hover:text-black" onclick="ejecutionDeleteBtn('${operation.id}','${operation.description}')" data-bs-toggle="modal" data-bs-target="#delete-modal">Eliminar</i></button>
            </td>
        </tr>
        `
    }
    } else {
        showElement([".no-operations"])
        hideElement([".div-table-container"])
    }
    $(".form-select-category").innerHTML += `

    `
}
    




const renderCategory = (arrayCategorys) => {
    clear("#container-categories");
    for (const categorie of arrayCategorys) {
      just(
        "#container-categories"
      ).innerHTML += `<li class="">
      <p
          class=" ">
          ${categorie.category}</p>
      <div class="">
          <button class="edit" onclick="editCategory('${categorie.id}')" >Editar</button>
          <button  class="btn-remove-categories" onclick="viewChangeRemove('${categorie.id}'  , '${categorie.category}')">Eliminar</button>
      </div> `;
  
      just(
        "#form-select-category"
      ).innerHTML += `<option value="${categorie.id}">${categorie.category}</option>`;
      just(
        "#select-category"
      ).innerHTML += `<option value="${categorie.id}">${categorie.category}</option>`;
    }
  };

  const renderBalance = () => {
    if(getData("operationsLS") === "[]"){
        resetBalance()
    }
    else {
        updatedBalance()
    }
}

// Renders- Reports
const renderCategorySummary = (title, categoryType, amount) => {
    const { categoryName, maxAmount } = categoryWithMaxValue(categoryType)
    $(".reports-summary").innerHTML += `
        <li class="">
            <p class="">${title}</p>
            <div class="">
                <span class="">${categoryName}</span>
                <span class=" ${amount < 0 ? 'text-red-600' : amount > 0 ? 'text-green-600' : ''}">${amount > 0 ? '+' : amount < 0 ? '-' : ''}$${Math.abs(maxAmount).toFixed(2)}</span>
            </div>
        </li>`
}


const renderMonthSummary = (title, property, amount) => {
    const { maxMonth, maxAmount } = monthWithMaxValue(property)
    $(".reports-summary").innerHTML += `
        <li class="">
            <p class="">${title}</p>
            <div class="">
                <span>${getMonthWithYear(maxMonth.month, maxMonth.year)}</span>
                <span class="${amount < 0 ? 'text-red-600' : 'text-green-600'}">${amount > 0 ? '+' : '-'}$${Math.abs(maxAmount).toFixed(2)}</span>
            </div>
        </li>`
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

//Recargar Resumen
const renderSummary = () => {
    cleanContainer(".reports-summary")
    renderCategoryWithMaxIncome()
    renderCategoryWithMaxExpense()
    renderCategoryWithMaxBalance()
    renderMonthWithMaxIncome()
    renderMonthWithMaxExpense()
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

// /* Data handlers */ - (Save and delete data)
const getOperationById = (operationId) => getOperations().find(({id}) => id === operationId)


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
// No estoy segura si hace falta anadir esto: 

const saveCategory = () => {
    return {
        id: randomId().value,
        name: $("#input-add"),
    }   
}



// Delete operation

const ejecutionDeleteBtn = (operationId, operationDescription) => {
    $(".btn-confirm-delete-operation").setAttribute("data-id", operationId)
    $(".description").innerText = `${operationDescription}`
    $(".btn-confirm-delete-operation").addEventListener("click", () => {
        const operationId = $(".btn-confirm-delete-operation").getAttribute("data-id")
        deleteOperation(operationId);
        showOperations(getData("operations"));

    });
}

const deleteOperation = (operationId) => {
    const currentData = getData("operations").filter(operation => operation.id != operationId);
    setData("operations", currentData);
    window.location.reload()

}

// <!-- Operaciones -->

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

//Obtener categoría por ID

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

const addNewCategory = () => {
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
        showElement(["#error-message"])

    }
}

//Delete Category
//btn-remove-categories ¿?

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

const modifyCategory = (categoryId) => {
    return {
        id: categoryId,
        name: $('#editCategoryName').value,
    }
}

const showEditCategory = (categoryID) => {
    showScreens("EditCategory")
    $(".containerEditCategory").setAttribute("data-id" , categoryID)
    const categoryToEdit = getData("categories").find(category => category.id === categoryID)
    $("#editCategoryName").value = categoryToEdit.name
}

const editCategory = () => {
    const categoryId = $(".containerEditCategory").getAttribute("data-id")
    const currentData = getData("categories").map(category => {
        if (category.id === categoryId) {
            return modifyCategory(categoryId)
        }
        return category
    })
    setData("categories", currentData)
    renderCategories(currentData)
    renderCategoriesOptions(currentData)
    renderInputCategoriesOptions(currentData)
    $("#editCategoryButton").setAttribute("disabled" , true)
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
// He movido esto a los RENDERS 
// const renderBalance = () => {
//     if(getData("operationsLS") === "[]"){
//         resetBalance()
//     }
//     else {
//         updatedBalance()
//     }
// }

const calculateBalance = (transactions) => {
    const totalIncome = total("Ganancia", transactions)
    const totalExpense = total("Gasto", transactions)
    const totalBalance = totalIncome - totalExpense

    return { totalIncome, totalExpense, totalBalance }
}

//REPORTS

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

// //Me habia olvidado de agregar estas funciónes, a las que llamo abajo. Hay que ponerle TAILWIND es lo que se imprime en el resumen (summary) en la tabla de reportes.

// He movido esto a los RENDERS:

// const renderCategorySummary = (title, categoryType, amount) => {
//     const { categoryName, maxAmount } = categoryWithMaxValue(categoryType)
//     $(".reports-summary").innerHTML += `
//         <li class="">
//             <p class="">${title}</p>
//             <div class="">
//                 <span class="">${categoryName}</span>
//                 <span class=" ${amount < 0 ? 'text-red-600' : amount > 0 ? 'text-green-600' : ''}">${amount > 0 ? '+' : amount < 0 ? '-' : ''}$${Math.abs(maxAmount).toFixed(2)}</span>
//             </div>
//         </li>`
// }


// const renderMonthSummary = (title, property, amount) => {
//     const { maxMonth, maxAmount } = monthWithMaxValue(property)
//     $(".reports-summary").innerHTML += `
//         <li class="">
//             <p class="">${title}</p>
//             <div class="">
//                 <span>${getMonthWithYear(maxMonth.month, maxMonth.year)}</span>
//                 <span class="${amount < 0 ? 'text-red-600' : 'text-green-600'}">${amount > 0 ? '+' : '-'}$${Math.abs(maxAmount).toFixed(2)}</span>
//             </div>
//         </li>`
// }

// // Categoría -> mayor ganancia
// const renderCategoryWithMaxIncome = () => renderCategorySummary("Categoría con mayor ganancia", "totalIncome", 1)

// // Categoría -> mayor gasto
// const renderCategoryWithMaxExpense = () => renderCategorySummary("Categoría con mayor gasto", "totalExpense", -1)

// // Categoría -> mayor balance
// const renderCategoryWithMaxBalance = () => renderCategorySummary("Categoría con mayor balance", "totalBalance", 0)

// // Mes -> mayor ganancia
// const renderMonthWithMaxIncome = () => renderMonthSummary("Mes con mayor ganancia", "totalIncome", 1)

// // Mes -> mayor gasto
// const renderMonthWithMaxExpense = () => renderMonthSummary("Mes con mayor gasto", "totalExpense", -1)



// // Carga por categorías NECESITA TAILWIND
// const renderTotalCategories = () => {
//     const totalsByCategory = totalAmountByCategory()
//     cleanContainer(".reports-categories")
//     for (const category in totalsByCategory) {
//         const { totalIncome, totalExpense, totalBalance } = totalsByCategory[category]
//         $(".reports-categories").innerHTML += `
//             <tr>
//                 <td class="">${getCategoryNameById(category)}</td>
//                 <td class="">+$${totalIncome.toFixed(2)}</td>
//                 <td class="">-$${totalExpense.toFixed(2)}</td>
//                 <td class="">$${totalBalance.toFixed(2)}</td>
//             </tr>`
//     }
// }

// //Recargar Resumen
// const renderSummary = () => {
//     cleanContainer(".reports-summary")
//     renderCategoryWithMaxIncome()
//     renderCategoryWithMaxExpense()
//     renderCategoryWithMaxBalance()
//     renderMonthWithMaxIncome()
//     renderMonthWithMaxExpense()
// }


// // Carga por mes NECESITA TAILWIND
// const renderTotalMonths = () => {
//     const totalsByMonth = totalAmountByMonth()
//     cleanContainer(".reports-months")
//     for (const year in totalsByMonth) {
//         for (const month in totalsByMonth[year]) {
//             const { totalIncome, totalExpense, totalBalance } = totalsByMonth[year][month]
//             $(".reports-months").innerHTML += `
//                 <tr>
//                     <td class="">${getMonthWithYear(month, year)}</td>
//                     <td class="">+$${totalIncome.toFixed(2)}</td>
//                     <td class="">-$${totalExpense.toFixed(2)}</td>
//                     <td class="">$${totalBalance.toFixed(2)}</td>
//                 </tr>`
//         }
//     }
// }

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


/* VALIDATIONS */

// Categories
    // $("#categoriesInput").addEventListener("input" , () => {
    //     validateCategoriesForm("#categoriesInput" , "#errorNewCategory" , "#addCategoryButton")
    // })
    // $("#editCategoryName").addEventListener("input" , () => {
    //     validateCategoriesForm("#editCategoryName" , "#errorEditCategory" , "#editCategoryButton")
    // })   


/* EVENTS */

const initializeApp = () => {
    setData("operations", allOperations) 
    setData("categories", allCategories)
    renderOperations(allOperations) 
    addNewCategory(allCategories)
 
    // Navigation Buttons - Header buttons

    $(".menu-hamburgesa").addEventListener("click", () => {
        $(".fa-bars").classList.toggle("hidden")
        $(".fa-xmark").classList.toggle("hidden")
        $(".dropdown-menu").classList.toggle("hidden")
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

    $("#categorias-sheet-drop").addEventListener("click", () => {
        showElement([".section-categories"])
        hideElement([".section-filtros-balance-operaciones", ".section-newOperation", ".section-reports"])
    })

    $("#reportes-sheet-drop").addEventListener("click", () => {
        showElement([".section-reports"])
        hideElement([".section-filtros-balance-operaciones", ".section-categories", ".section-newOperation"])
    })

    $("#balance-sheet-drop").addEventListener("click", () => {
        hideElement([".section-categories", ".section-newOperation", ".section-reports"])
        showElement([".section-filtros-balance-operaciones"])
    })

    // Action Buttons:

    // New Operation Button

    $("#btn-newOp").addEventListener("click", () => {
        showElement([".section-newOperation", "#btn-add-newOp"])
        hideElement([".section-filtros-balance-operaciones", ".btn-confirm-edit"])
    })

    // New/Edit Operation Form Buttons

    $("#btn-add-newOp").addEventListener("click", (e) => {
        e.preventDefault()
        const currentData = getData("operations")
        currentData.push(saveOperation())
        setData("operations", currentData)
        hideElement([".section-newOperation"])
        showElement([".section-filtros-balance-operaciones"])
        window.location.reload()
    })

    $("#btn-cancel-newOp").addEventListener("click", () => {
        hideElement([".section-newOperation"])
        showElement([".section-filtros-balance-operaciones"])
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

    // Delete Operation 
    $(".removeOperation-btn").addEventListener("click", () => {
        showElement(["#removeOperationConfirmation"])
    })

    $(".btn-cancel-delete-operation").addEventListener("click", () => {
        hideElement(["#removeOperationConfirmation"])
    })

    $(".btn-confirm-delete-operation").addEventListener("click", () => {
        const operationIdToDelete = $(".btn-confirm-delete-operation").getAttribute("data-operation-id");
        if (operationIdToDelete) {
            deleteOperation(operationIdToDelete)
            hideElement(["#removeOperationConfirmation"])
            window.location.reload()
        }
    })

    // Categories
    // Add Category

    $("#btn-add-categories").addEventListener("click", (e) => {
        e.preventDefault()
        addNewCategory()
    })

    // Delete category
   
    $(".btn-remove-categories").addEventListener("click", () => {
        showElement(["#removeCategoryConfirmation"]);
        console.log($(".btn-remove-categories"))
    })

    // $(".btn-cancel-delete").addEventListener("click", () => {
    //     hideElement(["#removeCategoryConfirmation"])
    // })

    $(".btn-confirm-delete").addEventListener("click", () => {
        const categoryIdToDelete = $(".btn-confirm-delete").getAttribute("data-category-id");
        if (categoryIdToDelete) {
            deleteCategory(categoryIdToDelete)
            hideElement(["#removeCategoryConfirmation"])
            window.location.reload()
        }
    })
    ;  // Check if this selects the correct button
console.log($(".btn-cancel-delete"));      // Check if this selects the correct button
console.log($(".btn-confirm-delete"))

    // Filters

    $(".form-select-tipo").addEventListener("input", (e) => {
        const operationId = e.target.value
        const currentData = getData("operations")
        const filterOperations = currentData.filter(operation => operation.type === operationId)
        renderOperations(filterOperations)
    })

    $(".form-select-category").addEventListener("input", (e) => {
        const operationId = e.target.value
        const currentData = getData("operations")
        const filterOperations = currentData.filter(operation => operation.category === operationId)
        renderOperations(filterOperations)
    })
}

window.addEventListener("load", initializeApp)