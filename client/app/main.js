// Agency Theme JavaScript
/*
 * Copyright 2017 Thomas Balouet All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
window.GLOBAL = {};
window.THREE = require("../lib/build/three.js");

(function($) {
    "use strict"; // Start of use strict
	var BoostrapValidation = require("./jqBootstrapValidation.js");
	var Contact            = require("./contact_me.js");
	var BirdsMain          = require("./birds/main.js");
	var Glob               = require("./globals.js");
	var World              = require("../lib/intern/world.js");
	var HTML2VR            = require("./HTML2VR.js");

	var world            = new World({
		canvas : document.getElementById("mainCanvas"),
		color : 0xffffff,
		fov   : 75,
		near  : 0.1,
		far   : 10000
	});
	GLOBAL.world = world;

    new BirdsMain();


	world.start();

	function onVRClick(){
		if(!GLOBAL.HTML2VR){
			GLOBAL.HTML2VR = new HTML2VR();
		}

		$(".col-xs-12").hide();
		Glob.enterFullScreen();
		if(GLOBAL.world.getManager().isVRCompatible){
			GLOBAL.world.getManager().button.emit('vr');
		}
	};

	function onFullScreenChange(event){
		if(Glob.isFullScreen()){
			if(!Glob.isMobile()){
				event.target.requestPointerLock();
			}
			GLOBAL.HTML2VR.show();
			console.log("fullscreen on", window.innerHeight, screen.height);
		}
		else{
			$(".col-xs-12").show();
			GLOBAL.HTML2VR.hide();
			console.log("fullscreen off", window.innerHeight, screen.height);
		}
	};

	function onOverVR(){
		document.getElementById("VRButton").style.cursor = "pointer";
		$("#VRButton").removeClass("ttFirst").addClass("tt");
	};

	document.getElementById("VRButton").addEventListener('click', onVRClick);
	document.getElementById("VRButton").addEventListener('touch', onVRClick);
	document.getElementById("VRButton").addEventListener('mouseover', onOverVR);

	document.addEventListener('fullscreenchange', onFullScreenChange, false);
	document.addEventListener('mozfullscreenchange', onFullScreenChange, false);
	document.addEventListener('webkitfullscreenchange', onFullScreenChange, false);


})(jQuery); // End of use strict
