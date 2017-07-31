//Based on https://github.com/mrdoob/three.js/blob/dev/examples/canvas_geometry_birds.html
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
var HTML2VR;

(function(){
	"use strict";
	
	var THREE        = require("../lib/build/three.js");
	var AssetManager    = require("../lib/intern/assetManager.js");

	HTML2VR = function(){
		var that         = this;
		this.isVisible   = false;
		var cubeGeometry = new THREE.CubeGeometry(1500, 1500, 1500, 1, 1, 1);

		var path = "/public/img/cube/cubicdamier_";
		var format = '.png';
		var urls = [
			path + 'px' + format, path + 'nx' + format,
			path + 'py' + format, path + 'ny' + format,
			path + 'pz' + format, path + 'nz' + format
		];

		AssetManager.getInstance().loadAsset(urls, AssetManager.TYPES.IMAGETEXTURECUBE, function(object){
			that.mainMesh        = new THREE.Mesh(cubeGeometry, new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: object, side : THREE.BackSide } ));
			that.mainMesh.name   = "cube";
			that.mainMesh.rotateY(Math.PI/2);//Put videos at the right place
			GLOBAL.world.getScene().add(that.mainMesh);

			that.mainMesh.visible = true;
		}, false, null, function(error){
			console.log("Error on loading Image Cube Home", error);
		});
	};

	HTML2VR.prototype.show = function(){
		if(this.mainMesh){
			this.mainMesh.visible = true;
		}
		this.isVisible = true;
	};

	HTML2VR.prototype.hide = function(){
		if(this.mainMesh){
			this.mainMesh.visible = false;
		}
		this.isVisible = false;
	};

})();
module.exports = HTML2VR;