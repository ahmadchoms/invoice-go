"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { db } from "@/lib/firebase/init";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

export default function FileUpload() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("No file selected", {
                description: "Please select a file to upload",
            });
            return;
        }

        try {
            setUploading(true);

            const reader = new FileReader();

            reader.onloadstart = () => {
                setProgress(0);
            };

            reader.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progressValue = Math.round((event.loaded / event.total) * 100);
                    setProgress(progressValue);
                }
            };

            reader.onload = async (event) => {
                try {
                    const base64String = event.target.result;

                    await addDoc(collection(db, "files"), {
                        name: fileName,
                        data: base64String,
                        size: file.size,
                        type: file.type,
                        createdAt: serverTimestamp(),
                    });

                    setFile(null);
                    setFileName("");
                    setProgress(0);
                    setUploading(false);

                    toast.success("Upload successful", {
                        description: "Your file has been uploaded",
                    });
                } catch (error) {
                    console.error("Error storing in Firestore:", error);
                    toast.error("Upload failed", {
                        description: error.message || "Failed to store file in database",
                    });
                    setUploading(false);
                }
            };

            reader.onerror = (error) => {
                console.error("File reading error:", error);
                toast.error("Upload failed", {
                    description: "Error reading the file",
                });
                setUploading(false);
            };

            reader.readAsDataURL(file);

        } catch (error) {
            console.error("Error during upload:", error);
            toast.error("Upload failed", {
                description: "Something went wrong",
            });
            setUploading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Upload File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="file">File</Label>
                    <Input
                        id="file"
                        type="file"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="cursor-pointer"
                    />
                </div>

                {uploading && (
                    <div className="space-y-2">
                        <Label>Upload Progress</Label>
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-gray-500 text-right">{progress}%</p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full cursor-pointer"
                >
                    {uploading ? "Uploading..." : "Upload"}
                </Button>
            </CardFooter>
        </Card>
    );
}