const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Skill = mongoose.model('Skill');
const EmployeeSkills = mongoose.model('Employeeskills');

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'You must be logged in' });
  }
  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, 'your-secret-key', async (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'You must be logged in' });
    }
    const { userId } = payload;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      req.user = user;
      next();
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Server error' });
    }
  });
};

const checkSkillExists = async (req, res, next) => {
  const { email, primarySkill, secondarySkills } = req.body;
  try {
    const existingSkill = await EmployeeSkills.findOne({ email });
    if (existingSkill) {
      return res.status(400).json({ error: 'Skill already exists for the employee' });
    }
    req.skillExists = false;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const updateSkillsInEmployeeSkill = async (req, res, next) => {
    try {
      const skills = await Skill.find();
      const skillNames = skills.map(skill => skill.name);
      const employees = await EmployeeSkills.find();
      for (const employee of employees) {
        if (employee.primarySkill && !skillNames.includes(employee.primarySkill.toString())) {
          employee.primarySkill = null;
        }
        employee.secondarySkills = employee.secondarySkills.filter(skill =>
          skillNames.includes(skill.toString())
        );
        await employee.save();
      }
      next();
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Server error' });
    }
  };
  
  module.exports = { authMiddleware, checkSkillExists, updateSkillsInEmployeeSkill };