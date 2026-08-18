import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import ListingCard from "../components/ListingCard";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

const categories = ["all","Stay","Villa","Apartment","Cabin","Hotel","Resort"];

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search:"", location:"", category:"all", minPrice:"", maxPrice:"", guests:"", sort:"newest" });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  async function load() {
    setLoading(true);
    try {
      const params = { ...filters, page };
      const { data } = await api.get("/listings", { params });
      setListings(data.listings); setPagination(data.pagination);
    } catch (e) { toast.error(e.response?.data?.message || "Failed to load listings"); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [page, filters.category, filters.sort]);
  function submit(e) { e.preventDefault(); setPage(1); load(); }

  return <section className="container">
    <div className="hero">
      <div><span className="eyebrow">Travel smarter</span><h1>Find a place that feels like yours.</h1><p>Discover stays, compare options, save favorites and book your next escape.</p></div>
      <form className="search-box" onSubmit={submit}>
        <div><Search size={20}/><input placeholder="Search stays or destinations" value={filters.search} onChange={e=>setFilters({...filters,search:e.target.value})}/></div>
        <input placeholder="Location" value={filters.location} onChange={e=>setFilters({...filters,location:e.target.value})}/>
        <button className="primary">Search</button>
      </form>
    </div>
    <div className="toolbar">
      <div className="chips">{categories.map(c=><button key={c} className={filters.category===c?"chip active":"chip"} onClick={()=>setFilters({...filters,category:c})}>{c}</button>)}</div>
      <div className="filter-inline"><SlidersHorizontal size={17}/><input type="number" placeholder="Min ₹" value={filters.minPrice} onChange={e=>setFilters({...filters,minPrice:e.target.value})}/><input type="number" placeholder="Max ₹" value={filters.maxPrice} onChange={e=>setFilters({...filters,maxPrice:e.target.value})}/><select value={filters.sort} onChange={e=>setFilters({...filters,sort:e.target.value})}><option value="newest">Newest</option><option value="priceLow">Price low</option><option value="priceHigh">Price high</option><option value="rating">Top rated</option></select></div>
    </div>
    {loading ? <Loading/> : listings.length ? <><div className="grid">{listings.map(x=><ListingCard key={x._id} listing={x}/>)}</div>
      <div className="pagination"><button disabled={page<=1} onClick={()=>setPage(page-1)}>Previous</button><span>Page {page} of {pagination.pages || 1}</span><button disabled={page>=pagination.pages} onClick={()=>setPage(page+1)}>Next</button></div></>
      : <div className="empty"><h2>No stays found</h2><p>Try another destination or loosen your filters.</p></div>}
  </section>;
}
