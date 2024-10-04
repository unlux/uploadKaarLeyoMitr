import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import toast, { Toaster } from "react-hot-toast";

const notify = () => toast("copied successfully");

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
      <h2>
        Presigned GET URL:
        <Button
          onClick={() => {
            navigator.clipboard.writeText(url);
          }}
        >
          Copy
        </Button>
      </h2>
      <br />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      Preview:
      {preview && (
        <Image src={preview} width={500} height={500} alt="Preview Image" />
      )}
    </div>
  );
}
