import FileList from "@/components/storage/file-list";
import FileUpload from "@/components/storage/file-upload";

export default function UploadPage() {
    return (
        <main className="container mx-auto py-10">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold">Firebase File Storage</h1>
                <p className="text-gray-500">Upload dan simpan file dengan mudah</p>
            </div>

            <div className="grid gap-8 px-10">
                <div className="mx-auto w-full max-w-xl">
                    <FileUpload />
                </div>

                <div className="w-full">
                    <FileList />
                </div>
            </div>
        </main>
    );
}