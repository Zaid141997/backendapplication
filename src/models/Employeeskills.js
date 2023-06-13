const mongoose = require('mongoose');
const Skill = mongoose.model('Skill');

const employeeSkillsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  
  primarySkill: {
    skill: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Skill', 
      required: true
     },
    yearsOfExperience: { 
      type: Number, 
      required: true 
    },
    certification: { 
      type: String 
    }
  },
  secondarySkills: [{
    skill: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true
     },
    yearsOfExperience: { 
      type: Number
     },
    certification: {
       type: String 
      }
  }]
});

mongoose.model('Employeeskills', employeeSkillsSchema);