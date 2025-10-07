const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: "dxbtafe9u",
  api_key: "478662978285762",
  api_secret: "GwE7M9uHmX89QwfjBXM1w9jxmpQ",
});

const coachDir = path.join(__dirname, "public", "Francisco Ramírez");
const cloudinaryFolder = "The Klan/coaches/francisco-ramirez";

async function uploadAllImages() {
  console.log("🚀 Subiendo todas las imágenes de Francisco Ramírez...\n");

  const files = fs.readdirSync(coachDir);
  const uploadedUrls = [];

  for (const file of files) {
    const filePath = path.join(coachDir, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile() && /\.(jpg|jpeg|png)$/i.test(file)) {
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: cloudinaryFolder,
          public_id: file.split(".")[0],
          resource_type: "image",
          overwrite: true,
        });

        uploadedUrls.push(result.secure_url);
        console.log(`✅ ${file}`);
        console.log(`   URL: ${result.secure_url}\n`);
      } catch (error) {
        console.error(`❌ Error al subir ${file}:`, error.message);
      }
    }
  }

  console.log(`\n📝 Total de imágenes subidas: ${uploadedUrls.length}`);
  console.log("\n✨ Proceso completado!");

  // Guardar URLs
  fs.writeFileSync(
    "francisco-urls.json",
    JSON.stringify(uploadedUrls, null, 2)
  );
  console.log("📄 URLs guardadas en francisco-urls.json");
}

uploadAllImages().catch(console.error);




