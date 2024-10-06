import mongoose from 'mongoose';
import fs from 'fs';
import productModel from '../models/productModel.js';
import dotenv from 'dotenv';
dotenv.config();

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/ecommerce`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Function to import products
const importProducts = async () => {
    try {
        // Read the JSON file
        const data = fs.readFileSync('updated_products.json', 'utf-8');
        const products = JSON.parse(data);

        // Insert products into the database
        await productModel.insertMany(products);
        console.log('Products imported successfully');
    } catch (error) {
        console.error('Error importing products:', error);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
};

// Run the functions
const run = async () => {
    await connectDB();
    await importProducts();
};

run();
