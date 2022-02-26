import express from 'express'
import { registerUser, 
          authUser, 
          generateRpin, 
          getAllRpin, 
          getMyDownlines, 
          getUserInfo, 
          registerVendor,
          generateBill,
          addUser,
          getUsers,
          getVendors
} from '../Controllers/user.js'
import {protect, admin, vendor} from '../middleware/authMiddleware.js'

let router = express.Router()

router.post(`/register-user`, registerUser);
router.post(`/login`, authUser);
router.get(`/generate-rpin`, protect,generateRpin);
router.get(`/get-all-rpin`, protect,getAllRpin);
router.get(`/get-my-downlines`, protect,getMyDownlines);
router.get(`/get-user-info`, protect,getUserInfo);
router.post(`/register-vendor`, protect, admin, registerVendor);
router.post(`/generate-bill`, protect, vendor, generateBill);
router.post(`/add-user`, protect, admin, addUser);
router.get(`/get-users`, protect, admin, getUsers);
router.get(`/get-vendors`, protect, admin, getVendors);

export default router