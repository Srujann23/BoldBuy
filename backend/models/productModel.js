import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    bestseller: { type: Boolean },
    date: { type: Number, required: true },
    // Stock management fields
    stock: { type: Number, required: true, default: 0 }, // Quantity in stock
    sold: { type: Number, default: 0 } // Quantity sold, optional
})

const productModel = mongoose.model.product || mongoose.model("product", productSchema)

export default productModel