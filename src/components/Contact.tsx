import DarkModeButton from "./DarkModeButton";
import InputFields from "./InputFields";
import OldUploads from "./OldUploads";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <InputFields />
      </div>
    </div>
  );
}
