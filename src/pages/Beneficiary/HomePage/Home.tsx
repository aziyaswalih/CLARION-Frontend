import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import Footer from "../../../components/beneficiary/Footer/Footer";
import Header from "../../../components/beneficiary/Header/Header";
import { Upload, FileText } from "lucide-react";

const BeneficiaryHome: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [details, setDetails] = useState("");
  const [condition, setCondition] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(event.target.files)]);
    }
  };

  const handleSubmit = () => {
    // Handle form submission (e.g., send data to API)
    console.log("Details:", details);
    console.log("Condition:", condition);
    console.log("Uploaded Files:", uploadedFiles);
    alert("Your details and documents have been submitted successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f9ff]">
      <Header />
      <section className="flex items-center bg-[#e9f5ff]">
        <div className="w-1/2 h-full p-8">
          <h2 className="text-4xl md:text-6xl font-serif text-[#00509e] tracking-wider mb-6">
            Welcome, Beneficiary!
          </h2>
          <p className="text-xl md:text-2xl text-[#3b3b3b] mb-8 italic">
            "Hope is the bridge between your challenges and a better tomorrow."
          </p>
          <p className="text-lg md:text-xl text-[#555555] mb-8">
            Please upload your reports and provide details about your situation to help us understand your needs better.
          </p>
        </div>
        <div className="w-1/2 h-full flex items-center justify-center">
          <img
            src="/images/featured-2.jpeg"
            alt="Beneficiary Help"
            className="w-4/5 h-full object-cover brightness-100 mt-20 m-16 p-4 bg-[#b2cbf986]"
          />
        </div>
      </section>

      <section className="bg-[#f4f9ff] py-16 px-4">
        <div className="container mx-auto max-w-3xl bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl md:text-3xl font-semibold text-[#00509e] mb-6">
            Submit Your Details
          </h3>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="details" className="block text-lg text-[#3b3b3b] mb-2">
                Your Details
              </label>
              <textarea
                id="details"
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide details about your background and needs..."
                className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring focus:ring-[#00509e] outline-none"
              ></textarea>
            </div>

            <div>
              <label htmlFor="condition" className="block text-lg text-[#3b3b3b] mb-2">
                Your Condition
              </label>
              <textarea
                id="condition"
                rows={3}
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="Describe your current condition or situation..."
                className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring focus:ring-[#00509e] outline-none"
              ></textarea>
            </div>

            <div>
              <label htmlFor="documents" className="block text-lg text-[#3b3b3b] mb-2">
                Upload Supporting Documents
              </label>
              <div className="border border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center">
                <Upload className="w-10 h-10 text-gray-500 mb-2" />
                <input
                  type="file"
                  id="documents"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="documents"
                  className="text-[#00509e] cursor-pointer hover:underline"
                >
                  Click to upload files
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: PDF, JPG, PNG, DOCX
                </p>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-lg font-medium mb-2">Uploaded Files:</h4>
                  <ul className="list-disc pl-5 text-gray-700">
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span>{file.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              className="bg-[#00509e] hover:bg-[#003f7f] text-white px-8 py-3 rounded-md text-lg transition-colors duration-200 w-full"
            >
              Submit
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BeneficiaryHome;
