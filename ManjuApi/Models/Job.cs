namespace ManjuApi.Models;

public class Job
{
    public string Id { get; set; } = "";
    public string Role { get; set; } = "";
    public string Company { get; set; } = "";
    public string LogoColor { get; set; } = "";
    public string Location { get; set; } = "";
    public string Mode { get; set; } = "";
    public string Exp { get; set; } = "";
    public string Comp { get; set; } = "";
    public int Match { get; set; }
    public int Alumni { get; set; }
    public int AlumniInRole { get; set; }
    public string Description { get; set; } = "";
    public string Responsibilities { get; set; } = "[]"; // JSON TEXT
    public string Skills { get; set; } = "[]";           // JSON TEXT
    public string Tags { get; set; } = "[]";             // JSON TEXT
    public string? Team { get; set; }
    public string Posted { get; set; } = "";
}
