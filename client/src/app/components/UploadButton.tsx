"use client";
import { useState, useCallback } from "react";
import UploadCloud from "../icons/UploadCloud";
import imageCompression from "browser-image-compression";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_TYPES = ["image/", "video/"]; // Solo imágenes y videos

const UploadButton = () => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Validar cada archivo
    for (const file of Array.from(files)) {
      if (!ACCEPTED_TYPES.some((type) => file.type.startsWith(type))) {
        setMessage("❌ Solo se permiten imágenes y videos.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setMessage(`❌ El archivo ${file.name} es demasiado grande (máx. ${MAX_FILE_SIZE / 1024 / 1024}MB).`);
        return;
      }
    }

    setUploading(true);
    setMessage("🔄 Subiendo archivos...");

    try {
      const results = await Promise.allSettled(
        Array.from(files).map(async (file) => {
          let fileToUpload = file;

          // Comprimir solo si es una imagen
          if (file.type.startsWith("image/")) {
            const options = {
              maxSizeMB: 2, // Tamaño máximo de la imagen comprimida (2MB)
              maxWidthOrHeight: 1920, // Resolución máxima (ancho o alto)
              useWebWorker: true, // Usar un Web Worker para mejorar el rendimiento
            };

            fileToUpload = await imageCompression(file, options);
          }

          const formData = new FormData();
          formData.append("file", fileToUpload);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Error en la subida.");
          }

          return response.json();
        })
      );

      const successfulUploads = results.filter((r) => r.status === "fulfilled").length;
      const failedUploads = results.filter((r) => r.status === "rejected").length;

      setMessage(`✅ ${successfulUploads} archivos subidos. ${failedUploads > 0 ? `❌ ${failedUploads} fallidos.` : ""}`);
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Error en la subida.");
    } finally {
      setUploading(false);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 border-3 border-blue-700 border-dashed">
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-white text-blue-950 text-3xl font-bold py-6 px-12 rounded-2xl border border-dashed border-blue-600 shadow-xl flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105"
      >
        <div className="flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full shadow-md">
          <UploadCloud className="w-12 h-12 text-blue-700" />
        </div>
        <span className="text-center">Subir fotos y videos aquí</span>
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
        multiple
      />
      <p className="text-gray-700 text-center max-w-sm mt-4">
        Puedes subir hasta <strong>10 archivos</strong> (máx. 100MB), solo formatos de imagen y video.
      </p>
      {message && <p className="mt-4 text-lg font-semibold text-gray-800">{message}</p>}
    </div>
  );
};

export default UploadButton;