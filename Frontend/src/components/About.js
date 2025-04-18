import React from "react";
import "./About.css";

const About = () => {
  return (
    <div style={{ paddingTop: "120px" }}>
      {/* About Section */}
      <h3>About Us</h3>
      <p style={{ color: "#6c757d", fontSize: "16px" }}>
        Welcome to Farmer Equipment Rental Services, your one-stop platform for
        renting and leasing agricultural equipment. Our mission is to make
        modern farming more efficient and affordable by connecting farmers with
        equipment owners and rental services.
      </p>

      {/* Bootstrap Accordion */}
      <div className="accordion" id="accordionPanelsStayOpenExample">
        
        {/* Accordion Item #1 - Why Choose Us? */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              <h5>Why Choose Us?</h5>
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse show">
            <div className="accordion-body">
              <ul>
                <li>Easy Equipment Access: Find and rent farming tools and machinery with just a few clicks.</li>
                <li>Affordable Rentals: Reduce costs by renting instead of purchasing expensive equipment.</li>
                <li>Multiple User Roles: Whether you’re a farmer, seller, or equipment owner, our platform is designed for you.</li>
                <li>Voice Assistance: Navigate the app effortlessly with multilingual voice guidance.</li>
                <li>Secure Payments: Integrated payment gateways for hassle-free transactions.</li>
                <li>User-Friendly Interface: Simple and intuitive design for easy booking and management.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Accordion Item #2 - Is the Payment Secure? */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              <h5>Is the Payment Secure?</h5>
            </button>
          </h2>
          <div id="collapseTwo" className="accordion-collapse collapse">
            <div className="accordion-body">
              Yes, we use **highly secure payment gateways** to ensure that all transactions are **encrypted** and **protected**. 
              Our platform supports multiple payment methods, including **UPI, credit/debit cards, and net banking**. 
              You can **safely rent equipment** without worrying about fraud or security issues.
            </div>
          </div>
        </div>

        {/* Accordion Item #3 - How Do I Rent Equipment? */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              <h5>How Do I Rent Equipment?</h5>
            </button>
          </h2>
          <div id="collapseThree" className="accordion-collapse collapse">
            <div className="accordion-body">
              Renting equipment on our platform is **simple**:
              <ol>
                <li><strong>Sign Up/Login:</strong> Create an account or log in.</li>
                <li><strong>Browse Equipment:</strong> Search for the required farming tools or machinery.</li>
                <li><strong>Check Availability:</strong> View rental details, pricing, and availability.</li>
                <li><strong>Make a Booking:</strong> Select the equipment and duration, then proceed to payment.</li>
                <li><strong>Confirm & Use:</strong> Once confirmed, collect or receive the equipment.</li>
              </ol>
              If you have any issues, our **support team is available 24/7** to assist you!
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
