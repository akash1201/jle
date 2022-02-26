import asyncHandler from 'express-async-handler';

const incomeChartStatic = [
          {         id : 1,
                    name : 'Grocery',
                    data : [
                              {level : 1, cashback : 4},
                              {level : 2, cashback : 4},
                              {level : 3, cashback : 4},
                              {level : 4, cashback : 1},
                              {level : 5, cashback : 1},
                              {level : 6, cashback : 1},
                              {level : 7, cashback : 1}
                    ]
          },
          {
                    id : 2,
                    name : 'Other Products',
                    data : [
                              {level : 1, cashback : 4},
                              {level : 2, cashback : 4},
                              {level : 3, cashback : 4},
                              {level : 4, cashback : 1},
                              {level : 5, cashback : 1},
                              {level : 6, cashback : 1},
                              {level : 7, cashback : 1}
                    ]
          }
]

const membershipBenefits = [
          {name : 'Decoration', cashback : 25},
          {name : 'Vehicle Rent', cashback : 20},
          {name : 'Doctor Visit', cashback : 25},
          {name : 'Medecine', cashback : 25}
]

const getIncomeChart = asyncHandler(async (req, res)=>{
     
          res.json({data : incomeChartStatic});

});

const getMembershipBenefits = asyncHandler(async(req, res)=>{
      
          res.json({data : membershipBenefits})

})

export { getIncomeChart, getMembershipBenefits }