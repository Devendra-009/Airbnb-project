import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ListingDetails from "./pages/ListingDetails";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Bookings from "./pages/Bookings";
import MyListings from "./pages/MyListings";
import NewListing from "./pages/NewListing";
import EditListing from "./pages/EditListing";
import Admin from "./pages/Admin";

export default function App(){return <MainLayout><Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/login" element={<Auth mode="login"/>}/>
  <Route path="/register" element={<Auth mode="register"/>}/>
  <Route path="/listings/:id" element={<ListingDetails/>}/>
  <Route element={<ProtectedRoute/>}>
    <Route path="/profile" element={<Profile/>}/>
    <Route path="/favorites" element={<Favorites/>}/>
    <Route path="/bookings" element={<Bookings/>}/>
    <Route path="/my-listings" element={<MyListings/>}/>
    <Route path="/listings/new" element={<NewListing/>}/>
    <Route path="/listings/:id/edit" element={<EditListing/>}/>
  </Route>
  <Route element={<ProtectedRoute admin/>}><Route path="/admin" element={<Admin/>}/></Route>
</Routes></MainLayout>}
