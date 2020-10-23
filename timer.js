var liveCodeTimer = {
  var: function() {
    this.tombolTimer 				= document.getElementsByClassName("toggle-timer");
    this.tombolReset  			= document.getElementById("reset-session");    
    this.tombolStop   			= document.getElementById("stop-session"); 
    this.tombolStart  			= document.getElementById("start-session");
    this.tambahSesi					= document.getElementById("tambah-sesi");
    this.tambahIstirahat   	= document.getElementById("tambah-istirahat");
    this.kurangSesi 				= document.getElementById("kurang-sesi" );
    this.kurangIstirahat    = document.getElementById("kurang-istirahat");
    this.displaySesi 				= document.getElementById("session-length");
    this.displayIstirahat   = document.getElementById("break-length");
    this.displayTimer   		= document.getElementById("countdown");
    this.display            = document.getElementById("display-timer");
    this.containerTimer 		= document.getElementById("countdown-container");        
	}, 
  variabelTimer: function() {
		this.sessionLength =  20; //waktu 20 menit buat livecode
    this.breakLength   =  5;   //istirahat dulu sejenak
		this.timeinterval = false;
    this.kerja = true;
    this.pausedTime = 0;
    this.timePaused = false;
    this.timeStopped = false;
	},
  bindEvents: function() {
    this.tambahSesi.onclick = liveCodeTimer.tmbhSesi;
    this.kurangSesi.onclick = liveCodeTimer.krgSesi;
    this.tambahIstirahat.onclick = liveCodeTimer.incrBreak;
    this.kurangIstirahat.onclick = liveCodeTimer.decrBreak;
    this.displayTimer.onclick  = liveCodeTimer.startCountdown;
    this.tombolReset.onclick = liveCodeTimer.resetCountdown;
    this.tombolStop.onclick  = liveCodeTimer.stopCountdown;
    this.tombolStart.onclick = liveCodeTimer.startCountdown;
	},
  updateDisp: function() {
    liveCodeTimer.displaySesi.innerHTML = this.sessionLength;
    liveCodeTimer.displayIstirahat.innerHTML   = this.breakLength;
    liveCodeTimer.displayTimer.innerHTML     = this.sessionLength + ":00";
    liveCodeTimer.resetVariables();
	},
  tmbhSesi: function() {
    if (liveCodeTimer.sessionLength < 59) {
      liveCodeTimer.sessionLength += 1;
      liveCodeTimer.updateDisp();    
    }   
  },
  krgSesi: function() {
    if (liveCodeTimer.sessionLength > 1) {
      liveCodeTimer.sessionLength -= 1;
      liveCodeTimer.updateDisp();      
    }
  },
  incrBreak: function() {
    if (liveCodeTimer.breakLength < 30 ) {
      liveCodeTimer.breakLength += 1;
      liveCodeTimer.updateDisp();    
    }
  },
  decrBreak: function() {
    if ( liveCodeTimer.breakLength > 1 ) {
      liveCodeTimer.breakLength -= 1;
      liveCodeTimer.updateDisp();     
    }    
  },
  resetVariables: function() {
    liveCodeTimer.timeinterval = false;
    liveCodeTimer.kerja = true;
    liveCodeTimer.pausedTime = 0;
    liveCodeTimer.timeStopped = false;
    liveCodeTimer.timePaused = false;
	},
  startCountdown: function() {
    liveCodeTimer.disableButtons();
    liveCodeTimer.displayType();
    if (liveCodeTimer.timeinterval !== false ) {
      liveCodeTimer.pauseCountdown();
    } else {
     liveCodeTimer.startTime = new Date().getTime();
      if (liveCodeTimer.timePaused === false ) {
        liveCodeTimer.unPauseCountdown();
      } else {
        liveCodeTimer.endTime = liveCodeTimer.startTime + liveCodeTimer.pausedTime;
        liveCodeTimer.timePaused = false;
			}
      liveCodeTimer.timeinterval = setInterval(liveCodeTimer.updateCountdown,1000); 
    }
  },
  updateCountdown: function() {
		var currTime = new Date().getTime();
    var diff = liveCodeTimer.endTime - currTime;
	  var seconds = Math.floor((diff/1000) % 60);
    var minutes = Math.floor((diff/1000)/ 60 % 60);
    if (seconds < 10) {
			seconds = "0" + seconds;
		}
	  if (diff > 1000) {
      liveCodeTimer.displayTimer.innerHTML = minutes + ":" + seconds;
    } else {
      liveCodeTimer.changeSessions();
    }  
  },
  changeSessions: function() {
	  clearInterval (liveCodeTimer.timeinterval);
    liveCodeTimer.playSound();
		if (liveCodeTimer.kerja === true) {
      liveCodeTimer.kerja = false;
    } else {
      liveCodeTimer.kerja = true;
    }
    liveCodeTimer.timeinterval = false;
  },
  pauseCountdown: function() {
    var currTime = new Date().getTime();
    liveCodeTimer.pausedTime = liveCodeTimer.endTime - currTime;
    liveCodeTimer.timePaused = true;      
    clearInterval( liveCodeTimer.timeinterval );    
    liveCodeTimer.timeinterval = false; //reset
  },
  unPauseCountdown: function() {
    if ( liveCodeTimer.kerja === true ) {
      liveCodeTimer.endTime = liveCodeTimer.startTime + (liveCodeTimer.sessionLength * 60000);
    } else {
      liveCodeTimer.endTime = liveCodeTimer.startTime + (liveCodeTimer.breakLength * 60000);      
    }  
  },
  resetCountdown: function() {
    clearInterval( liveCodeTimer.timeinterval );
    liveCodeTimer.resetVariables();
    liveCodeTimer.startCountdown(); //restart
  },
  stopCountdown: function() {
    clearInterval(liveCodeTimer.timeinterval); // Stop timer
    liveCodeTimer.updateDisp(); //display ke html
    liveCodeTimer.resetVariables(); //reset
    liveCodeTimer.unDisableButtons(); //kalo udh beres bisa dipake lg buttonnya
  },
  displayType: function() {
		if (liveCodeTimer.kerja === true) {
      liveCodeTimer.display.innerHTML = "KERJA!!!";
      liveCodeTimer.containerTimer.className = liveCodeTimer.containerTimer.className.replace( "break", "" );
    } else {
      liveCodeTimer.display.innerHTML = "Break";
      if (liveCodeTimer.containerTimer.className !== "break") {
        liveCodeTimer.containerTimer.className += "break";
      }
    }   
  },
  playSound: function() {
    var mp3 = "/audio/EMERGENCY.mp3";
    var audio = new Audio(mp3);
    audio.play();    
  },
  disableButtons: function() {
    for (var i = 0; i < liveCodeTimer.tombolTimer.length; i++) {
      liveCodeTimer.tombolTimer[i].setAttribute("disabled", "disabled");
      liveCodeTimer.tombolTimer[i].setAttribute("title", "stop"); 
    } 
	},
	//kalo udh jalan dimatiin tombol tambah kurang waktunya ok
  unDisableButtons: function() {
    for (var i = 0; i < liveCodeTimer.tombolTimer.length; i++) {
      liveCodeTimer.tombolTimer[i].removeAttribute("disabled"); 
      liveCodeTimer.tombolTimer[i].removeAttribute("title"); 
    }  
	},
	//fungsi buat mulai timer ok
	mulai: function() {
		this.var();
    this.variabelTimer();
    this.bindEvents();
    this.updateDisp();
	}
};

liveCodeTimer.mulai();