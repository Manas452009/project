import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LandingPage.css';

const API_URL = 'http://localhost:5000/api';

const LandingPage = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    city: ''
  });
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/clients`);
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/contact`, formData);
      setMessage('Contact form submitted successfully!');
      setFormData({ fullName: '', email: '', mobile: '', city: '' });
    } catch (error) {
      setMessage('Error submitting form');
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/subscribe`, { email });
      setMessage('Subscribed successfully!');
      setEmail('');
    } catch (error) {
      setMessage('Error subscribing');
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="hero">
        <h1>Welcome to Our Portfolio</h1>
        <p>We create amazing projects for happy clients</p>
      </header>

      {/* Projects Section */}
      <section className="projects-section">
        <h2>Our Projects</h2>
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project._id} className="project-card">
              <img 
                src={`http://localhost:5000/${project.image}`} 
                alt={project.name} 
              />
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <button className="read-more">Read More</button>
            </div>
          ))}
        </div>
      </section>

      {/* Clients Section */}
      <section className="clients-section">
        <h2>Happy Clients</h2>
        <div className="clients-grid">
          {clients.map(client => (
            <div key={client._id} className="client-card">
              <img 
                src={`http://localhost:5000/${client.image}`} 
                alt={client.name} 
              />
              <p className="client-description">"{client.description}"</p>
              <h4>{client.name}</h4>
              <p className="client-designation">{client.designation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-section">
        <h2>Contact Us</h2>
        <form onSubmit={handleContactSubmit} className="contact-form">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <h2>Subscribe to Our Newsletter</h2>
        <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default LandingPage;