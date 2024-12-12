import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageUpdate = () => {
    const [images, setImages] = useState([]);  // For holding the selected images
    const [uploadedImages, setUploadedImages] = useState([]);  // For displaying the uploaded images

    const handleImageUpload = (e) => {
        setImages(e.target.files);
    };

    const uploadImages = async () => {
        const formData = new FormData();
        Array.from(images).forEach((image) => formData.append('images', image));

        try {
            const { data } = await axios.post('http://localhost:5000/api/images/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploadedImages(data.images);  // Set the image URLs after upload
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    };

    // Fetch images when component mounts
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/images');
                setUploadedImages(data.images); // Assuming the endpoint returns image URLs
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);

    // Function to handle image update (replace an image)
    const handleImageEdit = async (index) => {
        const newImage = await promptForImage();  // Custom function to prompt user for new image
        if (newImage) {
            const updatedImages = [...uploadedImages];
            updatedImages[index] = newImage; // Replace the image at the given index
            setUploadedImages(updatedImages);  // Update the state
        }
    };

    // Function to prompt user for new image (this could open a file input or use a library)
    const promptForImage = async () => {
        // For simplicity, assuming the new image URL is returned (this can be extended)
        const newImageURL = prompt('Enter the URL of the new image:');
        return newImageURL;  // You could use an actual file input or integration here
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 max-w-4xl">
                <h1 className="text-3xl font-bold text-center mb-8">Dynamic Image Gallery</h1>

                <div className="mb-6">
                    <input
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <button
                    onClick={uploadImages}
                    className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Upload Images
                </button>

                <div className="mt-8 grid grid-cols-3 gap-6">
                    {uploadedImages.map((url, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={url}
                                alt={`Uploaded ${index + 1}`}
                                className="w-full h-48 object-cover rounded-md"
                            />
                            <button
                                onClick={() => handleImageEdit(index)}
                                className="absolute top-2 right-2 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100"
                            >
                                Edit
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageUpdate;
