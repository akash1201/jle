import mongoose from 'mongoose'


const CashBackSchema = mongoose.Schema({

        category : {
                  type : String,
                  required : true
        },
        level : {
                  type : Number,
                  required : true
        },
        rate : {
                  type : Number,
                  required : true
        }
},
          {
          timestamps: true,
        }
)


const Cashback = mongoose.model('Cashback',CashBackSchema)

export default Cashback