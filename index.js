import express from 'express' 
import path from 'path'  // Importa el módulo 'path' para manejar y transformar rutas de archivos.
import { fileURLToPath } from 'url'  // Importa la función 'fileURLToPath' del módulo 'url' para convertir una URL de archivo en una ruta de archivo
const __filename = fileURLToPath (import.meta.url)
const __dirname = path.dirname (__filename)

const app = express()

const port = 5001

app.listen(port, () =>{
    console.log(`Servidor levantado en el puerto ${port}`)
});

app.use(express.static('./Public')) 

app.get('/Home', (req, res)=>{
    res.sendFile(path.join(__dirname,'Public','Pages','Home','index.html'));
});

app.get('/QuienesSomos', (req, res)=>{
    res.sendFile(path.join(__dirname,'Public','Pages','QuienesSomos','index.html'));
});

app.get('/Productos', (req, res)=>{
    res.sendFile(path.join(__dirname,'Public','Pages','Productos','index.html'));
});