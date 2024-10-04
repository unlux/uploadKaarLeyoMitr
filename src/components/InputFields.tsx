"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Preview } from "./Preview";
import OldUploads from "./OldUploads";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export default function InputFields() {
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<File | undefined>();
  const [size, setSize] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [presignedGETURL, setPresignedGETURL] = useState<string | undefined>();
  const [resp, setResp] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("----------------------------handle submit TRIGGERED");

    if (!file && !name) return;
    setUploading(true);

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    const username = name;
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
      const { presignedGETURL, presignedPUTURL, message } = data;
      setResp(message);
      await fetch(presignedPUTURL, {
        method: "PUT",
        body: file,
      });
      console.log("----------------------------File uploaded successfully");
      console.log(
        "----------------------------Presigned GET URL: ",
        presignedGETURL
      );
      console.log("======================resp", resp);
      setPresignedGETURL(presignedGETURL);
      setUploading(false);
    } catch (error) {
      console.log("----------------------------error" + error);
      setUploading(false);
    }

    if (typeof file === "undefined") return;
  };

  const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };

    setFile(target.files[0]);
    setSize(target.files[0].size);
    console.log(target.files[0]);
  };

  const handleNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setName(target.value);
    console.log("----------------------------name" + name);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="text-center dark:bg-slate-700 bg-slate-400 rounded-3xl ">
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
                type="file"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!file || uploading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {uploading ? "Uploading" : "Upload"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <OldUploads username={name} />
      <div>{presignedGETURL && <Preview url={presignedGETURL} />}</div>
    </>
  );
}
