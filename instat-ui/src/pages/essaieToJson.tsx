import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function ExcelToJsonConverter() {
  const [file, setFile] = useState<File | null>(null); // Ajoutez le type File | null
  const [jsonData, setJsonData] = useState<string>("");

  const handleConvert = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          // Vérifiez la nullité de e.target et e.target.result
          const data = e.target.result as ArrayBuffer;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          setJsonData(JSON.stringify(json, null, 2));
        }
      };
      reader.readAsArrayBuffer(file); // Utilisez readAsArrayBuffer à la place de readAsBinaryString
    }
  };


  return (
    <div>
      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} // Ajoutez une vérification de nullité ici
      />
      <button onClick={handleConvert}>Convert</button>{" "}
      {/* Assurez-vous d'ajouter handleConvert ici */}
      <pre>{jsonData}</pre>
    </div>
  );
}

export default ExcelToJsonConverter;
