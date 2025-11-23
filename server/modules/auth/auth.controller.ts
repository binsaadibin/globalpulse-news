// In the login function, add this check after finding the user:
export const login = (req: any, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log('🔐 Login attempt:', username);

    const user = users.find(u => u.username === username);
    
    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // ADD THIS CHECK - Prevent inactive users from logging in
    if (!user.isActive) {
      console.log('❌ User account is inactive:', username);
      return res.status(401).json({ 
        success: false,
        message: 'Account is deactivated. Please contact administrator.' 
      });
    }

    // ... rest of your existing login code
    const isValidPassword = validatePassword(user.username, password);
    // ... continue with existing code
  } catch (error) {
    // ... existing error handling
  }
};