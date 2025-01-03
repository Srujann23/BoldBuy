import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js';
import ProductModel from '../models/productModel.js';
import mongoose from "mongoose";

const currency = 'inr'
const deliveryCharge = 100

const placeOrder = async (req, res) => {
    let session;
    try {
        console.log('Received order request:', JSON.stringify(req.body, null, 2));

        session = await mongoose.startSession()
        session.startTransaction()

        const { userId, items, amount, address } = req.body

        if (!userId || !items || !Array.isArray(items) || items.length === 0 || !amount || !address) {
            throw new Error('Invalid request body structure')
        }

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save({ session })
        console.log('Order saved:', newOrder._id)

        for (const item of items) {
            if (!item._id || !item.size || !item.quantity) {
                throw new Error(`Invalid item structure: missing _id, size, or quantity for item ${JSON.stringify(item)}`)
            }

            const product = await ProductModel.findById(item._id).session(session)
            if (!product) {
                throw new Error(`Product not found: ${item._id}`)
            }

            const sizeStock = product.sizeStock.find(s => s.size === item.size)
            if (!sizeStock) {
                throw new Error(`Size ${item.size} not found for product: ${product.name}`)
            }
            if (sizeStock.stock < item.quantity) {
                throw new Error(`Insufficient stock for product: ${product.name}, size: ${item.size}. Required: ${item.quantity}, Available: ${sizeStock.stock}`)
            }

            const updatedProduct = await ProductModel.findOneAndUpdate(
                { _id: item._id, "sizeStock.size": item.size },
                { 
                    $inc: { 
                        "sizeStock.$.stock": -item.quantity,
                        "sizeStock.$.sold": item.quantity
                    } 
                },
                { new: true, session }
            )
            if (!updatedProduct) {
                throw new Error(`Failed to update product: ${item._id}, size: ${item.size}`)
            }
            console.log(`Updated product ${item._id}, size ${item.size}:`, { 
                stock: updatedProduct.sizeStock.find(s => s.size === item.size).stock, 
                sold: updatedProduct.sizeStock.find(s => s.size === item.size).sold 
            })
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId, { cartData: {} }, { new: true, session })
        if (!updatedUser) {
            throw new Error(`Failed to clear cart for user: ${userId}`)
        }
        console.log(`Cleared cart for user ${userId}`)

        await session.commitTransaction()
        console.log('Transaction committed successfully')

        res.json({ success: true, message: "Order Placed!" })
    } catch (error) {
        console.error('Error in placeOrder:', error)
        if (session) {
            try {
                await session.abortTransaction()
                console.log('Transaction aborted')
            } catch (abortError) {
                console.error('Error aborting transaction:', abortError)
            }
        }
        if (error.message.startsWith('Insufficient stock for product:')) {
            res.status(400).json({ success: false, message: error.message, type: 'INSUFFICIENT_STOCK' })
        } else {
            res.status(500).json({ success: false, message: error.message, stack: error.stack })
        }
    } finally {
        if (session) {
            try {
                await session.endSession()
                console.log('Session ended')
            } catch (endSessionError) {
                console.error('Error ending session:', endSessionError)
            }
        }
    }
}

const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: 'Status Updated' })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export { placeOrder, allOrders, userOrders, updateStatus }

 