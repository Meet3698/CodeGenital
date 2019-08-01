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
  required: true,
  minlength: 8
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

UsersSchema.methods.validPassword = function(password) {
  return password = this.password;//bcrypt.compareSync(password, this.password);

}

module.exports = mongoose.model('Users',UsersSchema);
