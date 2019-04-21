"use strict";
let fs = require('fs');

function loadSettings() {
    let settings = JSON.parse(fs.readFileSync('../control/settings.json'));
    console.log("loaded settings:");
    console.log(settings);
}

loadSettings();

