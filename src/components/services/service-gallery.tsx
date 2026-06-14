const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800";

interface ServiceGalleryProps {
  images: string[] | null;
  imageUrl: string | null;
  title: string;
}

export function ServiceGallery({ images, imageUrl, title }: ServiceGalleryProps) {
  const allImages = images?.length
    ? images.slice(0, 5)
    : imageUrl
    ? [imageUrl]
    : [FALLBACK_IMAGE];

  const count = allImages.length;

  if (count === 1) {
    return (
      <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-8">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${allImages[0]}')` }}
          role="img"
          aria-label={title}
        />
      </div>
    );
  }

  if (count <= 3) {
    return (
      <div className="grid grid-cols-2 gap-2 h-[420px] rounded-2xl overflow-hidden mb-8">
        <div
          className="row-span-2 bg-cover bg-center"
          style={{ backgroundImage: `url('${allImages[0]}')` }}
          role="img"
          aria-label={title}
        />
        <div className="flex flex-col gap-2 h-full">
          {allImages.slice(1).map((src, i) => (
            <div
              key={i}
              className="flex-1 bg-cover bg-center"
              style={{ backgroundImage: `url('${src}')` }}
              role="img"
              aria-label={`${title} photo ${i + 2}`}
            />
          ))}
        </div>
      </div>
    );
  }

  // 4–5 images: full grid
  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[480px] rounded-2xl overflow-hidden mb-8">
      <div
        className="col-span-2 row-span-2 bg-cover bg-center"
        style={{ backgroundImage: `url('${allImages[0]}')` }}
        role="img"
        aria-label={title}
      />
      {allImages.slice(1, 5).map((src, i) => (
        <div
          key={i}
          className="col-span-1 row-span-1 bg-cover bg-center"
          style={{ backgroundImage: `url('${src}')` }}
          role="img"
          aria-label={`${title} photo ${i + 2}`}
        />
      ))}
    </div>
  );
}
