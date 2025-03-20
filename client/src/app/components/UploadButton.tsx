"use client";
import { useState, useCallback } from "react";
import UploadCloud from "../icons/UploadCloud";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_FILES = 50;
const ACCEPTED_TYPES = ["image/", "video/"]; // Solo imágenes y videos

const UploadButton = () => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
  
    setUploading(true);
    setMessage("🔄 Subiendo archivos...");
  
    const uploadUrl = "https://script.google.com/macros/s/AKfycbzc7s22U-WW6fVcDAprTqIp7ihERKMZDbNONuxjERJV4XlxyqZdRe2OthTfW-ZYAWovRQ/exec"; 
  
    try {
      const formData = new FormData();
      formData.append("file", files[0]); // Solo sube 1 archivo por ahora
      formData.append("filename", files[0].name);
      formData.append("mimetype", files[0].type);
  
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (data.success) {
        setMessage(`✅ Archivo subido: ${data.name}`);
      } else {
        throw new Error("Error al subir el archivo.");
      }
    } catch (error) {
      setMessage("❌ Error en la subida.");
      console.error(error);
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
        <span>Subir fotos y videos aquí</span>
      </label>
      <input
        id="file-upload"
        type="file"
        multiple
        accept="image/*,video/*" // Solo acepta imágenes y videos
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <p className="text-gray-700 text-center max-w-sm mt-4">
        Puedes subir hasta <strong>{MAX_FILES}</strong> archivos (máx. 100MB por archivo), solo formatos de imagen y video.
      </p>
      {message && <p className="mt-4 text-lg font-semibold text-gray-800">{message}</p>}
    </div>
  );
};

export default UploadButton;