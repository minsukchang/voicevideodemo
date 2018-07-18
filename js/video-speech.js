(function() {
	// Get some required handles
	var video = document.getElementById('v');
	var recStatus = document.getElementById('recStatus');
	var startRecBtn = document.getElementById('startRecBtn');
	var stopRecBtn = document.getElementById('stopRecBtn');
	var recText = document.getElementById('recText');
	var markerText = document.getElementById('markerText');
	var marker = 0;
	var next = document.getElementById('nextBtn');

	var equaltime = [0, 68.4, 136.8, 205.2, 273.6, 342];
	var textbased = [];
	var shotchange = [];
	var videocaption = [];

	// Define a new speech recognition instance
	var rec = null;
	try {
		rec = new webkitSpeechRecognition();
	} 
	catch(e) {
    	document.querySelector('.msg').setAttribute('data-state', 'show');
    	startRecBtn.setAttribute('disabled', 'true');
    	stopRecBtn.setAttribute('disabled', 'true');
    }
    if (rec) {
		
		rec.continuous = true;
		rec.interimResults = false;

		//rec.continuous = true;
		//rec.interimResults = false;
		rec.lang = 'en';

		// Define a threshold above which we are confident(!) that the recognition results are worth looking at 
		var confidenceThreshold = 0.5;

		// Simple function that checks existence of s in str
		var userSaid = function(str, s) {
			return str.indexOf(s) > -1;
		}

		var skip = function(value) {
			var video = document.getElementById(video);
			video.currentTime += value;
		} 

		// Highlights the relevant command that was recognised in the command list for display purposes
		var highlightCommand = function(cmd) {
			var el = document.getElementById(cmd); 
			el.setAttribute('data-state', 'highlight');
			setTimeout(function() {
				el.setAttribute('data-state', '');
			}, 3000);
		}

		// Process the results when they are returned from the recogniser
		rec.onresult = function(e) {
			console.log(e.results[0][0].transcript);
			// Check each result starting from the last one
			for (var i = e.resultIndex; i < e.results.length; ++i) {
				// If this is a final result
	       		if (e.results[i].isFinal) {
	       			// If the result is equal to or greater than the required threshold
	       			if (parseFloat(e.results[i][0].confidence) >= parseFloat(confidenceThreshold)) {
		       			var str = e.results[i][0].transcript;
						console.log('Recognised: ' + str);
						recText.innerHTML = str;
		       			
						if (userSaid(str, 'replay')) {
							video.currentTime = 0;
							video.play();
							//highlightCommand('vidReplay');
						}
						
						// fastforward 10sec
						else if (userSaid(str, 'fast forward')) {
							skip(10);
							//highlightCommand('vidPlay');
						}

						//rewind 10sec
						else if (userSaid(str, 'rewind')) {
							skip(-10);
							//highlightCommand('vidPlay');
						}

						else if (userSaid(str, 'next')) {
							console.log(video.currentTime);
							var now = video.currentTime;
							for (i = equaltime.length; i > 0 ; i--) { 
								if (now < equaltime[i]){
									video.currentTime = equaltime[i+1];
									
								}
							}
							//highlightCommand('vidPlay');
						}

						else if (userSaid(str, 'before')) {
							var now = video.currentTime;
							for (var i = 0; i < equaltime.length; i++) { 
								if (now > equaltime[i] && now < equaltime[i+1]){
									video.currentTime = equaltime[i-1]
								}
							}
							//highlightCommand('vidPlay');
						}

						// setting a custom marker
						else if (userSaid(str, 'set marker here')) {
							marker = video.currentTime;
							markerText.innerHTML = Math.round(marker*10/10);
							//highlightCommand('vidPlay');
						}
						
						// going to the custom marker
						else if (userSaid(str, 'go to marker')) {
							video.currentTime = marker;
							//highlightCommand('vidPlay');
						}

						else if (userSaid(str, 'rewind')) {
							video.currentTime -= 10;
							//highlightCommand('vidPlay');
						}

						// Play the video
						else if (userSaid(str, 'play')) {
							video.play();
							//highlightCommand('vidPlay');
						}
						// Stop the video
						else if (userSaid(str, 'stop')) {
							video.pause();
							//highlightCommand('vidStop');
						}
						else if (userSaid(str, 'hold on')) {
							video.pause();
							//highlightCommand('vidStop');
						}
						else if (userSaid(str, 'wait')) {
							video.pause();
							//highlightCommand('vidStop');
						}
						// If the user said 'volume' then parse it even further
						else if (userSaid(str, 'louder')) {
							// Check the current volume setting of the video
							var vol = Math.floor(video.volume * 10) / 10;
							// Increase the volume
							
							if (vol >= 0.9) video.volume = 1;
							else video.volume += 0.1;
							//highlightCommand('vidVolInc');
						}
						// Decrease the volume
						else if (userSaid(str, 'softer')) {
							// Check the current volume setting of the video
							var vol = Math.floor(video.volume * 10) / 10;
							
							if (vol <= 0.1) video.volume = 0;
							else video.volume -= 0.1;
							//highlightCommand('vidVolDec');
						}
						else if (userSaid(str, 'quieter')) {
							// Check the current volume setting of the video
							var vol = Math.floor(video.volume * 10) / 10;
							
							if (vol <= 0.1) video.volume = 0;
							else video.volume -= 0.1;
							//highlightCommand('vidVolDec');
						}

						// Turn the volume off (mute)
						else if (userSaid(str, 'mute')) {
							video.muted = true;
							//highlightCommand('vidVolOff');
						}
						// Turn the volume on (unmute)
						else if (userSaid(str, 'unmute')) {
							video.muted = false;
							//highlightCommand('vidVolOn');
						}
						}
					
	       			}
	        	}
			}
			//recStatus.innerHTML += str;
		};

		// Start speech recognition
		var startRec = function() {
			rec.start();
			recStatus.innerHTML = "<span style='color: green;'>ON</span>";
		}
		// Stop speech recognition
		var stopRec = function() {
			rec.stop();
			recStatus.innerHTML = 'OFF';
		}
		// Setup listeners for the start and stop recognition buttons
		startRecBtn.addEventListener('click', startRec, false);
		stopRecBtn.addEventListener('click', stopRec, false);
	
})();