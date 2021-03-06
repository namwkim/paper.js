/*
 * Paper.js - The Swiss Army Knife of Vector Graphics Scripting.
 * http://paperjs.org/
 *
 * Copyright (c) 2011 - 2016, Juerg Lehni & Jonathan Puckey
 * http://scratchdisk.com/ & http://jonathanpuckey.com/
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */

// This file uses Prepro.js to preprocess the paper.js source code on the fly in
// the browser, avoiding the step of having to manually preprocess it after each
// change. This is very useful during development of the library itself.
if (typeof window === 'object') {
    // Browser based loading through Prepro.js:

    /* jshint -W082 */
    function load(src) {
        document.write('<script src="' + src + '"></script>');
    }

    if (!window.include) {
        // Get the last script tag and assume it's the one that loaded this file
        // then get its src attribute and figure out the location of our root.
        var scripts = document.getElementsByTagName('script'),
            src = scripts[scripts.length - 1].getAttribute('src');
        // Assume that we're loading from a non-root folder, either through
        // ../../dist/paper-full.js, or directly through ../../src/load.js,
        // and match root as all the parts of the path that lead to that folder.
        // So we basically just want all the leading '.' and '/' characters:
        var root = src.match(/^([.\/]*)/)[1];
        // First load the prepro's browser.js file, which provides the include()
        // function for the browser.
        load(root + 'node_modules/prepro/lib/browser.js');
        // Now that we will have window.include() through browser.js, trigger
        // the loading of this file again, which will execute the lower part of
        // the code the 2nd time around.
        load(root + 'src/load.js');
    } else {
        include('options.js');
        include('paper.js');
    }
} else {
    // Node.js based loading through Prepro.js:
    var prepro = require('prepro/lib/node.js'),
        // Load the default browser-based options for further amendments.
        // Step out and back into src, if this is loaded from dist/paper-node.js
        options = require('../src/options.js');
    // Override Node.js specific options.
    options.version += '-load';
    options.environment = 'node';
    options.load = true;
    prepro.setup(function() {
        // Return objects to be defined in the preprocess-scope.
        // Note that this would be merge in with already existing objects.
        return { __options: options };
    });
    // Load Paper.js library files.
    prepro.include('../src/paper.js');
}
