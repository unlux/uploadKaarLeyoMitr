"use client";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Preview } from "./Preview";
import OldUploads from "./OldUploads";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function InputFields() {
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<File | undefined>();
  const [size, setSize] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [presignedGETURL, setPresignedGETURL] = useState<string | undefined>();
  const [resp, setResp] = useState("");

  // Sync input values with state after refresh
  useEffect(() => {
    // Retrieve name from input element if it exists
    const storedName = (
      document.getElementById("nameInput") as HTMLInputElement
    )?.value;
    if (storedName) {
      setName(storedName);
    }

    // Retrieve file from input element if it exists
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      setFile(fileInput.files[0]);
      setSize(fileInput.files[0].size);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file && !name) return;
    setUploading(true);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: JSON.stringify({
          fileName: file?.name,
          username: name,
          fileSize: size,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);

      const { presignedGETURL, presignedPUTURL, message } = data;

      {
        message === "Uploaded Successfully"
          ? toast.success(message)
          : toast.error(message);
      }
      await fetch(presignedPUTURL, {
        method: "PUT",
        body: file,
      });
      setPresignedGETURL(presignedGETURL);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };
    setFile(target.files[0]);
    setSize(target.files[0].size);
  };

  const handleNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setName(target.value);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="text-center dark:bg-gray-700 bg-gray-400 rounded-3xl p-1 shadow-md">
            File upload karleyo
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name:
              </Label>
              <Input
                id="nameInput" // Set ID for retrieving in useEffect
                type="text"
                value={name}
                onChange={handleNameChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                File:
              </Label>
              <Input
                id="fileInput" // Set ID for retrieving in useEffect
                type="file"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              />
            </div>
            <div className="flex ">
              <Button
                type="submit"
                disabled={!file || uploading}
                className="flex justify-center mx-auto h-full pt-2 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {uploading
                  ? "Uploading"
                  : !file
                  ? "Upload (disabled)"
                  : "Click to Upload"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div>{presignedGETURL && <Preview url={presignedGETURL} />}</div>
      <OldUploads username={name} />
    </>
  );
}
