/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import "./App.css";

const WebSocketFileUploader = () => {
  let ws:any;
  const [socket, setSocket] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  // const [selectedTime, setSelectedTime] 0= useState<any>("");

  useEffect(() => {
    const connectWebSocket = () => {
      ws = new WebSocket("wss://1f90-2806-10be-4-3ae0-5dd2-b414-f148-c3f6.ngrok-free.app/ws");

      ws.onopen = () => {
        console.log("Conectado al servidor WebSocket");
        setSocket(ws);
      };

      ws.onmessage = (event:any) => {
        setMessage(event.data);
        const receivedData = event.data;
        if (isValidURL(receivedData)) {
          downloadFile(receivedData);
        }
      };

      ws.onclose = () => {
        console.log("Conexión cerrada, intentando reconectar...");
        setTimeout(() => connectWebSocket(), 1000); // Intentar reconectar en 5 segundos
      };

      ws.onerror = (error:any) => {
        console.error("Error en WebSocket:", error);
      };
    };

    connectWebSocket();

    const isValidURL = (url: any) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };
  
    // Función para descargar el archivo automáticamente
    const downloadFile = (url: any) => {
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
  

    const keepAlive = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ping" }));
        console.log("Ping enviado");
      }
    }, 1000); // Enviar ping cada 30 segundos

    return () => {
      clearInterval(keepAlive);
      ws.close();
    };
  }, []);

  const handleFileChange = (e:any) => setFiles(Array.from(e.target.files));

  const handleFileUpload = () => {
    if (files.length > 0 && socket) {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result;
          socket?.send(arrayBuffer); // Enviar archivo
        };
        reader.readAsArrayBuffer(file);
      });
    }
  };

  return (
    <div>
      <h1>WebSocket File Uploader</h1>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={!files.length}>Subir archivos</button>
      {message && <p>Mensaje del servidor: {message}</p>}
    </div>
  );
};

export default WebSocketFileUploader;
