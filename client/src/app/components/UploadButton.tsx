"use client";

import { useState } from "react";
import UploadCloud from "../icons/UploadCloud";

const UploadButton = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const maxPhotos = 50;
  const maxVideos = 5;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen border-2 border-b-blue-600 border-dashed bg-gray-200 p-4">
      <label
        htmlFor="file-upload"
        className="cursor-pointer  hover:bg-gray-100 text-black text-xl sm:text-2xl font-bold py-6 px-12 rounded-2xl shadow-lg flex flex-col items-center gap-3 transition-all duration-300"
      >
        <UploadCloud />
        <span>Subir Fotos y Videos</span>
      </label>
      <input
        id="file-upload"
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <p className="text-gray-600 text-center mt-4 text-lg sm:text-xl">
        Puedes subir hasta <strong>{maxPhotos} fotos</strong> y <strong>{maxVideos} videos</strong>.
      </p>
    </div>
  );
};

export default UploadButton;
