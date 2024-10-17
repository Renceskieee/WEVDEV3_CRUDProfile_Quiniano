import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function Profile() {
    const { id } = useParams(); // Get user ID from URL params
    const [profile, setProfile] = useState({});
    const navigate = useNavigate();

// Fetch user profile from the backend using userId
    useEffect(() => {
        const userId = id || localStorage.getItem('userId'); // Use route param or fallback to local storage
        if (userId) {
            console.log('Fetching profile for user ID:', userId);
            axios.get(`http://localhost:3001/profile/${userId}`)
                .then(response => {
                    console.log('Profile data:', response.data); // Log the profile data
                    setProfile(response.data);
                })
                .catch(err => console.error('Error fetching profile:', err));
        } else {
            console.error('No user ID found');
        }
    }, [id]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        const userId = id || localStorage.getItem('userId'); // Use ID from URL or local storage
        axios.put(`http://localhost:3001/update/${userId}`, profile)
                .then(() => {
                alert('Profile updated successfully');
            })
            .catch(err => console.error('Error updating profile:', err));
    };

    const handleDelete = () => {
        const userId = id || localStorage.getItem('userId');
        axios.delete(`http://localhost:3001/delete/${userId}`)
            .then(() => {
                alert('User deleted successfully');
                localStorage.removeItem('userId'); // Remove userId from local storage upon delete
                navigate('/login');
            })
            .catch(err => console.error('Error deleting profile:', err));
    };

    return (
        <div>
            <h2>Profile</h2>
            <form>
                <div>
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        value={profile.username || ''} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div>
                    <label htmlFor="fname">First Name</label>
                    <input 
                        type="text" 
                        id="fname" 
                        name="fname" 
                        value={profile.fname || ''} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div>
                    <label htmlFor="lname">Last Name</label>
                    <input 
                        type="text" 
                        id="lname" 
                        name="lname" 
                        value={profile.lname || ''} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={profile.email || ''} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div>
                    <label htmlFor="cell_no">Cellphone Number</label>
                    <input 
                        type="text" 
                        id="cell_no" 
                        name="cell_no" 
                        value={profile.cell_no || ''} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <button type="button" onClick={handleUpdate}>Update</button>
                <button type="button" onClick={handleDelete}>Delete</button>
            </form>
        </div>
    );
}

export default Profile;
