import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

const ExcelUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Por favor selecciona un archivo Excel.");
      return;
    }

    const formData = new FormData();
    formData.append('archivo', file);

    try {
      const response = await axios.post('http://localhost:8000/api/import/excel/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Respuesta del servidor:', response.data);
    } catch (error: any) {
      console.error('Error al subir el archivo:', error.response?.data || error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Subir archivo Excel</h2>
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Subir
      </button>
    </div>
  );
};

export default ExcelUploader;
