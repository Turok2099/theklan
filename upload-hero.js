const cloudinary = require("cloudinary").v2;

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: "dxbtafe9u",
  api_key: "478662978285762",
  api_secret: "GwE7M9uHmX89QwfjBXM1w9jxmpQ",
});

async function uploadHeroImage() {
  console.log("🚀 Subiendo imagen del Hero...\n");

  try {
    const result = await cloudinary.uploader.upload("public/22.jpeg", {
      folder: "The Klan",
      public_id: "hero-image",
      resource_type: "image",
      overwrite: true,
    });

    console.log("✅ Imagen subida exitosamente");
    console.log(`URL: ${result.secure_url}\n`);
    console.log("✨ Proceso completado!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

uploadHeroImage().catch(console.error);




