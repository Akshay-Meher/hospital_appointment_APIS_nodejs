'use strict';

const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const specialties = ['Gynecologist', 'Dermatologist', 'Pediatrician', 'Neurologist', 'Gastroenterologist'];
    const indianNames = [
      { first: 'Amit', last: 'Sharma' },
      { first: 'Priya', last: 'Verma' },
      { first: 'Rahul', last: 'Kapoor' },
      { first: 'Neha', last: 'Iyer' },
      { first: 'Ravi', last: 'Mehta' },
      { first: 'Sonia', last: 'Nair' },
      { first: 'Vikram', last: 'Rao' },
      { first: 'Kavita', last: 'Singh' },
      { first: 'Manoj', last: 'Joshi' },
      { first: 'Anjali', last: 'Patel' }
    ];

    const doctors = [];

    for (let i = 0; i < indianNames.length; i++) {
      const name = indianNames[i];
      const email = `${name.first.toLowerCase()}.${name.last.toLowerCase()}@example.com`;
      const hashedPassword = await bcrypt.hash('password123', 10);

      doctors.push({
        name: name.first,
        last_name: name.last,
        email,
        password: hashedPassword,
        phone: `+91${Math.floor(9000000000 + Math.random() * 1000000000)}`, // Generates a random Indian phone number
        specialization: specialties[i % specialties.length],
        license_number: `LIC${10000 + i}`, // Unique license number
        years_of_experience: Math.floor(Math.random() * 20) + 1, // Random experience between 1-20 years
        gender: i % 2 === 0 ? 'Male' : 'Female',
        profile_image: null,
        degree: 'MBBS, MD',
        about: 'Experienced and well-qualified doctor specializing in ' + specialties[i % specialties.length],
        fees: (Math.floor(Math.random() * 500) + 500).toFixed(2), // Random fee between 500-1000 INR
        is_deleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Ensure no duplicates are inserted
    await queryInterface.bulkInsert('Doctors', doctors, {
      ignoreDuplicates: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Doctors', {
      email: {
        [Op.like]: '%@example.com'
      }
    });
  }
};


















// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add seed commands here.
//      *
//      * Example:
//      * await queryInterface.bulkInsert('People', [{
//      *   name: 'John Doe',
//      *   isBetaMember: false
//      * }], {});
//     */
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */
//   }
// };
