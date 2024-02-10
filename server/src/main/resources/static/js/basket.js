let basketString = localStorage.getItem("fooderos-basket");

let basketFoods = [];

let basketFoodObjects = [];

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
        let actionTd = document.createElement("td");
        let deleteButton = document.createElement("button");

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

        imageTd.appendChild(image);
        actionTd.appendChild(deleteButton);

        tr.appendChild(idTd);
        tr.appendChild(nameTd);
        tr.appendChild(imageTd);
        tr.appendChild(priceTd);
        tr.appendChild(actionTd);
        basketFoodsTableElement.appendChild(tr)

    }
}

insertBasketData(true)