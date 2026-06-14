namespace ManjuApi.Models;

public record SignInRequest(string Email, string Password);
public record SignUpRequest(string Email, string Password, string Name, string Institute, string Batch, string Location);
public record OtpVerifyRequest(string Email, string Code);
public record GoogleTokenRequest(string IdToken);
public record LinkedInTokenRequest(string IdToken);
public record AuthResponse(string AccessToken, string RefreshToken, object User);
public record RefreshTokenRequest(string RefreshToken);
