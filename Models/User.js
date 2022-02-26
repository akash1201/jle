import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = mongoose.Schema({

          parentId : {
                     type : String,
                     default : 'parent'
          },
          name : {
                    type: String,
                    required: true
          },
          slNo : {
                type : Number,
                unique : true
          },
          userId : {
                 type : String,
          },
          password: {
                    type: String,
                  },
          rPin : {
                  type : String,
                  unique : true
          },
          designation : {
                    type : String,
                    default : 'startup'
          },
          address : {
                      type : Object
          },
          phone : {
            type : String
          },
          userType : {
                    type : String,
                    default : 'user'
          },
          role : {
            type : String,
            default : 'customer'
          }

},
          {
          timestamps: true,
        }
)

UserSchema.methods.matchPassword = async function (enteredPassword) {
          return await bcrypt.compare(enteredPassword, this.password);
        };
        
UserSchema.pre("save", async function (next) {
if (!this.isModified("password")) {
next();
}
        
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
});
const user = mongoose.model('User',UserSchema)

export default user