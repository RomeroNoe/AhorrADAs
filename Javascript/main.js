/* UTILITIES */

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

//const randomId = () => self.crypto.randomUUID()
const randomId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  };

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
//const getData = (key) => JSON.parse(localStorage.getItem(key))

const getData = (key) => {
    if (typeof localStorage !== 'undefined') {
      // Verificar si localStorage está definido
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } 
  };

const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data))




//Date ROMPE TODO DATE PORQUEEEE

// const today = new Date()

// const date = new Date(today.getFullYear(), today.getMonth(), today.getDate())
// $("#op-input-date").valueAsDate = date
// console.log(date)

// const firstDayOfTheMonth = new Date(today.getFullYear(), today.getMonth(), 1)
// $("#since-filter").valueAsDate = firstDayOfTheMonth  //Label Desde / Filtros, es para que aparezca el dia actual cuando se abre el almanaque

/* RENDERS*/

//Renders-Categories

const renderCategoriesOptions = (categories) => {
    cleanContainer("#form-select-category")
    cleanContainer("#select-category")
    $("#form-select-category").innerHTML = `<option value="">Todas</option>`
    for (const {id, name} of categories) {
        $("#form-select-category").innerHTML += `
            <option value="${id}">${name}</option>
        `
        $("#select-category").innerHTML += `
            <option value="${id}">${name}</option>
        `
    }
}

//Necesita TAILWIND

const renderCategoriesTable = (categories) => {
    cleanContainer("#container-categories")
    for (const {id, name} of categories) {
        $("#container-categories").innerHTML += `
            <div class="">
                <p class="">${name}</p>
                <div>
                    <span class="edit-btn" data-id="${id}">Editar</span>
                    <span class="delete-btn" data-id="${id}">Eliminar</span>
                </div>
            </div>`
    }
    getIdButton($$(".edit-btn"), (id) => showEditCategory(id))
    getIdButton($$(".delete-btn"), (id) => deleteCategory(id))
}

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
                <button class="containerEditOperation-btn text-teal-500 hover:text-black" data-id onclick="editForm('${operation.id}')">Editar</i></button>
                <button type="button" class="btn removeOperation-btn text-teal-500 hover:text-black" data-id onclick="ejecutionDeleteBtn('${operation.id}','${operation.description}')" data-bs-toggle="modal" data-bs-target="#delete-modal">Eliminar</i></button>
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
        updateBalance()
    }
}

// Renders- Reports

const renderCategoryResume = (title, categoryType, amount) => {
    const { categoryName, maxAmount } = categoryWithMaxValue(categoryType)
    $(".reports-resume").innerHTML += `
        <li class="">
            <p class="">${title}</p>
            <div class="">
                <span class="">${categoryName}</span>
                <span class=" ${amount < 0 ? 'text-red-600' : amount > 0 ? 'text-green-600' : ''}">${amount > 0 ? '+' : amount < 0 ? '-' : ''}$${Math.abs(maxAmount).toFixed(2)}</span>
            </div>
        </li>`
}


const renderMonthResume = (title, property, amount) => {
    const { maxMonth, maxAmount } = monthWithMaxValue(property)
    $(".reports-resume").innerHTML += `
        <li class="">
            <p class="">${title}</p>
            <div class="">
                <span>${getMonthWithYear(maxMonth.month, maxMonth.year)}</span>
                <span class="${amount < 0 ? 'text-red-600' : 'text-green-600'}">${amount > 0 ? '+' : '-'}$${Math.abs(maxAmount).toFixed(2)}</span>
            </div>
        </li>`
}

// Categoría -> mayor ganancia
const renderCategoryWithMaxIncome = () => renderCategoryResume("Categoría con mayor ganancia", "totalIncome", 1)

// Categoría -> mayor gasto
const renderCategoryWithMaxExpense = () => renderCategoryResume("Categoría con mayor gasto", "totalExpense", -1)

// Categoría -> mayor balance
const renderCategoryWithMaxBalance = () => renderCategoryResume("Categoría con mayor balance", "totalBalance", 0)

// Mes -> mayor ganancia
const renderMonthWithMaxIncome = () => renderMonthResume("Mes con mayor ganancia", "totalIncome", 1)

// Mes -> mayor gasto
const renderMonthWithMaxExpense = () => renderMonthResume("Mes con mayor gasto", "totalExpense", -1)


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
const renderResume = () => {
    cleanContainer(".reports-resume")
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

//UpdateData

const updateBalance = (operations) => {
    const { totalIncome, totalExpense, totalBalance } = calculateBalance(operations)
    $("#total-profit").innerText = `+$${Math.abs(totalIncome).toFixed(2)}`
    $("#total-cost").innerText = `-$${Math.abs(totalExpense).toFixed(2)}`
    let sign = ""
    if (totalBalance > 0) {
        $("#total").classList.add("text-green-600")
        $("#total").classList.remove("text-red-600")
        sign = '+'
    } else if (totalBalance < 0) {
        $("#total").classList.add("text-red-600")
        $("#total").classList.remove("text-green-600")
        sign = '-'
    } else {
        $("#total").classList.remove("text-red-600", "text-green-600")
    }
    $("#total").innerText = `${sign}$${Math.abs(totalBalance).toFixed(2)}`
}

const updateCategories = (categorias) => {
    renderCategoriesTable(categorias)
    renderCategoriesOptions(categorias)
}

const updateReports = () => {
    const operations = getOperations()
    const hasIncome = operations.some(({type}) => type === 'Ganancia')
    const hasExpense = operations.some(({type}) => type === 'Gasto')

    if (hasIncome && hasExpense) {
        showElement([".has-reports"])
        hideElement([".none-reports"])
        operation()
        renderTotalCategories()
        renderTotalMonths()
    } else {
        showElement([".none-reports"])
        hideElement([".has-reports"])
    }
}

const updateData = (updatedCategories, updatedOperations) => {
    const updatedData = { 
        categories: updatedCategories || getCategories(), 
        operations :updatedOperations || getOperations()
    }
    setData("data", updatedData)
    updateCategories(updatedData.categories)
    updateBalance(updatedData.operations)
    renderOperationsTable(updatedData.operations)
     //aca va la parte de los filtros
    updateReports()
}

//const categoriesData = getData("defaultCategories") //localStorage is not defined ERROR

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


<<<<<<< HEAD

=======
>>>>>>> b82def2063005b86a6f0a95e6f8c95783a7c546b
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


// Delete operation

const ejecutionDeleteBtn = (operationId, operationDescription) => {
    $("#btn-remove-operations").setAttribute("data-id", operationId)
    $("#btn-remove-operations").addEventListener("click", () => {
        const operationId = $("#btn-remove-operations").getAttribute("data-id")
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

const clearOperationForm = () => {
    $("#input-description-text").value = ""
    $("#input-amount").value = "0"
    $("#select-type").value = "Gasto"
    $("#op-input-date").valueAsDate = date
}

const getOperationDetails = () => {
    const description = $("#input-description-text").value
    const amount = $("#input-amount").valueAsNumber
    const type = $("#select-type").value
    const category = $("#select-category").value
    const day = $("#op-input-date").valueAsDate
    return { description, amount, type, category, day }
}


const fillOperationForm = (operation) => {
    $("#input-description-text").value = operation.description
    $("#input-amount").value = operation.amount
    $("#select-type").value = operation.type
    $("#select-category").value = operation.category
    $("#op-input-date").valueAsDate = new Date (operation.day)
}


const updateOperation = (operationId) => {
    const updatedOperations = getOperations().map(operation =>
        (operation.id === operationId) ? saveOperation(operationId) : operation
    )
    updateData(null, updatedOperations)
}

const handleEditOperation = () => {
    const operationId = $("#edit-operation").getAttribute("data-id")
    const { description, amount, type, category, day } = getOperationDetails()

    if (description && !isNaN(amount) && type && category && day) {
        updateOperation(operationId)
    } else {
        showElement(["#error-message"])
    }
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
       //error
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
        //error
    }
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

const total = (operationType, operations) => {
    return operations.filter(({type}) => operationType === type).reduce((acc, {amount}) => acc + amount, 0)
}

const resetBalance = () => {
    $("#total-profit").innerHTML = `+$0`
    $("#total-cost").innerHTML = `+$0`
    $("#total").innerHTML = `$0`
}

const calculateBalance = (operations) => {
    const totalIncome = total("Ganancia", operations)
    const totalExpense = total("Gasto", operations)
    const totalBalance = totalIncome - totalExpense

    return { totalIncome, totalExpense, totalBalance }
}

//REPORTS

// Total de ganancias, gastos y balance por mes
const totalAmountByMonth = () => {
    return getoperations().reduce((acc, operation) => {
        const { day, amount, type } = operation
        const operationAmount = type === 'Ganancia' ? amount : -amount
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
        acc[year][month].totalBalance += operationAmount
        return acc
    }, {})
}

// Categoría con mayor valor
const totalAmountByCategory = () => {
    return getoperations().reduce((acc, operation) => {
        const { category, amount, type } = operation
        const operationAmount = type === 'Ganancia' ? amount : -amount

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
        acc[category].totalBalance += operationAmount
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

const categoryWithMaxValue = (property) => {
    const totalAmounts = totalAmountByCategory()
    let maxCategory = Object.keys(totalAmounts)[0]

    for (const category in totalAmounts) {
        if (totalAmounts[category][property] > totalAmounts[maxCategory][property]) {
            maxCategory = category
        }
    }

    const categoryName = getCategoryNameById(maxCategory)
    const maxAmount = totalAmounts[maxCategory][property]

    return { categoryName, maxAmount }
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
   
    // $(".btn-remove-categories").addEventListener("click", () => {
    //     showElement(["#removeCategoryConfirmation"])
        
    // })

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
<<<<<<< HEAD
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
=======
        e.preventDefault()
        const selectedType = e.target.value
    
        if (selectedType === "todos") {
            
            renderOperations(getData("operations"))
        } else {
            
            const currentData = getData("operations")
            const filterOperationType = currentData.filter(operations => operations.type === selectedType)
            renderOperations(filterOperationType)
        }
    })

    $(".form-select-category").addEventListener("input", (e) => {
        e.preventDefault()
        const selectedCategory = e.target.value
        if (selectedCategory === "Todas") {
            renderOperations(getData("operations"))
        } else {
            const currentData = getData("operations")
            const filterOperationCategory = currentData.filter(operation => operation.category === selectedCategory)
            renderOperations(filterOperationCategory)
        }
    })

    $(".input-date").addEventListener("input", (e) => {
        e.preventDefault()
        const selectedDate = new Date(e.target.value)
        const currentDate = new Date()
        
        const currentData = getData("operations")
    
        const filterOperationDate = currentData.filter(operation => {
            const operationDate = new Date(operation.day)
            return operationDate >= selectedDate && operationDate <= currentDate;
        })
    
        renderOperations(filterOperationDate)
    })

    

$(".form-select-order").addEventListener("input", (e) => {
    e.preventDefault()
    const selectedOption = e.target.value;
    const currentData = getData("operations");

    // Sort operations based on the selected option
    let sortedOperations;
    switch (selectedOption) {
        case "Mas reciente":
            sortedOperations = currentData.sort((a, b) => new Date(b.day) - new Date(a.day));
            break;
        case "Menos reciente":
            sortedOperations = currentData.sort((a, b) => new Date(a.day) - new Date(b.day));
            break;
        case "Mayo monto":
            sortedOperations = currentData.sort((a, b) => b.amount - a.amount);
            break;
        case "Menor monto":
            sortedOperations = currentData.sort((a, b) => a.amount - b.amount);
            break;
        case "A-Z":
            sortedOperations = currentData.sort((a, b) => a.description.localeCompare(b.description));
            break;
        case "Z-A":
            sortedOperations = currentData.sort((a, b) => b.description.localeCompare(a.description));
            break;
        default:
            sortedOperations = currentData;
    }

    // Render the sorted operations
    renderOperations(sortedOperations);
})

$(".hide-filters-btn").addEventListener("click", () => {
            hideElement([".form-filtros"])
            hideElement([".hide-filters-btn"])
            showElement([".show-filters-btn"])
            hideElement([".remove-filters-btn"])
        })
$(".show-filters-btn").addEventListener("click", () => {
            showElement([".form-filtros"])
            showElement([".hide-filters-btn"])
            showElement([".remove-filters-btn"])
            hideElement([".show-filters-btn"])
        })
        

// Esto no hay en el tp pero podemos anadir 
    $(".remove-filters-btn").addEventListener("click", () => {
        $(".form-select-category").value = "Todas";
        $(".form-select-tipo").value = "todos";
        $(".input-date").valueAsDate = new Date()
        $(".form-select-order").value = "Mas reciente"
    
        renderOperations(getData("operations"));
>>>>>>> b82def2063005b86a6f0a95e6f8c95783a7c546b
    })
}


if (typeof window !== 'undefined') {
    // Verificar si el objeto window está definido
    window.addEventListener("load", initializeApp);
  } 