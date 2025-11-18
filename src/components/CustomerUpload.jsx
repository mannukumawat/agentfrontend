import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "./ui/Button";
import UploadFileBox from "./ui/upload-file";

const CustomerUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateFile = (file) => {
    if (!file) {
      setErrorMessage("Please upload a file.");
      return false;
    }

    if (
      file.type !== "text/csv" &&
      file.type !== "application/vnd.ms-excel" &&
      file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setErrorMessage("Only CSV files are allowed.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFile(selectedFile)) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("csvFile", selectedFile);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/customers/upload-csv`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(res.data.message);
      setSelectedFile(null);
      onUploadSuccess();

    } catch (error) {
      toast.error(
        "Error uploading CSV: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <UploadFileBox
        errors={errorMessage}
        onFileChange={(file) => {
          setSelectedFile(file);
          validateFile(file);
        }}
        accept=".csv"
      />

      <div className="w-full flex justify-end">
        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload CSV"}
        </Button>
      </div>
      
    </form>
  );
};

export default CustomerUpload;
