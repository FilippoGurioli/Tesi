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
const host = ipv4Addresses.filter(addr => addr.startsWith('192.168.'));

//ipv4Addresses.forEach(h => {
	https.createServer(
		{
			key: fs.readFileSync("private_key.pem"),
			cert: fs.readFileSync("cert.pem"),
		}
		, app)
		.listen(port, host[0], () => {
			console.log('Server started at https://' + host[0] + ':' + port);
		});
//});


app.use(express.static(path.join(__dirname, '/public')));

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, 'public/html/index.html'));
});