/// <reference path="jquery-3.6.3.js"/>

$(() => {

    let allCoins = []

    // Fetching Coins Api
    $(() => {
        $.ajax({
            url: `https://api.coingecko.com/api/v3/coins`,
            success: coins => handleCoins(coins),
            error: err => coinError(err)
        })
    })

    // Catch Error If API Fail
    function coinError(err) {
        const errMessage = `
            <p class="reloadP">Error! <br>Status: ${err.status} <br> Click To Reload.</p>
            `
        $(".cryptos").children(".col").children(".card").html(errMessage)
        reloadAfterError()
    }

    //Reload After Error By Clicking P
    function reloadAfterError() {
        $(".reloadP").on("click", function () {
            location.reload();
        })
    }

    // Create Array Of Coins
    function handleCoins(coins) {
        allCoins = coins
        displayCoins(coins)
    }

    // Display Coins Cards
    function displayCoins(coins) {
        let cards = ""

        for (let item of coins) {
            cards += `
            <div class="col centerd text-center">
            <div class="card">
            <div class="card-body d-flex flex-column centerd" data-coinId="${item.id}">
                <img src="${item.image.large}">
                <h5 class="card-title coinId">${item.name}</h5>
                <p class="card-text">${item.symbol}</p>


                <div class="col d-flex">
                <button class="btn infoBtn btn-primary">More Info</button>

                <div>
                    <button class="favorite btn" data-favorite="white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-heart"
                            viewBox="0 0 16 16">
                            <path
                            d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                        </svg>
                    </button>
                </div>
            </div>

                <div class="AddData">
                <div class="centerd">
                <p class="loader">&nbsp;₿&nbsp;</p>
                </div>
            </div>
            </div>
        </div>
        </div>`

        }

        $(".cardsRows").html(cards)
        $(".AddData").hide()
        showMoreInfo()
        changeHeartColorOnClick()
    }

    // Get More Info About Coin
    function getDataAboutCoin(coinId, DataDiv) {
        $.ajax({
            url: `https://api.coingecko.com/api/v3/coins/${coinId}`,
            success: coins => addMoreInfo(coins, DataDiv),
            error: err => console.log(err)
        })

    }

    // Add Info To Cookies
    function setInfoToCookies(coinId, coinCurrencyEur, coinCurrencyIls, coinCurrencyUsd) {
        const date = new Date();
        date.setTime(date.getTime() + (2 * 60 * 1000));
        let expires = "; expires=" + date.toGMTString();
        console.log(expires)

        document.cookie = `${coinId} eur =${coinCurrencyEur} ${expires}`
        document.cookie = `${coinId} ils =${coinCurrencyIls} ${expires}`
        document.cookie = `${coinId} usd =${coinCurrencyUsd} ${expires}`

    }

    // Adds Info To Card
    function addMoreInfo(coin, DataDiv) {
        const euro = coin.market_data.current_price.eur
        const ils = coin.market_data.current_price.ils
        const usd = coin.market_data.current_price.usd

        getInfoFromCookies(coin.id)

        const usdCurrancy = `
            <span><b>EUR:</b> ${euro}€</span><br>
            <span><b>ILS:</b> ${ils}₪</span><br>
            <span><b>USD:</b> ${usd}$</span>`

        setInfoToCookies(coin.id, euro, ils, usd)
        $(DataDiv).html(usdCurrancy)
    }

    //Gets Info From Cookies
    function getInfoFromCookies(coinId) {
        let cookieArr = document.cookie.split("=" || ";");
        // if (document.cookie === coinId + "eur")
        //     console.log(coinId)

    }

    // More Info Collapser
    function showMoreInfo() {
        $(".infoBtn").on("click", function () {
            if ($(this).text() === "More Info") {

                $(this).parent().next(".loader").html("₿")
                $(this).parent().next(".AddData").slideDown(400)
                $(this).html("Less Info")

                // setInfoToCookie($(this).parent().parent().attr("data-coinId"))

                getDataAboutCoin($(this).parent().parent().attr("data-coinId"), $(this).parent().next(".AddData"))
            }
            else {
                $(this).parent().next(".AddData").slideUp(400)
                $(this).html("More Info")
            }
        })
    }

    // User Live Input Search
    $("#userInput").on("keyup", function () {
        const inputCoins = $(this).val()

        const cards = $(".card").parent(".col")

        let showCards = []
        let hideCards = []
        for (let card of cards) {
            if (!card.innerText.includes(inputCoins)) {
                hideCards.push(card)
                $(hideCards).hide()
            }
            else if (inputCoins === "") {
                $(cards).show()
            }
            else {
                showCards.push(card)
                $(showCards).show()
            }

        }
        console.log(showCards)

    })


    let favoriteCoins = []
    function changeHeartColorOnClick() {
        $(".favorite").on("click", function () {
            const heartColor = $(this).attr("data-favorite")

            if (heartColor === "white") {

                if (favoriteCoins.length >= 5) {
                    let coinId = $(this).parents(".card-body").attr("data-coinid")
                    console.log($(this).parent(".col").prev(".card-text"))
                    OpenBootstrapModal(coinId)
                    return
                }

                const blackHeart = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
              </svg>`

                $(this).html(blackHeart)
                $(this).attr("data-favorite", "black")

                const coinId = $(this).parent().parents(".card-body").attr("data-coinId")
                allCoins.forEach(coin => {
                    if (coin.id === coinId) {
                        favoriteCoins.push(coin)
                    }
                })

            }

            else {
                const whiteHeart = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-heart"
                viewBox="0 0 16 16">
                <path
                    d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                </svg>`

                $(this).html(whiteHeart)
                $(this).attr("data-favorite", "white")

                const coinId = $(this).parent().parents(".card-body").attr("data-coinId")

                const tempCoins = []
                for (let item of favoriteCoins) {
                    if (coinId === item.id) {
                        continue
                    }
                    tempCoins.push(item)
                }

                favoriteCoins = tempCoins
            }
            console.log(favoriteCoins)
        })
    }

    function OpenBootstrapModal(coinId) {
        let counter = 1
        let modalCoins = ``
        for (let item of favoriteCoins) {

            modalCoins += `
                <div class="card col modalCards text-center">
                    <div class="card-header">
                        <span><b>${item.name}</b></span>
                    </div>

                    <div class="card-body">
                        <img src="${item.image.large}"/>
                        <p class="card-text">${item.symbol}</p>
                        <button class="btn btn-primary modalReplaceBtn">Replace</button>
                    </div>

                    <div class="card-footer text-muted">
                        <span>${counter}</span>
                    </div>
                </div>
            `
            counter++
        }

        $("#modalCoinsDiv").html(modalCoins)
        $("#modalCoinsDiv").children().hide()
        $("#exceedCoinsModal").modal('show');

        replaceBtnModal(coinId)

        const first = $("#modalCoinsDiv").children(".modalCards")[0]
        const second = $("#modalCoinsDiv").children(".modalCards")[1]
        const third = $("#modalCoinsDiv").children(".modalCards")[2]
        const forth = $("#modalCoinsDiv").children(".modalCards")[3]
        const fifth = $("#modalCoinsDiv").children(".modalCards")[4]

        $(first).fadeIn(500)
        $(second).fadeIn(900)
        $(third).fadeIn(1300)
        $(forth).fadeIn(1700)
        $(fifth).fadeIn(2100)
    }

    function replaceBtnModal(coinId) {
        $(".modalReplaceBtn").on("click", function () {
            let currentCard = $(this).parents(".modalCards")
            let currentCoin = $(this).prev(".card-text").text()
            let counter = $(this).parent().next(".card-footer").text()

            let newCoin = allCoins.find(coin => {
                if (coin.id === coinId) {
                    return coin
                }
            })

            const tempCoins = []
            for (let item of favoriteCoins) {
                if (item.symbol === currentCoin) {
                    continue
                }
                tempCoins.push(item)
            }
            favoriteCoins = tempCoins
            favoriteCoins.push(newCoin)

            let newCoinTemplate = `
                    <div class="card-header">
                        <span><b>${newCoin.name}</b></span>
                    </div>

                    <div class="card-body">
                        <img src="${newCoin.image.large}"/>
                        <p class="card-text">${newCoin.symbol}</p>
                        <button class="btn btn-primary modalReplaceBtn">Replace</button>
                    </div>

                    <div class="card-footer text-muted">
                    <span>${counter}</span>
                    </div>
            `
            currentCard.html(newCoinTemplate)
            changeHeartColorAfterReplaced(coinId)
            console.log(favoriteCoins)
        })
    }


    function changeHeartColorAfterReplaced(coinId) {
        let cards = $(".cryptos").children(".col").children(".card")

        for (let card of cards) {
            console.log($(card).text().toLowerCase())
        }
        console.log(coinId)
    }


})

// לבדוק מה קורה בשליחת קויין איידי מודל