import { useEffect, useState } from "react";
import "./App.css";
import { Toaster, toast } from "react-hot-toast";

function App() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(null);
  const [publicId, setPublicId] = useState(null);

  const handelPopUp = () => {
    if (document.getElementById("image-pop-up").style.display === "none") {
      document.getElementById("image-pop-up").style.display = "flex";
    } else {
      document.getElementById("image-pop-up").style.display = "none";
    }
  };

  // console.log((publicId));
  useEffect(() => {
    const photo = localStorage.getItem("photo");
    const publicId = localStorage.getItem("id");

    if (photo && publicId) {
      setUrl(photo);
      setPublicId(publicId);
    } else {
      setUrl(null);
      setPublicId(null);
    }
  }, []);

  const handleFileChange = async () => {
    if (!file) {
      return toast.error("Choose any Image First", { position: "top-center" });
    }
    const popup = document.getElementById("image-pop-up");
    let data = new FormData();
    data.append("photo", file);

    if (!publicId) {
      const response = await fetch("https://e-book-backend-n147.onrender.com/add-image", {
        method: "POST",
        body: data,
      });
      if (response.status === 201) {
        toast.success("Image updated successfully", {
          position: "top-center",
        });

        const result = await response.json();
        localStorage.setItem("id", result.response.public_id);
        localStorage.setItem("photo", result.response.url);
      }
      setInterval(() => {
        window.location.reload();
        popup.style.display = "flex";
      }, 2000);
    } else {
      const response = await fetch(
        `https://e-book-backend-n147.onrender.com/update-image/${publicId}`,
        {
          method: "POST",
          body: data,
        }
      );
      if (response.status === 201) {
        toast.success("Image updated successfully", {
          position: "top-center",
        });

        const result = await response.json();
        localStorage.removeItem("photo");
        localStorage.removeItem("id");
        localStorage.setItem("id", result.response.public_id);
        localStorage.setItem("photo", result.response.url);
      }
      setInterval(() => {
        window.location.reload();
        popup.style.display = "flex";
      }, 2000);
    }
  };
  const deleteImage = async () => {
    if (!publicId) {
      return toast.error("No Image to delete", { position: "top-center" });
    }

    const response = await fetch(
      `https://e-book-backend-n147.onrender.com/delete-image/${publicId}`,
      {
        method: "DELETE",
      }
    );
    const result = await response.json();
    if (response.status === 200) {
      localStorage.removeItem("photo");
      localStorage.removeItem("id");

      toast.success("Image deleted successfully", {
        position: "top-center",
      });
    }

    setInterval(() => {
      window.location.reload();
    }, 2000);
  };
  return (
    <div className="container">
      <img
        src={
          url
            ? url
            : "https://st4.depositphotos.com/4329009/19956/v/450/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg"
        }
        alt=""
        id="show-img-box"
      />
      <button id="delete" onClick={deleteImage}>
        delete
      </button>
      <button id="button" onClick={handelPopUp}>
        Add/Edit Image
      </button>

      <div id="image-pop-up">
       
        <p>(**click on the photo icon to choose image)</p>
        <label htmlFor="pic">
          <img
            src={
              file
                ? URL.createObjectURL(file)
                : "https://st4.depositphotos.com/4329009/19956/v/450/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg"
            }
            alt=""
            id="img"
          />
        </label>
        <input
          type="file"
          id="pic"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <div>
          <button id="button" onClick={handleFileChange}>
            Update
          </button>
          <button id="button" onClick={handelPopUp}>
            Cancel
          </button>
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
