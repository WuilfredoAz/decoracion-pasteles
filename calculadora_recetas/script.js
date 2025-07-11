document.addEventListener('DOMContentLoaded', () => {
    const ingredientTypeInput = document.getElementById('ingredientType');
    const ingredientPriceInput = document.getElementById('ingredientPrice');
    const ingredientQuantityStockInput = document.getElementById('ingredientQuantityStock');
    const ingredientQuantityRecipeInput = document.getElementById('ingredientQuantityRecipe');
    const ingredientUnitInput = document.getElementById('ingredientUnit');
    const addIngredientBtn = document.getElementById('addIngredientBtn');
    const ingredientList = document.getElementById('ingredientList');
    const totalIngredientsCostSpan = document.getElementById('totalIngredientsCost');
    const totalPurchaseInvestmentSpan = document.getElementById('totalPurchaseInvestment');
    const operationalExpensesInput = document.getElementById('operationalExpenses');
    const administrativeExpensesInput = document.getElementById('administrativeExpenses');
    const profitMarginInput = document.getElementById('profitMargin');
    const finalSaleCostSpan = document.getElementById('finalSaleCost');

    // Nuevos elementos para mostrar los valores monetarios
    const operationalExpensesValueSpan = document.getElementById('operationalExpensesValue');
    const administrativeExpensesValueSpan = document.getElementById('administrativeExpensesValue');
    const profitMarginValueSpan = document.getElementById('profitMarginValue');

    let ingredients = [];

    // Función para calcular el costo de una unidad base del ingrediente (ej. costo por gramo)
    const calculateUnitPrice = (totalPrice, totalQuantity) => {
        if (totalQuantity === 0) return 0;
        return totalPrice / totalQuantity;
    };

    // Función para calcular el costo del ingrediente para la receta
    const calculateRecipeIngredientCost = (unitPrice, quantityForRecipe) => {
        return unitPrice * quantityForRecipe;
    };

    // Función para renderizar la lista de ingredientes y actualizar los costos totales
    const renderIngredients = () => {
        ingredientList.innerHTML = ''; // Limpiar la lista actual
        let totalRecipeIngredientsCost = 0;
        let totalPurchaseInvestment = 0;

        ingredients.forEach((ingredient, index) => {
            const listItem = document.createElement('li');
            const unitPrice = calculateUnitPrice(ingredient.price, ingredient.quantityStock);
            const costForRecipe = calculateRecipeIngredientCost(unitPrice, ingredient.quantityRecipe);
            totalRecipeIngredientsCost += costForRecipe;
            totalPurchaseInvestment += ingredient.price;

            listItem.innerHTML = `
                <span class="ingredient-details">
                    ${ingredient.type} -
                    ${ingredient.quantityRecipe} ${ingredient.unit} (necesario) @
                    $${unitPrice.toFixed(4)}/${ingredient.unit}
                    <br>
                    <small>(Comprado: ${ingredient.quantityStock} ${ingredient.unit} por $${ingredient.price.toFixed(2)})</small>
                </span>
                <span class="ingredient-cost">$${costForRecipe.toFixed(2)}</span>
                <button class="remove-btn" data-index="${index}">X</button>
            `;
            ingredientList.appendChild(listItem);
        });

        totalIngredientsCostSpan.textContent = totalRecipeIngredientsCost.toFixed(2);
        totalPurchaseInvestmentSpan.textContent = totalPurchaseInvestment.toFixed(2);
        updateFinalSaleCost(); // Actualizar el costo de venta y los valores de gastos/ganancia

        // Añadir event listeners para los botones de eliminar
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const indexToRemove = parseInt(e.target.dataset.index);
                ingredients.splice(indexToRemove, 1); // Eliminar el ingrediente del array
                renderIngredients(); // Volver a renderizar la lista
            });
        });
    };

    // Función para actualizar el costo final de venta y los valores monetarios de gastos/ganancia
    const updateFinalSaleCost = () => {
        const totalIngredientsCost = parseFloat(totalIngredientsCostSpan.textContent);
        const operationalExpensesPercent = parseFloat(operationalExpensesInput.value) || 0;
        const administrativeExpensesPercent = parseFloat(administrativeExpensesInput.value) || 0;
        const profitMarginPercent = parseFloat(profitMarginInput.value) || 0;

        // Calcular gastos operativos y administrativos basados en el costo de los ingredientes
        const operationalCost = totalIngredientsCost * (operationalExpensesPercent / 100);
        const administrativeCost = totalIngredientsCost * (administrativeExpensesPercent / 100);

        // Costo total de producción (ingredientes + gastos)
        const totalProductionCost = totalIngredientsCost + operationalCost + administrativeCost;

        // Calcular el costo de ganancia
        const profitAmount = totalProductionCost * (profitMarginPercent / 100);

        // Calcular el costo final de venta con el margen de ganancia
        const finalCost = totalProductionCost + profitAmount; // Sumamos el monto de la ganancia al costo de producción

        finalSaleCostSpan.textContent = finalCost.toFixed(2);

        // Actualizar los spans de valores monetarios
        operationalExpensesValueSpan.textContent = `( $${operationalCost.toFixed(2)} )`;
        administrativeExpensesValueSpan.textContent = `( $${administrativeCost.toFixed(2)} )`;
        profitMarginValueSpan.textContent = `( $${profitAmount.toFixed(2)} )`;
    };

    // Event listener para agregar un ingrediente
    addIngredientBtn.addEventListener('click', () => {
        const type = ingredientTypeInput.value.trim();
        const price = parseFloat(ingredientPriceInput.value);
        const quantityStock = parseFloat(ingredientQuantityStockInput.value);
        const quantityRecipe = parseFloat(ingredientQuantityRecipeInput.value);
        const unit = ingredientUnitInput.value.trim();

        if (type && !isNaN(price) && price >= 0 &&
            !isNaN(quantityStock) && quantityStock > 0 &&
            !isNaN(quantityRecipe) && quantityRecipe >= 0 && unit) {

            ingredients.push({ type, price, quantityStock, quantityRecipe, unit });
            renderIngredients();

            // Limpiar campos de entrada
            ingredientTypeInput.value = '';
            ingredientPriceInput.value = '';
            ingredientQuantityStockInput.value = '';
            ingredientQuantityRecipeInput.value = '';
            ingredientUnitInput.value = '';
            ingredientTypeInput.focus();
        } else {
            alert('Por favor, ingresa datos válidos para todos los campos. Asegúrate que el "Cantidad en Stock" sea mayor a 0.');
        }
    });

    // Event listeners para los cambios en los porcentajes
    profitMarginInput.addEventListener('input', updateFinalSaleCost);
    operationalExpensesInput.addEventListener('input', updateFinalSaleCost);
    administrativeExpensesInput.addEventListener('input', updateFinalSaleCost);

    // Renderizado inicial
    renderIngredients();
});