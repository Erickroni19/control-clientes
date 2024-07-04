const { writeFileSync, mkdirSync } = require('fs');

//Indicar configuración del archivo dotenv
require('dotenv').config({path: './src/.env'});

//Ruta del archivo
const targetPath = './src/environments/environment.ts';

//contenido del archivo
const envFileContent = `
  export const environment = {
    production: ${process.env.PRODUCTION},
    firebaseConfig: {
      apiKey: "${process.env.API_KEY}",
      authDomain: "${process.env.AUTH_DOMAIN}",
      projectId: "${process.env.PROJECT_ID}",
      storageBucket: "${process.env.STORAGE_BUCKET}",
      messagingSenderId: "${process.env.MESSAGING_SENDER_ID}",
      appId: "${process.env.APP_ID}",
      measurementId: "${process.env.MEASUREMENT_ID}"
    }
}`;

//crear carpeta (se pasa el path donde se va a crear, recursive: true sobreescribe si ya esta escrito)
mkdirSync('./src/environments', { recursive: true });

//escribir el archivo
writeFileSync( targetPath, envFileContent );
