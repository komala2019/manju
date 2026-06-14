using System.Net;
using System.Net.Mail;

namespace ManjuApi.Services;

public class EmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendReferralInviteAsync(string alumniEmail, string alumniName, string jobRole, string companyName, string referrerName)
    {
        try
        {
            // For MVP, just log to console/file. In production, use SendGrid/AWS SES/Mailgun
            _logger.LogInformation(
                "[Email] Referral invite sent to {Alumni} ({Email}) from {Referrer} for {JobRole} at {Company}",
                alumniName, alumniEmail, referrerName, jobRole, companyName
            );

            // Simulate email delay
            await Task.Delay(100);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send referral email to {Email}", alumniEmail);
        }
    }

    public async Task SendApplicationConfirmationAsync(string candidateEmail, string candidateName, string jobRole, string companyName)
    {
        try
        {
            _logger.LogInformation(
                "[Email] Application confirmation sent to {Name} ({Email}) for {JobRole} at {Company}",
                candidateName, candidateEmail, jobRole, companyName
            );
            await Task.Delay(50);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send confirmation email to {Email}", candidateEmail);
        }
    }
}
