// Ejemplo de configuración segura para Cloudinary
// Para usar scripts de upload en el futuro:
// 1. Instala dotenv: npm install dotenv
// 2. Crea un archivo .env.local (nunca lo subas a git)
// 3. Agrega tus credenciales ahí
// 4. Usa este patrón en tus scripts

require('dotenv').config({ path: '.env.local' });
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ejemplo de uso:
// async function uploadImage() {
//   const result = await cloudinary.uploader.upload("path/to/image.jpg", {
//     folder: "The Klan",
//     public_id: "image-name",
//   });
//   console.log(result.secure_url);
// }

module.exports = cloudinary;

