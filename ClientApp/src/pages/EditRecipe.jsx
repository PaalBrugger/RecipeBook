import { useState } from "react";
import BackButton from "../components/BackButton";
import { authFetch } from "../utils/authFetch";
import { areas, categories } from "../utils/dropdownOptions";
import { UPDATE_RECIPE_URL, LOOKUP_ID_URL } from "../utils/apiUrls";
import { useAuth } from "../services/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { resolveImageUrl } from "../utils/helpers";

function EditRecipe() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [youtube, setYoutube] = useState("");
  const [instructions, setInstructions] = useState("");

  // Ingredients
  const [ingredients, setIngredients] = useState([{ name: "", measure: "" }]);

  function updateIngredient(index, field, value) {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    );
  }

  function addIngredient() {
    // Dont add row if last row is empty
    const last = ingredients[ingredients.length - 1];
    if (!last.name.trim()) return;

    setIngredients([...ingredients, { name: "", measure: "" }]);
  }

  function removeIngredient(index) {
    setIngredients((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index)
    );
  }

  // Image Upload
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  // Fetch recipe
  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await fetch(LOOKUP_ID_URL + id);

        if (!res.ok) {
          navigate("/not-found", { replace: true });
          return;
        }

        const data = await res.json();
        console.log(data);

        setName(data.name);
        setCategory(data.category);
        setArea(data.area);
        setDescription(data.description);
        setSource(data.source);
        setYoutube(data.youtube);
        setInstructions(data.instructions);
        setPreviewUrl(resolveImageUrl(data.mainImageUrl));
        setIngredients(data.ingredients);
      } catch (error) {
        navigate("/not-found", { replace: true });
        console.error("Failed to fetch recipe:", error);
      }
    }
    fetchRecipe();
  }, []);

  // Sumbit
  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("id", id);
    formData.append("name", name);
    formData.append("category", category);
    formData.append("area", area);
    formData.append("description", description);
    formData.append("source", source);
    formData.append("youtube", youtube);
    formData.append("instructions", instructions);

    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    ingredients.forEach((ing, i) => {
      formData.append(`ingredients[${i}].name`, ing.name);
      formData.append(`ingredients[${i}].measure`, ing.measure);
    });

    try {
      const response = await authFetch(
        `${UPDATE_RECIPE_URL}/${id}`,
        {
          method: "PUT",
          body: formData,
        },
        logout
      );
      if (!response.ok) {
        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Body:", text);
        throw new Error("Request failed");
      }

      toast.success("Recipe Updated!💾");
      navigate(-1);
      // Catch 401 Unauthorized
    } catch (error) {
      console.log("Request failed:", error.message);
      toast.error("Unauthorized");
    }
  }

  return (
    <div>
      <h1 className="mb-5">Create Recipe 🌮</h1>

      <div className="container mt-4">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-6">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                ></input>
              </div>

              {/* Category selector */}
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  id="category"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>

                  {categories.slice(1).map((cat) => (
                    <option value={cat} key={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area selector */}
              <div className="mb-3">
                <label className="form-label">Area</label>
                <select
                  id="area"
                  className="form-select"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                >
                  <option value="">Select area</option>
                  {areas.slice(1).map((area) => (
                    <option value={area} key={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></input>
              </div>
              <div className="mb-3">
                <label className="form-label">Source</label>
                <input
                  type="text"
                  className="form-control"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                ></input>
              </div>
              <div className="mb-3">
                <label className="form-label">Youtube</label>
                <input
                  type="text"
                  className="form-control"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="col-6">
              <div className="mb-3">
                <label className="form-label">Instructions</label>
                <textarea
                  id="instructions"
                  className="form-control"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              {/* Upload image */}
              <div className="mb-3">
                <label className="form-label">Picture</label>
                <input
                  id="mainImage"
                  className="form-control"
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="img-fluid rounded mt-2"
                    style={{ maxHeight: 240, objectFit: "cover" }}
                  />
                )}
              </div>

              {/* Add ingredients */}
              {ingredients.map((ingredient, index) => (
                <div key={index} className="row g-2 mb-2 align-items-end">
                  <div className="col-7">
                    <label className="form-label">Ingredient</label>
                    <input
                      type="text"
                      className="form-control"
                      value={ingredient.name}
                      onChange={(e) =>
                        updateIngredient(index, "name", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-3">
                    <label className="form-label">measure</label>
                    <input
                      type="text"
                      className="form-control"
                      value={ingredient.measure}
                      onChange={(e) =>
                        updateIngredient(index, "measure", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-2">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => removeIngredient(index)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-primary mt-2 mb-3"
                onClick={addIngredient}
              >
                + Add ingredient
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Update Recipe 💾
          </button>
          <BackButton buttonText="Cancel" className="w-100 mt-2" />
        </form>
      </div>
    </div>
  );
}

export default EditRecipe;
