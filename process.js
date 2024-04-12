// node process.js --inputDir=images --outputDir=result --watermark=hab.png --resize=500

import minimist from 'minimist'; 
import chalk from 'chalk';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

import { pathExists, pathIfNotExists } from './helpers.js';
import { log } from 'console';

console.log(chalk.blue(`Welcome to Image Process v1.0
`));

// Función para procesar las imágenes
const processImages = async ({inputDir, outputDir, watermark, resize}) => {
    try {       
        const inputPath = path.resolve(process.cwd(), inputDir); // process.cwd() -> ruta del directorio actual
        const outputPath = path.resolve(process.cwd(), outputDir);
        let watermarkPath;
        if(watermark) { watermarkPath = path.resolve(process.cwd(), watermark) };


        // Comprobar que inputDir existe
        await pathExists(inputPath); 

        // Comprobar si existe outputDir y si no existe crearlo
        await pathIfNotExists(outputPath);

        // Si existe watermark comprobar que el archivo watermark existe
        if(watermarkPath) { await pathExists(watermarkPath) }; 

        // Leer los archivos de inputDir
        const inputFiles = await fs.readdir(inputPath);

        // Filtrar los archivos con imágenes
        const imageFiles = inputFiles.filter((file) => {
            const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', 'webp'];

            return validExtensions.includes(path.extname(file).toLowerCase() );
        });

        // Recorrer la lista de imagenes y:          
        for (const imageFile of imageFiles) { 
            console.log(chalk.blue(`Procesando imagen: ${imageFile}`));
            
            //Creamos la ruta completa de la imágen
            const imagePath = path.resolve(inputPath, imageFile); 
            
            // Cargamos la imagen en sharp
            const image = sharp(imagePath);
            
            // - Si existe resize redimensionar la imagen
            if(resize) { image.resize(resize) };
            
            // - Si existe watermark colocar watermark en la parte superior izquierda de la imagen
            if(watermarkPath) {
                image.composite([
                    {
                        input: watermarkPath,
                        top: 20,
                        left: 20,
                    },
                ]);
            }

            // - Guardar imagen con otro nombre en outputDir
            await image.toFile(path.resolve(outputPath, `processed_${imageFile}`));

        }

    } catch (error) {
        console.log(chalk.red(error.message));
        console.error(chalk.red('Comprueba que los argumentos sean correctos.'));
        process.exit(1);
    }

}

// Proceso los argumentos
const args = minimist(process.argv.slice(2));
const {inputDir, outputDir, watermark, resize} = args;

// Si no existe inputDir o outputDir muestro error y salgo del programa
if(!inputDir || !outputDir) {
    console.error(chalk.red('Los argumentos --inputDir y --outputDir son obligatorios.'));
    process.exit(1);
}

// Si no existe watermark y no existe resize muestro error y salgo del programa
if(!watermark && !resize) {
    console.error(chalk.red('Es necesario que exista un argumento --watermark 0 --resize.'));
    process.exit(1);
}

// Todos los argumentos están correctos, continuamos.
console.log(chalk.green(`Empezamos a procesar las imágenes.
`));

processImages({inputDir, outputDir, watermark, resize});