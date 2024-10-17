import React, { useState } from 'react';
import axios from 'axios';

function Register() {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        fname: '',
        lname: '',
        email: '',
        cell_no: ''
    });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/register', userData)
            .then(() => alert('User registered successfully'))
            .catch(err => console.error(err));
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <input type="text" name="fname" placeholder="First Name" onChange={handleChange} required />
                <input type="text" name="lname" placeholder="Last Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="text" name="cell_no" placeholder="Cellphone Number" onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
