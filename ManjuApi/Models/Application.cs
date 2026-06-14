namespace ManjuApi.Models;

public class Application
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string JobId { get; set; } = "";
    public string Stage { get; set; } = "Applied";
    public string AppliedAt { get; set; } = "";
    public string CoverNote { get; set; } = "";
    public string Referrals { get; set; } = "[]"; // JSON TEXT — array of alumni names
}
