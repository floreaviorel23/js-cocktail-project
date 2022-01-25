
let myDrinks = [];




function searchButton() {
    myDrinks = [];
    document.querySelector(".results").innerHTML = "";
    document.querySelector(".more-info").innerHTML = "";

    const cocktailName = document.querySelector('.cocktail-name').value;
    const isAlcoholic = document.querySelector('#isAlcoholic').checked;

    document.querySelector('.cocktail-name').value = '';
    document.querySelector('#isAlcoholic').checked = true;
    ajaxGetCocktails(cocktailName, isAlcoholic);
}





function ajaxGetCocktails(cocktailName, isAlcoholic) {
    if (cocktailName) {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            let resp = JSON.parse(this.responseText);
            onloadAjaxGetCocktails(resp, cocktailName, isAlcoholic);
        }
        const myURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + cocktailName;
        xhttp.open("GET", myURL);
        xhttp.send();
    }
    else {
        //window.alert("Invalid cocktail name");
        console.log("Invalid name");
    }
}






function onloadAjaxGetCocktails(ajaxResponse, cocktailName, isAlcoholic) {
    if (ajaxResponse.drinks) {
        if (ajaxResponse.drinks.length > 1) {
            showEveryResult(ajaxResponse, isAlcoholic);
        }
        else {
            showSingleResult(ajaxResponse, isAlcoholic);
        }
    }
}




function showEveryResult(ajaxResponse, isAlcoholic) {
    let results = document.querySelector(".results");
    let strHTML;
    let i = 0;
    ajaxResponse.drinks.forEach((elem) => {
        let typeOfDrink = "Non alcoholic";
        if (isAlcoholic === true)
            typeOfDrink = "Alcoholic";
        if (elem.strAlcoholic === typeOfDrink) {
            myDrinks.push(elem);
            //console.log(elem.strDrink);
            strHTML = '<div class="mt-3">';
            strHTML += '<p class="d-inline">' + elem.strDrink + '</p>';
            strHTML += '<button onClick="showMore(' + i + ')" class="d-inline btn btn-info float-end">More</button>';
            strHTML += '</div>';
            strHTML += '<hr>';
            i++;
            results.innerHTML += strHTML;
        }
    });
}




function showSingleResult(ajaxResponse, isAlcoholic) {
    let typeOfDrink = "Non alcoholic";
    if (isAlcoholic === true)
        typeOfDrink = "Alcoholic";
    if (ajaxResponse.drinks[0].strAlcoholic === typeOfDrink)
        myDrinks.push(ajaxResponse.drinks[0]);
    showMore(0);
}




function showMore(i) {
    deleteOldCard();
    createCard(i);
}





function deleteOldCard() {
    let divMoreInfo = document.querySelector(".more-info");
    divMoreInfo.innerHTML = "";
}




function createCard(i) {
    const divMoreInfo = document.querySelector(".more-info");
    const myDiv = document.createElement("DIV");
    const cocktail = myDrinks[i];

    const drinkName = myDrinks[i].strDrink;
    const instr = myDrinks[i].strInstructions;
    const thumbnail = myDrinks[i].strDrinkThumb;
    const measures = getMeasures(cocktail);

    divMoreInfo.appendChild(myDiv);
    myDiv.innerHTML = createCardInnerHTML(thumbnail, drinkName, measures, instr);

    setTimeout(function () {
        let element = document.querySelector('.more-info');
        element.scrollIntoView({
            behavior: 'smooth'
        });
    }, 330);
}






function getMeasures(cocktail) {
    let measures = '';
    for (let j = 1; j <= 15; j++) {
        let strIngredient = 'strIngredient' + j;

        let strMeasure = 'strMeasure' + j;
        if (cocktail[strIngredient] == null || cocktail[strIngredient] == '')
            break;
        else {
            measures += `${cocktail[strIngredient]}`;
            if (cocktail[strMeasure] != null) {
                measures += `(${cocktail[strMeasure].trim()})`;
            }
            measures += ", ";
        }
    }
    measures = measures.substring(0, measures.length - 2);
    return measures;
}






function createCardInnerHTML(thumbnail, drinkName, measures, instr) {
    cardHTML =
        `<div class="card my-card">
    <img class="card-img-top" src="${thumbnail}" alt="Card image" style="width:100%">
    <div class="card-body">
        <h4 class="card-title">${drinkName}</h4>
        <div class="card-text">
            <p class="measures">${measures}</p>
            <p>${instr}</p>
        </div>
    </div>
</div>`;
    return cardHTML;
}