import '../scss/data.scss';
import '../scss/nav.scss';

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

        // Configure the click listener.
        map.addListener('click', function(mapsMouseEvent) {
            // Close the current InfoWindow.
            infoWindow.close();
        
            // Create a new InfoWindow.
            infoWindow = new google.maps.InfoWindow({position: mapsMouseEvent.latLng});
            geocodeLatLng(map, mapsMouseEvent.latLng, geocoder, (result)=>{
                console.log(stateCode(result));
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

    // Append the 'script' element to 'head'
    document.head.appendChild(script);
})
