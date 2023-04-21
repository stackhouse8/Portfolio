
/*function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
    if(!event.target.matches('.dropbtn')) {
        var dropwdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropwdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

var apiKey = "W1L4ukvhh9ASpC8FYICufwmnwxcv6i16sNbSq9ZY";

//state data
var states = document.getElementsByTagName("option");
var searchInputVal = document.querySelector
var formatinput

for (var i = 0; i < states.length ; i++) {
    states[i].addEventListener("click", 
        function (event) {
            var e = document.getElementByValue("format-input");
            console.log(e)
            event.preventDefault();
        }, 
        false);
        }
    */
var cMBnt = document.querySelector('#clickMeBnt');
var historyEL = $("#history");
var clearEL = $("#hClearBnt");
var state = "";
var runs = 0;
var park = {};
var parkCodes = [];
var parkNames = [];
//gets the the current state selected by user 
function getState(event){
    event.preventDefault();
    if( runs >= 1){
        clearOldStuff();
        }
        //pulls state from dropdown box.
     state = document.querySelector("#format-input").value;
    setParkBubbles(state);
    runs++;
}
// grabs a list of parks within the set state
var pageAnchor = $("#results")
async function getParks(){
    var parkAPI = "https://developer.nps.gov/api/v1/parks?stateCode=" + state + "&api_key=W1L4ukvhh9ASpC8FYICufwmnwxcv6i16sNbSq9ZY";
    let dataResults = fetch(parkAPI)
    .then(function(response){
        var results = response.json();
        console.log(results);
            return results;
        });
        let data = await dataResults;
        return data;
}
    //loads list of old parks.
    function loadHistory(){
        var oldNames = JSON.parse(localStorage.getItem("parks"));
        var oldcodes = JSON.parse(localStorage.getItem("codes"));

        if (!oldNames){
            return;
        }
        else{
            for (var i=0;i<oldNames.length; i++){
                //loads old list of parks and codes.
                parkNames.push(oldNames[i]);
                parkCodes.push(oldcodes[i]);
                //creates button for each park.
                createPastButton(oldNames[i],oldcodes[i]);

            }
        }
    };

//creates history buttons for all of the current past searches.
async function createPastButton(parkNames,parkCodes){ 
console.log(parkCodes)
    var oldSearchBnt = $("<button>");
    oldSearchBnt.attr("value", parkCodes);
    oldSearchBnt.text(parkNames);
    oldSearchBnt.addClass("flex flex-col bg-stone-400 hover:bg-stone-600 rounded btn border-2 border-black btn-info btn-block mt-4")
    historyEL.append(oldSearchBnt);
    //adds event listener for the old buttons
    oldSearchBnt.on("click", function (event){
        event.preventDefault();
       
        var queryString = './resortpage.html?q=' + parkCodes;
        location.assign(queryString);
    })
};
// creates the blocks that contain the loaded list of parks.
async function setParkBubbles(){
    var data = await getParks(state);
    console.log(data);
    // checks for valid data
    if (!data){
        console.error("AHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
        return;
    }
     for(i=0; i<data.data.length; i++){
    var parkdiv = $("<button>");
    parkdiv.attr({id: data.data[i].parkCode});
    parkdiv.attr("value", i );
    parkdiv.attr({SN: data.data[i].name})
    pageAnchor.append(parkdiv);
    parkdiv.addClass("parkBlock");

    var coolIcon = $("<img>");
    coolIcon.attr("src",  data.data[i].images[0].url);
    parkdiv.append(coolIcon);
    coolIcon.addClass("parkBlockimg");

    var parkName = $("<h2>");
    parkName.addClass("text-center text-2xl p-2");
    parkName.text(data.data[i].fullName);
    parkdiv.append(parkName);
    
 //adds event listoner for each park block, upon clicking sends you to next page.
    parkdiv.on("click", function (event) {
        event.preventDefault();
        var parkCode = $(this).attr("id")
        park.code = $(this).attr("id");
        park.name = $(this).attr("sn");
        setLocalStorge();
        var queryString = './resortpage.html?q=' + parkCode;
        location.assign(queryString);
      });

    // Add mouseover event listener to display additional information
    parkdiv.on("mouseover", function () {
        var parkInfo = $("<div>");
        parkInfo.addClass("parkBlock-info");
        console.log($(this).attr("value"))
        parkInfo.text("This park is located in " + data.data[$(this).attr("value")].addresses[0].city + "! Click me to show more info!");
      
  
        // Append the information box to the parent element
        $(this).append(parkInfo);
      });
  
      // Add mouseout event listener to remove the information box
      parkdiv.on("mouseout", function () {
        $(this).find(".parkBlock-info").remove();
      });
    }
     
};
//saves lists to local storge
function saveLists(){
    localStorage.setItem("parks", JSON.stringify(parkNames));
    localStorage.setItem("codes", JSON.stringify(parkCodes));
    }
//adds searched thing to lists
function setLocalStorge(){ 
     if (parkNames.includes(park.name)){
         return;
     }
     else{
         parkNames.push(park.name);
         parkCodes.push(park.code);
         saveLists();
     };
 };
 //clears history bnts
 clearEL.on("click", function (){
    localStorage.clear();
    location.reload();
 }) 
//clears the last search results.
function clearOldStuff(){
    var curentday = document.getElementById("results");
    console.log(curentday);
    while (curentday.firstChild) {
        curentday.removeChild(curentday.firstChild);
      }
};
//grabs parks when the button is clicked
loadHistory();
cMBnt.addEventListener("click",getState)