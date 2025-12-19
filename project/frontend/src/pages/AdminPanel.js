import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const API_URL = 'http://localhost:5000/api';

const AdminPanel = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  
  // Form states
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    image: null
  });
  const [clientForm, setClientForm] = useState({
    name: '',
    description: '',
    designation: '',
    image: null
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [projectsRes, clientsRes, contactsRes, subsRes] = await Promise.all([
        axios.get(`${API_URL}/projects`),
        axios.get(`${API_URL}/clients`),
        axios.get(`${API_URL}/contacts`),
        axios.get(`${API_URL}/subscriptions`)
      ]);
      
      setProjects(projectsRes.data);
      setClients(clientsRes.data);
      setContacts(contactsRes.data);
      setSubscriptions(subsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', projectForm.name);
    formData.append('description', projectForm.description);
    if (projectForm.image) {
      formData.append('image', projectForm.image);
    }

    try {
      await axios.post(`${API_URL}/projects`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchAllData();
      setProjectForm({ name: '', description: '', image: null });
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', clientForm.name);
    formData.append('description', clientForm.description);
    formData.append('designation', clientForm.designation);
    if (clientForm.image) {
      formData.append('image', clientForm.image);
    }

    try {
      await axios.post(`${API_URL}/clients`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchAllData();
      setClientForm({ name: '', description: '', designation: '', image: null });
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      
      <div className="admin-sections">
        {/* Project Management */}
        <section className="admin-section">
          <h2>Add New Project</h2>
          <form onSubmit={handleProjectSubmit} className="admin-form">
            <input
              type="text"
              placeholder="Project Name"
              value={projectForm.name}
              onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
              required
            />
            <textarea
              placeholder="Project Description"
              value={projectForm.description}
              onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProjectForm({...projectForm, image: e.target.files[0]})}
              required
            />
            <button type="submit">Add Project</button>
          </form>

          <h3>All Projects</h3>
          <div className="items-list">
            {projects.map(project => (
              <div key={project._id} className="item-card">
                <img src={`http://localhost:5000/${project.image}`} alt={project.name} />
                <h4>{project.name}</h4>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Client Management */}
        <section className="admin-section">
          <h2>Add New Client</h2>
          <form onSubmit={handleClientSubmit} className="admin-form">
            <input
              type="text"
              placeholder="Client Name"
              value={clientForm.name}
              onChange={(e) => setClientForm({...clientForm, name: e.target.value})}
              required
            />
            <textarea
              placeholder="Client Description/Testimonial"
              value={clientForm.description}
              onChange={(e) => setClientForm({...clientForm, description: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Designation"
              value={clientForm.designation}
              onChange={(e) => setClientForm({...clientForm, designation: e.target.value})}
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setClientForm({...clientForm, image: e.target.files[0]})}
              required
            />
            <button type="submit">Add Client</button>
          </form>

          <h3>All Clients</h3>
          <div className="items-list">
            {clients.map(client => (
              <div key={client._id} className="item-card">
                <img src={`http://localhost:5000/${client.image}`} alt={client.name} />
                <h4>{client.name}</h4>
                <p>{client.designation}</p>
                <p>"{client.description}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form Responses */}
        <section className="admin-section">
          <h2>Contact Form Responses</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>City</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(contact => (
                  <tr key={contact._id}>
                    <td>{contact.fullName}</td>
                    <td>{contact.email}</td>
                    <td>{contact.mobile}</td>
                    <td>{contact.city}</td>
                    <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Subscribed Emails */}
        <section className="admin-section">
          <h2>Subscribed Email Addresses</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Subscription Date</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map(sub => (
                  <tr key={sub._id}>
                    <td>{sub.email}</td>
                    <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;