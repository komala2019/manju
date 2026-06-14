namespace ManjuApi.Models;

public class ReferralRequest
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string AlumniName { get; set; } = "";
    public string Company { get; set; } = "";
    public string JobId { get; set; } = "";
    public string State { get; set; } = "pending"; // pending | accepted | viewed | replied
    public string CreatedAt { get; set; } = "";
}
