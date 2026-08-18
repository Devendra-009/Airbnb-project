import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, LogOut, Menu, PlusCircle, UserCircle, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const doLogout = async () => { await logout(); navigate("/"); };
  return <header className="navbar">
    <Link to="/" className="brand">ExploreLust</Link>
    <button className="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    <nav className={open ? "nav-links open" : "nav-links"}>
      <NavLink to="/" onClick={() => setOpen(false)}>Explore</NavLink>
      {user && <NavLink to="/favorites" onClick={() => setOpen(false)}>Favorites</NavLink>}
      {user && <NavLink to="/bookings" onClick={() => setOpen(false)}>Bookings</NavLink>}
      {user && <NavLink to="/my-listings" onClick={() => setOpen(false)}>My Listings</NavLink>}
      {user?.role === "admin" && <NavLink to="/admin" onClick={() => setOpen(false)}>Admin</NavLink>}
      {user ? <>
        <NavLink to="/profile" onClick={() => setOpen(false)}><UserCircle size={17}/> {user.name}</NavLink>
        <button className="nav-button" onClick={doLogout}><LogOut size={17}/> Logout</button>
      </> : <NavLink className="nav-cta" to="/login" onClick={() => setOpen(false)}>Login</NavLink>}
    </nav>
  </header>;
}
