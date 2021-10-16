
  var inventorylist = []
  var collectionlist = [];
  var scrapmetallist = [];
  var selllist = [];
  var exchangelist = [];
  var bulklist = [];
  var coinlist = inventorylist;
  var current_page = 1;
  var min_page = 1;
  var max_page = 1;
  var sell_limit = 10;
  var wallet = 30.00;
  var day = 1;
  var metal_currency_pricelist = [0.007462, 0.016373, 0.726600, 56.62, 0.80357, 1.1538, 1.359, 1.07493, 0.008803, 0.7359, 0.048204, 0.25196, 0.045423, 0.737292]
  var product_amount = [10,10,10] 
  
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");

  const metal_currency_pricelistnames = ["COP", "NIC", "SIL","GOL", "CAD", "EUR", "GBP", "CHF", "JPY", "AUD",  "MXN", "PLN", "CZK", "SGD"]
  const product_pricelistnames = ["5WorldCoins","1PoundWorldCoins","10PoundWorldCoins"]
  const product_pricelist = [1,10,100] 
  const bulkReturnRate = 0.70
  const exchangeReturnRate = 0.8

  function startupFunction() {
    updateButtonsAndCoins();
    for(i=0;i<metal_currency_pricelist.length;i++){
      updateMetalCurrency(metal_currency_pricelist[i],metal_currency_pricelistnames[i],0,0)
    }
  }


  function disableCoinView(){
    if(document.getElementById("myCanvas").style.visibility == "hidden"){
      document.getElementById("myCanvas").style.visibility = "visible"
    }
    else{
      document.getElementById("myCanvas").style.visibility = "hidden"
    }

  }
  function updateButtonsAndCoins() {
    
    document.getElementById("WalletOutput").innerHTML = "Wallet $" + wallet.toFixed(2) + "<br>" + "Day " + day   

    if (coinlist.length == 0) {
      max_page = 1
    }
    else {
      max_page = Math.floor((coinlist.length - 1) / 10) + 1
    }

    document.getElementById("pageOutput").innerHTML = 'Page ' + String(current_page) + '/' + String(max_page);
    document.getElementById("inventorybutton").innerHTML = "View <br> Inventory <br> " + String(inventorylist.length) + " Coins"
    document.getElementById("exchangebutton").innerHTML = "View <br> Foreign Exchange <br> " + String(exchangelist.length) + " Coins"
    document.getElementById("bulkbutton").innerHTML = "View <br> Bank/Bulk Return <br> " + String(bulklist.length) + " Coins"
    document.getElementById("sellbutton").innerHTML = "View Online Selling <br> " + String(selllist.length) + " Coins <br>" + "Selling limit: " + String(sell_limit) + " Coins"
    document.getElementById("scrapmetalbutton").innerHTML = "View <br> Scrap Metal <br> " + String(scrapmetallist.length) + " Coins"
    document.getElementById("collectionbutton").innerHTML = "View <br> Collection <br> " + String(collectionlist.length) + " Coins"

    if (current_page == 1) {
      document.getElementById("goLeftButton").disabled = true;
    }
    else {
      document.getElementById("goLeftButton").disabled = false;
    }
    if (current_page == max_page) {

      document.getElementById("goRightButton").disabled = true;
    }
    else {
      document.getElementById("goRightButton").disabled = false;
    }
    for (i = 0; i < 10; i++) {
      showximageinfo(i)
    }

    for (i = 0; i < product_pricelistnames.length; i++) {
      document.getElementById(product_pricelistnames[i] + "Cost").innerHTML = "$" + product_pricelist[i].toFixed(2)
      document.getElementById(product_pricelistnames[i] + "Quantity").innerHTML = product_amount[i]
      if(product_amount[i] == 0 || product_pricelist[i] > wallet){
        document.getElementById(product_pricelistnames[i] + "BuyButton").disabled = true
      }
      else{
        document.getElementById(product_pricelistnames[i] + "BuyButton").disabled = false
      }
    }  
    
    document.getElementById("returnforeignbutton").innerHTML = "Foreign Exchange<br>$" + exchangelist.map(foreignExchangeValue).reduce((a, b) => a + b, 0).toFixed(2)
    document.getElementById("returnbulkbutton").innerHTML = "Return Bulk<br>$" + bulklist.map(bulkreturnValue).reduce((a, b) => a + b, 0).toFixed(2)
    document.getElementById("sellscrapbutton").innerHTML = "Sell Scrap<br>$" + scrapmetallist.map(scrapValue).reduce((a, b) => a + b, 0).toFixed(2)
    

    ctx.clearRect(0, 0, c.width, c.height);
    showCoin(0)
    
  }


  var seed = 1
  function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

  function showCoin(i){
    if(i < coinlist.length){
        seed = coinlist[i].id + coinlist[i].salevalue
        diamm = coinlist[i].diameter * 3
        x = random()*(c.width - diamm)
        y = random()*(c.height - diamm)

        img = document.createElement('img');
            
        if (coinlist[i].sidetoshow == 0) {
          img.src="https://en.numista.com/catalogue/photos/" + coinlist[i].obsimage
        }
        else{
          img.src="https://en.numista.com/catalogue/photos/" + coinlist[i].revsimage;
        }

        img.onload = function(){
          ctx.save();
          roundedImage(x, y, diamm, diamm, diamm/1.7);
          ctx.clip();
          ctx.drawImage(img, x, y, diamm, diamm);
          ctx.restore();
          showCoin(i+1)
        }

        function roundedImage(x,y,width,height,radius){
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + width - radius, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
          ctx.lineTo(x + width, y + height - radius);
          ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
          ctx.lineTo(x + radius, y + height);
          ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
        }
      }

    }

 
 

  function updateMetalCurrency(inputamount, code, rate1, rate2) {
    if (rate1 + rate2 >= 0) {
      document.getElementById(code + "trend").src = "https://cdn.discordapp.com/attachments/209865726675255296/896416938744512522/up.png"
      document.getElementById(code + "trendpercent").style.color = "green"
    }
    else {
      document.getElementById(code + "trend").src = "https://cdn.discordapp.com/attachments/209865726675255296/896416946608820334/down.png"
      document.getElementById(code + "trendpercent").style.color = "red"
    }

    retval = inputamount * (1 + rate1 + rate2)
    document.getElementById(code + "ratetag").innerHTML = "$" + retval.toFixed(6)
    document.getElementById(code + "trendpercent").innerHTML = (Math.abs(rate1 + rate2) * 100).toFixed(2) + "%"

    return retval
  }

  function coinSetter(probability_cumulative, issuer, issuer_parent, issuer_parent_parent, title, currency, amount, year, year_modified, metal_modified, metal_modified_purity, weight_modified, diameter_modified, thickness_modified, image_obs_small, image_revs_small, coin_id, shape, is_commemorative, min_price, max_price, count_price, average_price, median_price ) {
    var sidenumber = 0;
    if (Math.random() > 0.5) {
      sidenumber = 1
    }
    salevalueedited = Math.random()/50
    if (min_price != "N.A."){
        if(parseFloat(count_price) >= 10){
            salevalueedited = parseFloat(min_price)  * (1 + Math.random()/2)
        }
        
    }

    var coin = {
        sidetoshow: sidenumber,
        salevalue: salevalueedited,
        yearandmint: year,
        year: parseInt(year_modified),
        country: issuer,
        countryParent: issuer_parent,
        countryParentParent:issuer_parent_parent,
        name: title,
        metal: metal_modified,
        purity: parseFloat(metal_modified_purity),
        weight: parseFloat(weight_modified),
        obsimage: image_obs_small,
        revsimage: image_revs_small,
        exchangecurrency: currency,
        denomination: amount,
        diameter:diameter_modified,
        id:coin_id
    };
    return coin
  }
  
  function randomsign(number) {
    if (Math.random() > 0.5) {
      return -1 * number
    }
    return number
  }
  function movetoinventory(number) {
    inventorylist.push(coinlist[((current_page - 1) * 10) + number])
    coinlist.splice(((current_page - 1) * 10) + number, 1)
    updateButtonsAndCoins()
  }
  function movetoexchange(number) {
    exchangelist.push(coinlist[((current_page - 1) * 10) + number])
    coinlist.splice(((current_page - 1) * 10) + number, 1)
    updateButtonsAndCoins()
  }
  function movetobulk(number) {
    bulklist.push(coinlist[((current_page - 1) * 10) + number])
    coinlist.splice(((current_page - 1) * 10) + number, 1)
    updateButtonsAndCoins()
  }
  function movetosell(number) {
    selllist.push(coinlist[((current_page - 1) * 10) + number])
    coinlist.splice(((current_page - 1) * 10) + number, 1)
    updateButtonsAndCoins()
  }
  function movetoscrapmetal(number) {
    scrapmetallist.push(coinlist[((current_page - 1) * 10) + number])
    coinlist.splice(((current_page - 1) * 10) + number, 1)
    updateButtonsAndCoins()
  }
  function movetocollection(number) {
    collectionlist.push(coinlist[((current_page - 1) * 10) + number])
    coinlist.splice(((current_page - 1) * 10) + number, 1)
    updateButtonsAndCoins()
  }

  function getxinfo(number) {
    return coinlist[(current_page - 1) * 10 + number].country + "<br>"+ coinlist[(current_page - 1) * 10 + number].name + "<br>" + coinlist[(current_page - 1) * 10 + number].yearandmint + "<br>" + Math.round(coinlist[(current_page - 1) * 10 + number].purity * 100) + "% " + coinlist[(current_page - 1) * 10 + number].metal
  }

  function showximageinfo(number) {
    if (coinlist.length > ((current_page - 1) * 10 + number)) {
      if (coinlist[((current_page - 1) * 10) + number].sidetoshow == 0) {
        document.getElementById("list" + String(number) + "img").src = "https://en.numista.com/catalogue/photos/" + coinlist[((current_page - 1) * 10) + number].obsimage;
        document.getElementById("list" + String(number) + "img").style = "border-radius:120px";
        document.getElementById("list" + String(number) + "img").width = coinlist[((current_page - 1) * 10) + number].diameter * 4.2
        document.getElementById("list" + String(number) + "img").height = coinlist[((current_page - 1) * 10) + number].diameter * 4.2
      }
      else {
        document.getElementById("list" + String(number) + "img").src = "https://en.numista.com/catalogue/photos/" + coinlist[((current_page - 1) * 10) + number].revsimage
        document.getElementById("list" + String(number) + "img").style = "border-radius:120px";
        document.getElementById("list" + String(number) + "img").width = coinlist[((current_page - 1) * 10) + number].diameter * 4.2
        document.getElementById("list" + String(number) + "img").height = coinlist[((current_page - 1) * 10) + number].diameter * 4.2
      }

      document.getElementById("list" + String(number)).innerHTML = getxinfo(number)
      document.getElementById("list" + String(number) + "inventorybutton").disabled = false
      document.getElementById("list" + String(number) + "collectionbutton").disabled = false


      if (selllist.length < sell_limit && sellingValue(coinlist[((current_page - 1) * 10) + number])>0){
        if(sellingValue(coinlist[((current_page - 1) * 10) + number]) > bulkreturnValue(coinlist[((current_page - 1) * 10) + number])){
        document.getElementById("list" + String(number) + "sellbutton").disabled = false
        document.getElementById("list" + String(number) + "sellbutton").innerHTML = "Sell Online" + " $" + sellingValue(coinlist[((current_page - 1) * 10) + number]).toFixed(3)
        }
      }
      else {
        document.getElementById("list" + String(number) + "sellbutton").disabled = true
        document.getElementById("list" + String(number) + "sellbutton").innerHTML = "Sell Online"
      }

      if (foreignExchangeValue(coinlist[((current_page - 1) * 10) + number])>0){
        document.getElementById("list" + String(number) + "exchangebutton").disabled = false
        document.getElementById("list" + String(number) + "exchangebutton").innerHTML = "Foreign" + " $" + foreignExchangeValue(coinlist[((current_page - 1) * 10) + number]).toFixed(3)
      }
      else {
        document.getElementById("list" + String(number) + "exchangebutton").disabled = true
        document.getElementById("list" + String(number) + "exchangebutton").innerHTML = "Foreign Exchange" 
      }

      document.getElementById("list" + String(number) + "bulkbutton").disabled = false
      document.getElementById("list" + String(number) + "bulkbutton").innerHTML = "Bulk Return" + " $" + bulkreturnValue(coinlist[((current_page - 1) * 10) + number]).toFixed(3)

      if ((coinlist[((current_page - 1) * 10) + number].metal == 'silver' || coinlist[((current_page - 1) * 10) + number].metal == 'copper' || coinlist[((current_page - 1) * 10) + number].metal == 'nickel'  || coinlist[((current_page - 1) * 10) + number].metal == 'gold')) {
        
        if(scrapValue(coinlist[((current_page - 1) * 10) + number]) > bulkreturnValue(coinlist[((current_page - 1) * 10) + number])){
            document.getElementById("list" + String(number) + "scrapmetalbutton").disabled = false
            document.getElementById("list" + String(number) + "scrapmetalbutton").innerHTML = "Scrap Metal" + " $" + (scrapValue(coinlist[((current_page - 1) * 10) + number])).toFixed(3)
        }
        else{
        document.getElementById("list" + String(number) + "scrapmetalbutton").disabled = true
        document.getElementById("list" + String(number) + "scrapmetalbutton").innerHTML = "Scrap Metal"
        }
      }
      else {
        document.getElementById("list" + String(number) + "scrapmetalbutton").disabled = true
        document.getElementById("list" + String(number) + "scrapmetalbutton").innerHTML = "Scrap Metal"
      }

    

    }
    else {

      document.getElementById("list" + String(number) + "img").src = 'https://cdn.discordapp.com/attachments/209865726675255296/896417147520155658/null.png'
      document.getElementById("list" + String(number)).innerHTML = null
      document.getElementById("list" + String(number) + "inventorybutton").disabled = true
      document.getElementById("list" + String(number) + "exchangebutton").disabled = true
      document.getElementById("list" + String(number) + "scrapmetalbutton").disabled = true
      document.getElementById("list" + String(number) + "sellbutton").disabled = true
      document.getElementById("list" + String(number) + "collectionbutton").disabled = true
      document.getElementById("list" + String(number) + "bulkbutton").disabled = true
    }
  }

  function flipcoin(number) {
    if (coinlist[((current_page - 1) * 10) + number].sidetoshow == 0) {
      document.getElementById("list" + String(number) + "img").src = "https://en.numista.com/catalogue/photos/" + coinlist[((current_page - 1) * 10) + number].revsimage
      coinlist[((current_page - 1) * 10) + number].sidetoshow = 1
    }
    else {
      document.getElementById("list" + String(number) + "img").src = "https://en.numista.com/catalogue/photos/" + coinlist[((current_page - 1) * 10) + number].obsimage
      coinlist[((current_page - 1) * 10) + number].sidetoshow = 0
    }
    updateButtonsAndCoins()

  }

  function callNextDay() {
    day = day + 1

    EuroRate = randomsign(Math.random() / 100)
    CommonweathRate = randomsign(Math.random() / 50)
    EuropeRate = randomsign(Math.random() / 40)
    AmericasRate = randomsign(Math.random() / 50)
    AsiaRate = randomsign(Math.random() / 100)
	//  var metal_currency_pricelistnames = ["COP", "NIC", "SIL","GOL", "CAD", "EUR", "GBP", "CHF", "JPY", "AUD",  "MXN", "PLN", "CZK", "SGD"]
    metal_currency_pricelist[0] = updateMetalCurrency(metal_currency_pricelist[0], metal_currency_pricelistnames[0], randomsign(Math.random() / 50), randomsign(Math.random() / 50) + 0.00004)
    metal_currency_pricelist[1] = updateMetalCurrency(metal_currency_pricelist[1], metal_currency_pricelistnames[1], randomsign(Math.random() / 50), randomsign(Math.random() / 50) + 0.00004)
    metal_currency_pricelist[2] = updateMetalCurrency(metal_currency_pricelist[2], metal_currency_pricelistnames[2], randomsign(Math.random() / 50), randomsign(Math.random() / 50) + 0.00004)
	metal_currency_pricelist[3] = updateMetalCurrency(metal_currency_pricelist[3], metal_currency_pricelistnames[3], randomsign(Math.random() / 50), randomsign(Math.random() / 50) + 0.00004)
	
    metal_currency_pricelist[4] = updateMetalCurrency(metal_currency_pricelist[4], metal_currency_pricelistnames[4], CommonweathRate, randomsign(Math.random() / 50))
    metal_currency_pricelist[5] = updateMetalCurrency(metal_currency_pricelist[5], metal_currency_pricelistnames[5], EuroRate, EuroRate)
    metal_currency_pricelist[6] = updateMetalCurrency(metal_currency_pricelist[6], metal_currency_pricelistnames[6], CommonweathRate, randomsign(Math.random() / 50))
    metal_currency_pricelist[7] = updateMetalCurrency(metal_currency_pricelist[7], metal_currency_pricelistnames[7], -EuroRate, randomsign(Math.random() / 100))
    metal_currency_pricelist[8] = updateMetalCurrency(metal_currency_pricelist[8], metal_currency_pricelistnames[8], -EuroRate, randomsign(Math.random() / 100))
    metal_currency_pricelist[9] = updateMetalCurrency(metal_currency_pricelist[9], metal_currency_pricelistnames[9], CommonweathRate, randomsign(Math.random() / 50))
    metal_currency_pricelist[10] = updateMetalCurrency(metal_currency_pricelist[10], metal_currency_pricelistnames[10], AmericasRate, randomsign(Math.random() / 50))
    metal_currency_pricelist[11] = updateMetalCurrency(metal_currency_pricelist[11], metal_currency_pricelistnames[11], EuropeRate, randomsign(Math.random() / 30))
    metal_currency_pricelist[12] = updateMetalCurrency(metal_currency_pricelist[12], metal_currency_pricelistnames[12], EuropeRate, randomsign(Math.random() / 30))
    metal_currency_pricelist[13] = updateMetalCurrency(metal_currency_pricelist[13], metal_currency_pricelistnames[13], AsiaRate, randomsign(Math.random() / 50))


    var k = 0
    while(k < selllist.length){
      if(Math.random()<0.05){
        wallet = wallet + sellingValue(selllist[k])
        selllist.splice(k,1)
      }
      else{
        k++;
       
      }
    }


    for(i = 0;i < product_amount.length;i++){
      product_amount[i] = Math.floor(Math.random() * 10)
    }

    updateButtonsAndCoins()

  }

  function sellingValue(coin){
    return parseFloat(coin.salevalue)
  }

  function scrapValue(coin){
    if(coin.metal == "copper"){
      return coin.weight*coin.purity*metal_currency_pricelist[0]
    }
    else if(coin.metal == "nickel"){
      return coin.weight*coin.purity*metal_currency_pricelist[1]
    }
    else if(coin.metal == "silver"){
      return coin.weight*coin.purity*metal_currency_pricelist[2]
    }
	else if(coin.metal == "gold"){
      return coin.weight*coin.purity*metal_currency_pricelist[3]
    }
    else{
      return 0
    }
  }


  function bulkreturnValue(coin){
    if(coin.country != "United States"){
      return coin.weight /454 * 10 * bulkReturnRate
    }
    return 0
  }

  function foreignExchangeValue(coin){

    if (coin.exchangecurrency == "CAD"){
        return metal_currency_pricelist[4] * parseFloat(coin.denomination) *exchangeReturnRate
    }
    if (coin.exchangecurrency == "EUR"){
        return metal_currency_pricelist[5] * parseFloat(coin.denomination)* exchangeReturnRate
    }
    if (coin.exchangecurrency == "GBP"){
        return metal_currency_pricelist[6] * parseFloat(coin.denomination)* exchangeReturnRate
    }
    if (coin.exchangecurrency == "CHF"){
        return metal_currency_pricelist[7]* parseFloat(coin.denomination)* exchangeReturnRate
    }
    if (coin.exchangecurrency == "JPY"){
        return metal_currency_pricelist[8]* parseFloat(coin.denomination)* exchangeReturnRate
    }
    if (coin.exchangecurrency == "AUD"){
        return metal_currency_pricelist[9]* parseFloat(coin.denomination)* exchangeReturnRate
    }
    if (coin.exchangecurrency == "MXN"){
        return metal_currency_pricelist[10]* parseFloat(coin.denomination)* exchangeReturnRate
    }
    if (coin.exchangecurrency == "PLN"){
        return metal_currency_pricelist[11]* parseFloat(coin.denomination)* exchangeReturnRate
    }
    if (coin.exchangecurrency == "CZK"){
        return metal_currency_pricelist[12]* parseFloat(coin.denomination)* exchangeReturnRate
    }
    if (coin.exchangecurrency == "SGD"){
        return metal_currency_pricelist[13]* parseFloat(coin.denomination)* exchangeReturnRate
    }
    if (coin.exchangecurrency == "USD"){
        return 1* parseFloat(coin.denomination)
    }
    return 0
  }



  function inventoryview() {
    document.getElementById("inventorybutton").disabled = true
    document.getElementById("exchangebutton").disabled = false
    document.getElementById("bulkbutton").disabled = false
    document.getElementById("sellbutton").disabled = false
    document.getElementById("scrapmetalbutton").disabled = false
    document.getElementById("collectionbutton").disabled = false
    current_page = 1;
    coinlist = inventorylist
    updateButtonsAndCoins();
  }

  function exchangeview() {
    document.getElementById("inventorybutton").disabled = false
    document.getElementById("exchangebutton").disabled = true
    document.getElementById("bulkbutton").disabled = false
    document.getElementById("sellbutton").disabled = false
    document.getElementById("scrapmetalbutton").disabled = false
    document.getElementById("collectionbutton").disabled = false
    current_page = 1;
    coinlist = exchangelist
    updateButtonsAndCoins();
  }

  function bulkview() {
    document.getElementById("inventorybutton").disabled = false
    document.getElementById("exchangebutton").disabled = false
    document.getElementById("bulkbutton").disabled = true
    document.getElementById("sellbutton").disabled = false
    document.getElementById("scrapmetalbutton").disabled = false
    document.getElementById("collectionbutton").disabled = false
    current_page = 1;
    coinlist = bulklist
    updateButtonsAndCoins();
  }

  function sellview() {
    document.getElementById("inventorybutton").disabled = false
    document.getElementById("exchangebutton").disabled = false
    document.getElementById("bulkbutton").disabled = false
    document.getElementById("sellbutton").disabled = true
    document.getElementById("scrapmetalbutton").disabled = false
    document.getElementById("collectionbutton").disabled = false
    current_page = 1;
    coinlist = selllist
    updateButtonsAndCoins();
  }

  function scrapmetalview() {
    document.getElementById("inventorybutton").disabled = false
    document.getElementById("exchangebutton").disabled = false
    document.getElementById("bulkbutton").disabled = false
    document.getElementById("sellbutton").disabled = false
    document.getElementById("scrapmetalbutton").disabled = true
    document.getElementById("collectionbutton").disabled = false
    current_page = 1;
    coinlist = scrapmetallist
    updateButtonsAndCoins();
  }

  function collectionview() {
    document.getElementById("inventorybutton").disabled = false
    document.getElementById("exchangebutton").disabled = false
    document.getElementById("bulkbutton").disabled = false
    document.getElementById("sellbutton").disabled = false
    document.getElementById("scrapmetalbutton").disabled = false
    document.getElementById("collectionbutton").disabled = true
    current_page = 1;
    coinlist = collectionlist
    updateButtonsAndCoins();
  }

  function sortSpendCoin(){
    var k = 0
    while(k < inventorylist.length){
      if(foreignExchangeValue(inventorylist[k]) == Math.max(foreignExchangeValue(inventorylist[k]),bulkreturnValue(inventorylist[k]),scrapValue(inventorylist[k]))){
        exchangelist.push(inventorylist[k])
        coinlist.splice(k, 1)
      }
      //else if (inventorylist[k].countryParent == "Netherlands"){
      //collectionlist.push(inventorylist[k])
      //coinlist.splice(k, 1)
      //}
      else if(
      scrapValue(inventorylist[k]) == Math.max(foreignExchangeValue(inventorylist[k]),bulkreturnValue(inventorylist[k]),scrapValue(inventorylist[k]))){
      scrapmetallist.push(inventorylist[k])
      coinlist.splice(k, 1)
     }
      else if(sellingValue(inventorylist[k]) > 20){
	    collectionlist.push(inventorylist[k])
        coinlist.splice(k, 1)
      }
      else if(bulkreturnValue(inventorylist[k]) == Math.max(foreignExchangeValue(inventorylist[k]),bulkreturnValue(inventorylist[k]),scrapValue(inventorylist[k]))){
        bulklist.push(inventorylist[k])
        coinlist.splice(k, 1)
      }

      else{
        k++;
       
      }
    }
    updateButtonsAndCoins()
  }

  function sortYearCoin(){

    inventorylist.sort((a, b) => a.year - b.year);
    updateButtonsAndCoins()
  }

  function sortSilverCoin(){

    inventorylist.sort((a, b) => scrapValue(b) -  scrapValue(a));
    updateButtonsAndCoins()
  }

  function buySetAmountCoins(coin_list,number,indexitem){
    wallet = wallet - product_pricelist[indexitem]
    product_amount[indexitem] = product_amount[indexitem] - 1
    random_list = []
    for(i = 0;i < Number.parseInt(number);i++){
      random_list.push(Math.random())
    }

    random_list = random_list.sort((a, b) => a - b);
    random_list_index = 0

    for(i = 0;i < coin_list.length;i++){
      while(random_list[random_list_index] < Number.parseFloat(coin_list[i][0])){
        random_list[random_list_index] = i
        random_list_index++;
      }
    }

    
    while(random_list.length > 0){
      random_index = Math.floor(Math.random()*random_list.length)
      inventorylist.push(coinSetter(...coin_list[random_list[random_index]]))
      random_list.splice(random_index,1)
    }
    updateButtonsAndCoins();
    }

  function buyWeightAmountCoins(coin_list,weightAmount,indexitem){
    wallet = wallet - product_pricelist[indexitem]
    product_amount[indexitem] = product_amount[indexitem] - 1
    var random_list = []

    for(i = 0;i < weightAmount;i++){
    random_list.push(Math.random())
    }

    random_list = random_list.sort((a, b) => a - b);
    random_list_index = 0
    for(i = 0;i < coin_list.length;i++){
        while(random_list[random_list_index] < Number.parseFloat(coin_list[i][0])){
            random_list[random_list_index] = i
            random_list_index++;
        }
    }

    var currentWeight = 0
    while(currentWeight < weightAmount){
        random_index = Math.floor(Math.random()*random_list.length)
        if(currentWeight + parseFloat(coin_list[random_list[random_index]][11]) < weightAmount + 2){
            currentWeight = currentWeight + parseFloat(coin_list[random_list[random_index]][11])
            inventorylist.push(coinSetter(...coin_list[random_list[random_index]]))
            random_list.splice(random_index,1)
        }
    }
    updateButtonsAndCoins();
  }

  function SellScrap(){
    wallet = wallet + scrapmetallist.map(scrapValue).reduce((a, b) => a + b, 0)
    scrapmetallist = []
    inventoryview()
    updateButtonsAndCoins();
  }

  function ReturnForeign(){
    wallet = wallet + exchangelist.map(foreignExchangeValue).reduce((a, b) => a + b, 0)
    exchangelist = []
    inventoryview()
    updateButtonsAndCoins();
  }

  function ReturnBulk(){
    wallet = wallet + bulklist.map(bulkreturnValue).reduce((a, b) => a + b, 0)
    bulklist = []
    inventoryview()
    updateButtonsAndCoins();
  }

  function goLeft() {
    current_page -= 1;
    updateButtonsAndCoins();
  }

  function goRight() {
    current_page += 1;
    updateButtonsAndCoins();
  }



 /* var inventorylist = []
  var collectionlist = [];
  var scrapmetallist = [];
  var selllist = [];
  var exchangelist = [];
  var bulklist = [];
  var coinlist = inventorylist;
  var current_page = 1;
  var min_page = 1;
  var max_page = 1;
  var sell_limit = 10;
  var wallet = 25.00;
  var day = 1;
  var metal_currency_pricelist = [0.007462, 0.016373, 0.726600, 56.62, 0.80357, 1.1538, 1.359, 1.07493, 0.008803, 0.7359, 0.048204, 0.25196, 0.045423, 0.737292]
  var product_amount = [10,10] 
*/

  function makeSave(){

    localStorage.setItem("inventorylist",JSON.stringify(inventorylist))
    localStorage.setItem("collectionlist",JSON.stringify(collectionlist))
    localStorage.setItem("scrapmetallist",JSON.stringify(scrapmetallist))
    localStorage.setItem("selllist",JSON.stringify(selllist))
    localStorage.setItem("exchangelist",JSON.stringify(exchangelist))
    localStorage.setItem("bulklist",JSON.stringify(bulklist)) 
    localStorage.setItem("coinlist",JSON.stringify(coinlist)) 
    localStorage.setItem("current_page",current_page)
    localStorage.setItem("min_page",min_page)
    localStorage.setItem("max_page",max_page)
    localStorage.setItem("sell_limit",sell_limit)
    localStorage.setItem("wallet",wallet)
    localStorage.setItem("day",day)
    localStorage.setItem("metal_currency_pricelist",JSON.stringify(metal_currency_pricelist))
    localStorage.setItem("product_amount",JSON.stringify(product_amount))
    updateButtonsAndCoins()
  }

  function loadSave(){

    inventorylist = JSON.parse(localStorage.getItem("inventorylist"))

    collectionlist = JSON.parse(localStorage.getItem("collectionlist"))
    scrapmetallist = JSON.parse(localStorage.getItem("scrapmetallist"))
    selllist = JSON.parse(localStorage.getItem("selllist"))
    exchangelist = JSON.parse(localStorage.getItem("exchangelist"))
    bulklist = JSON.parse(localStorage.getItem("bulklist"))

    current_page = parseInt(localStorage.getItem("current_page"))
    min_page = parseInt(localStorage.getItem("min_page"))
    max_page = parseInt(localStorage.getItem("max_page"))
    sell_limit = parseInt(localStorage.getItem("sell_limit"))
    wallet = parseFloat(localStorage.getItem("wallet"))
    day = parseInt(localStorage.getItem("day"))
    metal_currency_pricelist = JSON.parse(localStorage.getItem("metal_currency_pricelist"))
    product_amount = JSON.parse(localStorage.getItem("product_amount"))
   
    inventoryview()
    coinlist = inventorylist

    updateButtonsAndCoins()
  }
