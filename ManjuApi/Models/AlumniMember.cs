namespace ManjuApi.Models;

public class AlumniMember
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Initials { get; set; } = "";
    public string Color { get; set; } = "";
    public string Institute { get; set; } = "";
    public string Batch { get; set; } = "";
    public string Role { get; set; } = "";
    public int Mutual { get; set; }
}
