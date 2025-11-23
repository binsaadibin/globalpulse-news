// In the login function, add this check after finding the user:
export var login = function (req, res) {
    try {
        var _a = req.body, username_1 = _a.username, password = _a.password;
        console.log('🔐 Login attempt:', username_1);
        var user = users.find(function (u) { return u.username === username_1; });
        if (!user) {
            console.log('❌ User not found:', username_1);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        // ADD THIS CHECK - Prevent inactive users from logging in
        if (!user.isActive) {
            console.log('❌ User account is inactive:', username_1);
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact administrator.'
            });
        }
        // ... rest of your existing login code
        var isValidPassword = validatePassword(user.username, password);
        // ... continue with existing code
    }
    catch (error) {
        // ... existing error handling
    }
};
