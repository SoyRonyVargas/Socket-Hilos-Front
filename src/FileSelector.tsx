// // import React, { useState } from 'react';

// const SaveFileComponent = () => {
//   // const [message, setMessage] = useState('');

//   const handleSaveFile = async () => {
//     // try {
//     //   // Abre el diálogo de selección de una carpeta
//     //   const folderHandle = await window?.showDirectoryPicker();

//     //   // Crea un nuevo archivo dentro de la carpeta seleccionada
//     //   const newFileHandle = await folderHandle.getFileHandle('archivo.sql', { create: true });

//     //   // Obtiene un "WritableStream" para escribir en el archivo
//     //   const writableStream = await newFileHandle.createWritable();

//     //   // Escribe contenido en el archivo
//     //   const content = 'Este es un archivo de prueba.';
//     //   await writableStream.write(content);

//     //   // Cierra el flujo de escritura para guardar el archivo
//     //   await writableStream.close();

//     //   setMessage('Archivo guardado exitosamente');
//     // } catch (err) {
//     //   console.error("Error al guardar el archivo:", err);
//     //   setMessage('Error al guardar el archivo');
//     // }
//   };

//   return (
//     <div>
//       {/* <button onClick={handleSaveFile}>Guardar Archivo</button>
//       <p>{message}</p> */}
//     </div>
//   );
// };

// export default SaveFileComponent;