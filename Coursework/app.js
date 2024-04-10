//Home Page Constants
const homeNav = document.getElementById('home-nav');
const homePage = document.getElementById('home-page');
homeNav.root = homePage;

const storageInput = document.getElementById('userName');
const textOutput = document.getElementById('accountInfo');
const userRegion = document.querySelector('#select-region');

const saveTextLocal = document.getElementById('btn-saveL');
const getTextLocal = document.getElementById('btn-getL');

//Map Page constants
const mapNav = document.getElementById('map-nav');
const mapPage = document.getElementById('map-page');
mapNav.root = mapPage;

const reloadMap = document.querySelector('#btn-refresh');
const mapAlerts = document.getElementById('mapNotifs');

//Species Page constants
const speciesNav = document.getElementById('species-nav');
const speciesPage = document.getElementById('species-page');
speciesNav.root = speciesPage;

let speciesObjectArray = [];
let name = "";

const animalSearch = document.getElementById('inp-search');
const searching = document.getElementById('txt-search');
const outputSelect = document.querySelector('#btn-display');

const animalName = document.getElementById('nameLabel');
const latinName = document.getElementById('latinLabel');
const animalLocation = document.getElementById('countryLabel');
const populationNumber = document.getElementById('numberLabel');
const threatsToLife = document.getElementById('threatLabel');

//Animal of the Day Page constants
const habitatNav = document.getElementById('aotd-nav');
const habitatPage = document.getElementById('aotd-page');
habitatNav.root = habitatPage;

const imageDisplay = document.getElementById('img-display');
const nextShiba = document.querySelector('#btn-shiba');
const shibaDetails = document.querySelector('#btn-moreShiba');

//Quiz Page constants
const quizNav = document.getElementById('quiz-nav');
const quizPage = document.getElementById('quiz-page');
quizNav.root = quizPage;

const questionBlock = document.getElementById('lbl-question');
const changeQuestion = document.querySelector('#btn-question');

const selectAnswer = document.querySelector('#select-answer');
const displayResults = document.getElementById('quizResults');
let correctAnswer;

// Making a map and tiles
const myMap = document.getElementById('map');
const map = L.map('map');

let layerGroup = L.layerGroup().addTo(map);

map.setView([51.000, 0.000], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

//Code to deal with leaflet/ionic issue
const resize = new ResizeObserver( () => {
    map.invalidateSize()
}, 12);
resize.observe(myMap);

function shibaMapPoint(){
    let shibaIcon = L.icon({
        iconUrl : "Paw Print.png",
        iconSize:     [30, 30],
    });

    let shibaOnMap = L.marker(shibaMarkerData[0]._latlng, {icon: shibaIcon}).bindPopup('Animal of the Day - Shiba Inu');
    shibaOnMap.addTo(layerGroup);
}

function userMarker(aRegion){
    clearMapPoints();
    let youAreHere;

    for (i = 0; i <= continentsData.length; i++){
        if (aRegion === continentsData[i]){
            youAreHere = L.marker(geoPointData[i]._latlng).bindPopup('You are here');
            youAreHere.addTo(layerGroup);

        }
    }
}

function clearMapPoints(){
    mapAlerts.textContent = "";
    layerGroup.clearLayers();
}

//Fetching and displaying new information
outputSelect.addEventListener('click', displayFacts);
nextShiba.addEventListener('click', getShibaImages);
shibaDetails.addEventListener('click', displayShiba);
reloadMap.addEventListener('click', clearMapPoints);
changeQuestion.addEventListener('click', getQuestions);

function displayFacts(){
    let searchAnimal = searching.textContent;
    name = searchAnimal.replaceAll("@animal", animalSearch.value);
    //console.log(name);
    getAnimalFacts(name);
}

function displayShiba(){
    name = "Shiba Inu";
    getAnimalFacts(name);
}

// --- Animal Facts API : https://api-ninjas.com/api/animals --- //
async function getAnimalFacts(aName){
    const apiURL = `https://api.api-ninjas.com/v1/animals?name=${aName}&x-api-key=${apiKey2}`;

    try {
        const response = await fetch(apiURL);
        const json = await getJson(response);
        updateDisplay(json);
        //console.log(response);
        //console.log(json);
    } catch (error) {
        reportError(error);
    }
}

// --- Random Shiba Pictures API : https://shibe.online/ --- //
async function getShibaImages(){
    const apiURL = `https://shibe.online/api/shibes`;
    
    try {
        const response = await fetch(apiURL);
        const json = await getJson(response);
        newImage(json);
        //console.log(response);
        //console.log(json);

        shibaMapPoint();

    } catch (error) {
        reportError(error);
    }
}

async function newImage(jsonObj){
    try{
        const data = jsonObj;
        //console.log(data);
            
        let speciesImageURL = data;
        imageDisplay.src = speciesImageURL;

    } catch (error){
        reportError(error);
    }
}

// --- Assign markers by animal Location --- //
function getContinent(aName, aContinent){
    let printOnMap = "";
    let counter = 0;
    mapAlerts.textContent = aContinent.length;
    //console.log(aContinent.length);
    
    for (let i = 0; i < geoPointData.length; i++){
        if (aContinent.length >= 2){
            if (aContinent[counter] === continentsData[i]){
                //console.log("Found in " + contintentsData[i]);
                //console.log(geoPointData[i]._latlng.lat, geoPointData[i]._latlng.lng);
                
                printOnMap = L.marker([geoPointData[i]._latlng.lat, geoPointData[i]._latlng.lng]).bindPopup(aName + ", found in " + continentsData[i]);
                printOnMap.addTo(layerGroup);

                counter++
            }
            
        } else {
            if (aContinent[0] === continentsData[i]){
                //console.log("Found in " + contintentsData[i]);
                //console.log(geoPointData[i]._latlng.lat, geoPointData[i]._latlng.lng);

                printOnMap = L.marker([geoPointData[i]._latlng.lat, geoPointData[i]._latlng.lng]).bindPopup(aName + ", found in " + continentsData[i]);
                printOnMap.addTo(layerGroup);
            }
        } 
    }
}

// --- Data Persistence --- //
const storedLocalUser = localStorage.getItem('userName');
const storedLocalRegion = localStorage.getItem('select-region');

saveTextLocal.addEventListener('click', saveToLocalStorage);
getTextLocal.addEventListener('click', getLocalStorage);

function saveToLocalStorage(){
    localStorage.setItem('userName', storageInput.value);
    localStorage.setItem('select-region', userRegion.value);
    console.log("Saved to local storage");
}

function getLocalStorage(){
    const localUser = localStorage.getItem('userName');
    const localRegion = localStorage.getItem('select-region');
    const localData = localUser + ", " + localRegion;

    console.log("Local data is " + localData);
    textOutput.textContent = localData;

    userMarker(localRegion);
}

function accountInput(){
    const alert = document.querySelector('#userStored');
    alert.buttons = ['OK'];
}
accountInput();

// --- Quiz Questions --- //
function getQuestions(){
    let question;
   
    for (i = 0; i <= quizQuestions.length; i++){
        question = quizQuestions[Math.floor(Math.random()*5)];
        
    }
    //console.log(question);
    questionBlock.textContent = question;
    setAnwers(question);
     
}

function setAnwers(aQuestion){
    if (aQuestion === quizQuestions[0]){
        //console.log("Ligers");
        correctAnswer = quizOptions[2]; 
    }

    if (aQuestion === quizQuestions[1]){
        //console.log("Shibas");
        correctAnswer = quizOptions[0];
    }

    if (aQuestion === quizQuestions[2]){
        //console.log("Proboscis Monkeys");
        correctAnswer = quizOptions[0];
    }

    if (aQuestion === quizQuestions[3]){
        //console.log("Panthers");
        correctAnswer = quizOptions[2];
    }

    if (aQuestion === quizQuestions[4]){
        //console.log("Zebra");
        correctAnswer = quizOptions[1];
    }
}

function getAnswers(){
    let answer = selectAnswer.value;
    checkAnswers(answer);
}

function checkAnswers(anAnswer){
    //console.log(anAnswer);
    //console.log(correctAnswer);

    if (anAnswer === correctAnswer){
        //console.log("Correct answer!");
        displayResults.textContent = "Correct answer!";

    } else {
        //console.log("Better luck next time");
        displayResults.textContent = "Better luck next time";
    }
}

selectAnswer.addEventListener('ionChange', getAnswers);
//checkAnswers(selectAnswer.value);

async function getJson(aResponse){
    return aResponse.json();
}

async function updateDisplay(jsonObj){
    //console.log(jsonObj.length);
    let speciesObj;
    let speciesCounter;
    
    for (let i = 0; i < jsonObj.length; i++){
        speciesObjectArray[i] = jsonObj[i].name;

        if (jsonObj[i].name === name){
            speciesObj = speciesObjectArray[i];
            speciesCounter = i;

        }
    }
    //console.log(speciesObj);
    //console.log(speciesCounter);
    //console.log(speciesObjectArray);

    clearMapPoints();

    try{
        const data = jsonObj;
        //console.log(data);
        
        animalName.textContent = "Name: " + data[speciesCounter].name;
        latinName.textContent = "Species: " + data[speciesCounter].taxonomy.scientific_name;
        animalLocation.textContent = "Habitat: " + data[speciesCounter].characteristics.habitat + " found in " + data[speciesCounter].locations;
        populationNumber.textContent = "Population: " + data[speciesCounter].characteristics.estimated_population_size;
        threatsToLife.textContent = "Primary threats: " + data[speciesCounter].characteristics.biggest_threat;

        getContinent(data[speciesCounter].name, data[speciesCounter].locations);
        //console.log(data[speciesCounter].locations);

    } catch (error){
        reportError(error);
    }
}

async function reportError(anError){
    console.log(anError);

    animalName.textContent = "Could not find animal";
    latinName.textContent = "???";
    animalLocation.textContent = "???";
    populationNumber.textContent = "???";
    threatsToLife.textContent = "???";
}