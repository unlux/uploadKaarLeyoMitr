import DarkModeButton from "./DarkModeButton";
import InputFields from "./InputFields";
import OldUploads from "./OldUploads";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Contact Us
          </h2>
          <DarkModeButton />
        </div>
        <InputFields />
      </div>
    </div>
  );
}
