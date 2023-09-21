openssl genrsa -out private_key.pem
openssl req -new -key private_key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey private_key.pem -out cert.pem

npm install && node app