import asyncHandler from 'express-async-handler';
import razorpay from 'razorpay';

const createOrder = asyncHandler (async (req, res)=>{

          var instance = new razorpay({ key_id: process.env.RAZORPAY_KEY, key_secret: process.env.RAZORPAY_SECRET });

          let order = await instance.orders.create({
                    amount: 50000,
                    currency: "INR",
                    receipt: "receipt#1",
                    notes: {
                      key1: "value3",
                      key2: "value2"
                    }
                  })

                  res.json(order);

})

export {
          createOrder
}