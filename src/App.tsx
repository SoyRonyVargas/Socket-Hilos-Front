import { useState, useEffect } from "react";
import "./App.css";

const WebSocketFileUploader = () => {
  let ws;
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    const connectWebSocket = () => {
      ws = new WebSocket("wss://1f90-2806-10be-4-3ae0-5dd2-b414-f148-c3f6.ngrok-free.app/ws");

      ws.onopen = () => {
        console.log("Conectado al servidor WebSocket");
        setSocket(ws);
      };

      ws.onmessage = (event) => {
        setMessage(event.data);
      };

      ws.onclose = () => {
        console.log("Conexión cerrada, intentando reconectar...");
        setTimeout(() => connectWebSocket(), 5000); // Intentar reconectar en 5 segundos
      };

      ws.onerror = (error) => {
        console.error("Error en WebSocket:", error);
      };
    };

    connectWebSocket();

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

  const handleFileChange = (e) => setFiles(Array.from(e.target.files));

  const handleFileUpload = () => {
    if (files.length > 0 && socket) {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result;
          socket.send(arrayBuffer); // Enviar archivo
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
