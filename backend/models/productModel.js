import mongoose from "mongoose";

const sizeStockSchema = new mongoose.Schema({
  size: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  sold: { type: Number, default: 0 }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: [String], required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizeStock: { type: [sizeStockSchema], required: true },
  bestseller: { type: Boolean },
  date: { type: Date, default: Date.now },
});

const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);

export default ProductModel;

