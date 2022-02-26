import mongoose from 'mongoose'


const RpinSchema = mongoose.Schema({

        rpin : {
                  type : String,
                  required : true
        },
        generatedBy : {
                  type : String,
                  required : true
        },
        paymentStatus : {
                   type : String,
                   default : 'paid'
        },
        iAssigned : {
                type : Boolean,
                default : false
        },
        assignedTo : {
                  type : String
        }
},
          {
          timestamps: true,
        }
)


const Rpin = mongoose.model('Rpin',RpinSchema)

export default Rpin