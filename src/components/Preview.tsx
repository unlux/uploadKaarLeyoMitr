import Image from "next/image";
import { useEffect, useState } from "react";

interface PreviewProps {
  url: string;
}

export function Preview({ url }: PreviewProps) {
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const imageUrl = URL.createObjectURL(await response.blob());
        setPreview(imageUrl);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the image:", error);
        setError("Error fetching the image");
        setLoading(false);
      }
    };

    fetchImage();
  }, [url]);

  return (
    <div>
      <h2>Presigned GET URL:</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {preview && (
        <Image src={preview} width={500} height={500} alt="Preview Image" />
      )}
    </div>
  );
}
