let foods = [];

let foodCardsElement = document.getElementById("food-cards");

let basketString = localStorage.getItem("fooderos-basket");

let basketFoods = [];

if (basketString != null) {
    basketFoods = JSON.parse(basketString);
}

async function getFoods() {
    foods = await fetch('http://localhost:8080/api/foods/').then(response => response.json())


    // console.log(foods);
}


async function insertFoodsData(reload = false) {
    if (reload) {
        await getFoods();
    }

    foodCardsElement.innerHTML = "";

    for (let i = 0; i < foods.length; i++) {
        let food = foods[i];
        let card = `
        <div class="col-9 col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-9 mt-3">
        <div class="card">
            <img src="${food.coverImg}" class="card-img-top" style="height:250px; object-fit:cover; object-position: 50% 50%;" alt="..." >
            <div class="card-body">
              <h5 class="card-title">${food.name}</h5>
              <p class="card-text">${food.restaurant.name}</p>
              <p class="card-text">${food.price} AZN</p>
             <div class="d-flex justify-content-center ">
                <button onclick="addToBasket(${food.id})" class="btn btn-warning text-white">Basket</button>
             </div>
            </div>
          </div>
    </div>
        `

        foodCardsElement.innerHTML += card
    }
}

document.getElementById("searchInput").addEventListener("input", (e) => {
    let inputValue = e.target.value;
    let searchResultFoods = [];

    if (inputValue.trim().length == 0) {
        insertFoodsData(true)
    }

    for (let i = 0; i < foods.length; i++) {
        let food = foods[i];
        if (food.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 || food.restaurant.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) {
            searchResultFoods.push(food);
        }
    }

    foods = searchResultFoods;
    insertFoodsData(false);
})

function addToBasket(id) {
    let exist = false;

    basketFoods.find((basketItem) => {
        if (basketItem.id == id) {
            exist = true;
            return basketItem;
        }
    })

    if (!exist) {
        basketFoods.push({ id: id });
        Swal.fire({
            icon: "success",
            title: "Basket",
            text: "Added to basket",
            timer: 1200
        });
        localStorage.setItem("fooderos-basket", JSON.stringify(basketFoods))
    } else {
        Swal.fire({
            icon: "error",
            title: "Basket",
            text: "This food is already in your basket.",
            timer: 1200
        });
    }
}

insertFoodsData(true);