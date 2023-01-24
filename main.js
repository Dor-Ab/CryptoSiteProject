/// <reference path="jquery-3.6.3.js"/>

$(() => {
    $(".about").hide()
    $(".card").hide()

    $("#homeBtn").on("click", function () {
        $(".about").fadeOut()
        $(".cryptos").delay(500).fadeIn()
    })

    $("#liveBtn").on("click", function () {
        $(".about").fadeOut()
        $(".cryptos").fadeOut()
    })

    $("#aboutBtn").on("click", function () {
        $(".cryptos").fadeOut()
        $(".about").delay(500).fadeIn()
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

                $(this).parent().next(".AddData").slideDown(400)
                $(this).parent().next(".AddData").next(".dataDiv").hide()
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
            // console.log(favoriteCoins)
        })
    }

    // Show Favorites Only
    $("#favoriteCardsBtn").on("click", function () {

        if (favoriteCoins.length === 0) {
            $(".card").parent(".col").fadeIn(200)
            const showEye = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye"
            viewBox="0 0 16 16">
            <path
                d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
        </svg>`

            $(this).children("span").text("Show Favorites")
            $(this).children("svg").html(showEye)
        }


        if (favoriteCoins.length >= 1) {
            let hideOrShowText = $(this).children("span").text()
            const cards = $(".card").parent(".col")

            let showCards = []

            if (hideOrShowText === "Show Favorites") {

                for (let card of cards) {
                    for (let fav of favoriteCoins) {
                        if (fav.id === $(card).children(".card").children().attr("data-coinId")) {
                            showCards.push(card)
                        }
                    }
                }

                const hideEye = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
              </svg>`

                cards.fadeOut(200)
                $(showCards).fadeIn(200)
                $(this).children("span").text("Hide Favorites")
                $(this).children("svg").html(hideEye)
            }

            else if (hideOrShowText === "Hide Favorites") {
                const showEye = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye"
                viewBox="0 0 16 16">
                <path
                    d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
            </svg>`

                cards.fadeIn(200)
                $(this).children("span").text("Show Favorites")
                $(this).children("svg").html(showEye)
            }
        }



    })

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

    $("#darkModebtn").on("click", function () {
        const darkModeBtn = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon-stars" viewBox="0 0 16 16">
        <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"/>
        <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/>
      </svg>`

        const lightModeBtn = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sun" viewBox="0 0 16 16">
        <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
      </svg>`

        if ($(this).children("span").text() === "Dark Mode") {
            $(this).children("span").html("Light Mode")
            $(this).children("svg").html(lightModeBtn)
        }
        else {
            $(this).children("span").html("Dark Mode")
            $(this).children("svg").html(darkModeBtn)
        }

        $("body").toggleClass("body-dark")
        $(".card").toggleClass("card-dark")
        $(".modal-body").toggleClass("modal-body-dark")
        $("#userInput").toggleClass("dark-input")
        $(".navBtns").toggleClass("navBtns-dark")
        $(".aboutBody").toggleClass("aboutBody-dark")


    })


})