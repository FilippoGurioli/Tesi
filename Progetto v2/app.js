const os = require('os');

const networkInterfaces = os.networkInterfaces();
const ipv4Addresses = [];

for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
        if (iface.family === 'IPv4' && !iface.internal) {
            ipv4Addresses.push(iface.address);
        }
    }
}

console.log('Indirizzi IP locale:', ipv4Addresses);


const https = require("https");
const fs = require("fs");
const express = require("express");
var path = require("path");
const app = express();
const port = 3000;
//const host = '192.168.40.100';//unibo
//const host = ipv4Addresses[2];
let ip = ipv4Addresses.filter(addr => addr === '192.168.40.100');
if (ip.length === 0) {
	ip = ipv4Addresses.filter(addr => addr.startsWith('192.168.'));
}
if (ip.length === 0) {
	ip = [ipv4Addresses[0]];
}

const host = ip[0];

https.createServer(
	{
		key: fs.readFileSync("private_key.pem"),
		cert: fs.readFileSync("cert.pem"),
	}
	, app)
	.listen(port, host, () => {
		console.log('Server started at https://' + host + ':' + port);
	});



app.use(express.static(path.join(__dirname, '/public')));

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, 'public/html/index.html'));
});