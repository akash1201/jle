import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getIncomeChart, getMembershipBenefits } from '../Controllers/income.js';

let router = express.Router();

router.get(`/get-income-chart`, protect, getIncomeChart);
router.get(`/get-membership-benefits`, protect, getMembershipBenefits);

export default router;