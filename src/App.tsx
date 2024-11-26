/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

const WebSocketFileUploader = () => {
  
  const [socket, setSocket] = useState<any>(null);
  const [message, setMessage] = useState<any>("");
  const [files, setFiles] = useState<any>([]);

  useEffect(() => {
    // Establecer conexión con WebSocket
    const ws = new WebSocket("wss://https://1f90-2806-10be-4-3ae0-5dd2-b414-f148-c3f6.ngrok-free.app/ws");

    ws.onopen = () => {
      console.log("Conectado al servidor WebSocket");
    };

    ws.onmessage = (event) => {
      const receivedData = event.data;
      setMessage(receivedData);

      // Verificar si el mensaje es una URL y descargar automáticamente
      if (isValidURL(receivedData)) {
        downloadFile(receivedData);
      }
    };

    ws.onclose = () => {
      console.log("Conexión cerrada");
    };

    ws.onerror = (error) => {
      console.error("Error en el WebSocket:", error);
    };

    // Establecer el socket en el estado
    setSocket(ws);

    // Limpiar la conexión cuando el componente se desmonte
    return () => {
      if (ws) ws.close();
    };
  }, []);

  const handleFileChange = (e:any) => {
    const selectedFiles = Array.from(e.target.files); // Convertir FileList a array
    setFiles(selectedFiles); // Guardar todos los archivos seleccionados
  };

  const handleFileUpload = () => {
    if (files.length > 0 && socket) {
      files.forEach((file:any) => {
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result;
          socket?.send(arrayBuffer); // Enviar el archivo como un mensaje binario
          console.log(`Archivo enviado: ${file.name}`);
        };
        reader.readAsArrayBuffer(file);
      });
      alert("Archivos subidos con éxito");
    } else {
      alert("Por favor, seleccione archivos antes de subir.");
    }
  };

  // Función para verificar si el mensaje recibido es una URL válida
  const isValidURL = (url:any) => {
    try {
      new URL(url);
      return true;
    } catch{
      return false;
    }
  };

  // Función para descargar el archivo automáticamente
  const downloadFile = (url:any) => {
    const anchor = document.createElement("a");
    anchor.href = url;
  
    // Extraer el nombre del archivo desde la URL, si es posible
    const fileName = url.split("/").pop();
    anchor.download = fileName || "archivo"; // Nombre sugerido para la descarga
  
    document.body.appendChild(anchor);
    anchor.click(); // Simular el clic en el enlace
    document.body.removeChild(anchor); // Eliminar el enlace del DOM
    console.log(`Archivo descargado: ${fileName || url}`);
  };
  

  return (
    <div className="m-3">
      <h1>Subir y descargar archivos a través de WebSocket</h1>

      <input
        className="form-control mb-4"
        type="file"
        multiple // Permitir selección múltiple
        onChange={handleFileChange}
      />

      <button
        className="btn btn-primary"
        onClick={handleFileUpload}
        disabled={files.length === 0}
      >
        Subir archivos
      </button>

      <h1>{message && <p>Mensaje del servidor: {message}</p>}</h1>
    </div>
  );
};

export default WebSocketFileUploader;
