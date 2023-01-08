/// <reference path="jquery-3.6.3.js"/>

$(() => {
    $(".about").hide()

    $(".card").hide()

    $("#aboutBtn").on("click", function () {
        $(".cryptos").fadeOut()
        $(".about").delay(500).fadeIn()
    })

    $("#homeBtn").on("click", function () {
        $(".about").fadeOut()
        $(".cryptos").delay(500).fadeIn()
    })
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
        $(".card").show()
        $(".circles").hide()
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

                    <div class="centerd lodaing">
                        <p class="loader">&nbsp;₿&nbsp;</p>
                    </div>
                    <div class="dataDiv"></div>
                </div>
            </div>
        </div>
        </div>`

        }

        $(".cardsRows").html(cards)
        $(".circles").hide()
        $(".card").show()
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

    // Add Coin Currency To Cookies For 2 Minutes
    function setInfoToCookies(coinId, coinCurrencyEur, coinCurrencyIls, coinCurrencyUsd) {
        const date = new Date();
        date.setTime(date.getTime() + (2 * 60 * 1000));
        let expires = "; expires=" + date.toGMTString();

        document.cookie = `${coinId} eur =${coinCurrencyEur} ${expires}`
        document.cookie = `${coinId} ils =${coinCurrencyIls} ${expires}`
        document.cookie = `${coinId} usd =${coinCurrencyUsd} ${expires}`

    }

    // Adds Coin Currency To Card From Ajax
    function addMoreInfo(coin, dataDiv) {
        $(dataDiv).hide()
        $(dataDiv).prev(".lodaing").show()

        const euro = coin.market_data.current_price.eur
        const ils = coin.market_data.current_price.ils
        const usd = coin.market_data.current_price.usd

        const coinCurrancy = `
            <span><b>EUR:</b> ${euro}€</span><br>
            <span><b>ILS:</b> ${ils}₪</span><br>
            <span><b>USD:</b> ${usd}$</span>`

        setInfoToCookies(coin.id, euro, ils, usd)
        $(dataDiv).html(coinCurrancy)

        $(dataDiv).prev(".lodaing").slideUp()
        $(dataDiv).show()

    }

    // Add Coin Currency To Card From Cookies 
    function addMoreInfoFromCookies(cookies, dataDiv) {

        $(dataDiv).prev(".lodaing").hide()

        let values = cookies.split("\n")
        let eur = values[0]
        let ils = values[1]
        let usd = values[2]

        const coinCurrancy = `
        <span><b>EUR:</b> ${eur}€</span><br>
        <span><b>ILS:</b> ${ils}₪</span><br>
        <span><b>USD:</b> ${usd}$</span>`


        $(dataDiv).html(coinCurrancy)
        $(dataDiv).show()

        return true
    }

    //Gets Info From Cookies
    function getInfoFromCookies(name) {
        let value = "; " + document.cookie
        let usdParts = value.split("; " + name + " usd" + "=")
        let eurParts = value.split("; " + name + " eur" + "=")
        let ilsParts = value.split("; " + name + " ils" + "=")
        if (usdParts.length == 2 && eurParts.length == 2 && ilsParts.length == 2) {
            let eur = eurParts.pop().split(";").shift()
            let ils = ilsParts.pop().split(";").shift()
            let usd = usdParts.pop().split(";").shift()
            return eur + "\n" + ils + "\n" + usd
        }

    }

    // More Info Collapser
    function showMoreInfo() {
        $(".infoBtn").on("click", function () {
            if ($(this).text() === "More Info") {

                $(this).parent().next(".loader").html("₿")
                $(this).parent().next(".AddData").slideDown(400)
                $(this).html("Less Info")

                if (getInfoFromCookies($(this).parent().parent().attr("data-coinId"))) {
                    let cookie = getInfoFromCookies($(this).parent().parent().attr("data-coinId"))
                    addMoreInfoFromCookies(cookie, $(this).parent().next(".AddData").children(".dataDiv"))
                }
                else {
                    getDataAboutCoin($(this).parent().parent().attr("data-coinId"), $(this).parent().next(".AddData").children(".dataDiv"))
                }
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
            const coinName = $(card).children().children().children(".card-title").text()
            const coinSymbol = $(card).children().children().children(".card-text").text()
            if (!coinName.includes(inputCoins) && !coinName.toLowerCase().includes(inputCoins) && !coinSymbol.includes(inputCoins)) {
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

    })

    // Changes Heart Color Of Card On Click And Adding Coin To Favorites
    let favoriteCoins = []

    function changeHeartColorOnClick() {
        $(".favorite").on("click", function () {
            const heartColor = $(this).attr("data-favorite")

            if (heartColor === "white") {

                if (favoriteCoins.length >= 5) {
                    let coinSymbol = $(this).parent().parent().prev(".card-text").text()
                    OpenBootstrapModal(coinSymbol)
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

    // Opens Modal If More Then 5 Coins Selected
    function OpenBootstrapModal(coinSymbol) {
        $(".modalSuccess").hide()
        $(".modalExceed").show()
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

        replaceBtnModal(coinSymbol)

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

    // Replace Coin Option On Modal
    function replaceBtnModal(coinSymbol) {
        $(".modalReplaceBtn").on("click", function () {
            let currentCard = $(this).parents(".modalCards")
            let currentCoin = $(this).prev(".card-text").text()
            let counter = $(this).parent().next(".card-footer").text()

            let newCoin = allCoins.find(coin => {
                if (coin.symbol === coinSymbol) {
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
            changeHeartColorAfterReplaced(coinSymbol, currentCoin)
        })
    }

    // Changes Heart Color On Main Page After Coin Replacement (If Replaced)
    function changeHeartColorAfterReplaced(coinSymbol, currentCoin) {
        let cards = $(".cryptos").children(".col").children(".card")

        for (let card of cards) {
            if ($(card).children().children(".card-text").text() === coinSymbol) {
                const whiteHeart = $(card).children().children(".col").children("div").children()
                const blackHeart = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
              </svg>`

                $(whiteHeart).html(blackHeart)
                $(whiteHeart).attr("data-favorite", "black")

            }
            if ($(card).children().children(".card-text").text() === currentCoin) {
                const blackHeart = $(card).children().children(".col").children("div").children()

                const whiteHeart = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-heart"
                viewBox="0 0 16 16">
                <path
                    d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                </svg>`

                $(blackHeart).html(whiteHeart)
                $(blackHeart).attr("data-favorite", "white")
            }
        }
        changeModalAfterCoinReplacement()

    }

    // Shows Confirmation That Coin Replaced
    function changeModalAfterCoinReplacement() {
        const replaceBtn = $(".modalReplaceBtn")
        replaceBtn.slideUp(500)
        $(".modalExceed").hide()
        $(".modalSuccess").fadeIn(1000)
    }


})