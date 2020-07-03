// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var serialport = require('serialport');
var tableify = require('tableify');
serialport.list(function (err, ports) {
    console.log('ports', ports);
    if (err) {
        document.getElementById('error').textContent = err.message;
        return;
    }
    else {
        document.getElementById('error').textContent = '';
    }
    if (ports.length === 0) {
        document.getElementById('error').textContent = 'No ports discovered';
    }
    var tableHTML = tableify(ports);
    document.getElementById('ports').innerHTML = tableHTML;
});
//# sourceMappingURL=renderer.js.map