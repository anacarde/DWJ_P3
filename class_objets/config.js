var Config = {
    Map: {
        center: [45.764043, 4.835658999999964],
        defaultZoom: 12,
        tileLayer: {
            path: 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYW5hY2FyZGUiLCJhIjoiY2psdzN4eDl0MTNwNjNxbXhtb3k5eTludSJ9.Y_qL1ixqDRdfe9il2ZrQmg',
            options: {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                minZoom: 12,
                maxZoom: 18,
                id: 'mapbox.streets',
                ext: 'png',
                accessToken: 'your.mapbox.access.token'
            }
        }
    },
    Status: {
        unavailable: {
            icon: L.icon ({
                iconUrl: "./images/marqueurs/red_cycle.png",
                iconSize: [30, 34],
                iconAnchor: [15, 34],
                popupAnchor: [0, -34]
            }),
            label: "cette station est indisponible",
            valid: false
        },
        unavailableBikes: {
            icon: L.icon ({
                iconUrl: "./images/marqueurs/gray_cycle.png",
                iconSize: [30, 34],
                iconAnchor: [15, 34],
                popupAnchor: [0, -34]
            }),
            label: "cette station n'a pas de vélos disponibles",
            valid: false
        },
        full: {
            icon: L.icon ({
                iconUrl: "./images/marqueurs/blue_marine_cycle.png",
                iconSize: [30, 34],
                iconAnchor: [15, 34]
            }),
            label: "cette station est pleine",
            valid: true
        },
        availableSpots: {
            icon: L.icon({
                iconUrl: "./images/marqueurs/blue_cycle.png",
                iconSize: [30, 34],
                iconAnchor: [15, 34]
            }),
            label: "cette station contient des emplacements disponibles",
            valid: true
        },
        fewAvailableSpots: {
            icon: L.icon({
                iconUrl: "./images/marqueurs/blue_gray_cycle.png",
                iconSize: [30, 34],
                iconAnchor: [15, 34]
            }),
            label: "cette station n'a plus beaucoup d'emplacements disponibles",
            valid: true
        },
        checked: {
            icon: L.icon ({
                iconUrl: "./images/marqueurs/orange_cycle.png",
                iconSize: [44, 50],
                iconAnchor: [22, 50]
            }),
            label: "station sélectionnée",
            valid: true
        },
        reserved: {
            icon: L.icon ({
                iconUrl: "./images/marqueurs/green_cycle.png",
                iconSize: [44, 50],
                iconAnchor: [22, 50],
                popupAnchor: [0, -50]
            }),
            label: "Vélo réservé à cette station",
            valid: true
        }
    },
    JCDecauxApi: {
        path: "https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=bda7e9b3256ef69d1888febfd11784f8c507d71f"
    }
};