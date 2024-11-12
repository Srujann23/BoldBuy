// import { currency } from '../../admin/src/App.jsx';
import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';
import mongoose from "mongoose";

import Stripe from 'stripe'
import razorpay from 'razorpay';
//global vars
const currency = 'inr'
const deliveryCharge = 100

//gateway init
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
// const razorpayInstance = new razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET
// })
//COD
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
        if (!item._id) {
          throw new Error(`Invalid item structure: missing _id for item ${JSON.stringify(item)}`)
        }
  
        const product = await productModel.findById(item._id).session(session)
        if (!product) {
          throw new Error(`Product not found: ${item._id}`)
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}. Required: ${item.quantity}, Available: ${product.stock}`)
        }
  
        const updatedProduct = await productModel.findByIdAndUpdate(
          item._id,
          { 
            $inc: { 
              stock: -item.quantity,
              sold: item.quantity
            } 
          },
          { new: true, session }
        )
        if (!updatedProduct) {
          throw new Error(`Failed to update product: ${item._id}`)
        }
        console.log(`Updated product ${item._id}:`, { stock: updatedProduct.stock, sold: updatedProduct.sold })
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


//stripe
// const placeOrderStripe = async (req, res) => {
//     try {
//         const { userId, items, amount, address } = req.body
//         const { origin } = req.headers;

//         const orderData = {
//             userId,
//             items,
//             amount,
//             address,
//             paymentMethod: "Stripe",
//             payment: false,
//             date: Date.now()
//         }

//         const newOrder = new orderModel(orderData)
//         await newOrder.save()

//         const line_items = items.map(() => ({
//             price_data: {
//                 currency: currency,
//                 product_data: {
//                     name: item.name
//                 },
//                 unit_amount: item.price * 100
//             }
//         }))
//         line_items.push({
//             price_data: {
//                 currency: currency,
//                 product_data: {
//                     name: 'Delivery Charges'
//                 },
//                 unit_amount: deliveryCharge * 100
//             },
//             quantity: 1

//         })

//         const session = await stripe.checkout.sessions.create({
//             success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
//             line_items,
//             mode: 'payment'
//         })

//         res.json({ success: true, session_url: session.url });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message })

//     }
// }

//verify stripe
// const verifyStripe = async (req, res) => {
//     const { orderId, success, userId } = req.body
//     try {
//         if (success === "true") {
//             await orderModel.findByIdAndUpdate(orderId, { payment: true });
//             await userModel.findByIdAndUpdate(userId, { cartData: {} })
//             res.json({ success: true });
//         }
//         else {
//             await orderModel.findByIdAndDelete(orderId)
//             res.json({ success: false });
//         }

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message })

//     }
// }
//Razorpay
// const placeOrderRazorpay = async (req, res) => {
//     try {
//         const { userId, items, amount, address } = req.body

//         const orderData = {
//             userId,
//             items,
//             amount,
//             address,
//             paymentMethod: "COD",
//             payment: false,
//             date: Date.now()
//         }

//         const newOrder = new orderModel(orderData)
//         await newOrder.save()

//         const options = {
//             amount: amount * 100,
//             currency: currency.toUpperCase(),
//             receipt: newOrder._id.toString()
//         }

//         await razorpayInstance.orders.create(options, (error, order) => {
//             if (error) {
//                 console.log(error)
//                 return res.json({ success: false, message: error })
//             }
//             res.json({ success: true, order })
//         })
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message })
//     }
// }

//verify razorpay
// const verifyRazorpay = async (req, res) => {
//     try {
//         const { userId, razorpay_order_id } = req.body
//         const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
//         if(orderInfo.status === 'paid'){
//             await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
//             await userModel.findByIdAndUpdate(userId,{cartData:{}})
//             res.json({success:true,message:"Payment Successful"})
//         } 
//         else{
//             res.json({success:false,message:"Payment Failed"});
//         }

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message })
//     }
// }

//all orders for admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

//user orderdata for frontend
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

//update order status
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
// export { placeOrder, placeOrderRazorpay, placeOrderStripe, allOrders, userOrders, updateStatus, verifyStripe, verifyRazorpay }
export { placeOrder, allOrders, userOrders, updateStatus }