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
var Glob = {};
(function(){
  "use strict";

  var THREE        = require("../lib/build/three.js");
  
  Glob.ZERO2 = new THREE.Vector2(0,0);
  Glob.ZERO3 = new THREE.Vector3(0,0,0);
  Glob.X_AXIS = new THREE.Vector3(1, 0, 0);
  Glob.XN_AXIS = new THREE.Vector3(-1, 0, 0);
  Glob.Y_AXIS = new THREE.Vector3(0, 1, 0);
  Glob.YN_AXIS = new THREE.Vector3(0, -1, 0);
  Glob.Z_AXIS = new THREE.Vector3(0, 0, 1);
  Glob.ZN_AXIS = new THREE.Vector3(0, 0, -1);
        
  /**
  * @method JsHelper#idDefined
  * @description  Check if a variable is defined
  * @param  {Any} [obj]  Variable to check
  * @return {Boolean}    Result of the check
  */
  Glob.isDefined = function(obj){
    if(typeof obj === "undefined" || obj === null || obj === undefined){
      return false;
    }
    return true;
  };


  Glob.base64 = function(mimeType, base64) {
    return 'data:' + mimeType + ';base64,' + base64;
  };
      
  /**
  * @method JsHelper#extendSingleton
  * @description  Extend a class to singleton
  * @param  {Object} [obj] Class instance to extend
  */
  Glob.extendSingleton = function(obj){
      if((Glob.isDefined(obj.instance) && obj.instance !== false) || !Glob.isDefined(obj.instance)){
          throw new Error("This class cannot be instanciated directly");
      }
  };

  Glob.getCors = function(src){
    if(src.indexOf("localhost") !== -1 && window.location.host.indexOf("localhost") === -1){
      src = src.replace("localhost", "192.168.20.79");
    }
    return (src.indexOf(window.location.host) !== -1 ? src : "http://ec2-54-246-145-118.eu-west-1.compute.amazonaws.com:8080/" + src);
  };

  /**
   * Check is timeout exists and if so clears it
   * @param  {[type]} timeout [description]
   * @return {[type]}         [description]
   */
  Glob.clearTimeout = function(timeout){
    if(timeout !== undefined){
      clearTimeout(timeout);
      timeout = undefined;
    }
  };

  Glob.enterFullScreen = function(){
    var elem = document.body;
    var requestFullScreen = elem.requestFullScreen || elem.mozRequestFullScreen || elem.webkitRequestFullScreen || elem.msRequestFullscreen;
    if(requestFullScreen){
      requestFullScreen.call(document.body);
    }
  };

  Glob.exitFullScreen = function(){
    if(this.isIOS()){
      $(".intro-header").append($("#mainCanvas"));
      $('div').not('#mainCanvas').show();
      $('nav').show();
    }
    else{
      var elem = document;
      var exitFullScreen = elem.exitFullScreen || elem.mozCancelFullScreen || elem.webkitExitFullscreen;
      exitFullScreen.call(document);
    }
  };

  Glob.isFullScreen = function(){
    return document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen || this.isIOS();
  };

  /**
  * @method JsHelper#getSingleton
  * @description Return the singleton instance of a class
  * @param  {Object} [obj] The instance class needed
  * @return {Object}       Instance of the class
  */
  Glob.getSingleton = function(obj){
    if(!Glob.isDefined(obj.instance)){
          obj.instance = false;
          obj.instance = new obj();
      }
      return obj.instance;
  };

  Glob.canPlayMP4 = function(){
    return document.createElement('video').canPlayType('video/mp4') !== "";
  };

  Glob.isMobile = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

  Glob.isSamsung = function(){
    return /SAMSUNG|SM-/.test(navigator.userAgent);
  };

  Glob.isIOS = function(){
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  };

  Glob.isDesktop = function(){
    return !this.isMobile() && GLOBAL.world.getManager().mode <= 1;
  };

  Glob.isFirefox = function() {
    return /firefox/i.test(navigator.userAgent);
  };

  Glob.isIFrame = function() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  };

  Glob.guid = function(){
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
  }

  Glob.copyObject = function(objSource, objDest){
    for(var key in objSource){
      if(objSource.hasOwnProperty(key)){
        objDest[key] = objSource[key];
      }
    }
  };

  /**
  * @method THREE.Quaternion#fixToAxis
  * @description Fix the rotation of a quaternion to a single axis
  * @param  {THREE.Vector3} [axis] The axis we want to rationalize to
  */
  THREE.Quaternion.prototype.fixToAxis = function(axis){
    //Set values to 0 if need be
    this._x *= axis.x;
    this._y *= axis.y;
    this._z *= axis.z;

    var mag = Math.sqrt(this._w * this._w + this._x * this._x * axis.x + this._y * this._y * axis.y + this._z * this._z * axis.z);
    this._w /= mag;
    if(axis.x !== 0){
      this._x /= mag;
    }
    if(axis.y !== 0){
      this._y /= mag;
    }
    if(axis.z !== 0){
      this._z /= mag;
    }
  }
  /*
   * Debug parameters.
   */
  window.WebVRConfig = {
    /**
     * webvr-polyfill configuration
     */

    // Forces availability of VR mode.
    // FORCE_ENABLE_VR: true, // Default: false.
    // Complementary filter coefficient. 0 for accelerometer, 1 for gyro.
    //K_FILTER: 0.98, // Default: 0.98.
    // How far into the future to predict during fast motion.
    //PREDICTION_TIME_S: 0.040, // Default: 0.040 (in seconds).
    // Flag to disable touch panner. In case you have your own touch controls
    //TOUCH_PANNER_DISABLED: true, // Default: false.
    // Enable yaw panning only, disabling roll and pitch. This can be useful for
    // panoramas with nothing interesting above or below.
    //YAW_ONLY: true, // Default: false.
    // Enable the deprecated version of the API (navigator.getVRDevices).
    //ENABLE_DEPRECATED_API: true, // Default: false.
    // Scales the recommended buffer size reported by WebVR, which can improve
    // performance. Making this very small can lower the effective resolution of
    // your scene.
    KEYBOARD_CONTROLS_DISABLED: true,
    BUFFER_SCALE: 0.5, // default: 1.0
    // Allow VRDisplay.submitFrame to change gl bindings, which is more
    // efficient if the application code will re-bind it's resources on the
    // next frame anyway.
    // Dirty bindings include: gl.FRAMEBUFFER_BINDING, gl.CURRENT_PROGRAM,
    // gl.ARRAY_BUFFER_BINDING, gl.ELEMENT_ARRAY_BUFFER_BINDING,
    // and gl.TEXTURE_BINDING_2D for texture unit 0
    // Warning: enabling this might lead to rendering issues.
    //DIRTY_SUBMIT_FRAME_BINDINGS: true // default: false
  };
})()

module.exports = Glob;