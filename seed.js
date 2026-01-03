const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const User = require('./models/User');
const Role = require('./models/Role');
const Website = require('./models/Website');

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Role.deleteMany({});
        await Website.deleteMany({});
        console.log('Cleared existing data');

        // Read data from JSON files
        const usersData = JSON.parse(await fs.readFile(path.join(__dirname, 'db', 'users.json'), 'utf-8'));
        const rolesData = JSON.parse(await fs.readFile(path.join(__dirname, 'db', 'roles.json'), 'utf-8'));
        const websitesData = JSON.parse(await fs.readFile(path.join(__dirname, 'db', 'websites.json'), 'utf-8'));

        // Insert new data
        await User.insertMany(usersData);
        await Role.insertMany(rolesData);
        await Website.insertMany(websitesData);

        console.log('Database successfully seeded');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
