import { v2 as cloudinary } from "cloudinary";

/**
 * Upload an image to Cloudinary.
 *
 * @param {String} file The image received in a form.
 *
 * @returns {Promise} The image url on Cloudinary.
 */
export const uploadImage = async (file) => {
  try {
    const uploadedResponse = await cloudinary.uploader.upload(file);
    const imgUrl = uploadedResponse.secure_url;

    return imgUrl;
  } catch (err) {
    console.error(err);
    return null;
  }
};

/**
 * Remove an image from Cloudinary.
 *
 * @param {String} url The image url on Cloudinary.
 *
 * @returns {Promise} Whether the image was successfully deleted.
 */
export const removeImage = async (url) => {
  try {
    const imgId = url.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(imgId);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
