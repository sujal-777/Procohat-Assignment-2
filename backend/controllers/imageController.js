import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';

// Multer for parsing form-data
const upload = multer({
    storage: multer.memoryStorage(),
}).array('images', 2); // The number '2' is the maximum number of files you want to upload

const uploadImages = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) return res.status(400).send(err.message);

            const files = req.files;

            // Use Promise.all to handle multiple Cloudinary uploads
            const uploadPromises = files.map((file) =>
                new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: 'dynamic_gallery' },
                        (error, result) => {
                            if (error) {
                                return reject(error);  // Reject the promise if error occurs
                            }
                            resolve(result);  // Resolve the promise with the result
                        }
                    ).end(file.buffer);  // Upload the file buffer
                })
            );

            // Wait for all images to be uploaded
            const results = await Promise.all(uploadPromises);

            // Respond with the image URLs
            res.status(200).json({
                message: 'Images uploaded successfully.',
                images: results.map((result) => result.secure_url),  // Get secure URLs of uploaded images
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default uploadImages;
