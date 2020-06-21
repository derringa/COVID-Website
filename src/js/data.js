import '../scss/home.scss';
import '../scss/data.scss';

function stateCode(state){
    /*
    Convert the various ways states can be represented in the geocoder response to a 2 letter state code.
    */
    let stateCodeUnification = {
        'al': 'al',
        'alabama': 'al',
        'az': 'az',
        'arizona': 'az',
        'ar': 'ar',
        'arkansas': 'ar',
        'ak': 'ak',
        'alaska': 'ak',
        'ca': 'ca',
        'california': 'ca',
        'co': 'co',
        'colorado': 'co',
        'ct': 'ct',
        'connecticut': 'ct',
        'de': 'de',
        'delaware': 'de',
        'fl': 'fl',
        'florida': 'fl',
        'ga': 'ga',
        'georgia': 'ga',
        'id': 'id',
        'idaho': 'id',
        'il': 'il',
        'illinois': 'il',
        'in': 'in',
        'indiana': 'in',
        'ia': 'ia',
        'iowa': 'iowa',
        'ks': 'ks',
        'kansas': 'ks',
        'ky': 'ky',
        'kentucky': 'ky',
        'la': 'la',
        'louisiana': 'la',
        'me': 'me',
        'maine': 'me',
        'md': 'md',
        'maryland': 'md',
        'ma': 'ma',
        'massachusetts': 'ma',
        'mi': 'mi',
        'michigan': 'mi',
        'mn': 'mn',
        'minnesota': 'mn',
        'ms': 'ms',
        'mississippi': 'ms',
        'mo': 'mo',
        'missouri': 'mo',
        'mt': 'mt',
        'montana': 'mt',
        'ne': 'ne',
        'nebraska': 'ne',
        'nv': 'nv',
        'nevada': 'nv',
        'nh': 'nh',
        'new hampshire': 'nh',
        'nj': 'nj',
        'new jersey': 'nj',
        'nm': 'nm',
        'new mexico': 'nm',
        'ny': 'ny',
        'new york': 'ny',
        'nc': 'nc',
        'north carolina': 'nc',
        'nd': 'nd',
        'north dakota': 'nd',
        'oh': 'oh',
        'ohio': 'oh',
        'ok': 'ok',
        'oklahoma': 'ok',
        'or': 'or',
        'oregon': 'or',
        'pa': 'pa',
        'pennsylvania': 'pa',
        'ri': 'ri',
        'rhode island': 'ri',
        'sc': 'sc',
        'south carolina': 'sc',
        'sd': 'sd',
        'south dakota': 'sd',
        'tennessee': 'tn',
        'tn': 'tn',
        'texas': 'tx',
        'tx': 'tx',
        'utah': 'ut',
        'ut': 'ut',
        'vermont': 'vt',
        'vt': 'vt',
        'virginia': 'va',
        'va': 'va',
        'washington': 'wa',
        'wa': 'wa',
        'west virginia': 'wv',
        'wv': 'wv',
        'wisconsin': 'wi',
        'wi': 'wi',
        'wyoming': 'wy',
        'wy': 'wy'
    };
    return stateCodeUnification[state.toLowerCase()];
}

function stateName(state){
    /*
    Convert the various ways states can be represented in the geocoder response to a 2 letter state code.
    */
    let stateCodeUnification = {
        'al': 'Alabama',
        'az': 'Arizona',
        'ar': 'Arkansas',
        'ak': 'Alaska',
        'ca': 'California',
        'co': 'Colorado',
        'ct': 'Connecticut',
        'de': 'Delaware',
        'florida': 'Florida',
        'ga': 'Georgia',
        'id': 'Idaho',
        'il': 'Illinois',
        'in': 'Indiana',
        'ia': 'Iowa',
        'ks': 'Kansas',
        'ky': 'Kentucky',
        'la': 'Louisiana',
        'me': 'Maine',
        'md': 'Maryland',
        'ma': 'Massachusetts',
        'mi': 'Michigan',
        'mn': 'Minnesota',
        'ms': 'Mississippi',
        'mo': 'Missouri',
        'mt': 'Montana',
        'ne': 'Nebraska',
        'nv': 'Nevada',
        'nh': 'New Hampshire',
        'nj': 'New Jersey',
        'nm': 'New Mexico',
        'ny': 'New York',
        'nc': 'North Carolina',
        'nd': 'North Dakota',
        'oh': 'Ohio',
        'ok': 'Oklahoma',
        'or': 'Oregon',
        'pa': 'Pennsylvania',
        'ri': 'Rhode Island',
        'sc': 'South Carolina',
        'sd': 'South Dakota',
        'tn': 'Tennessee',
        'tx': 'Texas',
        'ut': 'Utah',
        'vt': 'Vermont',
        'va': 'Virginia',
        'wa': 'Washington',
        'wv': 'West Virginia',
        'wi': 'Wisconsin',
        'wy': 'Wyoming'
    };
    return stateCodeUnification[state];
}

document.addEventListener('DOMContentLoaded', () => {
    const MAPAPIKEY = 'AIzaSyBpXm7Z_Rr99Ki3_iB4vHpZlPBicXqrvIk';
    // Create the script tag, set the appropriate attributes
    var script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPAPIKEY}&callback=initMap`;
    script.defer = true;
    script.async = true;

    // Attach your callback function to the `window` object

    window.initMap = function() {
    // JS API is loaded and available
        let myLatlng = { lat: 39.50, lng: -98.35 }

        let map = new google.maps.Map(document.getElementById("map"), {
            center: myLatlng,
            zoom: 3,
            draggable: false
        });

        // Create the initial InfoWindow telling user to click the map at the location they want
        var infoWindow = new google.maps.InfoWindow(
        {content: 'Click on your state to get state info!', position: myLatlng});
        infoWindow.open(map);

        /* Set up geocoder */
        var geocoder = new google.maps.Geocoder;

        // Set up chart.js
        let chartjs = document.createElement('script');
        chartjs.src = 'https://cdn.jsdelivr.net/npm/chart.js@2.8.0';
        document.getElementsByTagName('head')[0].appendChild(chartjs);

        // Configure the click listener.
        map.addListener('click', function(mapsMouseEvent) {
            // Close the current InfoWindow.
            infoWindow.close();
        
            // Create a new InfoWindow.
            infoWindow = new google.maps.InfoWindow({position: mapsMouseEvent.latLng});
            geocodeLatLng(map, mapsMouseEvent.latLng, geocoder, (result)=>{
                getData(stateCode(result));
            }); 
        });
    };

    /* Covert latitude and longitude to a state */
    function geocodeLatLng(map, latLong, geocoder, callback) {
        geocoder.geocode({'location': latLong}, function(result, status) {
            /* Does stuff if the geocode is valid */
            if (status === 'OK') {
                if (result[0]) {
                    placeMarker(latLong, map);
                    let addressInParts = result[0]['formatted_address'].split(',');
                    let state = addressInParts[ addressInParts.length - 2].split(' ')[1];
                    callback(state);
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }

    /* Puts and updates the red place marker on the map */
    let marker;
    function placeMarker(latlng, map){
        if (marker){
            marker.setPosition(latlng);
        } else {
            marker = new google.maps.Marker({
                position: latlng,
                map: map
            });
        }
    }


    //
    //
    // Get Data
    //
    //
    let graph;

    function getData(state){
        let url = `/getState?state=${state}&historic=true`;
        fetch(url)
        .then(result => result.json())
        .then(res => {
            putDataInDocument(res[0]);
            graph = makeGraph(res, graph);
        })
    }

    function addData(name, stat){
        let statsElement = document.createElement('h3');
        if (stat === null) {
            stat = 'Unrecorded';
        }
        statsElement.innerText = name + stat;
        return statsElement
    }

    function putDataInDocument(data){
        let dataArea = document.getElementById('data-box');
        dataArea.innerHTML = '';
        let stateTitle = document.createElement('h2');
        stateTitle.innerText = 'Data for ' + stateName(data['state'].toLowerCase())+':';
        dataArea.appendChild(stateTitle);
        
        // New Covid Cases Today
        dataArea.appendChild(addData('New Cases Today: ',data['positiveIncrease']));

        // Total Deaths Today
        dataArea.appendChild(addData('Total Deaths Today: ',data['deathIncrease']));

        // Cumulative Deaths
        dataArea.appendChild(addData('Cumulative deaths: ',data['death']));

        // Currently Hospitalized
        dataArea.appendChild(addData('Patients Currently Hospitalized: ',data['hospitalizedCurrently']));

        // COVID patients in ICU
        dataArea.appendChild(addData('Patient currently in ICU: ',data['inIcuCurrently']));
    };

    
    function makeGraph(dataArray, oldGraph){
        let days = [];
        let positive = [];
        let death = [];
        for (let day of dataArray){
            days.push(day['date']);
            death.push(day['death']);
            positive.push(day['positive']);
        }
        days.reverse()
        death.reverse()
        positive.reverse();
        // Destroy the old canvas/chart and create a new one.
        let oldChart = document.getElementById('line-chart');
        oldChart.parentNode.removeChild(oldChart);

        let newChart = document.createElement('canvas');
        newChart.width = "800";
        newChart.height = "450";
        newChart.id = "line-chart";

        document.getElementById('line-chart-div').appendChild(newChart);
        

        graph = new Chart(document.getElementById('line-chart'), {
            type: 'line',
            data: {
              labels: days,
              datasets: [{ 
                  data: positive,
                  label: "Total Cases",
                  borderColor: "#3e95cd",
                  fill: false
                }, { 
                  data: death,
                  label: "Total Deaths",
                  borderColor: "#8e5ea2",
                  fill: false
                }
              ]
            },
            options: {
              title: {
                display: true,
                text: 'Covid Data for ' + stateName(dataArray[0]['state'].toLowerCase())
              }
            }
          });
    }


    // Append the 'script' element to 'head'
    document.head.appendChild(script);
})
