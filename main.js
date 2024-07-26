/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var three_examples_jsm_loaders_GLTFLoader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three/examples/jsm/loaders/GLTFLoader */ "./node_modules/three/examples/jsm/loaders/GLTFLoader.js");
/* harmony import */ var three_examples_jsm_loaders_RGBELoader_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three/examples/jsm/loaders/RGBELoader.js */ "./node_modules/three/examples/jsm/loaders/RGBELoader.js");
/* harmony import */ var _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tweenjs/tween.js */ "./node_modules/@tweenjs/tween.js/dist/tween.esm.js");





class ThreeJSContainer {
    scene;
    light;
    backgroundModels = []; // 背景モデルを3つ保存するための配列
    startTime = Date.now(); // 開始時間
    hdrUrls = ["Ggenebrush_HDRI1.hdr", "satara_night_no_lamps_4k.hdr"]; // HDRI画像のURL
    currentHdrIndex = 0; // 現在のHDRI画像のインデックス
    envMaps = []; // 環境マップを保存するための配列
    constructor() { }
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        renderer.toneMapping = three__WEBPACK_IMPORTED_MODULE_1__.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.outputColorSpace = three__WEBPACK_IMPORTED_MODULE_1__.SRGBColorSpace;
        const camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_2__.OrbitControls(camera, renderer.domElement);
        this.createScene(renderer, camera).then(() => {
            const render = (time) => {
                orbitControls.update();
                renderer.render(this.scene, camera);
                requestAnimationFrame(render);
            };
            requestAnimationFrame(render);
        });
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    createScene = async (renderer, camera) => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        // HDRI画像を全てロード
        const rgbeLoader = new three_examples_jsm_loaders_RGBELoader_js__WEBPACK_IMPORTED_MODULE_3__.RGBELoader();
        const pmremGenerator = new three__WEBPACK_IMPORTED_MODULE_1__.PMREMGenerator(renderer);
        const loadHdrPromises = this.hdrUrls.map((hdrUrl) => {
            return new Promise((resolve) => {
                rgbeLoader.load(hdrUrl, (texture) => {
                    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
                    this.envMaps.push(envMap);
                    texture.dispose();
                    resolve(null);
                });
            });
        });
        await Promise.all(loadHdrPromises);
        pmremGenerator.dispose();
        // 初期の環境マップを設定
        this.scene.background = this.envMaps[this.currentHdrIndex];
        this.scene.environment = this.envMaps[this.currentHdrIndex];
        this.light = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff);
        const lvec = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
        const loaderGLTF = new three_examples_jsm_loaders_GLTFLoader__WEBPACK_IMPORTED_MODULE_4__.GLTFLoader();
        const otherFiles = ['mati.glb', 'mati.glb', 'mati.glb']; // 同じ背景モデルを3つ読み込む
        otherFiles.forEach((file, index) => {
            loaderGLTF.load(file, (gltf) => {
                const model = gltf.scene;
                this.backgroundModels[index] = model; // 背景モデルを設定
                this.backgroundModels[index].position.z = -340 * index; // モデルを連続して配置
                this.scene.add(model);
            });
        });
        loaderGLTF.load('sofuinu.glb', (gltf) => {
            const model = gltf.scene;
            this.scene.add(model);
            let position = model.position;
            // Tweenでコントロールする変数の定義
            let tweeninfo = { position: model.position.y };
            //  Tweenでパラメータの更新の際に呼び出される関数
            let updateScale = () => {
                model.position.y = tweeninfo.position;
            };
            // Tweenの作成
            const tween = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(tweeninfo)
                .to({ position: 5 }, 600)
                .easing(_tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Easing.Quadratic.Out)
                .onUpdate(updateScale);
            const tween1 = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(tweeninfo)
                .to({ position: 0 }, 300)
                .easing(_tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Easing.Quadratic.In)
                .onUpdate(updateScale);
            tween.chain(tween1);
            tween1.chain(tween);
            // アニメーションの開始
            tween.start();
        });
        const textureLoader = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader();
        const raindropTexture = textureLoader.load('raindrop.png'); // あなたの雨粒の画像へのパス
        const rainGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BufferGeometry();
        const positions = [];
        const velocities = [];
        const raindropCount = 100000;
        for (let i = 0; i < raindropCount; i++) {
            positions.push(Math.random() * 100 - 50, // x座標
            Math.random() * 50, // y座標
            Math.random() * 100 - 20 // z座標
            );
            velocities.push(0, // x速度
            -Math.random() * 3, // y速度
            0 // z速度
            );
        }
        rainGeometry.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_1__.Float32BufferAttribute(positions, 3));
        rainGeometry.setAttribute('velocity', new three__WEBPACK_IMPORTED_MODULE_1__.Float32BufferAttribute(velocities, 3));
        // 雨粒のマテリアルを作成します。
        const rainMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.PointsMaterial({ size: 0.5, map: raindropTexture, blending: three__WEBPACK_IMPORTED_MODULE_1__.AdditiveBlending, color: 0xffffff, depthWrite: false, transparent: true, opacity: 0.5 });
        // 雨粒のパーティクルシステムを作成します。
        const rainParticles = new three__WEBPACK_IMPORTED_MODULE_1__.Points(rainGeometry, rainMaterial);
        // シーンに雨粒を追加します。
        this.scene.add(rainParticles);
        let update = (time) => {
            // 背景モデルを後ろにずらす
            this.backgroundModels.forEach((model, index) => {
                model.position.z -= 0.2;
                if (model.position.z < -340) {
                    model.position.z = this.backgroundModels[(index + 2) % 3].position.z + 340;
                }
            });
            // 1分ごとにHDRI画像を切り替える
            if (Date.now() - this.startTime >= 60000) {
                this.startTime = Date.now();
                this.currentHdrIndex = (this.currentHdrIndex + 1) % this.hdrUrls.length;
                this.scene.background = this.envMaps[this.currentHdrIndex];
                this.scene.environment = this.envMaps[this.currentHdrIndex];
            }
            _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.update();
            const currentTime = (Date.now() - this.startTime) / 1000;
            // 雨が降るタイミングを計算します。
            const rainStart = Math.floor(currentTime / 40) * 40 + 20;
            const rainEnd = rainStart + 20;
            // 雨が降るべきかどうかを判断します。
            const shouldRain = currentTime >= rainStart && currentTime < rainEnd;
            // 雨粒の可視性を設定します。
            rainParticles.visible = shouldRain;
            // 雨が降っている場合のみ、雨粒の位置を更新します。
            if (shouldRain) {
                const positions = rainParticles.geometry.attributes.position.array;
                const velocities = rainParticles.geometry.attributes.velocity.array;
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i + 1] += velocities[i + 1];
                    // 雨粒が地面に到達したら、上に戻します。
                    if (positions[i + 1] < -250) {
                        positions[i + 1] = 250;
                    }
                }
                rainParticles.geometry.attributes.position.needsUpdate = true;
            }
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(-4, 3, 8));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_tweenjs_tween_js_dist_tween_esm_js-node_modules_three_examples_jsm_contr-b20721"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7Ozs7Ozs7VUN4TkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOzs7OztXQ3pCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLCtCQUErQix3Q0FBd0M7V0FDdkU7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQkFBaUIscUJBQXFCO1dBQ3RDO1dBQ0E7V0FDQSxrQkFBa0IscUJBQXFCO1dBQ3ZDO1dBQ0E7V0FDQSxLQUFLO1dBQ0w7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQzNCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvLi9zcmMvYXBwLnRzIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzXCI7XG5pbXBvcnQgeyBHTFRGTG9hZGVyIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9sb2FkZXJzL0dMVEZMb2FkZXJcIjtcbmltcG9ydCB7IFJHQkVMb2FkZXIgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9SR0JFTG9hZGVyLmpzJztcbmltcG9ydCAqIGFzIFRXRUVOIGZyb20gXCJAdHdlZW5qcy90d2Vlbi5qc1wiO1xuXG5jbGFzcyBUaHJlZUpTQ29udGFpbmVyIHtcbiAgICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgICBwcml2YXRlIGxpZ2h0OiBUSFJFRS5MaWdodDtcbiAgICBwcml2YXRlIGJhY2tncm91bmRNb2RlbHM6IFRIUkVFLk9iamVjdDNEW10gPSBbXTsgLy8g6IOM5pmv44Oi44OH44Or44KSM+OBpOS/neWtmOOBmeOCi+OBn+OCgeOBrumFjeWIl1xuICAgIHByaXZhdGUgc3RhcnRUaW1lOiBudW1iZXIgPSBEYXRlLm5vdygpOyAvLyDplovlp4vmmYLplpNcbiAgICBwcml2YXRlIGhkclVybHM6IHN0cmluZ1tdID0gW1wiR2dlbmVicnVzaF9IRFJJMS5oZHJcIiwgXCJzYXRhcmFfbmlnaHRfbm9fbGFtcHNfNGsuaGRyXCJdOyAvLyBIRFJJ55S75YOP44GuVVJMXG4gICAgcHJpdmF0ZSBjdXJyZW50SGRySW5kZXg6IG51bWJlciA9IDA7IC8vIOePvuWcqOOBrkhEUknnlLvlg4/jga7jgqTjg7Pjg4fjg4Pjgq/jgrlcbiAgICBwcml2YXRlIGVudk1hcHM6IFRIUkVFLlRleHR1cmVbXSA9IFtdOyAvLyDnkrDlooPjg57jg4Pjg5fjgpLkv53lrZjjgZnjgovjgZ/jgoHjga7phY3liJdcblxuICAgIGNvbnN0cnVjdG9yKCkge31cblxuICAgIHB1YmxpYyBjcmVhdGVSZW5kZXJlckRPTSA9ICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgY2FtZXJhUG9zOiBUSFJFRS5WZWN0b3IzKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgcmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICByZW5kZXJlci50b25lTWFwcGluZyA9IFRIUkVFLkFDRVNGaWxtaWNUb25lTWFwcGluZztcbiAgICAgICAgcmVuZGVyZXIudG9uZU1hcHBpbmdFeHBvc3VyZSA9IDE7XG4gICAgICAgIHJlbmRlcmVyLm91dHB1dENvbG9yU3BhY2UgPSBUSFJFRS5TUkdCQ29sb3JTcGFjZTtcblxuICAgICAgICBjb25zdCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpZHRoIC8gaGVpZ2h0LCAwLjEsIDEwMDApO1xuICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weShjYW1lcmFQb3MpO1xuXG4gICAgICAgIGNvbnN0IG9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlU2NlbmUocmVuZGVyZXIsIGNhbWVyYSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZW5kZXI6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcbiAgICAgICAgICAgICAgICBvcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCBjYW1lcmEpO1xuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLmNzc0Zsb2F0ID0gXCJsZWZ0XCI7XG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUubWFyZ2luID0gXCIxMHB4XCI7XG4gICAgICAgIHJldHVybiByZW5kZXJlci5kb21FbGVtZW50O1xuICAgIH07XG5cbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lID0gYXN5bmMgKHJlbmRlcmVyOiBUSFJFRS5XZWJHTFJlbmRlcmVyLCBjYW1lcmE6IFRIUkVFLkNhbWVyYSkgPT4ge1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICAgICAgLy8gSERSSeeUu+WDj+OCkuWFqOOBpuODreODvOODiVxuICAgICAgICBjb25zdCByZ2JlTG9hZGVyID0gbmV3IFJHQkVMb2FkZXIoKTtcbiAgICAgICAgY29uc3QgcG1yZW1HZW5lcmF0b3IgPSBuZXcgVEhSRUUuUE1SRU1HZW5lcmF0b3IocmVuZGVyZXIpO1xuICAgICAgICBjb25zdCBsb2FkSGRyUHJvbWlzZXMgPSB0aGlzLmhkclVybHMubWFwKChoZHJVcmwpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJnYmVMb2FkZXIubG9hZChcbiAgICAgICAgICAgICAgICAgICAgaGRyVXJsLFxuICAgICAgICAgICAgICAgICAgICAodGV4dHVyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZW52TWFwID0gcG1yZW1HZW5lcmF0b3IuZnJvbUVxdWlyZWN0YW5ndWxhcih0ZXh0dXJlKS50ZXh0dXJlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbnZNYXBzLnB1c2goZW52TWFwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHR1cmUuZGlzcG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKGxvYWRIZHJQcm9taXNlcyk7XG4gICAgICAgIHBtcmVtR2VuZXJhdG9yLmRpc3Bvc2UoKTtcblxuICAgICAgICAvLyDliJ3mnJ/jga7nkrDlooPjg57jg4Pjg5fjgpLoqK3lrppcbiAgICAgICAgdGhpcy5zY2VuZS5iYWNrZ3JvdW5kID0gdGhpcy5lbnZNYXBzW3RoaXMuY3VycmVudEhkckluZGV4XTtcbiAgICAgICAgdGhpcy5zY2VuZS5lbnZpcm9ubWVudCA9IHRoaXMuZW52TWFwc1t0aGlzLmN1cnJlbnRIZHJJbmRleF07XG5cbiAgICAgICAgdGhpcy5saWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmKTtcbiAgICAgICAgY29uc3QgbHZlYyA9IG5ldyBUSFJFRS5WZWN0b3IzKDEsIDEsIDEpLm5vcm1hbGl6ZSgpO1xuICAgICAgICB0aGlzLmxpZ2h0LnBvc2l0aW9uLnNldChsdmVjLngsIGx2ZWMueSwgbHZlYy56KTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5saWdodCk7XG5cbiAgICAgICAgY29uc3QgbG9hZGVyR0xURiA9IG5ldyBHTFRGTG9hZGVyKCk7XG4gICAgICAgIGNvbnN0IG90aGVyRmlsZXMgPSBbJ21hdGkuZ2xiJywgJ21hdGkuZ2xiJywgJ21hdGkuZ2xiJ107IC8vIOWQjOOBmOiDjOaZr+ODouODh+ODq+OCkjPjgaToqq3jgb/ovrzjgoBcbiAgICAgICAgb3RoZXJGaWxlcy5mb3JFYWNoKChmaWxlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgbG9hZGVyR0xURi5sb2FkKFxuICAgICAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICAgICAgKGdsdGYpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBnbHRmLnNjZW5lO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhY2tncm91bmRNb2RlbHNbaW5kZXhdID0gbW9kZWw7IC8vIOiDjOaZr+ODouODh+ODq+OCkuioreWumlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhY2tncm91bmRNb2RlbHNbaW5kZXhdLnBvc2l0aW9uLnogPSAtMzQwICogaW5kZXg7IC8vIOODouODh+ODq+OCkumAo+e2muOBl+OBpumFjee9rlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChtb2RlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbG9hZGVyR0xURi5sb2FkKFxuICAgICAgICAgICAgJ3NvZnVpbnUuZ2xiJyxcbiAgICAgICAgICAgIChnbHRmKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBnbHRmLnNjZW5lO1xuICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKG1vZGVsKTtcblxuICAgICAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IG1vZGVsLnBvc2l0aW9uO1xuXG4gICAgICAgICAgICAgICAgLy8gVHdlZW7jgafjgrPjg7Pjg4jjg63jg7zjg6vjgZnjgovlpInmlbDjga7lrprnvqlcbiAgICAgICAgICAgICAgICBsZXQgdHdlZW5pbmZvID0ge3Bvc2l0aW9uOiBtb2RlbC5wb3NpdGlvbi55fTtcblxuICAgICAgICAgICAgICAgIC8vICBUd2VlbuOBp+ODkeODqeODoeODvOOCv+OBruabtOaWsOOBrumam+OBq+WRvOOBs+WHuuOBleOCjOOCi+mWouaVsFxuICAgICAgICAgICAgICAgIGxldCB1cGRhdGVTY2FsZSA9KCk9PntcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwucG9zaXRpb24ueSA9IHR3ZWVuaW5mby5wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBUd2VlbuOBruS9nOaIkFxuICAgICAgICAgICAgICAgIGNvbnN0IHR3ZWVuID0gbmV3IFRXRUVOLlR3ZWVuKHR3ZWVuaW5mbylcbiAgICAgICAgICAgICAgICAgICAgLnRvKHsgcG9zaXRpb246IDUgfSwgNjAwKVxuICAgICAgICAgICAgICAgICAgICAuZWFzaW5nKFRXRUVOLkVhc2luZy5RdWFkcmF0aWMuT3V0KVxuICAgICAgICAgICAgICAgICAgICAub25VcGRhdGUodXBkYXRlU2NhbGUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHR3ZWVuMSA9IG5ldyBUV0VFTi5Ud2Vlbih0d2VlbmluZm8pXG4gICAgICAgICAgICAgICAgICAgIC50byh7IHBvc2l0aW9uOiAwIH0sMzAwKVxuICAgICAgICAgICAgICAgICAgICAuZWFzaW5nKFRXRUVOLkVhc2luZy5RdWFkcmF0aWMuSW4pXG4gICAgICAgICAgICAgICAgICAgIC5vblVwZGF0ZSh1cGRhdGVTY2FsZSk7XG5cbiAgICAgICAgICAgICAgICB0d2Vlbi5jaGFpbih0d2VlbjEpO1xuICAgICAgICAgICAgICAgIHR3ZWVuMS5jaGFpbih0d2Vlbik7XG5cbiAgICAgICAgICAgICAgICAvLyDjgqLjg4vjg6Hjg7zjgrfjg6fjg7Pjga7plovlp4tcbiAgICAgICAgICAgICAgICB0d2Vlbi5zdGFydCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICBjb25zdCB0ZXh0dXJlTG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcbiAgICAgICAgY29uc3QgcmFpbmRyb3BUZXh0dXJlID0gdGV4dHVyZUxvYWRlci5sb2FkKCdyYWluZHJvcC5wbmcnKTsgLy8g44GC44Gq44Gf44Gu6Zuo57KS44Gu55S75YOP44G444Gu44OR44K5XG5cbiAgICAgICAgY29uc3QgcmFpbkdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IFtdO1xuICAgICAgICBjb25zdCB2ZWxvY2l0aWVzID0gW107XG5cbiAgICAgICAgY29uc3QgcmFpbmRyb3BDb3VudCA9IDEwMDAwMDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhaW5kcm9wQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgcG9zaXRpb25zLnB1c2goXG4gICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIDEwMCAtNTAsIC8vIHjluqfmqJlcbiAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogNTAgLCAvLyB55bqn5qiZXG4gICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIDEwMC0yMCAgIC8vIHrluqfmqJlcbiAgICAgICAgICAgICk7XG4gICAgICAgIFxuICAgICAgICAgICAgdmVsb2NpdGllcy5wdXNoKFxuICAgICAgICAgICAgICAgIDAsICAgICAvLyB46YCf5bqmXG4gICAgICAgICAgICAgICAgLU1hdGgucmFuZG9tKCkgKiAzLCAvLyB56YCf5bqmXG4gICAgICAgICAgICAgICAgMCAgICAgIC8vIHrpgJ/luqZcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJhaW5HZW9tZXRyeS5zZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywgbmV3IFRIUkVFLkZsb2F0MzJCdWZmZXJBdHRyaWJ1dGUocG9zaXRpb25zLCAzKSk7XG4gICAgICAgIHJhaW5HZW9tZXRyeS5zZXRBdHRyaWJ1dGUoJ3ZlbG9jaXR5JywgbmV3IFRIUkVFLkZsb2F0MzJCdWZmZXJBdHRyaWJ1dGUodmVsb2NpdGllcywgMykpO1xuICAgICAgICBcbiAgICAgICAgLy8g6Zuo57KS44Gu44Oe44OG44Oq44Ki44Or44KS5L2c5oiQ44GX44G+44GZ44CCXG4gICAgICAgIGNvbnN0IHJhaW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5Qb2ludHNNYXRlcmlhbCh7IHNpemU6IDAuNSwgbWFwOiAgcmFpbmRyb3BUZXh0dXJlLCBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZywgY29sb3I6IDB4ZmZmZmZmLCBkZXB0aFdyaXRlOiBmYWxzZSwgdHJhbnNwYXJlbnQ6IHRydWUsIG9wYWNpdHk6IDAuNSB9KSBcbiAgICAgICAgXG4gICAgICAgIC8vIOmbqOeykuOBruODkeODvOODhuOCo+OCr+ODq+OCt+OCueODhuODoOOCkuS9nOaIkOOBl+OBvuOBmeOAglxuICAgICAgICBjb25zdCByYWluUGFydGljbGVzID0gbmV3IFRIUkVFLlBvaW50cyhyYWluR2VvbWV0cnksIHJhaW5NYXRlcmlhbCk7XG4gICAgICAgIFxuICAgICAgICAvLyDjgrfjg7zjg7Pjgavpm6jnspLjgpLov73liqDjgZfjgb7jgZnjgIJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQocmFpblBhcnRpY2xlcyk7XG5cbiAgICAgICAgbGV0IHVwZGF0ZTogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuICAgICAgICAgICAgLy8g6IOM5pmv44Oi44OH44Or44KS5b6M44KN44Gr44Ga44KJ44GZXG4gICAgICAgICAgICB0aGlzLmJhY2tncm91bmRNb2RlbHMuZm9yRWFjaCgobW9kZWwsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgbW9kZWwucG9zaXRpb24ueiAtPSAwLjI7XG4gICAgICAgICAgICAgICAgaWYgKG1vZGVsLnBvc2l0aW9uLnogPCAtMzQwKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsLnBvc2l0aW9uLnogPSB0aGlzLmJhY2tncm91bmRNb2RlbHNbKGluZGV4ICsgMikgJSAzXS5wb3NpdGlvbi56ICsgMzQwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyAx5YiG44GU44Go44GrSERSSeeUu+WDj+OCkuWIh+OCiuabv+OBiOOCi1xuICAgICAgICAgICAgaWYgKERhdGUubm93KCkgLSB0aGlzLnN0YXJ0VGltZSA+PSA2MDAwMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRIZHJJbmRleCA9ICh0aGlzLmN1cnJlbnRIZHJJbmRleCArIDEpICUgdGhpcy5oZHJVcmxzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmJhY2tncm91bmQgPSB0aGlzLmVudk1hcHNbdGhpcy5jdXJyZW50SGRySW5kZXhdO1xuICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUuZW52aXJvbm1lbnQgPSB0aGlzLmVudk1hcHNbdGhpcy5jdXJyZW50SGRySW5kZXhdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBUV0VFTi51cGRhdGUoKTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gKERhdGUubm93KCkgLSB0aGlzLnN0YXJ0VGltZSkgLyAxMDAwO1xuXG4gICAgICAgICAgICAvLyDpm6jjgYzpmY3jgovjgr/jgqTjg5/jg7PjgrDjgpLoqIjnrpfjgZfjgb7jgZnjgIJcbiAgICAgICAgICAgIGNvbnN0IHJhaW5TdGFydCA9IE1hdGguZmxvb3IoY3VycmVudFRpbWUgLyA0MCkgKiA0MCArIDIwO1xuICAgICAgICAgICAgY29uc3QgcmFpbkVuZCA9IHJhaW5TdGFydCArIDIwO1xuXG4gICAgICAgICAgICAvLyDpm6jjgYzpmY3jgovjgbnjgY3jgYvjganjgYbjgYvjgpLliKTmlq3jgZfjgb7jgZnjgIJcbiAgICAgICAgICAgIGNvbnN0IHNob3VsZFJhaW4gPSBjdXJyZW50VGltZSA+PSByYWluU3RhcnQgJiYgY3VycmVudFRpbWUgPCByYWluRW5kO1xuXG4gICAgICAgICAgICAvLyDpm6jnspLjga7lj6/oppbmgKfjgpLoqK3lrprjgZfjgb7jgZnjgIJcbiAgICAgICAgICAgIHJhaW5QYXJ0aWNsZXMudmlzaWJsZSA9IHNob3VsZFJhaW47XG5cbiAgICAgICAgICAgIC8vIOmbqOOBjOmZjeOBo+OBpuOBhOOCi+WgtOWQiOOBruOBv+OAgembqOeykuOBruS9jee9ruOCkuabtOaWsOOBl+OBvuOBmeOAglxuICAgICAgICAgICAgaWYgKHNob3VsZFJhaW4pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSByYWluUGFydGljbGVzLmdlb21ldHJ5LmF0dHJpYnV0ZXMucG9zaXRpb24uYXJyYXkgYXMgRmxvYXQzMkFycmF5O1xuICAgICAgICAgICAgICAgIGNvbnN0IHZlbG9jaXRpZXMgPSByYWluUGFydGljbGVzLmdlb21ldHJ5LmF0dHJpYnV0ZXMudmVsb2NpdHkuYXJyYXkgYXMgRmxvYXQzMkFycmF5O1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3NpdGlvbnMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zW2kgKyAxXSArPSB2ZWxvY2l0aWVzW2kgKyAxXTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDpm6jnspLjgYzlnLDpnaLjgavliLDpgZTjgZfjgZ/jgonjgIHkuIrjgavmiLvjgZfjgb7jgZnjgIJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc2l0aW9uc1tpICsgMV0gPCAtMjUwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnNbaSArIDFdID0gMjUwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmFpblBhcnRpY2xlcy5nZW9tZXRyeS5hdHRyaWJ1dGVzLnBvc2l0aW9uLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgIH07XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0KTtcbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgbGV0IGNvbnRhaW5lciA9IG5ldyBUaHJlZUpTQ29udGFpbmVyKCk7XG5cbiAgICBsZXQgdmlld3BvcnQgPSBjb250YWluZXIuY3JlYXRlUmVuZGVyZXJET00oNjQwLCA0ODAsIG5ldyBUSFJFRS5WZWN0b3IzKC00LCAzLCA4KSk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh2aWV3cG9ydCk7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnMtbm9kZV9tb2R1bGVzX3R3ZWVuanNfdHdlZW5fanNfZGlzdF90d2Vlbl9lc21fanMtbm9kZV9tb2R1bGVzX3RocmVlX2V4YW1wbGVzX2pzbV9jb250ci1iMjA3MjFcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwLnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=