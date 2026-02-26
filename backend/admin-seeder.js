const adminDetails = require("./models/details/admin-details.model");
const connectToMongo = require("./database/db");
const mongoose = require("mongoose");

const seedData = async () => {
  try {
    await connectToMongo();

    // Clear existing admin data
    await adminDetails.deleteMany({});

    const password = "admin123";
    const employeeId = 123456;

    const adminDetail = {
      employeeId: employeeId,
      firstName: "Tatikonda",
      middleName: "Venkata",
      lastName: "Sravya",
      email: "tatikondasravya9@gmail.com",
      phone: "1234567890",
      profile: "profile.jpeg",
      address: "Vn puram,2nd lane",
      city: "Podili",
      state: "Andhra Pradesh",
      pincode: "523240",
      country: "India",
      gender: "female",
      dob: new Date("2004-04-12"),
      designation: "Student",
      joiningDate: new Date(),
      salary: 50000,
      status: "active",
      isSuperAdmin: true,
      emergencyContact: {
        name: "Emergency Contact",
        relationship: "Spouse",
        phone: "9876543210",
      },
      bloodGroup: "O+",
      password: password,
    };

    await adminDetails.create(adminDetail);

    console.log("\n=== Admin Credentials ===");
    console.log("Employee ID:", employeeId);
    console.log("Password:", password);
    console.log("Email:", adminDetail.email);
    console.log("=======================\n");
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error while seeding:", error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

seedData();
