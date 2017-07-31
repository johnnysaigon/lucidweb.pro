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
var World;

(function(){
	"use strict";
	
	var THREE        = require("../build/three.js");

	require("../../app/globals.js");

	var WebVRManager = require("../build/webvr-manager.js");
	require("../build/webvr-polyfill.js");
	THREE.VRControls = require("../build/VRControls.js");
	THREE.VREffect   = require("../build/VREffect.js");
	var Stats        = require("../build/stats.js");
	var Glob         = require("../../app/globals.js");
	require("../build/GamepadState.js");


	World = function(opts){
		var that = this;
		//Loops to add to the general animate function
		this.preRenderLoops  = [];
		this.postRenderLoops = [];

		opts.width  = opts.width || window.innerWidth;
		opts.height = opts.height || window.innerHeight;

		var renderer      = new THREE.WebGLRenderer({canvas: opts.canvas, antialias: true});
		if(opts.color){
			renderer.setClearColor( opts.color );
		}
		renderer.setPixelRatio(window.devicePixelRatio);	
			
		if(!opts.canvas){
			// Append the canvas element created by the renderer to document body element.
			document.body.appendChild(renderer.domElement);
		}
		
		// Create a three.js scene.
		var scene         = new THREE.Scene();
		
		// Create a three.js camera.
		var camera        = new THREE.PerspectiveCamera(opts.fov, opts.width / opts.height, opts.near, opts.far);
		camera.layers.enable(1);
		var camParent	  = new THREE.Group();
		camParent.name	  = "camParent";
		camParent.add(camera);
		scene.add(camParent);
		
		this.camDirVector = new THREE.Vector3();
		
		var controls 	  = undefined;
		if(!opts.noControls){
			// Apply VR headset positional data to camera.
		    controls = new THREE.VRControls(camera);
		}
		this.controlsEnabled = true;

		// Apply VR stereo rendering to renderer.
		var effect        = new THREE.VREffect(renderer);
		effect.setSize(opts.width, opts.height);
		
		// Create a VR manager helper to enter and exit VR mode.
		var manager       = new WebVRManager(renderer, effect, {hideButton : true});
		
		navigator.getVRDisplays().then(function(displays) {
			if(displays && displays.length && displays[0].displayName.indexOf("Gear") !== -1){
				effect.requestPresent();
			}
		});

		var stats;
		if(GLOBAL.env === "dev"){
			stats = new Stats();
			stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
			stats.dom.id = "StatsCanvas";
			document.body.appendChild( stats.dom );
		}

		window.addEventListener('resize', this.onResize.bind(this), true);
		window.addEventListener('vrdisplaypresentchange', this.onResize.bind(this), true);


		
		this.getRenderer    = function(){ return renderer;};
		this.getScene       = function(){ return scene;};
		this.getCamera      = function(){ return camera;};
		this.getCamParent   = function(){ return camParent;};
		this.getControls    = function(){ return controls;};
		this.getGamepad     = function(){ return gamepad;};
		this.getEffect      = function(){ return effect;};
		this.getManager     = function(){ return manager;};
		this.getManagerMode = function(){ return manager.mode;};
		this.getStats       = function(){ return stats;};
	};

	World.prototype.onResize = function(e) {
		this.getCamera().aspect = window.innerWidth / window.innerHeight;
		this.getCamera().updateProjectionMatrix();
		this.getRenderer().setSize( window.innerWidth, window.innerHeight );
	};

	World.prototype.start = function(){
		this.animate(0);
	};

	World.prototype.hookOnPreRender = function(func){
		this.preRenderLoops.push(func);
	};

	World.prototype.unHookOnPreRender = function(func){
		for(var i = 0, len = this.preRenderLoops.length; i < len; ++i){
			if(this.preRenderLoops[i] === func){
				this.preRenderLoops.splice(i, 1);
			}
		}
	};

	World.prototype.hookOnPostRender = function(func){
		this.postRenderLoops.push(func);
	};

	World.prototype.unHookOnPostRender = function(func){
		for(var i = 0, len = this.postRenderLoops.length; i < len; ++i){
			if(this.postRenderLoops[i] === func){
				this.postRenderLoops.splice(i, 1);
			}
		}
	};

	// Request animation frame loop function
	World.prototype.animate = function(timestamp) {
		if(this.getStats()){
			this.getStats().begin();
		}

		if(this.getControls() && this.controlsEnabled){
			// Update VR headset position and apply to camera.
			this.getControls().update();
		}

		var i, len;
		for(i = 0, len = this.preRenderLoops.length; i < len; ++i){
			this.preRenderLoops[i](timestamp);
		}

		// this.getStats().renderLoop(timestamp === 0 ? 1 : timestamp);

		// Render the scene through the manager.
		this.getManager().render(this.getScene(), this.getCamera(), timestamp);

		for(i = 0, len = this.postRenderLoops.length; i < len; ++i){
			this.postRenderLoops[i](timestamp);
		}

		if(this.getStats()){
			this.getStats().end();
		}

		this.getEffect().requestAnimationFrame(this.animate.bind(this));
	};
})();
module.exports = World;