using System.Text.RegularExpressions;

namespace ManjuApi.Services;

public class PasswordValidator
{
    private readonly HashSet<string> _commonPasswords = new(StringComparer.OrdinalIgnoreCase)
    {
        "password", "123456", "qwerty", "abc123", "password123",
        "admin", "letmein", "welcome", "monkey", "1234567",
        "dragon", "master", "sunshine", "princess", "football"
    };

    public (bool IsValid, string Error) Validate(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
            return (false, "Password is required");

        if (password.Length < 8)
            return (false, "Password must be at least 8 characters");

        if (password.Length > 128)
            return (false, "Password must be less than 128 characters");

        // Check for uppercase
        if (!Regex.IsMatch(password, @"[A-Z]"))
            return (false, "Password must contain at least one uppercase letter");

        // Check for lowercase
        if (!Regex.IsMatch(password, @"[a-z]"))
            return (false, "Password must contain at least one lowercase letter");

        // Check for digit
        if (!Regex.IsMatch(password, @"[0-9]"))
            return (false, "Password must contain at least one number");

        // Check for special character
        if (!Regex.IsMatch(password, @"[!@#$%^&*\-_+=\[\]{};:'"",.<>?/\\|`~]"))
            return (false, "Password must contain at least one special character (!@#$%^&*)");

        // Check against common passwords
        if (_commonPasswords.Contains(password))
            return (false, "Password is too common. Please choose a more unique password");

        return (true, "");
    }
}
