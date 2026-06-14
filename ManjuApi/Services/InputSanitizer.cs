using System.Text.RegularExpressions;

namespace ManjuApi.Services;

public class InputSanitizer
{
    /// <summary>
    /// Escapes special characters for SQLite LIKE queries
    /// </summary>
    public static string EscapeLike(string input)
    {
        if (string.IsNullOrEmpty(input))
            return input;

        // Escape SQLite wildcard characters: % and _
        return input.Replace("\\", "\\\\")
                   .Replace("%", "\\%")
                   .Replace("_", "\\_")
                   .Replace("'", "''");
    }

    /// <summary>
    /// Sanitizes file names to prevent directory traversal
    /// </summary>
    public static string SanitizeFileName(string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
            return "file";

        // Remove path separators and null bytes
        var sanitized = Regex.Replace(fileName, @"[^\w\s\-\.]", "");

        // Remove leading dots and slashes
        sanitized = Regex.Replace(sanitized, @"^[\s\.\-/\\]+", "");

        // Limit length
        if (sanitized.Length > 255)
            sanitized = sanitized.Substring(0, 255);

        return sanitized.Length == 0 ? "file" : sanitized;
    }

    /// <summary>
    /// Validates and sanitizes email addresses
    /// </summary>
    public static (bool IsValid, string Sanitized) ValidateEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return (false, "");

        email = email.Trim().ToLowerInvariant();

        // RFC 5322 simplified check
        var emailPattern = @"^[^\s@]+@[^\s@]+\.[^\s@]+$";
        if (!Regex.IsMatch(email, emailPattern))
            return (false, "");

        if (email.Length > 254)
            return (false, "");

        return (true, email);
    }

    /// <summary>
    /// Sanitizes text to prevent XSS in API responses
    /// </summary>
    public static string SanitizeText(string text, int maxLength = 1000)
    {
        if (string.IsNullOrEmpty(text))
            return text;

        // Remove HTML tags
        text = Regex.Replace(text, "<[^>]*>", "");

        // Remove control characters
        text = Regex.Replace(text, @"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "");

        // Limit length
        if (text.Length > maxLength)
            text = text.Substring(0, maxLength);

        return text.Trim();
    }
}
