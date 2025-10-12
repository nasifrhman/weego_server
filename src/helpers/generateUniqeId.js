// // Function to generate a custom shipping ID
// const generateUniqeId = () => {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let id = '#'; // Start with #
//     for (let i = 0; i < 5; i++) { // Generate 5 random characters
//       id += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//     return id;
//   };



// Function to generate a numeric referral code
const generateReferralCode = () => {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) { 
    code += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return code;
};

module.exports = generateReferralCode;


  