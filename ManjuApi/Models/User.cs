namespace ManjuApi.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string Name { get; set; } = "";
    public string First { get; set; } = "";
    public string Last { get; set; } = "";
    public string Title { get; set; } = "";
    public string Current { get; set; } = "";
    public string Institute { get; set; } = "";
    public string InstituteShort { get; set; } = "";
    public string Batch { get; set; } = "";
    public string Location { get; set; } = "";
    public string AvatarColor { get; set; } = "";
    public int Completeness { get; set; }
    public string Experience { get; set; } = "[]";   // JSON TEXT
    public string Education { get; set; } = "[]";    // JSON TEXT
    public string Skills { get; set; } = "[]";       // JSON TEXT
    public string Preferences { get; set; } = "{}";  // JSON TEXT
    public string Role { get; set; } = "candidate";  // candidate | recruiter | admin
    public string? RecruiterCompany { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
