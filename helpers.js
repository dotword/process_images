import { log } from 'console';
import fs from 'fs/promises';

// Función para comprobar que una ruta existe en el disco
const pathExists = async (path) => {
    try {
        await fs.access(path);
    } catch (error) {
        throw new Error(`La ruta ${path} no existe.`);
    }
}


// Función para crear una ruta en el disco si no existe
const pathIfNotExists = async (path) => {
    try {
        await fs.access(path);
    } catch (error) {
        await fs.mkdir(path);
    }
}

export {
    pathExists,
    pathIfNotExists
}