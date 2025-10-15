const User = require("../modules/User/user.model");
const adminModel = require("../modules/Admin/admin.model");

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ isAdmin: true });
    if (!existingAdmin) {
      const newborn = await User.create({
        fullName: "Admin",
        userName: adminEmail.split("@")[0],
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        currentRole: 'admin',
        isAdmin: true
      });
      await adminModel.create({
        user: newborn._id,
        adminRole: "owner",
        categoryPermissions: "all"
      })
      console.log("✅ Admin user created successfully.");
    } else {
      console.log("✅ Admin user already exists.");
    }
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  }
};


module.exports = {
  seedAdmin
}

