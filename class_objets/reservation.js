function Reservation(app) {

		// DEFINITION DES VARIABLES UTILISEES DANS LA CLASSE.

	var self = this;

	this.app = app;

	this.canvasObj = null;

	this.isAskConfirm = false;

	this.stationChecked = null;

	this.stationReserved = null;

	this.timerTime = 20*60*1000;
	// this.timerTime = 3000;

		// METHODES UTILISEES POUR LA MANIPULATION DU FORMULAIRE

	// Methode ouvrant le formulaire 

	this.openForm = function() {
		self.stationChecked.removePanel();
		document.getElementById("form_booking").classList.add("open_mode");
	}

	// Methode fermant le panneau de demande de confirmation dans le cas de sa présence.

	this.removeConfirmRequestDiv = function() {
		if (document.getElementById("ask_confirm").classList.contains("confirm_mode")) {
			document.getElementById("ask_confirm").classList.remove("confirm_mode");
			this.isAskConfirm = false;
		}
	}

	// Methode fermant le formulaire.

	this.closeForm = function() {
		if (self.canvasObj.isSign) {
			self.canvasObj.erase();
			self.canvasObj.isSign = false;
		}
		self.removeConfirmRequestDiv();
		document.getElementById("form_booking").classList.remove("open_mode");
	}

		// METHODES UTILISEES LORS DE LA RESERVATION

	// Réduction de la map.

	this.reductMap = function() {
		document.getElementById("map_Lyon").classList.add("reduct_mode");
	}	

	// Extraction du cluster de la station réservée (pour la faire apparaître au dézoom).

	this.clusterOut = function() {
		this.app.cluster.removeLayer(this.stationReserved.marker);
		this.stationReserved.marker.addTo(this.app.map);
	}

	// Changement du zoom au clic sur la station réservée. 

	this.reservedStationzoomIn = function() {
		this.stationReserved.marker.removeEventListener("click");
		this.stationReserved.marker.addEventListener("click", function() {
				self.app.map.setView(self.stationReserved.position, 17);
		});
	}

	// Changement de l'icône de la station réservée.

	this.reservedStationIcon = function() {
		this.stationReserved.status = Config.Status.reserved;
		this.stationReserved.marker.setIcon(this.stationReserved.status.icon);
		this.stationReserved.marker.bindPopup(this.stationReserved.status.label);
		this.stationReserved.marker.addEventListener("mouseover", function(e){
			e.target.openPopup();
		});
		this.stationReserved.marker.addEventListener("mouseout", function(e){
			e.target.closePopup();
		});
		this.stationReserved.clicked = false;
	}

	// Sauvegardes dans la storage.

	this.storageSave = function() {
		localStorage.setItem("client_name", document.getElementById("input_name").value);
		localStorage.setItem("client_surname", document.getElementById("input_surname").value);
		sessionStorage.setItem("station_name", this.stationReserved.name);
		sessionStorage.setItem("station_address", this.stationReserved.address);
		sessionStorage.setItem("timer_end_date", Date.now() + this.timerTime);
	}

	// Panneau indiquant que la réservation a bien été enregistrée.

	this.confirmationPanel = function() {
		var confirmationPanel = document.createElement("div");
		confirmationPanel.id = "reservation_confirmed";
		confirmationPanel.setAttribute("class", "info_reservation_status");
		confirmationPanel.textContent = "Réservation effectuée.";
		document.getElementById("rent_bike").appendChild(confirmationPanel);
		setTimeout(function() {
			document.getElementById("rent_bike").removeChild(confirmationPanel)
		}, 2000);
	}

	// Fonction affichant le countdown du timer dans le html.

    this.countdownOnHTML = function(timer) {
		var minutes = Math.floor(timer.rest/60000);
		var secondes = Math.floor(timer.rest%60000/1000);
        document.getElementById("minute_rest").textContent = minutes < 10 ? `0${minutes}` : minutes;
        document.getElementById("second_rest").textContent = secondes < 10 ? `0${secondes}` : secondes;
    }

	// Ouverture du panneau du Timer

	this.openTimerPanel = function() {
		document.getElementById("station_name_reserved").textContent = this.stationReserved.name;
		document.getElementById("station_address_reserved").textContent = this.stationReserved.address;
		document.getElementById("client_name").textContent = localStorage.getItem("client_name") + " " + localStorage.getItem("client_surname");
		document.getElementById("timer").classList.add("open_mode");
		document.getElementById("cancel_reservation_button").addEventListener("click", self.cancelReservation);
	}

	// Réunion des événéments lors de la réservation

	this.stationReservedEvents = function() {
		this.stationReserved = this.stationChecked;
		this.stationChecked = null;
		this.reductMap();
		this.clusterOut();
		this.reservedStationzoomIn();
		this.reservedStationIcon();
		this.storageSave();
		this.closeForm();
		this.openTimerPanel();
	}

		// METHODES - FIN DE RESERVATION

	// Retour de l'icône à sons statut initial.

	this.resetStationStatus = function(){
		this.stationReserved.marker.removeEventListener("mouseover");
		this.stationReserved.marker.removeEventListener("mouseout");
		this.stationReserved.marker.unbindPopup();
		this.stationReserved.marker.removeEventListener("click");
		this.stationReserved.marker.remove();
		this.app.cluster.addLayer(this.stationReserved.marker);
		this.stationReserved.marker.addEventListener("click", this.stationReserved.centerOnStation);
		this.stationReserved.marker.addEventListener("click", this.stationReserved.changeStatusOfStation);
		this.stationReserved.defineStatus();
		this.stationReserved.marker.setIcon(this.stationReserved.status.icon);
	}

	// Panneau d'annulation.

	this.panelChangeOnCanceling = function() {
		document.getElementById("timer").classList.remove("open_mode");
		var annulationPanel = document.createElement("div");
		annulationPanel.id = "reservation_canceled";
		annulationPanel.setAttribute("class", "info_reservation_status");
		annulationPanel.textContent = "Réservation annulée.";
		document.getElementById("bottom_section").appendChild(annulationPanel);
		setTimeout(function(){
			document.getElementById("bottom_section").removeChild(annulationPanel);
			document.getElementById("map_Lyon").classList.remove("reduct_mode")
		}, 2000);
	}

	// Panneau de fin naturel du timer.

	this.panelChangeOnTimerEnd = function() {
		document.getElementById("timer").classList.add("end_mode");
		setTimeout(function(){
			document.getElementById("timer").classList.remove("open_mode", "end_mode");
			document.getElementById("map_Lyon").classList.remove("reduct_mode")
		}, 2000);
	}

	// Fin de réservation.

    this.endOfReservation = function() {
		this.removeConfirmRequestDiv();
		this.resetStationStatus();
		sessionStorage.clear();
		clearInterval(self.app.timer.interval);
		clearTimeout(self.app.timer.timeout);
		this.stationReserved = null;
		document.getElementById("cancel_reservation_button").removeEventListener("click", self.cancelReservation);
    }

    // Fin de réservation + panneau de fin du timer

    this.timerEnd = function() {
    	self.endOfReservation();
    	self.panelChangeOnTimerEnd();
    }

    // Fin de réservation + panneau d'annulation.

	this.cancelReservation = function() {
		self.endOfReservation();
		self.panelChangeOnCanceling();
 	}

		// RESERVATION

	this.launchReservation = function(event) {
		event.preventDefault();
		if (!self.canvasObj.isSign) {
			document.getElementById("canvas").setAttribute("title", "Veuillez signer s'il-vous-plaît.");
			document.getElementById("canvas").classList.add("confirm_mode");
			return;
		}
		if (sessionStorage.getItem("station_name") && !self.isAskConfirm) {
			document.getElementById("ask_confirm").classList.add("confirm_mode");
			self.isAskConfirm = true;
			return;
		}
		if (self.stationReserved){
			self.endOfReservation();
		}
		self.stationReservedEvents();
		self.app.timer.start(self.timerTime, self.countdownOnHTML, self.timerEnd);
		self.confirmationPanel();
	}

		// RECUPERATION DE LA RESERVATION LORS D'UN RAFRAICHISSEMENT.

	this.keepReservationOnRefresh = function(stations) {
	    if (sessionStorage.getItem("station_name") && Date.now() < sessionStorage.getItem("timer_end_date")) {
            var previousReservedStation = stations.find(function(station){
                return station.name == sessionStorage.getItem("station_name");
            })
            var timerRest = Number(sessionStorage.getItem("timer_end_date")) - Date.now();
            this.stationChecked = this.app.stations[previousReservedStation.number];
            this.stationReservedEvents();
            this.app.timer.start(timerRest, this.countdownOnHTML, this.timerEnd);
        }
    }

		// INITIALISATION DU FORMULAIRE 

	this.init = function() {
		document.getElementById("erase_info_panel").addEventListener("click", function() {
			self.stationChecked.uncheckedStation();
		});
		document.getElementById("booking").addEventListener("click", this.openForm);
		document.getElementById("close_button").addEventListener("click", function() {
			self.stationChecked.uncheckedStation();
		});
		document.getElementById("close_button").addEventListener("click", this.closeForm);
		document.getElementById("form_booking").addEventListener("submit", this.launchReservation);
		this.canvasObj = new Utils.Canvas(document.getElementById("canvas"), document.getElementById("erase_canvas"), "confirm_mode");
		this.canvasObj.createSignatureCanvas();
	}
}