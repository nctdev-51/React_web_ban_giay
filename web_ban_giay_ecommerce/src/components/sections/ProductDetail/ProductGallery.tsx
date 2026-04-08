import { useEffect, useMemo, useState } from "react";

type ProductGalleryProps = {
  images: string[];
  title: string;
};

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const galleryImages = useMemo(() => {
    return images.length > 0
      ? images
      : ["https://via.placeholder.com/800x800?text=No+Image"];
  }, [images]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [galleryImages]);

  return (
    <div className="grid gap-4 md:grid-cols-[96px_1fr]">
      {/* Cột Thumbnail */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible hide-scrollbar">
        {galleryImages.map((image, index) => {
          const isActive = index === selectedIndex;

          return (
            <button
              type="button"
              key={`${image}-${index}`}
              onClick={() => setSelectedIndex(index)}
              className={`w-20 h-20 shrink-0 rounded-md overflow-hidden border-2 transition-all bg-[#f6f6f6] ${
                isActive
                  ? "border-black"
                  : "border-transparent hover:border-gray-300"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover mix-blend-multiply p-1"
              />
            </button>
          );
        })}
      </div>

      {/* Ảnh chính */}
      <div className="bg-[#F6F6F6] rounded-xl overflow-hidden aspect-square flex items-center justify-center">
        <img
          src={galleryImages[selectedIndex]}
          alt={title}
          className="w-full h-full object-cover mix-blend-multiply"
        />
      </div>
    </div>
  );
}
