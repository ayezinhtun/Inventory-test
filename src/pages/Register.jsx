import logo from '../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'


export default function Register() {

    const {signUp} = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({full_name: "", email: "", password: "", confirm:""})

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(form.password !== form.confirm) {
            alert('Passwords do not match');
            return;
        }

        try {
            await signUp({
                email: form.email,
                password: form.password,
                full_name: form.full_name
            });
            alert("Accound created! Check your email");
            navigate("/login");
        }catch(error) {
            alert(error.message);
        }
    }

    return (
        <div className="bg-gray-200 min-h-screen flex items-center justify-center py-3">
            <div className="container grid grid-cols-2 gap-4 max-w-4xl bg-white p-8 rounded-xl shadow-lg">
                <div className="p-4">
                    <h1 className='text-[#26599F] text-4xl font-bold mb-3'>Sign Up</h1>
                    <p className='mb-5 text-xl font-semibold'>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                    
                    <form action="" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="" className="block text-lg font-medium text-gray-700 mb-2">Name</label>
                            <input type="text" name='full_name' value={form.full_name} onChange={handleChange} placeholder='Enter Your Name...' className="block w-full  rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 p-2 required" />
                        </div>

                         <div className="mb-4">
                            <label htmlFor="" className="block text-lg font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" name='email' value={form.email} onChange={handleChange} placeholder='Enter Your Email...' className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 p-2" />
                        </div>

                         <div className="mb-4">
                            <label htmlFor="" className="block text-lg font-medium text-gray-700 mb-2">Password</label>
                            <input type="password" name='password' value={form.password} onChange={handleChange} placeholder='Enter Your Password...' className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 p-2" />
                        </div>

                         <div className="mb-10">
                            <label htmlFor="" className="blcok text-lg font-medium text-gray-700 mb-2">Confirm Password</label>
                            <input type="password" name='confirm' value={form.confirm} onChange={handleChange} placeholder='Confirm Your Password...' className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 p-2" />
                        </div>

                        <button type="submit" size="sm" className="w-full mb-3 py-2 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:rign-blue-500 rounded-md">Sign Up</button>
                        <p className='text-center'>Already have an account! <Link to="/login" className='text-[#26599F] font-bold'>Login In</Link></p>
                    </form>
                </div>

                <div className="p-4 flex items-center justify-center">
                    <div>
                        <img src={logo} alt="" className='h-[100px]' />
                        <p className='text-lg text-gray-700 mt-3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil omnis est voluptates exercitationem repellendus magnam minus accusantium magni quaerat atque!</p>
                    </div>
                </div>
            </div>
        </div>
    )
}