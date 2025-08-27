import { useState, useEffect } from "react";
import { BASE_URLS } from "../apis/config";

export default function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const storedImagePaths =
      JSON.parse(localStorage.getItem("imagePaths")) || [];
    setImages(storedImagePaths);
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Image Gallery
      </h1>

      {images.length === 0 ? (
        <p className="text-center text-gray-500">No images found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={`${BASE_URLS.files}/${image}`}
                alt={`Image ${index + 1}`}
                className="w-full h-auto block object-cover transform transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                crossOrigin="anonymous"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
