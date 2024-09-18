const express = require('express');
const morgan = require('morgan');
const path = require('path');
const argv = require('yargs')
    .usage('Usage: $0 -p [port]')
    .alias('p', 'port')
    .describe('port', '(Optional) Port Number - Default is 3000')
    .strict()
    .argv;

const DEFAULT_PORT = 3000;

const app = express();

let port = DEFAULT_PORT;
if (argv.port) {
    port = argv.p;
}

app.use(morgan('dev'));
app.use("/lib", express.static(path.join(__dirname, '../../lib/msal-browser/lib')));

app.use(express.static('app'));

// Serve the scripts directory
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Serve the styles directory
app.use('/styles', express.static(path.join(__dirname, 'styles')));


app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port);
console.log(`Listening on port ${port}...`);