import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>Persicuf</h5>
            <p>Tus prendas personalizadas.</p>
          </div>
          <div className="col-md-6">
            <h5>Contáctanos</h5>
            <p>Email: laurevalentino@gmail.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>
        <hr />
        <p className="text-center mb-0">&copy; 2024 Persicuf. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
