(function() {
	// Get some required handles
	var video = document.getElementById('v');
	var recStatus = document.getElementById('recStatus');
	var startRecBtn = document.getElementById('startRecBtn');
	var stopRecBtn = document.getElementById('stopRecBtn');
	var recText = document.getElementById('recText');
	var markerText = document.getElementById('markerText');
	var marker = 0;
	//var next = document.getElementById('nextBtn');

	var grammar = "#JSGF V1.0; grammar keyword; public <keyword> = play|stop|hold|wait|replay|mute|unmute|louder|softer|quieter|fastforward|rewind|set|marker|here|next|before"

	var equaltime = [0, 68.4, 136.8, 205.2, 273.6, 342];
	var stepbased = [0, 33.589196, 53.787267, 77.805879, 119.321606, 164.855763, 184.099407];
	var textbased = [];
	var shotchange = [];
	var videocaption = [];	

	var nextStep = function(now){
		var i;
		for (i = 0; i < stepbased.length ; i++) { 
			if (stepbased[i] < now && now < stepbased[i+1]){
				video.currentTime = stepbased[i+1];
				
				console.log("skipped to: "+video.currentTime);
			}
		}
	}

	var prevStep = function(now){
		if (now < stepbased[1]){
			video.currentTime = stepbased[0];
		}
		else{
			var i;
			for (i = 1; i < stepbased.length ; i++) { 
				if (stepbased[i] < now && now < stepbased[i+1]){
					video.currentTime = stepbased[i-1];
					console.log("skipped to: "+video.currentTime);
				}
			}
		}
	}

	// Define a new speech recognition instance
	var rec = null;
	try {
		rec = new webkitSpeechRecognition();
		//var speechRecognitionList = new SpeechGrammarList();
		//speechRecognitionList.addFromString(grammar, 1);
		//rec.grammars = speechRecognitionList;
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
			video.seekTo(video.getCurrentTime()+value);
			//video.currentTime += value; //HTML5
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
			// console.log(e.results[0][0].transcript);
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
							video.playVideo();
							//video.play();//HTML5
							//highlightCommand('vidReplay');
						}
						
						// fastforward 10sec
						else if (userSaid(str, 'fast forward') || userSaid(str, 'fastforward')) {
							skip(10);
							//highlightCommand('vidPlay');
						}

						//rewind 10sec
						else if (userSaid(str, 'rewind')) {
							skip(-10);
							//highlightCommand('vidPlay');
						}

						else if (userSaid(str, 'next')) {
							console.log(video.getCurrentTime());
							nextStep(video.getCurrentTime());
							//highlightCommand('vidPlay');
						}

						else if (userSaid(str, 'before') || userSaid(str, 'go back one step')) {
							var now = video.currentTime;
							//highlightCommand('vidPlay');
						}

						// setting a custom marker
						//else if (userSaid(str, 'set marker here')) {
						//	marker = video.getCurrentTime;
						//	markerText.innerHTML = Math.round(marker*10/10);
							//highlightCommand('vidPlay');
						//}
						
						// going to the custom marker
						//else if (userSaid(str, 'go to marker')) {
						//	video.currentTime = marker;
							//highlightCommand('vidPlay');
						//}

						// Play the video
						else if (userSaid(str, 'play')) {
							//video.play(); video tag
							video.playVideo(); //youtube iframe
							//highlightCommand('vidPlay');
						}
						// Stop the video
						else if (userSaid(str, 'stop')) {
							video.pauseVideo();
							//highlightCommand('vidStop');
						}
						else if (userSaid(str, 'hold on')) {
							video.pauseVideo();
							//highlightCommand('vidStop');
						}
						else if (userSaid(str, 'wait')) {
							video.pauseVideo();
							//highlightCommand('vidStop');
						}
						// If the user said 'volume' then parse it even further
						else if (userSaid(str, 'louder')) {
							// Check the current volume setting of the video
							var vol = Math.floor(video.getVolume() * 10) / 10;
							// Increase the volume
							
							if (vol >= 0.9) video.volume = 1;
							else video.volume += 0.1;
							//highlightCommand('vidVolInc');
						}
						// Decrease the volume
						else if (userSaid(str, 'softer')) {
							// Check the current volume setting of the video
							var vol = Math.floor(video.getVolume() * 10) / 10;
							
							if (vol <= 0.1) video.volume = 0;
							else video.volume -= 0.1;
							//highlightCommand('vidVolDec');
						}
						else if (userSaid(str, 'quieter')) {
							// Check the current volume setting of the video
							var vol = Math.floor(video.getVolume() * 10) / 10;
							
							if (vol <= 0.1) video.volume = 0;
							else video.volume -= 0.1;
							//highlightCommand('vidVolDec');
						}

						// Turn the volume off (mute)
						else if (userSaid(str, 'mute')) {
							video.mute();
							//highlightCommand('vidVolOff');
						}
						// Turn the volume on (unmute)
						else if (userSaid(str, 'unmute')) {
							video.unMute;
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