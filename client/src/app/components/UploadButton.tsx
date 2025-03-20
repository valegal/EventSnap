"use client";

import { useState } from "react";
import UploadCloud from "../icons/UploadCloud"; // Asegúrate de que la ruta es correcta

const UploadButton = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const maxPhotos = 50;
  const maxVideos = 5;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setFiles(selectedFiles);
      uploadFiles(selectedFiles);
    }
  };

  const uploadFiles = async (selectedFiles: FileList) => {
    setUploading(true);
    setMessage("Subiendo archivos...");

    try {
      const responses = await Promise.all(
        Array.from(selectedFiles).map(async (file) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);

          return new Promise((resolve, reject) => {
            reader.onload = async () => {
              const rawLog = reader.result?.toString().split(",")[1];
              if (rawLog) {
                const dataSend = {
                  dataReq: { data: rawLog, name: file.name, type: file.type },
                  fname: "uploadFilesToGoogleDrive",
                };

                try {
                  const response = await fetch("/api/upload", {
                    method: "POST",
                    body: JSON.stringify(dataSend),
                    headers: { "Content-Type": "application/json" },
                  });

                  const result = await response.json();
                  resolve(result);
                } catch (error) {
                  reject(error);
                }
              }
            };

            reader.onerror = () => reject(new Error("Error al leer el archivo"));
          });
        })
      );

      setMessage("✅ Subida exitosa.");
      console.log("Archivos subidos:", responses);
    } catch (error) {
      setMessage("❌ Error al subir archivos.");
      console.error("Error al subir:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen border-3 border-blue-700 border-dashed bg-gray-50 p-6">
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-white text-blue-950 text-3xl sm:text-center text-center sm:text-2xl font-bold py-6 px-12 rounded-2xl border border-dashed border-blue-600 shadow-xl flex flex-col items-center gap-4 transition-all duration-300 transform hover:scale-105"
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
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <p className="text-gray-700 text-center font-mono mt-4 text-md sm:text-md">
        <span className="text-blue-500">* </span> Puedes subir hasta <strong>{maxPhotos} fotos</strong> y <strong>{maxVideos} videos</strong>.
      </p>
      {message && <p className="mt-4 text-lg font-semibold text-gray-800">{message}</p>}
    </div>
  );
};

export default UploadButton;
