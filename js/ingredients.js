
let allIngredients = [];
let addedIngredients = [];
let unwantedIngredients = [];

let desiredCocktails = [];
let intersect = [];


function ajaxListIngredients() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        let responseAjax = this.responseText;
        onloadAjaxListIngredients(responseAjax);
    }
    xhttp.open("GET", "https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list");
    xhttp.send();
}




function onloadAjaxListIngredients(responseAjax) {
    convertToArrayIngredients(responseAjax);
    generateDatalistDivs();
}




function convertToArrayIngredients(responseAjax) {
    responseAjax = JSON.parse(responseAjax);
    responseAjax.drinks.forEach((element) => {
        allIngredients.push(element.strIngredient1);
    });
}




function generateDatalistDivs() {
    let divIngredients = document.querySelector(".datalistWanted");
    let stringIngredients = generateIngredients();
    divIngredients.innerHTML = stringIngredients;
    divIngredients.innerHTML += `<button onclick="addIngredientButton()" 
                                type="button" class="btn mt-2 btn-info">Add</button>`;

    let divUnwantedIngredients = document.querySelector(".datalistUnwanted");
    let stringUnwanted = generateUnwantedIngredients();
    divUnwantedIngredients.innerHTML = stringUnwanted;
    divUnwantedIngredients.innerHTML += `<button onclick="addUnwantedIngredientButton()" 
                                        type="button" class="btn mt-2 btn-info">Add</button>`;
}





function generateIngredients() {
    let stringIngredients =
        `<label for="ingredients" class="form-label"><strong><h4>Select&nbspingredients</h4></strong></label>
    <input class="form-control" list="datalistOptions" id="ingredientsDataList" placeholder="Type to search...">
    <datalist id="datalistOptions">`;

    allIngredients.forEach(elem => {
        stringIngredients += `<option value = "${elem}">`;
    });
    stringIngredients += `</datalist>`;
    return stringIngredients;
}




function generateUnwantedIngredients() {
    let stringUnwantedIngredients =
        `<label for="ingredients" class="form-label"><strong><h4>Select&nbspunwanted&nbspingredients</h4></strong></label>
    <input class="form-control" list="datalistOptions" id="unwantedIngredientsDataList" placeholder="Type to search...">
    <datalist id="datalistOptions">`;

    allIngredients.forEach(elem => {
        stringUnwantedIngredients += `<option value = "${elem}">`;
    });
    stringUnwantedIngredients += `</datalist>`;
    return stringUnwantedIngredients;
}





function addIngredientButton() {
    let val = document.getElementById("ingredientsDataList").value;
    document.getElementById("ingredientsDataList").value = null;

    if (!alreadyAdded(addedIngredients, val) && val != '') {
        if (!alreadyAdded(unwantedIngredients, val)) {
            addedIngredients.push(val);
            rendIngredient(val, "wanted");
        }
        else {
            window.alert("Already added to unwanted.");
        }
    }
}




function addUnwantedIngredientButton() {
    let val = document.getElementById("unwantedIngredientsDataList").value;
    document.getElementById("unwantedIngredientsDataList").value = null;

    if (!alreadyAdded(unwantedIngredients, val) && val != '') {
        if (!alreadyAdded(addedIngredients, val)) {
            unwantedIngredients.push(val);
            rendIngredient(val, "unwanted");
        }
        else {
            window.alert("Already added to wanted.");
        }
    }
}




// array.includes()
function alreadyAdded(addedIngredients, ingred) {
    for (let i = 0; i < addedIngredients.length; i++)
        if (addedIngredients[i] === ingred)
            return true;
    return false;

}





function rendIngredient(val, wantedOrNot) {
    let rowDiv = document.createElement("div");
    rowDiv.classList.add('row');
    let valUnderscore = val.replaceAll(" ", "_");
    let whereToRend;

    if (wantedOrNot === "wanted") {
        whereToRend = ".addedIngredients";
        contextBgColor = "alert-success";
    }
    else if (wantedOrNot === "unwanted") {
        whereToRend = ".unwantedIngredients";
        contextBgColor = "alert-danger";
    }
    else {
        window.alert('Error: "whereToRend"');
    }

    // Atribuie clasele specificate in string (le suprascrie pe cele existente)
    let spanDiv = document.createElement("div");
    spanDiv.className = `col-10 col-md-6 alert ms-2 ${contextBgColor} span${valUnderscore}`;

    let closeButtonDiv = document.createElement("div");
    closeButtonDiv.className = `col-1 col-md-5 d-flex align-items-center button${valUnderscore}`;

    // Adauga clasa specificata (nu suprascrie)
    // closeButtonDiv.classList.add('col-6');
    // closeButtonDiv.classList.add('pb-2');
    // closeButtonDiv.classList.add(`button${valUnderscore}`);

    rowDiv.appendChild(spanDiv);
    rowDiv.appendChild(closeButtonDiv);

    let ingredientsDiv = document.querySelector(whereToRend);
    ingredientsDiv.appendChild(rowDiv);

    spanDiv.innerHTML += `<span> <strong> ${val} </strong> </span>`;
    closeButtonDiv.innerHTML += `
    <div>
        <button onclick="removeIngredient('${val}', '${wantedOrNot}')" type="button" 
                class="btn-close btn-close-dark" aria-label="Close"></button>
    </div>`;
}







function removeIngredient(val, fromWanted) {
    if (fromWanted === "wanted") {
        removeFromWanted(val);
    }
    else if (fromWanted === "unwanted") {
        removeFromUnwanted(val);
    }
    removeFromDOM(val);
}


function removeFromWanted(val) {
    for (let i = 0; i < addedIngredients.length; i++) {
        if (addedIngredients[i] === val) {
            const index = addedIngredients.indexOf(val);
            if (index > -1) {
                addedIngredients.splice(index, 1);
            }
            break;
        }
    }
}
function removeFromUnwanted(val) {
    for (let i = 0; i < unwantedIngredients.length; i++) {
        if (unwantedIngredients[i] === val) {
            const index = unwantedIngredients.indexOf(val);
            if (index > -1) {
                unwantedIngredients.splice(index, 1);
            }
            break;
        }
    }
}
function removeFromDOM(val) {
    let valUnderscore = val.replaceAll(" ", "_");
    let spanName = `.span${valUnderscore}`;
    let spanDiv = document.querySelector(spanName);
    spanDiv.remove();

    let buttonName = `.button${valUnderscore}`;
    let buttonDiv = document.querySelector(buttonName);
    buttonDiv.remove();
}




const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", async function () {
    desiredCocktails = [];
    if (addedIngredients.length > 0) {
        let success = await findDesiredCocktails();
        if (success != -1)
            showResults();
    }
    else {
        window.alert("Add at least one ingredient please.");
    }
});





async function findDesiredCocktails() {
    for (let i = 0; i < addedIngredients.length; i++) {
        let ingredient = addedIngredients[i];
        try {
            let responseAjax = await ajaxSearchWIthIngredients(ingredient);
            desiredCocktails = convertToArrayResults(responseAjax);
            if (i == 0) {
                intersect = desiredCocktails;
            }
            else {
                intersect = desiredCocktails.filter(value => intersect.includes(value));
            }
            if (intersect.length == 0)
                break;
        }
        catch (error) {
            window.alert(`Ingredient ${ingredient} doesn't exist`);
            console.log(error);
            return -1;
        }
    }
    desiredCocktails = intersect;
    if (unwantedIngredients.length != 0) {
        let success = await filterUnwantedResults();
        if (success == -1)
            return - 1;
    }

}






function ajaxSearchWIthIngredients(ingredient) {
    let prom = new Promise((resolve, reject) => {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            if (this.responseText != '') {
                let responseAjax = this.responseText;
                resolve(responseAjax);
            }
            else {
                reject('myErr "ajaxSearchWithIngredient"');
            }
        }
        xhttp.open("GET", `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        xhttp.send();
    });
    return prom;
}





function convertToArrayResults(resp) {
    array = [];
    resp = JSON.parse(resp).drinks;
    resp.forEach((element) => {
        array.push(element.strDrink);
    });
    return array;
}




async function filterUnwantedResults() {
    intersect = [];
    if (unwantedIngredients.length != 0) {
        for (let i = 0; i < unwantedIngredients.length && desiredCocktails.length != 0; i++) {
            let ingredient = unwantedIngredients[i];
            try {
                let responseAjax = await ajaxSearchWIthIngredients(ingredient, i);
                let unwantedCocktails = convertToArrayResults(responseAjax);
                intersect = desiredCocktails.filter(value => unwantedCocktails.includes(value));

                if (intersect.length != null) {
                    removeFromDesiredCocktails(unwantedCocktails);
                }
            }
            catch (error) {
                window.alert(`Ingredient ${ingredient} doesn't exist`);
                console.log(error);
                return -1;
            }
        }
    }
}



function removeFromDesiredCocktails(unwantedCocktails) {
    desiredCocktails = desiredCocktails.filter((elem) => !unwantedCocktails.includes(elem));
}



function showResults() {
    const title = document.querySelector(".results-title");
    const content = document.querySelector(".results-content");
    const resultsDiv = document.querySelector(".cocktails-results");

    title.innerHTML = " ";
    content.innerHTML = " ";
    resultsDiv.classList.remove("visually-hidden");

    if (desiredCocktails.length == 0) {
        title.innerHTML = "Unfortunately, no cocktails were found.";
    }
    else {
        title.innerHTML = "Cocktails found : ";
        for (let i = 0; i < desiredCocktails.length; i++) {
            let elem = desiredCocktails[i].replaceAll(" ", "&nbsp");
            desiredCocktails[i] = elem;
            content.innerHTML += `${desiredCocktails[i]}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp `;
        }
    }
}



/*
async function filterUnwantedResults() {
    for (let i = 0; i < desiredCocktails.length && desiredCocktails.length != 0; i++) {
        let cocktailName = desiredCocktails[i];
        let resp = await ajaxSearchByName(cocktailName);
        resp = transform(cocktailName, resp);
        console.log(resp);
        if(verify(resp, unwantedIngredients[0]) == false){
            console.log(`${resp.strDrink} contains ${unwantedIngredients[0]}`);
        }
    }
}





async function ajaxSearchByName(cocktailName) {
    let prom = new Promise((resolve, reject) => {
        if (cocktailName) {
            const xhttp = new XMLHttpRequest();
            xhttp.onload = function () {
                let resp = JSON.parse(this.responseText);
                resolve(resp);
            }
            const myURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + cocktailName;
            xhttp.open("GET", myURL);
            xhttp.send();
        }
        else {
            console.log("Invalid name");
        }
    });
    return prom;
}



function transform(cocktailName, resp) {
    for (let i = 0; i < resp.drinks.length; i++) {
        if (cocktailName === resp.drinks[i].strDrink)
            return resp.drinks[i];
    }
    return -1;
}




function verify(resp, unwanted) {
    let str = 'strIngredient';
    for (let i = 1; i <= 15; i++) {
        let sir = str + i;
        if (resp[sir] == null) {
            break;
        }
        else if(resp[sir].toLowerCase() === unwanted.toLowerCase()){
            return false;
        }
    }
    return true;
}
*/