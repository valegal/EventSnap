import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    console.log("Archivos recibidos en el backend:", files); // Verifica los archivos

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No se recibieron archivos." }, { status: 400 });
    }

    const results = await Promise.allSettled(
      files.map(async (file) => {
        console.log("Procesando archivo:", file.name); // Verifica el archivo actual

        // Crear un nuevo FormData para enviar el archivo al Google Apps Script
        const fileFormData = new FormData();
        fileFormData.append("file", file);

        const response = await fetch(
          "https://script.google.com/macros/s/AKfycby4ADZem000RpO0H9SegwdzfDKgEQw5cq-sZULCxqNbR-DTgvORMhswynrdrPapdVn0mQ/exec",
          {
            method: "POST",
            body: fileFormData, // Enviar el archivo directamente
          }
        );

        console.log("Respuesta del Google Apps Script:", response); // Verifica la respuesta

        if (!response.ok) {
          throw new Error("Error al subir el archivo a Google Drive.");
        }

        return response.json();
      })
    );

    const successfulUploads = results.filter((r) => r.status === "fulfilled").length;
    const failedUploads = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json(
      { successfulUploads, failedUploads },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en la subida:", error);
    return NextResponse.json({ error: "Error al subir archivos." }, { status: 500 });
  }
}