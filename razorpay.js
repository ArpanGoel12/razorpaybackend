const Razorpay=require("razorpay");
const express=require("express");
const app=express();
app.use(express.json());
//authenticating razorpay
var instance = new Razorpay({
    key_id: 'rzp_test_YqQ9om1jfcBSmS',
    key_secret: 'TWVoKnfd3izynbMibjJ2ipTT',
  });
  


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

//to create order id
let itemPrice;
app.post('/createPlan',(req,res)=>{
    if(req.body.amount==3) itemPrice=5000;
    else if(req.body.amount==6) itemPrice=7000;
    return res.send("plan created");
})
app.post('/create/orderId',(req,res)=>{
console.log("posted");
var options = {
  amount: itemPrice,  // amount in the smallest currency unit
  currency: "INR",
  receipt: "order_rcptid_11"
};
instance.orders.create(options, function(err, order) {
    if(err) console.log(err);
  console.log(order);
  return res.send({data:order});
});
});


//to verify payment
app.post("/api/payment/verify",(req,res)=>{
    

    let body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
   
     var crypto = require("crypto");
     var expectedSignature = crypto.createHmac('sha256', 'TWVoKnfd3izynbMibjJ2ipTT')
                                     .update(body.toString())
                                     .digest('hex');
     var response = {"signatureIsValid":"false"}
     if(expectedSignature === req.body.razorpay_signature){
      response={"signatureIsValid":"true"}
      console.log("successful)");
     }
         res.send(response);
     });
   

const port=process.env.PORT||4000;
  app.listen(port,(req,res)=>{
    console.log("kistening on port 4000");
});
