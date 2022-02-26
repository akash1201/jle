import mongoose from 'mongoose'


const BillSchema = mongoose.Schema({

     issuedTo : {
               type : String,
               required : true
     },
     issuedBy : {
               type : String,
               required : true
     },
     amount : {
               type : Number,
               required : true
     },
     category : {
               type : String
     }
},
          {
          timestamps: true,
        }
)


const Bill = mongoose.model('Bill', BillSchema)

export default Bill;