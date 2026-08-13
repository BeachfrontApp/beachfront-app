document.addEventListener("DOMContentLoaded", () => {


    // =====================================================
    // APPS SCRIPT WEB APP
    // =====================================================

    const APPS_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycby2GH9uwa33nT92lPOT_h2uEuqbP9Tfndy-8pOjtSwFh9rEyZmRLqNXybyZESxvWpc/exec";


    // =====================================================
    // SOURCE
    // =====================================================

    const sourceButtons =
        document.querySelectorAll(".source");

    let selectedSource = "Booking.com";


    sourceButtons.forEach(button => {

        button.addEventListener("click", () => {

            sourceButtons.forEach(b =>
                b.classList.remove("active")
            );

            button.classList.add("active");

            selectedSource =
                button.innerText;

        });

    });


    // =====================================================
    // COUNTERS
    // =====================================================

    const counters =
        document.querySelectorAll(".counter-row");


    counters.forEach((row, index) => {

        const buttons =
            row.querySelectorAll("button");

        const minus = buttons[0];
        const plus = buttons[1];

        const value =
            row.querySelector(".counter-value");


        plus.addEventListener("click", () => {

            const number =
                Number(value.innerText) + 1;

            value.innerText = number;

            loadPrice();

        });


        minus.addEventListener("click", () => {

            let number =
                Number(value.innerText) - 1;


            // Adults minimum 1
            if (index === 0 && number < 1) {
                number = 1;
            }


            // Children and pets minimum 0
            if (index !== 0 && number < 0) {
                number = 0;
            }


            value.innerText = number;

            loadPrice();

        });

    });


    // =====================================================
    // CHECK-IN OPTION
    // =====================================================

    const optionButtons =
        document.querySelectorAll(".option");

    let selectedCheckinPrice = 0;


    optionButtons.forEach(button => {

        button.addEventListener("click", () => {

            optionButtons.forEach(b =>
                b.classList.remove("active")
            );

            button.classList.add("active");


            selectedCheckinPrice =
                Number(
                    button.innerText
                        .replace("€", "")
                );


            updatePrice();

        });

    });


    // =====================================================
    // PRICE
    // =====================================================

    const correctionInput =
        document.getElementById("correction");

    const priceOutput =
        document.getElementById("price");


    let basePrice = 0;


    async function loadPrice() {

        const checkin =
            document.getElementById("checkin").value;


        const checkout =
            document.getElementById("checkout").value;


        const caravanValue =
            document.getElementById("caravan").value;


        const caravan =
            Number(caravanValue);


        const adults =
            Number(
                document
                    .getElementById("adults")
                    .innerText
            );


        const children =
            Number(
                document
                    .getElementById("children")
                    .innerText
            );


        const pets =
            Number(
                document
                    .getElementById("pets")
                    .innerText
            );


        // -------------------------------------------------
        // CHECK REQUIRED DATA
        // -------------------------------------------------

        if (
            !checkin ||
            !checkout ||
            !caravanValue ||
            caravanValue === "🏖️" ||
            Number.isNaN(caravan)
        ) {

            basePrice = 0;

            updatePrice();

            return;

        }


        // -------------------------------------------------
        // CHECK DATES
        // -------------------------------------------------

        if (checkout <= checkin) {

            basePrice = 0;

            updatePrice();

            return;

        }


        // -------------------------------------------------
        // SEND REQUEST TO APPS SCRIPT
        // -------------------------------------------------

        try {

            const response =
                await fetch(
                    APPS_SCRIPT_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "text/plain;charset=utf-8"
                        },

                        body: JSON.stringify({

                            action: "getPrice",

                            checkin: checkin,

                            checkout: checkout,

                            caravan: caravan,

                            adults: adults,

                            children: children,

                            pets: pets

                        })
                    }
                );


            const result =
                await response.json();


            console.log(
                "Pricing response:",
                result
            );


            if (result.success) {

                basePrice =
                    Number(result.price) || 0;

            } else {

                console.error(
                    "Pricing error:",
                    result.error
                );

                basePrice = 0;

            }


            updatePrice();


        } catch (error) {

            console.error(
                "Connection error:",
                error
            );

            basePrice = 0;

            updatePrice();

        }

    }


    // =====================================================
    // UPDATE PRICE DISPLAY
    // =====================================================

    function updatePrice() {

        const correction =
            Number(
                correctionInput.value
            ) || 0;


        const total =
            basePrice +
            selectedCheckinPrice +
            correction;


        if (total < 0) {

            priceOutput.innerText =
                "-€" +
                Math.abs(total).toFixed(2);

        } else {

            priceOutput.innerText =
                "€" +
                total.toFixed(2);

        }

    }


    // =====================================================
    // CORRECTION
    // =====================================================

    correctionInput.addEventListener(
        "input",
        () => {

            updatePrice();

        }
    );


    // =====================================================
    // DATE EVENTS
    // =====================================================

    document
        .getElementById("checkin")
        .addEventListener(
            "change",
            loadPrice
        );


    document
        .getElementById("checkout")
        .addEventListener(
            "change",
            loadPrice
        );


    // =====================================================
    // CARAVAN EVENT
    // =====================================================

    document
        .getElementById("caravan")
        .addEventListener(
            "change",
            loadPrice
        );


});
