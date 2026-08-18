import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Auth({ mode }) {
  const registerMode = mode === "register";
  const { login, register } = useAuth();
  const nav = useNavigate(); const loc = useLocation();
  const [form,setForm]=useState({name:"",email:"",password:""});
  const [busy,setBusy]=useState(false);
  async function submit(e){e.preventDefault();setBusy(true);try{if(registerMode) await register(form);else await login({email:form.email,password:form.password});toast.success(registerMode?"Account created":"Welcome back");nav(loc.state?.from||"/");}catch(err){toast.error(err.response?.data?.message||"Something went wrong");}finally{setBusy(false);}}
  return <div className="auth-page"><div className="auth-card"><div className="brand center">ExploreLust</div><h1>{registerMode?"Create your account":"Welcome back"}</h1><p className="muted">{registerMode?"Start discovering better stays.":"Sign in to continue your journey."}</p><form onSubmit={submit}>
    {registerMode&&<label>Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>}
    <label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
    <label>Password<input type="password" minLength="6" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>
    <button className="primary full" disabled={busy}>{busy?"Please wait...":registerMode?"Create account":"Login"}</button>
  </form><p className="auth-switch">{registerMode?"Already have an account?":"New here?"} <Link to={registerMode?"/login":"/register"}>{registerMode?"Login":"Create account"}</Link></p></div></div>
}
