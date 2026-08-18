import { Heart, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ListingCard({ listing, onFavorite }) {
  const { user, setUser } = useAuth();
  const liked = user?.favorites?.some(id => String(id?._id || id) === String(listing._id));
  async function favorite(e) {
    e.preventDefault();
    if (!user) return toast.error("Login to save favorites");
    try {
      const { data } = await api.post(`/listings/${listing._id}/favorite`);
      setUser(prev => ({ ...prev, favorites: data.favorites }));
      onFavorite?.();
    } catch (err) { toast.error(err.response?.data?.message || "Could not update favorite"); }
  }
  const image = listing.images?.[0]?.url || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80";
  return <Link to={`/listings/${listing._id}`} className="card">
    <div className="card-image-wrap"><img src={image} alt={listing.title}/><button className={liked ? "heart liked" : "heart"} onClick={favorite}><Heart size={19} fill={liked ? "currentColor" : "none"}/></button></div>
    <div className="card-body">
      <div className="row-between"><h3>{listing.title}</h3><span className="rating"><Star size={15} fill="currentColor"/> {listing.ratingAverage?.toFixed?.(1) || "New"}</span></div>
      <p className="muted"><MapPin size={15}/> {listing.location}, {listing.country}</p>
      <p className="card-price">₹{listing.price.toLocaleString()} <span>/ night</span></p>
    </div>
  </Link>;
}
