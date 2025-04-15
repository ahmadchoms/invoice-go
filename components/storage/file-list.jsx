"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/init";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon, DownloadIcon, Loader2 } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function FileList() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const q = query(collection(db, "files"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const fileList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate(),
                    isImage: doc.data().type?.startsWith('image/') || false
                }));

                setFiles(fileList);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching files:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";

        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));

        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    };

    const formatFileType = (type) => {
        return type.split("/")[1]?.toUpperCase() || type;
    };

    const downloadFile = (file) => {
        const byteString = atob(file.data.split(',')[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([int8Array], { type: file.type });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 0);
    };

    const handlePreview = (file) => {
        if (file.isImage) {
            setPreviewImage(file.data);
        } else {
            // For non-image files, fall back to the original behavior
            const byteString = atob(file.data.split(',')[1]);
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const int8Array = new Uint8Array(arrayBuffer);

            for (let i = 0; i < byteString.length; i++) {
                int8Array[i] = byteString.charCodeAt(i);
            }

            const blob = new Blob([int8Array], { type: file.type });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');

            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 0);
        }
    };

    if (loading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Files</CardTitle>
                </CardHeader>
                <CardContent className={"flex items-center justify-center"}>
                    <Loader2 className="h-10 w-10 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Uploaded Files</CardTitle>
            </CardHeader>
            <CardContent>
                {files.length === 0 ? (
                    <p className="text-center py-4">No files uploaded yet</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Preview</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Uploaded</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {files.map((file) => (
                                <TableRow key={file.id}>
                                    <TableCell>
                                        {file.isImage ? (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handlePreview(file)}
                                                    >
                                                        <img
                                                            src={file.data}
                                                            alt={file.name}
                                                            className="h-10 w-10 object-cover rounded-md cursor-pointer hover:opacity-80"
                                                        />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-4xl p-10">
                                                    <img
                                                        src={file.data}
                                                        alt={file.name}
                                                        className="w-full h-full object-contain max-h-[80vh]"
                                                    />
                                                    <DialogTitle></DialogTitle>
                                                </DialogContent>
                                            </Dialog>
                                        ) : (
                                            <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md">
                                                <ImageIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{file.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{formatFileType(file.type)}</Badge>
                                    </TableCell>
                                    <TableCell>{formatFileSize(file.size)}</TableCell>
                                    <TableCell>
                                        {file.createdAt
                                            ? formatDistanceToNow(file.createdAt, { addSuffix: true })
                                            : "Unknown"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => downloadFile(file)}
                                            className="text-green-600 hover:bg-green-50"
                                        >
                                            <DownloadIcon className="h-4 w-4 mr-1" />
                                            Download
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}