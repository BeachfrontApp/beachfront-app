document.addEventListener("DOMContentLoaded", () => {


    // ===== Източник =====

    const sourceButtons = document.querySelectorAll(".source");

    let selectedSource = "Booking.com";


    sourceButtons.forEach(button => {

        button.addEventListener("click", () => {

            sourceButtons.forEach(b => b.classList.remove("active"));

            button.classList.add("active");

            selectedSource = button.innerText;

        });

    });



    // ===== Броячи =====

    const counters = document.querySelectorAll(".counter-row");


    counters.forEach((row, index) => {

        const buttons = row.querySelectorAll("button");

        const minus = buttons[0];
        const plus = buttons[1];

        const value = row.querySelector(".counter-value");


        plus.addEventListener("click", () => {

            value.innerText = Number(value.innerText) + 1;

            loadPrice();

        });


        minus.addEventListener("click", () => {

            let number = Number(value.innerText) - 1;


            // Възрастни минимум 1
            if (index === 0 && number < 1) {
                number = 1;
            }


            // Деца и домашни любимци минимум 0
            if (index !== 0 && number < 0) {
                number = 0;
            }


            value.innerText = number;

            loadPrice();

        });

    });




    // ===== Настаняване =====

    const optionButtons = document.querySelectorAll(".option");

    let selectedCheckinPrice = 0;


    optionButtons.forEach(button => {

        button.addEventListener("click", () => {


            optionButtons.forEach(b => b.classList.remove("active"));


            button.classList.add("active");


            selectedCheckinPrice = Number(
                button.innerText.replace("€", "")
            );


            updatePrice();


        });

    });





    // ===== Цена =====

const correctionInput = document.getElementById("correction");

const priceOutput = document.getElementById("price");


let basePrice = 0;


function loadPrice() {

    const checkin = document.getElementById("checkin").value;
    const caravan = Number(document.getElementById("caravan").value);

    const adults = document.getElementById("adults").innerText;
    const children = document.getElementById("children").innerText;
    const pets = document.getElementById("pets").innerText;


    if (!checkin || caravan === "🏖️") {

        basePrice = 0;
        updatePrice();
        return;

    }


    google.script.run
    .withSuccessHandler(function(price) {

        basePrice = Number(price) || 0;

        updatePrice();

    })
    .getPrice(
        checkin,
        caravan,
        adults,
        children,
        pets
    );

}


function updatePrice() {

    let correction = Number(correctionInput.value) || 0;

    let total = basePrice + selectedCheckinPrice + correction;


    if (total < 0) {

        priceOutput.innerText =
            "-€" + Math.abs(total).toFixed(2);

    } else {

        priceOutput.innerText =
            "€" + total.toFixed(2);

    }

}


correctionInput.addEventListener("input", () => {

    updatePrice();

});


document.getElementById("checkin")
.addEventListener("change", loadPrice);


document.getElementById("caravan")
.addEventListener("change", loadPrice);


});