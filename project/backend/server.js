const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Models
const Project = require('./models/Project');
const Client = require('./models/Client');
const Contact = require('./models/Contact');
const Subscription = require('./models/Subscription');

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Image cropping function
const sharp = require('sharp');
const cropImage = async (filePath, width, height) => {
    try {
        const croppedPath = filePath.replace(/(\.\w+)$/, '-cropped$1');
        await sharp(filePath)
            .resize(width, height, {
                fit: 'cover',
                position: 'center'
            })
            .toFile(croppedPath);
        return croppedPath;
    } catch (error) {
        console.error('Error cropping image:', error);
        return filePath;
    }
};

// Routes
// Projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/projects', upload.single('image'), async (req, res) => {
    try {
        let imagePath = req.file.path;
        
        // Crop image to 450x350
        if (req.file) {
            imagePath = await cropImage(req.file.path, 450, 350);
        }

        const project = new Project({
            name: req.body.name,
            description: req.body.description,
            image: imagePath.replace('uploads\\', '')
        });

        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Clients
app.get('/api/clients', async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/clients', upload.single('image'), async (req, res) => {
    try {
        let imagePath = req.file.path;
        
        // Crop client image (adjust ratio as needed)
        if (req.file) {
            imagePath = await cropImage(req.file.path, 300, 300);
        }

        const client = new Client({
            name: req.body.name,
            description: req.body.description,
            designation: req.body.designation,
            image: imagePath.replace('uploads\\', '')
        });

        await client.save();
        res.status(201).json(client);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Contact Form
app.post('/api/contact', async (req, res) => {
    try {
        const contact = new Contact({
            fullName: req.body.fullName,
            email: req.body.email,
            mobile: req.body.mobile,
            city: req.body.city
        });

        await contact.save();
        res.status(201).json(contact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Newsletter Subscription
app.post('/api/subscribe', async (req, res) => {
    try {
        const subscription = new Subscription({
            email: req.body.email
        });

        await subscription.save();
        res.status(201).json(subscription);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/subscriptions', async (req, res) => {
    try {
        const subscriptions = await Subscription.find().sort({ createdAt: -1 });
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});