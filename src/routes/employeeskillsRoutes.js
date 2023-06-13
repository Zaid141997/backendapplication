const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const EmployeeSkills = mongoose.model('Employeeskills');
const Skill = mongoose.model('Skill');

router.post('/employeeskills', (req, res) => {
  const { primarySkill, secondarySkill } = req.body;

  if (primarySkill) {
    // Save primary skill
    EmployeeSkills.findOneAndUpdate(
      { email: req.user.email, }, // Update the condition according to your needs
      { primarySkill: primarySkill },
      { new: true, upsert: true }
    )
      .populate('primarySkill.skill')
      .populate('secondarySkills.skill')
      .then(employeeSkills => {
        res.json(employeeSkills);
      })
      .catch(error => {
        console.error('Error saving primary skill:', error);
        res.status(500).json({ error: 'Failed to save primary skill' });
      });
  } else if (secondarySkill) {
    // Save secondary skill
    EmployeeSkills.findOneAndUpdate(
      { email: req.user.email, }, // Update the condition according to your needs
      { $push: { secondarySkills: secondarySkill } },
      { new: true }
    )
      .populate('primarySkill.skill')
      .populate('secondarySkills.skill')
      .then(employeeSkills => {
        res.json(employeeSkills);
      })
      .catch(error => {
        console.error('Error saving secondary skill:', error);
        res.status(500).json({ error: 'Failed to save secondary skill' });
      });
  }
});

 module.exports = router;
