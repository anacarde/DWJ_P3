var Utils = {

    Slider: function(frame, leftArrow, rightArrow, pause) {

        var self = this;
        this.frame = frame;
        this.leftArrow = leftArrow;
        this.rightArrow =  rightArrow;
        this.pause = pause;
        this.interval = 5000;
        this.index1 = null;
        this.index2 = null;
        this.index3 = null;
        this.index4 = null;
        this.go = null;
        this.i = 0;
        this.backward = false;
        this.pauseOn = false;
        
        this.initSlide = function() {
            this.frame[this.frame.length-1].style.display = "flex";
            this.frame[this.i+1].style.display = "flex";
            this.frame[this.i].style.display = "flex";
            this.frame[this.i].style.opacity = 1;
        };

        this.changeSlide = function() {
            if (!this.backward) {
                if (this.i === this.frame.length-1) {
                    this.i = 0;
                } else {
                    this.i++;
                }           
                this.index1 = this.i + 1;
                this.index2 = this.i;
                this.index3 = this.i - 1;
                this.index4 = this.i - 2;

                if (this.i === this.frame.length-1) {
                    this.index1 = 0;
                } else if (this.i === 0) {
                    this.index3 = this.frame.length-1;
                    this.index4 = this.frame.length-2;
                } else if (this.i === 1) {
                    this.index4 = this.frame.length - 1;
                } 
     
            } else if (this.backward) {
                if (this.i === 0) {
                    this.i = this.frame.length-1;
                } else {
                    this.i--;
                }
                this.index1 = this.i - 1;
                this.index2 = this.i;
                this.index3 = this.i + 1;
                this.index4 = this.i + 2;

                if (this.i === 0) {
                    this.index1 = this.frame.length-1;
                } else if (this.i === this.frame.length-1) {
                    this.index3 = 0;
                    this.index4 = 1;
                } else if (this.i === this.frame.length-2) {
                    this.index4 = 0;
                }            
            }

            this.frame[this.index1].style.display = "flex";
            this.frame[this.index2].style.opacity = 1;
            this.frame[this.index3].style.opacity = 0;
            this.frame[this.index4].style.display = "none";
        };

        this.goSlide = function() {
            this.go = setInterval(function() {
                    self.changeSlide()
                }, this.interval);
        };

        this.pauseSlide = function() {
            if (!this.pauseOn) {
                clearInterval(this.go);
                this.pauseOn = true;
                this.pause.setAttribute("src", "./images/slider/play.png");
            } else {
                this.goSlide();
                this.pauseOn = false;
                this.pause.setAttribute("src", "./images/slider/pause.png");
            }
        };

        this.backwardSlide = function() {
            if (!this.pauseOn) {
                clearInterval(this.go);
            }
            this.leftArrow.classList.add("active");
            setTimeout(function() {
                self.leftArrow.classList.remove("active")
            }, 200);
            this.backward = true;
            this.changeSlide(this.frame);
            this.backward = false;
            if (!this.pauseOn) {
               this.goSlide();
            }
        };

        this.forwardSlide = function() {
            if (!this.pauseOn) {
                clearInterval(this.go);
            }
            this.rightArrow.classList.add("active");
            setTimeout(function() {
                self.rightArrow.classList.remove("active")
            }, 200);
            this.changeSlide();
            if (!this.pauseOn) {
                this.goSlide();
            }
        };

        this.mouseMove = function() {
            this.leftArrow.addEventListener("mousedown", function() {
                self.backwardSlide();
            });
            this.pause.addEventListener("mousedown", function() {
                self.pauseSlide();
            });
            this.rightArrow.addEventListener("mousedown", function() {
                self.forwardSlide();
            });
        };

        this.keyMove = function() {
            window.addEventListener("keydown", function(e) {
                if(e.keyCode === 37) {
                    self.backwardSlide();
                }
                if(e.keyCode === 32) {
                    e.preventDefault();
                    self.pauseSlide();
                }
                if(e.keyCode === 39) {
                    self.forwardSlide();
                }
            });
        };

        this.appSlider = function() {
            this.initSlide();
            this.goSlide();
            this.mouseMove();
            this.keyMove();
        }
    },

    Ajax: {
        get: function(url, callback) {
            var req = new XMLHttpRequest();
            req.open("GET", url);
            req.addEventListener("load", function() {
                if (req.status >= 200 && req.status < 400) {
                    callback(req.responseText);
                } else {
                    console.error(req.status + " " + req.statusText + " " + url);
                }
            });
            req.addEventListener("error", function() {
                console.error("Erreur réseau avec l'URL " + url);
            });
            req.send(null);
        }
    },
   
    Timer: function() {
        var self = this;

        this.start = function(duration, during, end) {
            this.duration = duration;
            this.rest = duration;
            this.during = during;
            this.during(this);
            this.end = end;
            this.timeout = setTimeout(this.reset, this.duration);
            this.interval = setInterval(this.countdown, 1000);
        }

        this.countdown = function() {
            self.rest -= 1000;
            self.during(self);
        }

        this.reset = function() {
            self.end();
        }
    },

    Canvas: function(canvas, eraseCanvas, classCss) {
        var self = this;
        this.ctx = canvas.getContext("2d");
        this.w = canvas.width;
        this.h = canvas.height;
        this.press = false;
        this.prevX = 0;
        this.prevY = 0;
        this.currX = 0;
        this.currY = 0;
        this.isSign = false;

        this.drawBegin = function() {
                    this.ctx.beginPath();
                    this.ctx.fillStyle = "black";
                    this.ctx.fillRect(this.currX, this.currY, 2, 2);
                    this.ctx.closePath();
                };

        this.draw = function() {
                this.ctx.beginPath();
                this.ctx.moveTo(this.prevX, this.prevY);
                this.ctx.lineTo(this.currX, this.currY);
                this.ctx.strokeStyle = "black";
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                this.ctx.closePath();
            };

        this.erase = function() {
                this.ctx.clearRect(0, 0, this.w, this.h);
            };

        this.findxy = function(event, e, canvas) {
                if (event === "down") {
                    this.prevX = this.currX;
                    this.prevY = this.currY;
                    if (e.type === "touchstart") {
                        this.currX = e.changedTouches[0].clientX - canvas.getBoundingClientRect().left;
                        this.currY = e.changedTouches[0].clientY - canvas.getBoundingClientRect().top;
                    } else {
                        this.currX = e.clientX - canvas.getBoundingClientRect().left;
                        this.currY = e.clientY - canvas.getBoundingClientRect().top;
                    }
                    this.press = true;
                    this.drawBegin();               
                }
                if (event === "move") {
                    if (this.press) {
                        this.prevX = this.currX;
                        this.prevY = this.currY;
                        if(e.type === "touchmove") {
                            this.currX = e.changedTouches[0].clientX - canvas.getBoundingClientRect().left;
                            this.currY = e.changedTouches[0].clientY - canvas.getBoundingClientRect().top;
                        } else {
                            this.currX = e.clientX - canvas.getBoundingClientRect().left;
                            this.currY = e.clientY - canvas.getBoundingClientRect().top;
                        }
                        this.draw();
                    }  
                } 
                if (event === "out" || event === "up") {
                    this.press = false;
                } 
            };

        this.createSignatureCanvas = function() {

            // Mouse events (large device)

            canvas.addEventListener("mousedown", function(e) {
                self.findxy("down", e, canvas);
                if (!self.isSign) {
                    self.isSign = true;
                    canvas.removeAttribute("title");
                    canvas.classList.remove(classCss);
                }
            });

            canvas.addEventListener("mousemove", function(e) {
                e.preventDefault();
                self.findxy("move", e, canvas);
            });

            canvas.addEventListener("mouseup", function(e) {
                self.findxy("up", e, canvas);
            });

            canvas.addEventListener("mouseout", function(e) {
                self.findxy("out", e, canvas);
            });

            // Touch events (small device)

            canvas.addEventListener("touchstart", function(e) {
                self.findxy("down", e, canvas);
                if (!self.isSign) {
                    self.isSign = true;
                    canvas.removeAttribute("title");
                    canvas.classList.remove(classCss);
                }
            });

            canvas.addEventListener("touchmove", function(e) {
                e.preventDefault();
                self.findxy("move", e, canvas);
            });

            canvas.addEventListener("touchend", function(e) {
                self.findxy("up", e, canvas);
            });

            canvas.addEventListener("touchleave", function(e) {
                self.findxy("out", e, canvas);
            });

            // Erase canvas
            
            eraseCanvas.addEventListener("click", function() {
                self.erase();
                self.isSign = false;
            });
        }
    }
}
