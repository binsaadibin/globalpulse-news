import mongoose from 'mongoose';

async function seed() {
  // Replace with your MongoDB Atlas connection string
  await mongoose.connect('mongodb+srv://golbalnews:zulfiqar4455@globalnews.yhhmhpy.mongodb.net/');
  
  const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String,
    role: String
  }));
  
  await User.deleteMany({});
  
  const users = [
    { username: 'admin1', password: 'admin123', role: 'admin' },
    { username: 'admin2', password: 'admin456', role: 'admin' },
    { username: 'editor1', password: 'editor123', role: 'editor' },
  ];
  
  for (const user of users) {
    await User.create(user);
    console.log(`Created: ${user.username}`);
  }
  
  console.log('Seeding complete!');
  process.exit();
}

seed();