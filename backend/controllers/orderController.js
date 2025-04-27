import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import sendMail from "../utils/sendMail.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    const userEmail = req.body.email;
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
    const user = await userModel.findById(req.body.userId);

    await sendMail(
        userEmail,
        "Your RotiChapati Order Confirmation 🍛",
        `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #d35400;">Hi ${user.name},</h2>
              <p style="font-size: 16px; color: #333;">
                Thank you for placing your order with <strong>RotiChapati</strong>! 🫓✨
              </p>
              <p style="font-size: 16px; margin: 20px 0; color: #333;">
                <strong>Order Amount:</strong> $${req.body.amount}
              </p>
              <p style="font-size: 16px; color: #333;">
                We are currently preparing your delicious meal and will notify you once it is on its way.
              </p>
              <hr style="margin: 30px 0;">
              <p style="font-size: 14px; color: #888;">
                If you have any questions or need assistance, feel free to reply to this email.
              </p>
              <p style="font-size: 14px; color: #888;">- The RotiChapati Team</p>
            </div>
          </div>
        `
      );
      

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orderes = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orderes });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//api for updating order status

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Update status
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.json({ success: false, message: "Order not found" });
    }

    // Check if address and email exist
    const userEmail = updatedOrder.address?.email;
    console.log(userEmail);
    if (userEmail) {
    //   console.log("Sending email to", userEmail); // debug
      let statusMessage = "";

      if (status === "Out For Delivery") {
        statusMessage = "Your delicious food is on the way! Get ready!";
      } else if (status === "Delivered") {
        statusMessage = "Your order has been delivered. Enjoy your meal!";
      } else if (status === "Cancelled") {
        statusMessage =
          "Your order has been cancelled. If this was a mistake, please reach out.";
      } else {
        statusMessage = `Your order status is now: ${status}`;
      }

      await sendMail(
        userEmail,
        "Update on Your Order from RotiChapati!",
        `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #d35400;">Hello ${updatedOrder.address.firstName},</h2>
        <p style="font-size: 16px; color: #333;">
          ${statusMessage}
        </p>
        <p style="font-size: 16px; color: #333;">
          Thank you for choosing <strong>RotiChapati</strong>! We hope you have a wonderful experience.
        </p>
        <hr style="margin: 30px 0;">
        <p style="font-size: 14px; color: #888;">
          If you have any questions or concerns, feel free to contact our support team anytime.
        </p>
        <p style="font-size: 14px; color: #888;">- The RotiChapati Team</p>
      </div>
    </div>
  `
      );
    } else {
      console.log("No email found for this order.");
    }

    res.json({ success: true, message: "Status updated and email sent" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
