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


export default function App() {

    return (
        <MainLayout>

            <Routes>

                {/* =================================================
                    PUBLIC ROUTES
                ================================================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Auth mode="login" />}
                />

                <Route
                    path="/register"
                    element={<Auth mode="register" />}
                />

                <Route
                    path="/listings/:id"
                    element={<ListingDetails />}
                />


                {/* =================================================
                    PROTECTED USER ROUTES
                ================================================= */}

                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                    <Route
                        path="/favorites"
                        element={<Favorites />}
                    />

                    <Route
                        path="/bookings"
                        element={<Bookings />}
                    />

                    <Route
                        path="/my-listings"
                        element={<MyListings />}
                    />

                    <Route
                        path="/listings/new"
                        element={<NewListing />}
                    />

                    <Route
                        path="/listings/:id/edit"
                        element={<EditListing />}
                    />

                </Route>


                {/* =================================================
                    ADMIN ROUTES
                ================================================= */}

                <Route element={<ProtectedRoute admin />}>

                    <Route
                        path="/admin"
                        element={<Admin />}
                    />

                </Route>


                {/* =================================================
                    FALLBACK ROUTE
                ================================================= */}

                <Route
                    path="*"
                    element={
                        <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-5xl font-bold mb-4">
                                    404
                                </h1>

                                <p className="text-gray-500">
                                    Page not found
                                </p>
                            </div>
                        </div>
                    }
                />

            </Routes>

        </MainLayout>
    );
}