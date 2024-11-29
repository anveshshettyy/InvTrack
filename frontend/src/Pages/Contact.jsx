import React, { useState } from "react";
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_key: "fbd353dc-c077-4dc2-bae7-63609c52b067", 
        ...formData,
      }),
    });

    if (response.ok) {
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } else {
      alert("There was an error submitting the form. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F1F5F9] p-20 ">
      
      {/* <div className="w-full text-center mb-12">
        <img src="your-logo-path.png" alt="InvTrack Logo" className="w-[200px] mx-auto" />
      </div> */}

      <div className="  p-8 bg-white shadow-xl rounded-lg">
        <h2 className="font-founders-grotesk tracking-normal text-[6vh] text-[#124462] text-center ">
          Get In Touch With InvTrack!
        </h2>
        <p className="font-regular tracking-wide text-[#6B7280] text-center mb-8">
          We’d love to hear from you! If you have any questions or need support, fill out the form below, and our team will get back to you as soon as possible.
        </p>
        
        {isSubmitted ? (
          <p className="text-center text-green-600 font-regular tracking-wide text-[3vh]">
            Thank you! Your message has been sent successfully. 
            <Link to='/' className="font-regular underline text-green-900">
             Back to Home!
            </Link>
          </p>
          
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="font-regular tracking-wide text-[#124462] text-lg mb-2 block">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-[#E5E7EB] p-4 rounded-sm text-[#124462] focus:outline-none focus:border-[#124462] transition duration-300"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="font-regular tracking-wide text-[#124462] text-lg mb-2 block">
                Your Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-[#E5E7EB] p-4 rounded-sm text-[#124462] focus:outline-none focus:border-[#124462] transition duration-300"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="font-regular tracking-wide text-[#124462] text-lg mb-2 block">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border border-[#E5E7EB] p-4 rounded-sm text-[#124462] focus:outline-none focus:border-[#124462] transition duration-300"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#124462] text-white py-4 rounded-sm font-regular tracking-wide text-lg hover:bg-[#103C50] transition duration-300"
            >
              Send Message
            </button>
            <div className="flex w-full justify-center mt-2">
            <Link to='/' className="text-center text-gray-300 font-regular text-[2.6vh] hover:underline "  >
                Back to Home
            </Link>
            </div>
          </form>
        )}
      </div>
        
      
    </div>
  );
};

export default Contact;
