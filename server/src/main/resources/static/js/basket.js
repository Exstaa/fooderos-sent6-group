let basketString = localStorage.getItem("fooderos-basket");

let basketFoods = [];

let basketFoodObjects = [];

let totalPriceElement = document.getElementById("total-price");

if (basketString != null) {
    basketFoods = JSON.parse(basketString);
}

let basketFoodsTableElement = document.getElementById("basket-foods-table");

async function getBasketFoods() {
    for (let i = 0; i < basketFoods.length; i++) {
        let basketFoodItem = basketFoods[i];
        let foodId = basketFoodItem.id;
        let requestStatus = null;
        let resultFood = await fetch(`http://localhost:8080/api/foods/find/${foodId}`).then(response => {

            requestStatus = response.status;

            return response.json()
        });

        if (requestStatus == 200) {
            basketFoodObjects.push(resultFood)
        }
    }
}

async function insertBasketData(reload = false) {
    basketFoodsTableElement.innerHTML = "";
    if (reload) {
        await getBasketFoods();
    }

    for (let i = 0; i < basketFoodObjects.length; i++) {
        let basketFoodObject = basketFoodObjects[i];

        let tr = document.createElement("tr");
        let idTd = document.createElement("td");
        let nameTd = document.createElement("td");
        let imageTd = document.createElement("td");
        let image = document.createElement("img");
        let priceTd = document.createElement("td");
        let quantityTd = document.createElement("td");
        let quantityInput = document.createElement("input");
        let sumTd = document.createElement("td");
        let actionTd = document.createElement("td");
        let deleteButton = document.createElement("button");

        quantityInput.setAttribute("class", "form-control");
        quantityInput.setAttribute("placeholder", "Say");
        quantityInput.setAttribute("type", "number");
        quantityInput.setAttribute("id", `quantity${basketFoodObject.id}`)
        quantityInput.setAttribute("required", "on")
        quantityInput.min = 1;
        quantityTd.style.width = "15%"
        quantityInput.style.width = "90%"
        idTd.innerText = basketFoodObject.id;
        nameTd.innerText = basketFoodObject.name;
        image.src = basketFoodObject.coverImg;
        image.style.width = "150px";
        image.style.height = "150px";
        image.style.objectFit = "cover";
        priceTd.innerText = basketFoodObject.price + " AZN";
        deleteButton.innerText = "Delete";
        deleteButton.setAttribute("class", "btn btn-danger");

        let basketFoodObjectIndex = -1;

        deleteButton.addEventListener("click", function () {
            basketFoodObjects.find((iteratedBasketFoodObject, index) => {
                if (iteratedBasketFoodObject.id == basketFoodObject.id) {
                    basketFoodObjectIndex = index;
                }
                console.log("hi")
            })

            basketFoodObjects.splice(basketFoodObjectIndex, 1);
            localStorage.setItem("fooderos-basket", JSON.stringify(basketFoodObjects))

            Swal.fire({
                icon: "success",
                title: "Basket",
                text: "Deleted from Basket",
                timer: 1200
            })

            insertBasketData(false);
        })
        quantityInput.addEventListener("input", function () {
            if (quantityInput.value > 0) {
                sumTd.innerText = basketFoodObject.price * quantityInput.value + " AZN"
                countTotalPrice();
            }
        })
        sumTd.innerText = "0 AZN"
        quantityTd.appendChild(quantityInput);
        imageTd.appendChild(image);
        actionTd.appendChild(deleteButton);

        tr.appendChild(idTd);
        tr.appendChild(nameTd);
        tr.appendChild(imageTd);
        tr.appendChild(priceTd);
        tr.appendChild(quantityTd)
        tr.appendChild(sumTd)
        tr.appendChild(actionTd);
        basketFoodsTableElement.appendChild(tr)

    }
}
function countTotalPrice() {
    totalPriceElement.innerText = "0 AZN";
    let sum = 0;
    for (let i = 0; i < basketFoodObjects.length; i++) {
        let basketFoodObject = basketFoodObjects[i];
        sum += Number(document.getElementById(`quantity${basketFoodObject.id}`).value) * basketFoodObject.price;
    }
    totalPriceElement.innerText = sum + " AZN";
}

function buyBasketItems(event) {
    event.preventDefault();
    let allow = true;
    let basketFoodObject;
    for (let i = 0; i < basketFoodObjects.length; i++) {
         basketFoodObject = basketFoodObjects[i];
        if (Number(document.getElementById(`quantity${basketFoodObject.id}`).value) < 1) {
            allow = false;
            break;
        }
    }
    if(allow){
        Swal.fire({
            icon: "success",
            title: "Redirect",
            text: "You will be redirected to confirm page",
            timer: 1200
        });
        for (let i = 0; i < basketFoodObjects.length; i++) {
             basketFoods[i].quantity = Number(document.getElementById(`quantity${basketFoodObject.id}`).value);
        } 
        localStorage.setItem("fooderos-basket",JSON.stringify(basketFoods))
        window.location.replace("/templates/confirm-order.html")
    }else{
        Swal.fire({
            icon: "error",
            title: "Basket",
            text: "Basket Validation failed",
            timer: 1200
        });
    }
}

insertBasketData(true)