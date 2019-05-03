function Station(info, app) {

        // RECUPERATION DES INFORMATIONS DE LA STATION

    Object.assign(this, info);

        // DEFINITION DES VARIABLES UTILISEES DANS LA CLASSE.

    var self = this;

    this.app = app;

    this.marker = null;

    this.clicked = false;

        // METHODES UTILISEES POUR DEFINIR LA STATION

    // Méthode définissant le statut de la station.

    this.defineStatus = function() {
        if (this.status == "CLOSED") {
            this.status = Config.Status.unavailable;
            return;
        }

        if (this.available_bike_stands == 0) {
            this.status = Config.Status.unavailableBikes;
            return;
        }

        if (this.available_bike_stands == this.bike_stands) {
            this.status = Config.Status.full;
            return;
        }

        if (this.available_bike_stands < 4) {
            this.status = Config.Status.fewAvailableSpots;
            return;
        }

        this.status = Config.Status.availableSpots;
    };

    // Methode centrant sur la station au clic.

    this.centerOnStation = function() {
        self.app.map.setView(self.position);
    };

        // METHODE GERANT DYNAMIQUEMENT LA STATION

    // Définition des informations du panneau d'information.

    this.changeInfoPanel = function() {
        document.getElementById("station_name").textContent = this.name;
        document.getElementById("station_address").textContent = this.address;
        document.getElementById("station_stands").textContent = this.bike_stands;
        document.getElementById("station_bikes").textContent = this.available_bike_stands;
    }

    // Ouverture du panneau d'information.

    this.openPanel = function() {
        document.getElementById("div_info_panel").classList.add("open_mode");
    }

    // Fermeture du panneau d'information.

    this.removePanel = function() {
        document.getElementById("div_info_panel").classList.remove("open_mode");
    }

    // Focus sur la station.

    this.checkedStation = function() {
        this.status = Config.Status.checked;
        this.marker.setIcon(this.status.icon);
        this.changeInfoPanel();
        this.openPanel();
        this.app.reservation.stationChecked = this;
        this.clicked = true;
    };

    // Retrait du focus sur la station.

    this.uncheckedStation = function() {
        self.defineStatus();
        self.marker.setIcon(self.status.icon);
        if(document.getElementById("form_booking").classList.contains("open_mode")) {
            self.app.reservation.closeForm();
        } else {
            self.removePanel();
        }
        self.clicked = false;
    }

    // Méthode assemblant les changements des stations au clic.

    this.changeStatusOfStation = function() {
        if (!self.clicked) {
            if (self.app.reservation.stationChecked) {
                self.app.reservation.stationChecked.uncheckedStation();
            }
            self.checkedStation();
        } else {
            self.uncheckedStation();
        }
    }

            // MÉTHODE INITIALISANT L'OBJET STATION À L'AIDE DES MÉTHODES PRÉCÉDENTES (POSITION + COULEUR + ÉVÉNEMENTS)

    this.init = function() {
        this.defineStatus();

        this.marker = L.marker(this.position,{ icon: this.status.icon });

        this.app.cluster.addLayer(this.marker);

        if (this.status.valid) {
            this.marker.addEventListener("click", this.centerOnStation);
            this.marker.addEventListener("click", this.changeStatusOfStation);
        } else {
            this.marker.bindPopup(this.status.label);

            this.marker.addEventListener("click", function(e) {
                e.target.openPopup();
                setTimeout(function() {e.target.closePopup()}, 2000);
            })
        }
    };
}