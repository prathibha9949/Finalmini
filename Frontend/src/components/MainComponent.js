// frontend/src/components/MainComponent.js

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import avatarImage from '../images/avatar.jpg'; // Import your static avatar image

const MainComponent = () => {
    return (
        <div>
            <h1>Welcome to the Application</h1>
            {/* Clickable static avatar image */}
            <Link to="/profile">
                <img 
                    src={avatarImage} // Use the imported static avatar image
                    alt="User Avatar" 
                    style={{ width: "100px", height: "100px", borderRadius: "50%" }} // Style to make it circular
                />
            </Link>
        </div>
    );
};

export default MainComponent;
