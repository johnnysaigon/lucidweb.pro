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
var BirdsMain;

(function(){
	"use strict";
	
	var THREE        = require("../../lib/build/three.js");
	var Boid         = require("./boids.js");
	var BirdObj      = require("./obj.js");

	var SCREEN_WIDTH   	   = window.innerWidth,
		SCREEN_HEIGHT      = window.innerHeight,
		SCREEN_WIDTH_HALF  = SCREEN_WIDTH  / 2,
		SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;

	BirdsMain = function(){
		document.addEventListener( 'mousemove', this.onMouseMove.bind(this), false );

		this.nbBirds = 200;

		this.createBirds();
		GLOBAL.world.hookOnPreRender(this.update.bind(this));
	};

	var boid, bird, color;

	BirdsMain.prototype.createBirds = function(){
		this.birds = [];
		this.boids = [];
		for ( var i = 0; i < this.nbBirds; i ++ ) {
			boid = this.boids[ i ] = new Boid();

			boid.position.set(Math.random() * 400 - 200, Math.random() * 400 - 200, Math.random() * 400 - 200);
			boid.velocity.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);

			boid.setAvoidWalls( true );
			boid.setWorldSize( 500, 500, 400 );

			bird = this.birds[ i ] = new THREE.Mesh( new BirdObj(), new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, side: THREE.DoubleSide } ) );
			bird.phase = Math.floor( Math.random() * 62.83 );
			GLOBAL.world.getScene().add( bird );
		}
	};

	BirdsMain.prototype.onMouseMove = function(event){
		var vector = new THREE.Vector3( event.clientX - SCREEN_WIDTH_HALF, - event.clientY + SCREEN_HEIGHT_HALF, 0 );
		for ( var i = 0, il = this.boids.length; i < il; i++ ) {
			boid = this.boids[ i ];
			vector.z = boid.position.z;
			boid.repulse( vector );
		}
	};

	BirdsMain.prototype.update = function(timestamp){
		for ( var i = 0, il = this.birds.length; i < il; i++ ) {
			boid                          = this.boids[ i ];
			boid.run( this.boids );
			
			bird                          = this.birds[ i ];
			bird.position.copy( this.boids[ i ].position );
			
			color                         = bird.material.color;
			color.r = color.g = color.b = ( 500 - bird.position.z ) / 1000;

			bird.rotation.y               = Math.atan2( - boid.velocity.z, boid.velocity.x );
			bird.rotation.z               = Math.asin( boid.velocity.y / boid.velocity.length() );
			
			bird.phase                    = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;
			bird.geometry.vertices[ 5 ].y = bird.geometry.vertices[ 4 ].y = Math.sin( bird.phase ) * 5;
		}
	};
})();
module.exports = BirdsMain;