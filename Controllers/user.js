import asyncHandler from 'express-async-handler'
import User from '../Models/User.js'
import generateToken from '../utils/generateToken.js'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import Rpin from '../Models/Rpin.js'
import {ObjectId} from 'mongodb'
import Bill from '../Models/Bill.js'
import base64 from 'base-64';
import fetch from 'node-fetch'


const registerUser = asyncHandler(async(req, res)=>{

          let max = await User.aggregate([
                    {
                        $group: {
                            _id: null,
                            maxSlNo: {$max: "$slNo"}
                        }
                    }
                ])

                let slno = max[0].maxSlNo?(max[0].maxSlNo+1):(1)
                 //Razor Pay api calls
                 let key = `${process.env.RAZORPAY_KEY}:${process.env.RAZORPAY_SECRET}`;
                 let encodedKey = base64.encode(key);
                 let config = {
                        'Content-Type': 'application/json',
                         'Authorization' : `Basic ${encodedKey}`
                 }
                 let contactObj = {
                       name : req.body.name,
                       contact : req.body.phone,
                       type : "customer"
                 }
                 let response = await fetch(`https://api.razorpay.com/v1/contacts`,{
                    method: 'post',
                    body: JSON.stringify(contactObj),
                    headers: config
                });
                let data = await response.json();
                let contactId = data.id;
                let bankDetails = {
                    contact_id : contactId,
                    account_type : "bank_account",
                    bank_account : {
                        name : req.body.name,
                        ifsc : req.body.ifsc,
                        account_number : req.body.account
                    }
                }
                let response1 = await fetch(`https://api.razorpay.com/v1/fund_accounts`,{
                    method: 'post',
                    body: JSON.stringify(bankDetails),
                    headers: config
                });
                let data1 = await response1.json();

                let obj = {
                          parentId : req.body.parentId,
                          name : req.body.name,
                          address : req.body.address,
                          slNo: slno,
                          userId : 'JLE00'+slno,
                          rPin: req.body.rpin,
                          phone : req.body.phone,
                          password : req.body.password,
                          contactId : contactId,
                          fundId : data1.id
                }

                try{
                    let user = await User.create(obj)
                    await Rpin.updateOne({rpin : req.body.rpin}, {$set : {iAssigned : true, assignedTo: user._id}})
                    res.json(obj)
                }catch(err){
                          console.log(err)
                }
          

})

const authUser = asyncHandler(async(req, res)=> {

          let userName = req.body.userName

          let user = await User.findOne({userId : userName})

          if(user && (await user.matchPassword(req.body.password))){
               
                    res.json({
                              id : user._id,
                              userName : user.userId,
                              name : user.name,
                              token : generateToken(user._id),
                               userType : user.userType,
                               role : user.role
                    })

          }else{
                    res.status(500).json({msg : 'Invalid email or password'})
          }

})

const generateRpin = asyncHandler( async (req, res) => {

          let token = req.headers.authorization.split(' ')[1]
          let userid = jwt.verify(token, process.env.JWT_SECRET)
          console.log(userid.id)

          let rpin = uuidv4()

          let obj = {
                     rpin : rpin,
                     generatedBy : userid.id,
                     isAssigned : false
          }

          let rpinObj = await Rpin.create(obj)
           
          res.json({rpin : rpin})

})

const getAllRpin = asyncHandler( async (req, res) => {

          let token = req.headers.authorization.split(' ')[1];
          let userid = jwt.verify(token, process.env.JWT_SECRET);
          
        let pins = await Rpin.find({generatedBy : userid.id, paymentStatus : 'paid', isAssigned : false})

           
          res.json({rpins : pins})

})

let users = []
const getMyDownlines = asyncHandler( async (req, res) => {

          let token = req.headers.authorization.split(' ')[1]
          let userid = jwt.verify(token, process.env.JWT_SECRET)
          
         users = await User.find({})
         let user = [...users]
      
          let data = []

          for(let i=0; i<user.length; ++i){
                
                   if(user[i].parentId == userid.id){
                    data.push({
                              id : user[i]._id,
                              name : user[i].name,
                              userId : user[i].userId,
                              designation : user[i].designation,
                              address : user[i].address.line1+", "+user[i].address.city+", "+user[i].address.district,
                              phone : user[i].phone,
                              children : await getClildren(ObjectId(user[i]._id).toString())
                    })
                   }
          }

          res.json({users : data})
})

const getClildren = async (id) => {
   let data = []
   let user = [...users]

     for(let i=0; i<user.length; ++i){
               if(user[i].parentId == id){
                    data.push({
                              id : user[i]._id,
                              name : user[i].name,
                              userId : user[i].userId,
                              designation : user[i].designation,
                              address : user[i].address.line1+", "+user[i].address.city+", "+user[i].address.district,
                              phone : user[i].phone,
                              children : await getClildren(ObjectId(user[i]._id).toString())
                         })
               }
     }

     return data
}

const getUserInfo = asyncHandler( async (req, res) => {

    let token = req.headers.authorization.split(' ')[1]
    let userid = jwt.verify(token, process.env.JWT_SECRET)

   let user = await User.findOne({_id :userid.id}, {_id : 0, password : 0})
   console.log(user)



    res.json({user : user})
})

const registerVendor = asyncHandler( async (req, res)=>{

    try{
        let max = await User.aggregate([
            {
                $group: {
                    _id: null,
                    maxSlNo: {$max: "$slNo"}
                }
            }
        ])

        let token = req.headers.authorization.split(' ')[1];
        let userid = jwt.verify(token, process.env.JWT_SECRET);

        let pin = uuidv4();

        let slno = max[0].maxSlNo?(max[0].maxSlNo+1):(1)
        let obj = {
            parentId : userid.id,
            name : req.body.name,
            address : req.body.address,
            slNo : slno,
            userId : 'JLE00'+slno,
            rPin : pin,
            userType : 'vendor',
            role : 'vendor',
            phone : req.body.phone,
            password : req.body.password
        }
        let vendor = await User.create(obj);
        res.json({vendor : vendor});
    }catch(err){
        res.status(500).json({message : err.message});
    }

})

const generateBill = asyncHandler ( async (req, res)=>{

    try{

        let token = req.headers.authorization.split(' ')[1];
        let userid = jwt.verify(token, process.env.JWT_SECRET);

          let vendor = await User.findById(userid.id);

          let obj = {
            issuedTo : req.body.issuedTo,
            issuedBy : vendor.userId,
            amount : req.body.amount,
            category : req.body.category
          }
          let bill = await Bill.create(obj);

          res.json({bill : bill})
    }catch(err){
        res.status(500).json({message : err.message});
    }
});

const addUser = asyncHandler (async (req, res)=>{

    let rpin = uuidv4();

    let max = await User.aggregate([
        {
            $group: {
                _id: null,
                maxSlNo: {$max: "$slNo"}
            }
        }
    ])
    let slno = max[0].maxSlNo?(max[0].maxSlNo+1):(1)

    let obj = {
        slNo : slno,
        rPin : rpin,
        ...req.body
    }
   
    let user = await User.create(obj);
    res.json(user);
})

const getUsers = asyncHandler ( async (req, res)=>{

    let user = await User.find({}, {password : 0});
    res.json(user);
})

const getVendors = asyncHandler( async (req, res)=>{

    let vendors = await User.find({userType : 'vendor'}, {password : 0});
    res.json(vendors);
})
export {
    getVendors,
    getUsers,
    addUser,
    registerUser
    , authUser
    , generateRpin
    , getAllRpin
    , getMyDownlines
    , getUserInfo
    , registerVendor
    , generateBill
}