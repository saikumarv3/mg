"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkapp3"] = self["webpackChunkapp3"] || []).push([["src_main_ts"],{

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/**\n * Bootstrap Angular application with retry logic\n *\n * This retry mechanism is necessary because:\n * - Module Federation loads shared modules asynchronously\n * - Angular requires Zone.js to be loaded before bootstrap\n * - Dynamic imports can have timing issues with Module Federation\n * - Retries ensure Angular bootstraps after all dependencies are ready\n *\n * @param retries - Number of retry attempts (default: 3)\n */\nasync function bootstrapAngular(retries = 3) {\n    for (let i = 0; i < retries; i++) {\n        try {\n            await __webpack_require__.e(/*! import() */ \"node_modules_zone_js_fesm2015_zone_js\").then(__webpack_require__.t.bind(__webpack_require__, /*! zone.js */ \"../../node_modules/zone.js/fesm2015/zone.js\", 23));\n            if (i > 0) {\n                await new Promise(resolve => setTimeout(resolve, 50));\n            }\n            const platformBrowserDynamicModule = await __webpack_require__.e(/*! import() */ \"node_modules_angular_platform-browser-dynamic_fesm2022_platform-browser-dynamic_mjs\").then(__webpack_require__.bind(__webpack_require__, /*! @angular/platform-browser-dynamic */ \"../../node_modules/@angular/platform-browser-dynamic/fesm2022/platform-browser-dynamic.mjs\"));\n            const appModule = await __webpack_require__.e(/*! import() */ \"src_app_app_module_ts\").then(__webpack_require__.bind(__webpack_require__, /*! ./app/app.module */ \"./src/app/app.module.ts\"));\n            const { platformBrowserDynamic } = platformBrowserDynamicModule;\n            const { AppModule } = appModule;\n            await platformBrowserDynamic().bootstrapModule(AppModule);\n            if (true) {\n                console.log('Angular app bootstrapped successfully');\n            }\n            return;\n        }\n        catch (err) {\n            if (i === retries - 1) {\n                console.error('Error bootstrapping Angular after', retries, 'attempts:', err);\n            }\n            else {\n                if (true) {\n                    console.log(`Bootstrap attempt ${i + 1} failed, retrying...`);\n                }\n                await new Promise(resolve => setTimeout(resolve, 100));\n            }\n        }\n    }\n}\nbootstrapAngular();\n\n\n\n//# sourceURL=webpack://app3/./src/main.ts?\n}");

/***/ })

}]);