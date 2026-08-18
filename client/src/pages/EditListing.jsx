import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api";

const categories = [
  "Stay",
  "Villa",
  "Apartment",
  "Cabin",
  "Hotel",
  "Resort"
];

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Stay",
    price: "",
    maxGuests: 2,
    location: "",
    country: "India",
    amenities: ""
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing listing
  useEffect(() => {
    let active = true;

    async function loadListing() {
      try {
        const { data } = await api.get(`/listings/${id}`);

        const listing = data.listing;

        if (!active) return;

        setForm({
          title: listing.title || "",
          description: listing.description || "",
          category: listing.category || "Stay",
          price: listing.price ?? "",
          maxGuests: listing.maxGuests ?? 2,
          location: listing.location || "",
          country: listing.country || "India",

          amenities: Array.isArray(listing.amenities)
            ? listing.amenities.join(", ")
            : listing.amenities || ""
        });

        setExistingImages(listing.images || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load listing"
        );

        navigate("/my-listings");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadListing();

    return () => {
      active = false;
    };
  }, [id, navigate]);

  // Handle form changes
  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  // Submit update
  async function submit(event) {
    event.preventDefault();

    setSaving(true);

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    newImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const { data } = await api.put(
        `/listings/${id}`,
        formData
      );

      toast.success("Listing updated successfully");

      navigate(`/listings/${data.listing._id}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Update failed"
      );
    } finally {
      setSaving(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <section className="container narrow">
        <div className="panel">
          <p className="muted">
            Loading listing...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container narrow">

      <div className="section-title">
        <span className="eyebrow">
          Host
        </span>

        <h1>
          Edit listing
        </h1>

        <p className="muted">
          Update your property details.
        </p>
      </div>

      <form
        className="panel form-grid"
        onSubmit={submit}
      >

        {/* Title */}

        <label>
          Title

          <input
            name="title"
            required
            value={form.title}
            onChange={updateField}
          />
        </label>


        {/* Category */}

        <label>
          Category

          <select
            name="category"
            value={form.category}
            onChange={updateField}
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </label>


        {/* Description */}

        <label>
          Description

          <textarea
            name="description"
            required
            value={form.description}
            onChange={updateField}
          />
        </label>


        {/* Price + Guests */}

        <div className="two-col">

          <label>
            Price / night

            <input
              name="price"
              type="number"
              min="0"
              required
              value={form.price}
              onChange={updateField}
            />
          </label>


          <label>
            Max guests

            <input
              name="maxGuests"
              type="number"
              min="1"
              required
              value={form.maxGuests}
              onChange={updateField}
            />
          </label>

        </div>


        {/* Location + Country */}

        <div className="two-col">

          <label>
            Location

            <input
              name="location"
              required
              value={form.location}
              onChange={updateField}
            />
          </label>


          <label>
            Country

            <input
              name="country"
              value={form.country}
              onChange={updateField}
            />
          </label>

        </div>


        {/* Amenities */}

        <label>

          Amenities

          <span className="muted">
            {" "} (comma separated)
          </span>

          <input
            name="amenities"
            value={form.amenities}
            onChange={updateField}
          />

        </label>


        {/* Existing images */}

        {existingImages.length > 0 && (

          <div>

            <p>
              <strong>
                Current images
              </strong>
            </p>

            <div className="image-grid">

              {existingImages.map(
                (image, index) => (

                  <img
                    key={
                      image.publicId ||
                      image.url ||
                      index
                    }
                    src={image.url}
                    alt={`Listing ${index + 1}`}
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 12
                    }}
                  />

                )
              )}

            </div>

          </div>

        )}


        {/* New images */}

        <label>

          Add more images

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) =>
              setNewImages([
                ...event.target.files
              ])
            }
          />

          <span className="muted">
            New images will be added to
            the existing images.
          </span>

        </label>


        {/* Buttons */}

        <div className="two-col">

          <button
            type="button"
            className="secondary"
            onClick={() =>
              navigate(`/listings/${id}`)
            }
            disabled={saving}
          >
            Cancel
          </button>


          <button
            className="primary"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save changes"}
          </button>

        </div>

      </form>

    </section>
  );
}