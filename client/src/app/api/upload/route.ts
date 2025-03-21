import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configura el límite de tamaño de la solicitud
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb", // Aumenta el límite a 100 MB
    },
  },
};

// Configura Cloudinary con tus credenciales
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No se recibieron archivos." }, { status: 400 });
    }

    // Subir cada archivo a Cloudinary
    const results = await Promise.allSettled(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const base64Data = Buffer.from(buffer).toString("base64");

        const result = await cloudinary.uploader.upload(`data:${file.type};base64,${base64Data}`, {
          folder: "event_snap",
          resource_type: "auto",
        });

        return result.secure_url;
      })
    );

    // Contar subidas exitosas y fallidas
    const successfulUploads = results.filter((r) => r.status === "fulfilled").length;
    const failedUploads = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      status: "success",
      successfulUploads,
      failedUploads,
    });
  } catch (error) {
    console.error("Error al subir archivos a Cloudinary:", error);
    return NextResponse.json({ error: "Error al subir archivos." }, { status: 500 });
  }
}