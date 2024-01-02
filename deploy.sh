#!/bin/bash

# Instalar las dependencias
npm install -g @angular/cli@15.2.10
npm install

# Compilar la aplicación en modo de producción
ng build --configuration production

sudo apt-get update
sudo apt-get install lftp

# Subir la aplicación al servidor de Hostinger (ejemplo usando FTP)
lftp -c "open -u u874328425.devployers.site,in6aTyl7N 195.35.10.185; set ssl:verify-certificate no; mirror -R dist/ /"
