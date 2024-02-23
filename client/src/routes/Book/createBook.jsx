import React, { useState } from "react";
import NoImageSelected from "../../assets/no-image-selected.jpg";
import { VITE_BACKEND_URL } from "../../App";


function CreateBook() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [stars, setStars] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [image, setImage] = useState(NoImageSelected);

  // Added this line
  const [thumbnail, setThumbnail] = useState(null);

  const createBook = async (e) => {
    e.preventDefault();
    // console.table([title, slug]);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("stars", stars);
    formData.append("description", description);
    formData.append("category", categories);
    // Also added this line 
    formData.append("thumbnail", thumbnail);

    try {
      const response = await fetch(`${VITE_BACKEND_URL}/api/books`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setTitle("");
        setSlug("");
        setThumbnail(null);
        setSubmitted(true);
        console.log("Book added successfully");
      } else {
        console.log("Failed to Submit Data");
      }
    } catch (error) {
      console.log(error);
    }
  };


  const onImageChange = (e) => {
    if(e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setThumbnail(e.target.files[0]);
    }
  }
  

  const handleCategoryChange = (e) => {
    setCategories(e.target.value.split(",").map((category) => category.trim()));
  };

  return (
    <div>
      <h1>Create Book</h1>
      <p>
        This is where we use NodeJs, Express & MongoDB to grab some data. the
        data below is pulled from a MongoDB database.
      </p>


      {submitted ? (
        <p>Data Submitted Successfully!</p>
      ) : (

        <form className="bookdetails" onSubmit={createBook}>
        <div className="col-1">
          <label>Upload Thumbnail</label>
          <img src={image} alt="preview image" />
          <input
            type="file"
            accept="image/gif, image/jpg, image/png"
            onChange={onImageChange}
          />
        </div>

        <div className="col-2">
          <div>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label>Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          <div>
            <label>Stars</label>
            <input
              type="text"
              value={stars}
              onChange={(e) => setStars(e.target.value)}
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              rows="4"
              cols="50"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label>Categories (Comma-Seperated)</label>
            <input
              type="text"
              value={categories}
              onChange={handleCategoryChange}
            />
          </div>

          <input type="submit" value="Add Book" />
        </div>
      </form>

      )}

    </div>
  );
}

export default CreateBook;
