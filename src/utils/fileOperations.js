const fs = require('fs');
const path = require('path');
const { Model } = require('sequelize');

/**
 * Ensures that a directory exists. If it doesn't exist, it will be created.
 * 
 * @param {string} dirPath - The path of the directory to check or create.
 * @returns {Promise<void>} A promise that resolves when the directory exists or has been created.
 * @throws {Error} Throws an error if the directory creation fails.
 * 
 * @module fs.promises
 * 
 * @example
 * await ensureDirectoryExists('/path/to/dir');
 */
const ensureDirectoryExists = async (dirPath) => {
    try {
        await fs.promises.mkdir(dirPath, { recursive: true });
    } catch (err) {
        throw new Error(`Failed to create directory: ${dirPath}`);
    }
};

/**
 * Copies a file from the source path to the destination path.
 * 
 * @param {string} source - The path to the source file to be copied.
 * @param {string} destination - The path where the file should be copied to.
 * @returns {Promise<void>} A promise that resolves when the file has been copied successfully.
 * @throws {Error} Throws an error if the file copy operation fails.
 * 
 * @module fs
 * 
 * @example
 * await copyFile('/path/to/source/file.txt', '/path/to/destination/file.txt');
 */
const copyFile = async (source, destination) => {
    try {
        await new Promise((resolve, reject) => {
            fs.copyFile(source, destination, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        console.log('File copied successfully!');
    } catch (err) {
        console.error('Error copying file:', err);
    }
};


module.exports = { ensureDirectoryExists, copyFile };
