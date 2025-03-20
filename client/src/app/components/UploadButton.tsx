"use client";
import { useState, useCallback } from "react";
import UploadCloud from "../icons/UploadCloud";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_TYPES = ["image/", "video/"]; // Only images and videos

const UploadButton = () => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Validate file type and size
    const file = files[0];
    if (!ACCEPTED_TYPES.some((type) => file.type.startsWith(type))) {
      setMessage("❌ Solo se permiten imágenes y videos.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setMessage(`❌ El archivo es demasiado grande (máx. ${MAX_FILE_SIZE / 1024 / 1024}MB).`);
      return;
    }

    setUploading(true);
    setMessage("🔄 Subiendo archivo...");

    // Replace with your Google Apps Script web app URL
    const uploadUrl = "https://script.google.com/macros/s/AKfycbyOp6te9FbfakgbSOEqhB21zDhOBVlYyD0QFILTRMmp_CwUl5CRZA0RQW7Auf6TXvaG/exec";

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        if (!reader.result) {
          setMessage("❌ Error al leer el archivo.");
          return;
        }
        const base64Data = reader.result.toString().split(",")[1]; // Convert to string and remove the data URL prefix

        // Send the file to Google Apps Script
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `file=${encodeURIComponent(base64Data)}&filename=${encodeURIComponent(file.name)}&mimetype=${encodeURIComponent(file.type)}`,
          mode: "no-cors", // Required for Google Apps Script
        });

        // Log the response for debugging
        const responseText = await response.text();
        console.log("Server Response:", responseText);

        // Parse the response as JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (error) {
          throw new Error("Invalid JSON response from server.");
        }

        // Handle the response
        if (data.status === "success") {
          setMessage(`✅ Archivo subido: ${data.url}`);
        } else {
          throw new Error(data.message || "Error al subir el archivo.");
        }
      };
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
        accept="image/*,video/*" // Only accept images and videos
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <p className="text-gray-700 text-center max-w-sm mt-4">
        Puedes subir hasta <strong>1 archivo</strong> (máx. 100MB), solo formatos de imagen y video.
      </p>
      {message && <p className="mt-4 text-lg font-semibold text-gray-800">{message}</p>}
    </div>
  );
};

export default UploadButton;