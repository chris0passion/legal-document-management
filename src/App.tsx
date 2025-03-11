import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import './App.css';
import DocumentBox from './components/DocumentBox';
import { MdCloudUpload } from "react-icons/md";

// Bind modal to app element for accessibility
Modal.setAppElement('#root');

interface DocumentData {
  file: File;
  fileName: string;
  uploadDate: string;
  url: string;
}

const mockExtractions = [
  { key: 'Extraction 1', page: 1 },
  { key: 'Extraction 2', page: 3 },
  { key: 'Extraction 3', page: 11 },
];

const App: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<Record<number, DocumentData>>({});
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
    'application/vnd.ms-excel', // XLS
    'text/csv',
  ];

  const handleUpload = async (index: number, file: File) => {
    if (!allowedTypes.includes(file.type)) {
      alert('Only XLSX, XLS, CSV, and PDF files are allowed.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setUploadedFiles((prev) => ({
      ...prev,
      [index]: {
        file,
        fileName: data.fileName,
        uploadDate: data.uploadDate,
        url: URL.createObjectURL(file),
      },
    }));
    setIsUploadModalOpen(false);
    setSelectedFile(null);
  };

  const openUploadModal = (index: number) => {
    setSelectedDoc(index);
    setIsUploadModalOpen(true);
  };

  const openDetailsModal = (index: number) => {
    setSelectedDoc(index);
    setIsDetailsModalOpen(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (selectedFile && selectedDoc !== null) {
      handleUpload(selectedDoc, selectedFile);
    } else {
      alert('Please select a file to upload.');
    }
  };

  return (
    <div className="App">
      <header>
        <img src="/deepseek-logo-icon.png" alt="Icon" className="header-icon" width={32} height={32} />
        <h1>Legal Document Management</h1>
      </header>
      <div className="doc-grid">
        {Array.from({ length: 9 }).map((_, index) => (
          <DocumentBox
            key={index}
            index={index}
            uploadedFile={uploadedFiles[index]}
            onClick={uploadedFiles[index] ? openDetailsModal : openUploadModal}
          />
        ))}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onRequestClose={() => setIsUploadModalOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Legal Document {selectedDoc !== null ? selectedDoc + 1 : ''}</h2>
        <div
          className={`drag-area ${isDragging ? 'dragover' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleFileInputClick}
        >
          <div>
            <img src="/icons8-file-upload-64.png"  alt="Icon" className="header-icon" width={32} height={32}/>
          </div>
          Drag files here or click to select files
          <br />
          <small>(XLSX, XLS, CSV, and PDF files are allowed)</small>
          {selectedFile && <p>Selected: {selectedFile.name}</p>}
          <input
            type="file"
            accept=".xlsx,.xls,.csv,.pdf"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setSelectedFile(file);
            }}
          />
        </div>
        <div className="button-group">
          <button onClick={() => setIsUploadModalOpen(false)}>Cancel</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </Modal>

      {/* Document Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onRequestClose={() => setIsDetailsModalOpen(false)}
        className="details-modal"
        overlayClassName="overlay"
      >
        <div className="modal-header">
          <h2>Legal Document {selectedDoc !== null ? selectedDoc + 1 : ''}</h2>
          <button onClick={() => setIsDetailsModalOpen(false)}>X</button>
        </div>
        <div className="modal-content">
          <div className="viewer">
            {selectedDoc !== null && uploadedFiles[selectedDoc]?.url && (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={uploadedFiles[selectedDoc].url} />
              </Worker>
            )}
          </div>
          <div className="extractions">
            <h3>Mock Extractions</h3>
            {mockExtractions.map((entry, i) => (
              <div key={i}>
                {entry.key} - Page {entry.page}{' '}
                <button onClick={() => alert(`Navigate to page ${entry.page}`)}>
                  Go To Page
                </button>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default App;