import { v2 as cloudinary } from 'cloudinary';
import ProductModel from '../models/productModel.js'
import productModel from '../models/productModel.js';
//add product 
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller, stock } = req.body;
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        )
        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === 'true' ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            stock: Number(stock),
            date: Date.now()
        }

        console.log(productData);

        const product = new ProductModel(productData);
        await product.save();
        res.status(201).json({ success: true, message: "Product added successfully" });

        // console.log(name, description, price, category, subCategory, sizes, bestseller);
        // console.log(imagesUrl);
        // res.json({});

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

//list product
const listProducts = async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }

}
//remove product
const removeProduct = async (req, res) => {
    try {
        await ProductModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product removed successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId)
        res.json({ success: true, product })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const editProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, subCategory, sizes, bestseller, stock, sold } = req.body;

        // Find the existing product
        const existingProduct = await ProductModel.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Prepare updated product data
        const updatedProductData = {
            name: name || existingProduct.name,
            description: description || existingProduct.description,
            price: price ? Number(price) : existingProduct.price,
            category: category || existingProduct.category,
            subCategory: subCategory || existingProduct.subCategory,
            bestseller: bestseller !== undefined ? bestseller === 'true' : existingProduct.bestseller,
            sizes: sizes ? JSON.parse(sizes) : existingProduct.sizes,
            stock: stock ? Number(stock) : existingProduct.stock,
            sold: sold ? Number(sold) : existingProduct.sold,
        };

        // Update the product
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, updatedProductData, { new: true });

        res.status(200).json({ success: true, message: "Product updated successfully", product: updatedProduct });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};



export { listProducts, addProduct, removeProduct, singleProduct, editProduct }