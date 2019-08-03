const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;


const UsersSchema = new Schema({
  username :{
    type : String, 
    index : {unique : true}
  },

email: {
  type: String,
  require: true
},

password: {
  type: String,
  required: true
  // minlength: 8
},

points:{
  type: Number
},

rank : {
  type: Number
}

});

/*
UsersSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
}
*/

UsersSchema.statics.findByCredentials = async (email,password) => {
  const user = await User.findOne({email}) 
  console.log(user);
  
  if(user === null){
      return 'user doesn\'t exist'
  }
  
  if(user.password !== password){
      return 'wrong password'
  }

  return user

}   

const User =  mongoose.model('Users',UsersSchema);
module.exports = User
