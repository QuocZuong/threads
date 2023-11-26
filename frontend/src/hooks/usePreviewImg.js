import { useState } from "react";
import useShowToast from "./useShowToast";
const usePreviewImg = () => {
    const [imgUrl, setImgUrl] = useState(null);
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
