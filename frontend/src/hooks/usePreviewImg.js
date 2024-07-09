import { useState } from "react";
import useShowToast from "./useShowToast";

/**
 * Process an image from an input and provide the local image URL.
 *
 * @param {String} initialValue An optional parameter to set the initial value of the image URL.
 *
 * @returns {Object} An object containing the following properties and methods:
 *  - imgUrl: The URL of the image to be previewed.
 *  - setImgUrl: A function to set the URL of the image to be previewed.
 *  - handleImageChange: A function to handle the change event of the input element of type file.
 */
const usePreviewImg = (initialValue) => {
  const [imgUrl, setImgUrl] = useState(initialValue || null);
  const showToast = useShowToast();
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file?.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImgUrl(reader.result);
      };

      // content of the file will be converted to a base64-encoded string representation of the file's data
      reader.readAsDataURL(file);
    } else {
      showToast("File is not an image", "Please select an image file", "error");
      setImgUrl(null);
    }
  };

  return { handleImageChange, imgUrl, setImgUrl };
};

export default usePreviewImg;
