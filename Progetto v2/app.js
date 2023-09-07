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
const host = ipv4Addresses[2]; //portatile
//const host = ipv4Addresses.find(addr => addr.startsWith('192.168.')); //fisso

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

//-------------------------------------------------------------------
const axios = require('axios');

fs.readFile('./public/js/Utils/Cards.json', 'utf8', (err, data) => {
	if (err) {
	  console.error('Errore nella lettura del file JSON:', err);
	  return;
	}
  
	const json = JSON.parse(data);
	json.forEach(card => {
		axios({
			method: 'get',
			url: card.image,
			responseType: 'stream',
		  })
			.then(function (response) {
				const parts = card.image.split("/");
				const fileName = "public/img/" + parts[parts.length - 1];
				response.data.pipe(fs.createWriteStream(fileName));
				card.image = fileName;
				fs.writeFile("./public/js/Utils/Cards.json", JSON.stringify(json), function(err) {
					if(err) {
						return console.log(err);
					}
				});
			})
			.catch(function (error) {
			  console.log('Errore durante il download dell\'immagine:', error);
			});
	});
  });