import { useState } from "react";

export default function UploadForm({ onFileUpload, onUrlUpload }) {
  const [url, setUrl] = useState("");

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files[0] && onFileUpload(e.target.files[0])}
        className="file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-600 file:text-white"
      />
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste image URL"
          className="text-black px-3 py-2 rounded"
        />
        <button
          onClick={() => onUrlUpload(url)}
          className="bg-green-600 px-3 py-2 rounded"
        >
          Search URL
        </button>
      </div>
    </div>
  );
}
