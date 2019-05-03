function App() {
    var self = this;

    this.map = null;

    this.stations = {};

    this.init = function() {
        this.slider = new Utils.Slider(document.getElementsByClassName("cadre"), document.getElementById("left_arrow"), document.getElementById("right_arrow"), document.getElementById("pause"));
        this.slider.appSlider();
        this.map = L.map(document.getElementById("map_Lyon")).setView(Config.Map.center, Config.Map.defaultZoom);
        this.map.doubleClickZoom.disable();
        L.tileLayer(Config.Map.tileLayer.path,Config.Map.tileLayer.options).addTo(this.map);
        this.cluster = new L.markerClusterGroup();
        Utils.Ajax.get(Config.JCDecauxApi.path, this.fetch);
        this.reservation = new Reservation(self);
        this.reservation.init();
        this.timer = new Utils.Timer();
    }

    this.fetch = function(response) {
        var stations = JSON.parse(response);

        stations.forEach(function(station) {
            self.stations[station.number] = new Station(station, self);
            self.stations[station.number].init();
        })
        
        self.map.addLayer(self.cluster);
        
        self.reservation.keepReservationOnRefresh(stations);
    }
}

var app = new App();

app.init();