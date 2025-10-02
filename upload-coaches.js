const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: "dxbtafe9u",
  api_key: "478662978285762",
  api_secret: "GwE7M9uHmX89QwfjBXM1w9jxmpQ",
});

const publicDir = path.join(__dirname, "public");

// Configuración de entrenadores y sus carpetas
const coaches = [
  {
    name: "Francisco Ramírez",
    folder: "Francisco Ramírez",
    cloudinaryFolder: "The Klan/coaches/francisco-ramirez",
  },
  {
    name: "Sebastian Gomez",
    folder: "Sebastian Gomez",
    cloudinaryFolder: "The Klan/coaches/sebastian-gomez",
  },
  {
    name: "Luis Gonzalez",
    folder: "Luis Gonzalez",
    cloudinaryFolder: "The Klan/coaches/luis-gonzalez",
  },
  {
    name: "Joaquin Lino",
    folder: "Joaquin Lino",
    cloudinaryFolder: "The Klan/coaches/joaquin-lino",
  },
];

async function uploadCoachImages() {
  console.log(
    "🚀 Iniciando subida de imágenes de entrenadores a Cloudinary...\n"
  );

  const allUploadedImages = {};

  for (const coach of coaches) {
    const coachDir = path.join(publicDir, coach.folder);

    if (!fs.existsSync(coachDir)) {
      console.log(`⚠️  Carpeta no encontrada: ${coach.folder}`);
      continue;
    }

    console.log(`📁 Procesando: ${coach.name}`);
    const files = fs.readdirSync(coachDir);
    const uploadedImages = [];

    for (const file of files) {
      const filePath = path.join(coachDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isFile() && /\.(jpg|jpeg|png)$/i.test(file)) {
        try {
          const result = await cloudinary.uploader.upload(filePath, {
            folder: coach.cloudinaryFolder,
            public_id: file.split(".")[0],
            resource_type: "image",
            overwrite: true,
          });

          uploadedImages.push(result.secure_url);
          console.log(`   ✅ ${file}`);
        } catch (error) {
          console.error(`   ❌ Error al subir ${file}:`, error.message);
        }
      }
    }

    allUploadedImages[coach.name] = uploadedImages;
    console.log(`   Total: ${uploadedImages.length} imágenes\n`);
  }

  // Guardar las URLs en un archivo JSON
  const outputPath = path.join(__dirname, "coaches-cloudinary-urls.json");
  fs.writeFileSync(outputPath, JSON.stringify(allUploadedImages, null, 2));
  console.log(`\n📝 URLs guardadas en: ${outputPath}`);
  console.log("\n✨ Proceso completado!");
}

uploadCoachImages().catch(console.error);

