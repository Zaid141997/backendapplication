
const mongoose = require('mongoose');

const employeeSkillsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  primarySkill: {
    skillName: {
      type: String,
      required: true,
    },
    yearsOfExperience: {
      type: String,
      required: true,
    },
    certification: {
      type: String,
    },
  },
  secondarySkills: [
    {
      skillName: {
        type: String,
        required: true,
      },
      yearsOfExperience: {
        type: String,
        required: true,
      },
      certification: {
        type: String,
      },
    },
  ],
});

 mongoose.model('Employeeskills', employeeSkillsSchema);






