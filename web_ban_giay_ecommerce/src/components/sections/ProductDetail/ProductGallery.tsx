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
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
        {galleryImages.map((image, index) => {
          const isActive = index === selectedIndex;

          return (
            <button
              type="button"
              key={`${image}-${index}`}
              onClick={() => setSelectedIndex(index)}
              className={`w-20 h-20 shrink-0 rounded-md overflow-hidden border transition ${
                isActive ? "border-black" : "border-slate-200 hover:border-slate-400"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img src={image} alt={`${title} ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          );
        })}
      </div>

      <div className="bg-[#F6F6F6] rounded-xl overflow-hidden aspect-square">
        <img src={galleryImages[selectedIndex]} alt={title} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
