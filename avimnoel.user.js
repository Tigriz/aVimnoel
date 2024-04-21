// ==UserScript==
// @name         a𝑽𝒊𝒎noel
// @version      1.0.21
// @description  Add vim shortcuts to avenoel
// @author       Tigriz
// @source       https://github.com/Tigriz
// @license      CECILL-2.1; http://www.cecill.info/licences/Licence_CeCILL_V2.1-en.txt
// @match        https://avenoel.org/*
// @icon         https://raw.githubusercontent.com/Tigriz/aVimnoel/main/assets/avimnoel.png
// @run-at       document-start
// @grant        GM_info
// ==/UserScript==

const VERSION = GM_info.script.name.includes('dev') ? Date.now() : GM_info.script.version;
const HOST = GM_info.script.name.includes('dev') ? 'http://127.0.0.1:8080' : 'https://Tigriz.github.io/aVimnoel';

const { vim } = await import(`${HOST}/js/main.js?v=${VERSION}`);

const style = document.createElement('style');
style.innerText = await (await fetch(`${HOST}/assets/style.css?v=${VERSION}`)).text();
document.body.append(style);

vim(VERSION);
