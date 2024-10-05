import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import toast, { Toaster } from "react-hot-toast";
import { Card, CardContent } from "./ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
      <Card>
        <CardContent>
          <br />
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <h1>Click here for the file preview</h1>
              </AccordionTrigger>
              <AccordionContent>
                {preview && (
                  <Image
                    src={preview}
                    width={500}
                    height={500}
                    alt="Preview Image"
                  />
                )}
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="flex justify-center items-center mx-auto h-full pt-2">
            <Toaster />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(url);
                toast.success("copied");
              }}
              className="flex rounded-full "
            >
              Copy Link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
