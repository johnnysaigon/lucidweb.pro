/* globals beloola, ItemCoreBuilder*/
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
var AssetManager, AssetObject;
(function(){
	"use strict";
	var THREE         = require("../build/three.js");
	var Glob          = require("../../app/globals.js");
	var ColladaLoader = require("../build/loaders/ColladaLoader.js");
	var FBXLoader     = require("../build/loaders/FBXLoader.js");
	var $             = require("../build/jquery-1.11.3.min.js");
	
	/////////////////
	///@TODO : OVERRIDE threejs loadtexture function
	////////////////
	THREE.ImageUtils.loadCompressedTexture     = new Function("return "+THREE.ImageUtils.loadCompressedTexture.valueOf().toString().replace("'GET', url", "'GET', url + '?releaseDate' + releaseDate")).call();
	THREE.ImageUtils.loadCompressedTextureCube = new Function("return "+THREE.ImageUtils.loadCompressedTextureCube.valueOf().toString().replace("'GET', url", "'GET', url + '?releaseDate' + releaseDate")).call();
	THREE.ImageUtils.loadTexture               = new Function("return "+THREE.ImageUtils.loadTexture.valueOf().toString().replace("'GET', url", "'GET', url + '?releaseDate' + releaseDate")).call();
	THREE.ImageUtils.loadTextureCube           = new Function("return "+THREE.ImageUtils.loadTextureCube.valueOf().toString().replace("'GET', url", "'GET', url + '?releaseDate' + releaseDate")).call();

	/////////////////
	///Set cross loaders to anonymous to allow use of proxy
	///@TODO : remettre les crossorigin des nouvelles fonctions utilisées
	/////////////////
	var authType = "anonymous";
    function updateCrossOrigin(authType){
        THREE.ImageUtils.crossOrigin                           = authType;
        THREE.ImageUtils.loadTexture.crossOrigin               = authType;
        THREE.ImageUtils.loadTexture.prototype.crossOrigin     = authType;
        THREE.ImageUtils.loadTextureCube.prototype.crossOrigin = authType;
        THREE.ImageUtils.loadTextureCube.crossOrigin           = authType;
        THREE.ImageUtils.loadTextureCube.prototype.crossOrigin = authType;
        THREE.Loader.crossOrigin                               = authType;
        THREE.Loader.prototype.crossOrigin                     = authType;
        THREE.XHRLoader.crossOrigin                            = authType;
        THREE.XHRLoader.prototype.crossOrigin                  = authType;
    }
    updateCrossOrigin(authType);
	/*===========================
	 * ASSETMANAGER
	 ===========================*/

	AssetManager = function(){
		var that = this;

		this.startTime = Date.now();

		Glob.extendSingleton(AssetManager);
		this.assetArray = {};
		
		this.jsonLoader = new THREE.JSONLoader();

		this.onAllAssetsLoaded = function(){};
		
		this.loadAsset  = function(url, type, callback, syncLoad, data, callbackError, forceLoad){
			this.assetArray[type] = this.assetArray[type] || {};

			var id = url + (forceLoad ? Date.now() : "");
			if(!this.assetArray[type][id]){
				this.assetArray[type][id] = new AssetObject(url, type, data);
				this.assetArray[type][id].load(syncLoad);
			}
			this.assetArray[type][id].onDatasLoaded(callback, callbackError);
			this.assetArray[type][id].onDatasLoaded(function(){ that.checkAllAssetLoaded();});
		};

		this.get = function(url, type){
			return this.assetArrayObject[type][url];
		};

		this.checkAllAssetLoaded = function(){
			for(var type in this.assetArray){
				if(this.assetArray.hasOwnProperty(type)){
					for(var id in this.assetArray[type]){
						if(this.assetArray[type].hasOwnProperty(id)){
							if(!this.assetArray[type][id].isLoaded){
								return;
							}
						}
					}
				}
			}
			this.onAllAssetsLoaded();
		};

		this.registerOnAllAssetsLoaded = function(callback){
			var that = this;

			this.onAllAssetsLoaded = function(){
				console.log("Total loading time: "+(Date.now()-that.startTime));
				callback();
			}
		};
	};

	AssetManager.getInstance = function () {
		return Glob.getSingleton(AssetManager);
	};

	AssetManager.TYPES = {
		"JSONDATA"         : 0,
		"TEXTDATA"         : 1,
		"JSONMODEL"        : 2,
		"IMAGETEXTURE"     : 3,
		"IMAGETEXTURECUBE" : 4,
		"IMAGEDOM"         : 5,
		"JAVASCRIPT"       : 6,
		"SOUND"            : 7,
		"OBJMTL"           : 8,
		"COLLADA"          : 9,
		"FBX"       	   : 10
	};

	/*===========================
	 * ASSETOBJECT
	 ===========================*/
	

	AssetObject = function(url, type, data){
		this.isLoaded    = false;
		this.isOnError	 = false;
		this.type 		 = type;
		this.data 		 = data;//For ajax calls
		this.dataObject	 = undefined;
		this.onLoadedCbs = [];
		this.onErrorCbs  = [];
		this.url		 = url;
		

		this.load = function(syncLoad){
			switch(this.type){
				case AssetManager.TYPES.JSONDATA :
					new AssetManager.JSONDataLoader(this, syncLoad);
					break;
				case AssetManager.TYPES.TEXTDATA :
					new AssetManager.TextDataLoader(this, syncLoad);
					break;
				case AssetManager.TYPES.JSONMODEL :
					new AssetManager.JSONModelLoader(this, syncLoad);
					break;
				case AssetManager.TYPES.IMAGETEXTURE :
					new AssetManager.ImageTextureMapLoader(this, syncLoad);
					break;
				case AssetManager.TYPES.IMAGETEXTURECUBE :
					new AssetManager.ImageTextureCubeMapLoader(this, syncLoad);
					break;
				case AssetManager.TYPES.IMAGEDOM :
					new AssetManager.ImageDOMLoader(this, syncLoad);
					break;
				case AssetManager.TYPES.JAVASCRIPT :
					new AssetManager.JavascriptLoader(this, syncLoad);
					break;
				case AssetManager.TYPES.SOUND :
					new AssetManager.AudioLoader(this, syncLoad);
					break;
				case AssetManager.TYPES.OBJMTL :
					new AssetManager.OBJMTLLoader(this, syncLoad);
					break;
				case AssetManager.TYPES.COLLADA :
					new AssetManager.ColladaLoader(this, syncLoad);
					break;
				case AssetManager.TYPES.FBX :
					new AssetManager.FBXLoader(this, syncLoad);
					break;
				default:
					console.error("Error type " + this.type + " unknown for file " + this.url);
					break;
			}
		};

		this.onDatasLoaded = function(callback, callbackError){
			callback      = callback || function(){};
			callbackError = callbackError || function(){};

			if(this.isLoaded){
				callback(this.dataObject);
			}
			else if(this.isOnError){
				callbackError(this.dataObject);
			}
			else{
				this.onLoadedCbs.push(callback);
				this.onErrorCbs.push(callbackError);
			}
		};

		this.triggerIsLoaded = function(){
			this.isLoaded = true;
			for(var i = 0, len = this.onLoadedCbs.length; i < len; ++i){
				this.onLoadedCbs[i](this.dataObject);
			}
		};

		this.onLoadError = function(error){
			console.error("Error on loading file " + this.url, error);
			this.isOnError = true;
			for(var i = 0, len = this.onErrorCbs.length; i < len; ++i){
				this.onErrorCbs[i](error);
			}
		};
	};


	AssetManager.JSONDataLoader = function(parent){
		var that = parent;

		$.ajax({
			type    : "GET",
			url     : that.url,
			data    : that.data,
			context : that
		}).done(function (data) {
			that.dataObject = data;
			that.triggerIsLoaded();
		}).fail(function(error) {
			that.onLoadError(error);
		});
	};


	AssetManager.TextDataLoader = function(parent){
		var that = parent;

		$.ajax({
			type    : "GET",
			url     : that.url,
			data    : that.data,
			dataType: "text",
			context : that
		}).done(function (data) {
			that.dataObject = data;
			that.triggerIsLoaded();
		}).fail(function(error) {
			that.onLoadError(error);
		});
	};

	AssetManager.JSONModelLoader = function(parent){
		var that = parent;

		AssetManager.getInstance().jsonLoader.load(that.url, function (geometry, materials) {
			that.dataObject = {
				"geometry" : geometry,
				"materials": materials
			};
			that.triggerIsLoaded();
		}, function(){/*onProgress*/}, function(error){
			that.onLoadError(error);
		});
	};

	AssetManager.ImageTextureMapLoader = function(parent, syncLoad){
		var that = parent;
                
		if(syncLoad){
			that.dataObject = new THREE.TextureLoader().load( that.url );
			that.triggerIsLoaded();
		}
		else{
			new THREE.TextureLoader().load( that.url, function(data){
				that.dataObject = data;
				that.triggerIsLoaded();
			}, undefined, function(error){
				that.onLoadError(error);
			});
		}
	};

	AssetManager.ImageTextureCubeMapLoader = function(parent, syncLoad){
		var that = parent;

		if(syncLoad){
			that.dataObject = new THREE.CubeTextureLoader().load( that.url );
			that.triggerIsLoaded();
		}
		else{
			new THREE.CubeTextureLoader().load( that.url, function(data){
				that.dataObject = data;
				that.triggerIsLoaded();
			}, undefined, function(error){
				that.onLoadError(error);
			});
		}
	};

	AssetManager.ImageDOMLoader = function(parent, syncLoad){
		var that = parent;

		that.dataObject = new Image();
		that.dataObject.onload = function(){
			that.triggerIsLoaded();
		};	
		that.dataObject.onerror = function(error){
			that.onLoadError(error);
		};		
		//CROSS ORIGIN MUST BE SET BEFORE THE URL, OTHERWISE IT DOESN'T WORK !!!
		that.dataObject.setAttribute('crossorigin', AssetManager.getInstance().authType);
		that.dataObject.src = that.url;
	};

	AssetManager.JavascriptLoader = function(parent, syncLoad){
		var that = parent;

		var scriptID = that.url;
		var reqConfPath = {};
		reqConfPath[scriptID] = that.url;

		require.config({ paths: reqConfPath });
		require( [scriptID], function (script) {
				that.triggerIsLoaded();
			}
		);
	};

	AssetManager.AudioLoader = function(parent, syncLoad){
		var that = parent;

		new THREE.AudioLoader().load( that.url, function( data ) {
			that.dataObject = data;
			that.triggerIsLoaded();
		}, function(){}, that.onLoadError.bind(that));
	};


	AssetManager.OBJMTLLoader = function(parent, syncLoad){
		var that = parent;

		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setBaseUrl( that.data.baseUrl );
		mtlLoader.setPath( that.data.path );
		mtlLoader.load( that.data.mtlUrl, function( materials ) {
			materials.preload();

			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials( materials );
			objLoader.load( that.data.objUrl, function ( data ) {
				that.dataObject = data;
				that.triggerIsLoaded();
			}, function(){/*onProgress*/}, that.onLoadError.bind(that) );

		});
	};


	AssetManager.ColladaLoader = function(parent, syncLoad){
		var that = parent;

		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.load( that.url, function ( data ) {
			that.dataObject = data;
			that.triggerIsLoaded();
		});
	};

	AssetManager.FBXLoader = function(parent, syncLoad){
		var that = parent;

		var loader = new THREE.FBXLoader();
		loader.load( that.url, function( data ) {
			that.dataObject = data;
			that.triggerIsLoaded();
		});
	}
})()
module.exports = AssetManager;