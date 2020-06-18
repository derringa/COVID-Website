import '../scss/data.scss';
import '../scss/nav.scss';

document.addEventListener('DOMContentLoaded', () => {
    console.log('hello data');

    const MAPAPIKEY = 'AIzaSyBpXm7Z_Rr99Ki3_iB4vHpZlPBicXqrvIk';
    // Create the script tag, set the appropriate attributes
    var script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPAPIKEY}&callback=initMap`;
    script.defer = true;
    script.async = true;

    // Attach your callback function to the `window` object
    window.initMap = function() {
    // JS API is loaded and available
        let map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: 39.50, lng: -98.35 },
            zoom: 4
        });
    };

    

    // Append the 'script' element to 'head'
    document.head.appendChild(script);
})
