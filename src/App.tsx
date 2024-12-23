/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useContext } from "react";
import "./App.css";
import { Context } from "./Context";

const WebSocketFileUploader = () => {
  let ws: any;
  const [socket, setSocket] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const downloadQueue: string[] = [];
  let isDownloading = false;
  const { flag  , handleFlag } = useContext(Context)

  const [selectedTime, setSelectedTime] = useState<string>('');
  

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(event.target.value);
    console.log(event.target.value);
  };  

  const processDownloadQueue = async () => {
    if (isDownloading || downloadQueue.length === 0) {
      return;
    }

    isDownloading = true;

    while (downloadQueue.length > 0) {
      const url = downloadQueue.shift(); // Obtener el primer elemento de la cola
      if (url) {
        await downloadFile(url); // Descargar el archivo
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Pausa entre descargas
    }

    isDownloading = false;
  };

  const enqueueDownload = (url: string) => {
    downloadQueue.push(url);
    processDownloadQueue();
  };

  const connectWebSocket = () => {
    ws = new WebSocket("wss://bec3-148-230-247-220.ngrok-free.app/ws");

    ws.onopen = () => {
      console.log("Conectado al servidor WebSocket");
      setSocket(ws);
    };

    ws.onmessage = (event: any) => {
      setMessage(event.data);
      const receivedData = event.data;
      console.log("Datos recibidos:", receivedData);
      
      if (isValidURL(receivedData)) {
        enqueueDownload(receivedData);
      }
    };

    ws.onclose = () => {
      alert("Conexión cerrada");
      console.log("Conexión cerrada, intentando reconectar...");
      setTimeout(() => connectWebSocket(), 1000); // Intentar reconectar en 5 segundos
    };

    ws.onerror = (error: any) => {
      console.error("Error en WebSocket:", error);
    };
  };

  const isValidURL = (url: any) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  useEffect(() => {
    connectWebSocket();


    // Mantener conexión WebSocket activa
    const keepAlive = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ping" }));
        console.log("Ping enviado");
      }
    }, 1000); // Enviar ping cada 1 segundo

    return () => {
      clearInterval(keepAlive);
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (selectedTime) {
      const interval = setInterval(() => {
        const currentTime = new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        });

        if (currentTime === selectedTime && !flag) {
          handleFileUpload();
          // setSended(true);
        }
      }, 1000); // Verificar cada minuto

      return () => clearInterval(interval);
    }
  }, [selectedTime , flag]);
  
  const downloadFile = async (url: string) => {
    return new Promise<void>((resolve) => {
      const anchor = document.createElement("a");
      anchor.href = url;

      // Extraer el nombre del archivo desde la URL
      const fileName = url.split("/").pop();
      anchor.download = fileName || "archivo"; // Nombre sugerido para la descarga

      document.body.appendChild(anchor);
      anchor.click(); // Simular el clic en el enlace
      document.body.removeChild(anchor); // Eliminar el enlace del DOM
      console.log(`Archivo descargado: ${fileName || url}`);
      resolve();
    });
  };

  const handleFileChange = (e: any) => setFiles(Array.from(e.target.files));

  const handleFileUpload = () => {
    
    if(flag) {
      return 
    }
    handleFlag();
    files.forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const arrayBuffer = reader.result;
          socket?.send(arrayBuffer); // Enviar archivo
          console.log(`Archivo enviado: ${file?.name}`);
        } catch (err) {
          console.error(`Error al enviar el archivo ${file.name}:`, err);
        }
      };
      reader.onerror = () => {
        console.error(`Error al leer el archivo ${file.name}:`, reader.error);
      };
      reader.readAsArrayBuffer(file);
    });
    handleFlag();
  };

  return (
    <div>
      <h1>WebSocket File Uploader</h1>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={!files.length}>Subir archivos</button>
      <input
        className="time"
        type="time"
        onChange={handleTimeChange}
      />
      <br />
      {message && <p>Mensaje del servidor: {message} flag: { flag ? "activo" : "no activo" } </p>}
    </div>
  );
};

export default WebSocketFileUploader;
