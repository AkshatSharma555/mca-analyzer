import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFileText, FiXCircle } from 'react-icons/fi';

const FileUpload = ({ file, setFile }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
  });

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
  };

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-300
        ${isDragActive ? 'border-cyan-400 bg-slate-700/50' : 'border-slate-600 hover:border-cyan-500'}
      `}
    >
      <input {...getInputProps()} />
      {file ? (
        <div className="flex flex-col items-center justify-center text-slate-300">
          <FiFileText className="w-12 h-12 text-emerald-400" />
          <p className="mt-2 font-semibold">{file.name}</p>
          <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
          <button
            onClick={removeFile}
            className="mt-4 text-red-500 hover:text-red-400 flex items-center gap-1 text-sm"
          >
            <FiXCircle /> Remove File
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-400">
          <FiUploadCloud className="w-12 h-12 mb-4" />
          <p className="font-semibold">Drag & drop your CSV or Excel file here</p>
          <p className="text-sm mt-2">or click to browse</p>
          <p className="text-xs text-slate-500 mt-4">Supports: .csv, .xlsx (Max 1 file)</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;