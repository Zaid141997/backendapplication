

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const EmployeeSkills = mongoose.model('Employeeskills');
const Skill = mongoose.model('Skill');

// Retrieve employee skills
router.get('/employeeskills', async (req, res) => {
  try {
    const { email } = req.query;

    const employeeSkills = await EmployeeSkills.findOne({ email });

    if (employeeSkills) {
      res.json(employeeSkills);
    } else {
      res.json({ primarySkill: null, secondarySkills: [] });
    }
  } catch (error) {
    console.error('Error retrieving employee skills:', error);
    res.status(500).json({ error: 'Failed to retrieve employee skills.' });
  }
});








router.post('/primary', async (req, res) => {
  try {
    const { email, primarySkill } = req.body;

    const employeeSkills = await EmployeeSkills.findOne({ email });

    if (employeeSkills) {
      const skill = await Skill.findOne({ name: primarySkill.skillName });
      if (skill) {
        primarySkill.skillName = skill.name;
        employeeSkills.primarySkill = primarySkill;
        await employeeSkills.save();
        res.json({ message: 'Primary skill saved successfully.' });
      } else {
        res.status(404).json({ error: 'Skill not found.' });
      }
    } else {
      const newEmployeeSkills = new EmployeeSkills({
        email,
        primarySkill,
      });
      await newEmployeeSkills.save();
      res.json({ message: 'Primary skill saved successfully.' });
    }
  } catch (error) {
    console.error('Error saving primary skill:', error);
    res.status(500).json({ error: 'Failed to save primary skill.' });
  }
});

router.post('/secondary', async (req, res) => {
  try {
    const { email, secondarySkills } = req.body;

    const employeeSkills = await EmployeeSkills.findOne({ email });

    if (employeeSkills) {
      for (const secondarySkill of secondarySkills) {
        const skill = await Skill.findOne({ name: secondarySkill.skillName });
        if (skill) {
          secondarySkill.skillName = skill.name;
        } else {
          res.status(404).json({ error: 'Skill not found.' });
          return;
        }
      }
      employeeSkills.secondarySkills = secondarySkills;
      await employeeSkills.save();
      res.json({ message: 'Secondary skills saved successfully.' });
    } else {
      const newEmployeeSkills = new EmployeeSkills({
        email,
        secondarySkills,
      });
      await newEmployeeSkills.save();
      res.json({ message: 'Secondary skills saved successfully.' });
    }
  } catch (error) {
    console.error('Error saving secondary skills:', error);
    res.status(500).json({ error: 'Failed to save secondary skills.' });
  }
});

module.exports = router;
