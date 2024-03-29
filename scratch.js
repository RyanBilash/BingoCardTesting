function Random(seed) {
    this._seed = seed % 2147483647;
    if (this._seed <= 0) this._seed += 2147483646;
}

/**
 * Returns a pseudo-random value between 1 and 2^32 - 2.
 */
Random.prototype.next = function () {
    return this._seed = this._seed * 16807 % 2147483647;
};


/**
 * Returns a pseudo-random floating point number in range [0, 1).
 */
Random.prototype.nextFloat = function (opt_minOrMax, opt_max) {
    // We know that result of next() will be 1 to 2147483646 (inclusive).
    return (this.next() - 1) / 2147483646;
};

var squares = [];
var todaySquares = [];
var canJumble = true;

function getText(){
    var quote;
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();;
        request.open("GET", "https://raw.githubusercontent.com/RyanBilash/BingoCardTesting/master/items.txt", true);
        request.send(null);
        request.onreadystatechange = function() {
            if (request.readyState == 4)
                resolve(request.responseText);
        };
    });
}

async function updateSquares(){
    items = await getText();

    items = items.split('\n');

    squares = [];
    for (var i = 0; i < items.length; i++) {
        if(items[i]!=""){
            squares.push(items[i]);
        }
    }
}

async function getTodaySquares(){
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDay();

    await updateSquares();

    console.log(squares);

    var r = new Random(parseInt(""+year+""+month+""+day));

    todaySquares = [];
    for (var i = 0; i < 24; i++) {
        var index = Math.floor(r.nextFloat()*squares.length);
        todaySquares[i] = squares[index];
        squares.splice(index,1);
    }

    await updateSquares();
}

async function generateCard(){
    canJumble = false;

    await getTodaySquares();

    var s = "";

    var nums = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];

    for (var i = 0; i < todaySquares.length; i++) {

        var index = Math.floor(Math.random()*nums.length);
        s+=nums[index];
        nums.splice(index,1);
        if(i<23){
            s+="i";
        }
    }
    console.log(s);
    window.location.href = "https://sites.google.com/udel.edu/eastwestbingocard/card?id="+s;
}

async function getCard(id){
    id = id.replace("id=","");
    id = id.substr(0,61);
    console.log(id);
    var items = id.split("i");

    await getTodaySquares();

    var s = "<table>";

    for (var i = 0; i < 5; i++) {
        s+="<tr>";
        for (var j = 0; j < 5; j++) {
            if(i==j && i==3){
                s+="<td>Free Space</td>";
            }else{
                s+="<td>"+todaySquares[i*5+j]+"</td>";
            }
        }
        s+="</tr>";
    }

    s+="</table>";

    document.getElementById('tableThing') = s;
}

//document.onload = function(){
    if(window.location.href.includes("edit?authuser")){

    }
    else if(!window.location.href.includes("id=")) {
        generateCard();
    }else{
        getCard(window.location.href.substr(window.location.href.lastIndexOf("id=")))
    }
//}
