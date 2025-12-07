import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';


export default function Login() {

    const {signIn} = useAuth();

    const navigate = useNavigate();

    const [form, setForm] = useState({email: '', password: ''});

    const handleChange = (e) => {
        const {name, value} = e.target;

        setForm({...form, [name]: value});
    }

    const handleSubmit = async(e) => {

        e.preventDefault();
        
        try {
            await signIn({email: form.email, password: form.password});
            alert('login successful');
            navigate('/');
        }catch(error) {
            alert(error.message);
        }

    }
    return (
        <div className='bg-gray-200 py-3 min-h-screen flex items-center justify-center'>
            <div className="container grid grid-cols-2 gap-4 max-w-4xl bg-white p-8 rounded-xl shadow-lg">

                <div className="p-4">
                    <h1 className='text-4xl font-bold text-[#26599F] mb-3'>Log In</h1>
                    <p className='text-xl font-semibold mb-5'>See Your Growth and Get Suppport!</p>

                    <form action="" onSubmit={handleSubmit}>
                        <div className='mb-4'>
                            <label htmlFor="" className='block text-lg font-medium text-gray-700 mb-2'>Email:</label>
                            <input type="email" name='email' value={form.email} onChange={handleChange} placeholder="Enter your email..." className='block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus-ring-blue-500 transition-all duration-200 p-2' />
                        </div>
                        <div className='mb-10'>
                            <label htmlFor="" className='block text-lg font-medium text-gray-700 mb-2'>Password:</label>
                            <input type="password" name='password' value={form.password} onChange={handleChange} placeholder="Enter your password..." className='block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus-ring-blue-500 transition-all duration-200 p-2' />
                        </div>

                        <button type="submit" className='w-full mb-3 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:ring-blue-500 py-2 rounded-md' size='lg'>Log in</button>

                        <p className='text-center'>Not registered yet? <Link to="/register" className='text-[#26599F] font-bold'>Sign Up</Link></p>
                    </form>
                </div>
                <div className="p-4 flex items-center justify-center">
                    <div>
                        <img src={logo} alt="" className='h-[100px]' />
                        <p className='text-lg text-gray-700 mt-3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. In modi reiciendis sunt nemo voluptas. Expedita autem doloribus perspiciatis maiores iusto.</p>
                    </div>
                </div>

            </div>
        </div>
    )
}