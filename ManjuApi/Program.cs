using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ManjuApi.Data;
using ManjuApi.Models;
using ManjuApi.Services;

var builder = WebApplication.CreateBuilder(args);

// JWT configuration - CRITICAL: Must be configured in appsettings.json or env var
var jwtSecret = builder.Configuration["Jwt:SecretKey"];
if (string.IsNullOrEmpty(jwtSecret))
{
    throw new InvalidOperationException(
        "JWT secret key must be configured via appsettings.json or Jwt:SecretKey environment variable. " +
        "Generate a secure key: dotnet user-secrets set 'Jwt:SecretKey' '$(openssl rand -base64 32)'"
    );
}

// SQLite via EF Core
builder.Services.AddDbContext<ManjuDbContext>(opt =>
    opt.UseSqlite("Data Source=manju.db"));

// JWT service
builder.Services.AddSingleton<JwtService>();

// Password validator
builder.Services.AddSingleton<PasswordValidator>();

// JWT authentication
builder.Services
    .AddAuthentication("Bearer")
    .AddJwtBearer(opts =>
    {
        var key = Encoding.UTF8.GetBytes(jwtSecret);
        opts.TokenValidationParameters = new()
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
        };
    });

builder.Services.AddAuthorization();

// Email service for notifications
builder.Services.AddScoped<EmailService>();

// Camel-case JSON to match JS frontend expectations
builder.Services.ConfigureHttpJsonOptions(o =>
    o.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase);

// CORS configuration - restrict to allowed origins
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new[]
{
    "http://localhost:3000",
    "http://localhost:7821",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:7821"
};

builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins(allowedOrigins)
     .AllowAnyHeader()
     .AllowAnyMethod()
     .AllowCredentials()));

var app = builder.Build();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// ─── DB init: migrate + seed on every startup ────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ManjuDbContext>();
    db.Database.EnsureCreated();

    // Schema migration: add Role/RecruiterCompany columns if missing (SQLite doesn't support IF NOT EXISTS)
    try { db.Database.ExecuteSqlRaw("ALTER TABLE Users ADD COLUMN Role TEXT NOT NULL DEFAULT 'candidate'"); } catch { }
    try { db.Database.ExecuteSqlRaw("ALTER TABLE Users ADD COLUMN RecruiterCompany TEXT"); } catch { }

    if (!db.Jobs.Any())
    {
        db.Jobs.AddRange(SeedData.Jobs);
        db.Companies.AddRange(SeedData.Companies);
        db.Alumni.AddRange(SeedData.Alumni);
        db.Users.Add(SeedData.DemoUser);
        db.SaveChanges(); // Flush so FKs resolve before dependents

        db.SavedJobs.AddRange(SeedData.SavedJobs);
        db.Applications.AddRange(SeedData.Applications);
        db.ReferralRequests.AddRange(SeedData.ReferralRequests);
        db.SaveChanges();
    }

    // Ensure admin and recruiter seed users exist (safe to run on existing DBs)
    if (!db.Users.Any(u => u.Email == "admin@manju.in"))
    {
        db.Users.Add(SeedData.AdminUser);
        db.SaveChanges();
    }
    if (!db.Users.Any(u => u.Email == "recruiter@swiggy.com"))
    {
        db.Users.AddRange(SeedData.RecruiterUsers);
        db.SaveChanges();
    }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
var userResumes = new Dictionary<int, (string FileName, byte[] Bytes)>();

T[] Arr<T>(string json) =>
    JsonSerializer.Deserialize<T[]>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? [];

object JobDto(Job j) => new
{
    j.Id, j.Role, j.Company, j.LogoColor, j.Location, j.Mode,
    j.Exp, j.Comp, j.Match, j.Alumni, j.AlumniInRole, j.Description, j.Team, j.Posted,
    responsibilities = Arr<string>(j.Responsibilities),
    skills            = Arr<string>(j.Skills),
    tags              = Arr<string>(j.Tags),
};

object UserDto(User u) => new
{
    u.Id, u.Email, u.Name, u.First, u.Last, u.Title, u.Current,
    u.Institute, u.InstituteShort, u.Batch, u.Location,
    u.AvatarColor, u.Completeness, u.Role, u.RecruiterCompany,
    experience  = JsonSerializer.Deserialize<object[]>(u.Experience) ?? [],
    education   = JsonSerializer.Deserialize<object[]>(u.Education) ?? [],
    skills      = Arr<string>(u.Skills),
    preferences = JsonSerializer.Deserialize<object>(u.Preferences) ?? new { roles = new string[] {}, locations = new string[] {}, comp = "" },
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────
app.MapPost("/api/auth/login", async (ManjuDbContext db, JwtService jwt, SignInRequest req) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
    if (user is null || string.IsNullOrEmpty(user.PasswordHash) || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
        return Results.Unauthorized();

    var accessToken = jwt.GenerateAccessToken(user.Id, user.Email, user.Name);
    var refreshToken = jwt.GenerateRefreshToken();

    db.RefreshTokens.Add(new RefreshToken
    {
        UserId = user.Id,
        Token = refreshToken,
        ExpiresAt = DateTime.UtcNow.AddDays(7),
    });
    await db.SaveChangesAsync();

    return Results.Ok(new AuthResponse(accessToken, refreshToken, UserDto(user)));
});

app.MapPost("/api/auth/signup", async (ManjuDbContext db, JwtService jwt, PasswordValidator validator, SignUpRequest req) =>
{
    if (string.IsNullOrEmpty(req.Email) || string.IsNullOrEmpty(req.Password))
        return Results.BadRequest(new { error = "Email and Password are required." });

    // Validate email format
    var (isValidEmail, sanitizedEmail) = InputSanitizer.ValidateEmail(req.Email);
    if (!isValidEmail)
        return Results.BadRequest(new { error = "Invalid email format." });

    // Validate password strength
    var (isValidPassword, passwordError) = validator.Validate(req.Password);
    if (!isValidPassword)
        return Results.BadRequest(new { error = passwordError });

    if (await db.Users.AnyAsync(u => u.Email == sanitizedEmail))
        return Results.BadRequest(new { error = "User with this email already exists." });

    var passwordHash = BCrypt.Net.BCrypt.HashPassword(req.Password);
    var firstLast = req.Name.Split(' ', 2);
    string first = firstLast.Length > 0 ? firstLast[0] : "";
    string last = firstLast.Length > 1 ? firstLast[1] : "";

    string[] colors = ["#C84B31", "#E6843D", "#3A2618", "#6B8B47", "#2D6BE4", "#25B847", "#5F259F"];
    string avatarColor = colors[Math.Abs(req.Email.GetHashCode()) % colors.Length];

    var user = new User
    {
        Email = sanitizedEmail,
        PasswordHash = passwordHash,
        Name = InputSanitizer.SanitizeText(req.Name, 100),
        First = first,
        Last = last,
        Title = "Alumnus / Member",
        Current = "",
        Institute = string.IsNullOrEmpty(req.Institute) ? "IIT Bombay" : req.Institute,
        InstituteShort = string.IsNullOrEmpty(req.Institute) ? "IIT B" : (req.Institute.Length > 5 ? req.Institute.Substring(0, 5) : req.Institute),
        Batch = string.IsNullOrEmpty(req.Batch) ? "2018" : req.Batch,
        Location = string.IsNullOrEmpty(req.Location) ? "Bengaluru" : req.Location,
        AvatarColor = avatarColor,
        Completeness = 30,
        Experience = "[]",
        Education = "[]",
        Skills = "[]",
        Preferences = "{\"roles\":[],\"locations\":[],\"comp\":\"\"}"
    };

    db.Users.Add(user);
    await db.SaveChangesAsync();

    var accessToken = jwt.GenerateAccessToken(user.Id, user.Email, user.Name);
    var refreshToken = jwt.GenerateRefreshToken();

    db.RefreshTokens.Add(new RefreshToken
    {
        UserId = user.Id,
        Token = refreshToken,
        ExpiresAt = DateTime.UtcNow.AddDays(7),
    });
    await db.SaveChangesAsync();

    return Results.Ok(new AuthResponse(accessToken, refreshToken, UserDto(user)));
});

app.MapPost("/api/auth/refresh", async (ManjuDbContext db, JwtService jwt, RefreshTokenRequest req) =>
{
    var token = await db.RefreshTokens.FirstOrDefaultAsync(t => t.Token == req.RefreshToken && !t.IsRevoked);
    if (token is null || token.ExpiresAt < DateTime.UtcNow)
        return Results.Unauthorized();

    var user = await db.Users.FindAsync(token.UserId);
    if (user is null) return Results.NotFound();

    var newAccessToken = jwt.GenerateAccessToken(user.Id, user.Email, user.Name);
    return Results.Ok(new { accessToken = newAccessToken, refreshToken = req.RefreshToken });
});

app.MapPost("/api/auth/logout", async (ManjuDbContext db, HttpContext context) =>
{
    var userIdClaim = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
    if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
        return Results.Unauthorized();

    // Revoke all refresh tokens for this user
    var tokens = await db.RefreshTokens.Where(t => t.UserId == userId && !t.IsRevoked).ToListAsync();
    foreach (var token in tokens)
    {
        token.IsRevoked = true;
    }
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Logged out successfully" });
}).RequireAuthorization();

app.MapPost("/api/auth/google", async (ManjuDbContext db, JwtService jwt, GoogleTokenRequest req) =>
{
    string email = "";
    string name = "";

    if (string.IsNullOrEmpty(req.IdToken))
        return Results.BadRequest(new { error = "Token is required" });

    // Development mode: Accept mock tokens ONLY if explicitly enabled
    var isDev = !builder.Environment.IsProduction();
    if (req.IdToken.StartsWith("mock_"))
    {
        if (!isDev)
            return Results.Json(new { error = "Mock tokens not allowed in production" }, statusCode: 401);

        var parts = req.IdToken.Split('|');
        if (parts.Length >= 3)
        {
            email = parts[1];
            name = parts[2];
        }
        else
        {
            return Results.BadRequest(new { error = "Invalid mock token format" });
        }
    }
    else
    {
        // Parse and validate real JWT token from Google
        try
        {
            var handler = new JwtSecurityTokenHandler();
            if (!handler.CanReadToken(req.IdToken))
                return Results.BadRequest(new { error = "Invalid token format" });

            var jwtToken = handler.ReadJwtToken(req.IdToken);

            // Validate issuer
            var issuer = jwtToken.Issuer;
            if (issuer != "https://accounts.google.com" && issuer != "accounts.google.com")
                return Results.Json(new { error = "Invalid token issuer" }, statusCode: 401);

            email = jwtToken.Claims.FirstOrDefault(c => c.Type == "email")?.Value ?? "";
            name = jwtToken.Claims.FirstOrDefault(c => c.Type == "name")?.Value ?? "";

            if (string.IsNullOrEmpty(email))
                return Results.BadRequest(new { error = "Email not found in token" });
        }
        catch (SecurityTokenException ex)
        {
            return Results.Json(new { error = $"Invalid token: {ex.Message}" }, statusCode: 401);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = $"Failed to parse token: {ex.Message}" });
        }
    }

    // Validate email format
    var (isValidEmail, sanitizedEmail) = InputSanitizer.ValidateEmail(email);
    if (!isValidEmail)
        return Results.BadRequest(new { error = "Invalid email from token" });

    email = sanitizedEmail;

    // Check if user exists
    var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
    bool isNewUser = false;
    
    if (user is null)
    {
        isNewUser = true;
        
        // Register new user
        var firstLast = name.Split(' ', 2);
        string first = firstLast.Length > 0 ? firstLast[0] : "";
        string last = firstLast.Length > 1 ? firstLast[1] : "";
        
        // Generate random avatar color
        string[] colors = ["#C84B31", "#E6843D", "#3A2618", "#6B8B47", "#2D6BE4", "#25B847", "#5F259F"];
        string avatarColor = colors[Math.Abs(email.GetHashCode()) % colors.Length];

        user = new User
        {
            Email = email,
            Name = name,
            First = first,
            Last = last,
            Title = "Alumnus / Member",
            Current = "",
            Institute = "IIT Bombay", // Default matching default fallback
            InstituteShort = "IIT B",
            Batch = "2018",
            Location = "Bengaluru",
            AvatarColor = avatarColor,
            Completeness = 30, // Initial profile completeness
            Experience = "[]",
            Education = "[]",
            Skills = "[]",
            Preferences = "{\"roles\":[],\"locations\":[],\"comp\":\"\"}"
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();
    }

    // Generate access & refresh tokens
    var accessToken = jwt.GenerateAccessToken(user.Id, user.Email, user.Name);
    var refreshToken = jwt.GenerateRefreshToken();

    db.RefreshTokens.Add(new RefreshToken
    {
        UserId = user.Id,
        Token = refreshToken,
        ExpiresAt = DateTime.UtcNow.AddDays(7),
    });
    await db.SaveChangesAsync();

    return Results.Ok(new { accessToken, refreshToken, user = UserDto(user), isNewUser });
});

app.MapPost("/api/auth/linkedin", async (ManjuDbContext db, JwtService jwt, LinkedInTokenRequest req) =>
{
    string email = "";
    string name = "";

    if (string.IsNullOrEmpty(req.IdToken))
        return Results.BadRequest(new { error = "Token is required" });

    // Development mode: Accept mock tokens ONLY if explicitly enabled
    var isDev = !builder.Environment.IsProduction();
    if (req.IdToken.StartsWith("mock_linkedin_"))
    {
        if (!isDev)
            return Results.Json(new { error = "Mock tokens not allowed in production" }, statusCode: 401);

        var parts = req.IdToken.Split('|');
        if (parts.Length >= 3)
        {
            email = parts[1];
            name = parts[2];
        }
        else
        {
            return Results.BadRequest(new { error = "Invalid mock token format" });
        }
    }
    else
    {
        // Parse and validate real JWT token from LinkedIn
        try
        {
            var handler = new JwtSecurityTokenHandler();
            if (!handler.CanReadToken(req.IdToken))
                return Results.BadRequest(new { error = "Invalid token format" });

            var jwtToken = handler.ReadJwtToken(req.IdToken);

            // Validate issuer
            var issuer = jwtToken.Issuer;
            if (issuer != "https://www.linkedin.com" && issuer != "linkedin.com")
                return Results.Json(new { error = "Invalid token issuer" }, statusCode: 401);

            email = jwtToken.Claims.FirstOrDefault(c => c.Type == "email")?.Value ?? "";
            name = jwtToken.Claims.FirstOrDefault(c => c.Type == "name")?.Value ?? "";

            if (string.IsNullOrEmpty(email))
                return Results.BadRequest(new { error = "Email not found in token" });
        }
        catch (SecurityTokenException ex)
        {
            return Results.Json(new { error = $"Invalid token: {ex.Message}" }, statusCode: 401);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = $"Failed to parse token: {ex.Message}" });
        }
    }

    // Validate email format
    var (isValidEmail, sanitizedEmail) = InputSanitizer.ValidateEmail(email);
    if (!isValidEmail)
        return Results.BadRequest(new { error = "Invalid email from token" });

    email = sanitizedEmail;

    // Check if user exists
    var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
    bool isNewUser = false;
    
    if (user is null)
    {
        isNewUser = true;
        
        // Register new user
        var firstLast = name.Split(' ', 2);
        string first = firstLast.Length > 0 ? firstLast[0] : "";
        string last = firstLast.Length > 1 ? firstLast[1] : "";
        
        // Generate random avatar color
        string[] colors = ["#C84B31", "#E6843D", "#3A2618", "#6B8B47", "#2D6BE4", "#25B847", "#5F259F"];
        string avatarColor = colors[Math.Abs(email.GetHashCode()) % colors.Length];

        user = new User
        {
            Email = email,
            Name = name,
            First = first,
            Last = last,
            Title = "Alumnus / Member",
            Current = "",
            Institute = "IIT Bombay", // Default matching default fallback
            InstituteShort = "IIT B",
            Batch = "2018",
            Location = "Bengaluru",
            AvatarColor = avatarColor,
            Completeness = 30, // Initial profile completeness
            Experience = "[]",
            Education = "[]",
            Skills = "[]",
            Preferences = "{\"roles\":[],\"locations\":[],\"comp\":\"\"}"
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();
    }

    // Generate access & refresh tokens
    var accessToken = jwt.GenerateAccessToken(user.Id, user.Email, user.Name);
    var refreshToken = jwt.GenerateRefreshToken();

    db.RefreshTokens.Add(new RefreshToken
    {
        UserId = user.Id,
        Token = refreshToken,
        ExpiresAt = DateTime.UtcNow.AddDays(7),
    });
    await db.SaveChangesAsync();

    return Results.Ok(new { accessToken, refreshToken, user = UserDto(user), isNewUser });
});

// ─── JOBS ─────────────────────────────────────────────────────────────────────
app.MapGet("/api/jobs", async (ManjuDbContext db, string? q, string? mode, string? fn) =>
{
    var jobs = db.Jobs.AsQueryable();

    if (!string.IsNullOrWhiteSpace(q))
    {
        var escaped = InputSanitizer.EscapeLike(q);
        jobs = jobs.Where(j => EF.Functions.Like(j.Role, $"%{escaped}%") || EF.Functions.Like(j.Company, $"%{escaped}%"));
    }

    if (!string.IsNullOrWhiteSpace(mode))
    {
        var sanitizedMode = InputSanitizer.SanitizeText(mode, 50);
        jobs = jobs.Where(j => j.Mode == sanitizedMode);
    }

    var list = await jobs.OrderByDescending(j => j.Match).ToListAsync();

    if (!string.IsNullOrWhiteSpace(fn))
        list = list.Where(j => Arr<string>(j.Tags).Contains(fn)).ToList();

    return list.Select(JobDto);
});

app.MapGet("/api/jobs/{id}", async (string id, ManjuDbContext db) =>
    await db.Jobs.FindAsync(id) is Job j ? Results.Ok(JobDto(j)) : Results.NotFound());

app.MapPost("/api/jobs", async (ManjuDbContext db, CreateJobRequest req) =>
{
    var id = "j" + Guid.NewGuid().ToString("N")[..8];
    var job = new Job
    {
        Id = id,
        Role = req.Role,
        Company = req.Company,
        LogoColor = req.LogoColor ?? "#2970FF",
        Location = req.Location ?? "Bengaluru",
        Mode = req.Mode ?? "Hybrid",
        Exp = req.Exp ?? "Open",
        Comp = req.Comp ?? "Competitive",
        Match = 0,
        Alumni = 0,
        AlumniInRole = 0,
        Posted = "just now",
        Description = req.Description ?? "",
        Responsibilities = JsonSerializer.Serialize(req.Responsibilities ?? []),
        Skills = JsonSerializer.Serialize(req.Skills ?? []),
        Tags = JsonSerializer.Serialize(req.Tags ?? []),
        Team = req.Team ?? "",
    };
    db.Jobs.Add(job);
    await db.SaveChangesAsync();
    return Results.Created($"/api/jobs/{job.Id}", JobDto(job));
});

// ─── COMPANIES ────────────────────────────────────────────────────────────────
app.MapGet("/api/companies", async (ManjuDbContext db) =>
    await db.Companies.OrderBy(c => c.Name).ToListAsync());

// ─── ALUMNI ───────────────────────────────────────────────────────────────────
app.MapGet("/api/alumni", async (ManjuDbContext db) =>
    await db.Alumni.ToListAsync());

// ─── USER ─────────────────────────────────────────────────────────────────────
app.MapGet("/api/users/{id:int}", async (int id, ManjuDbContext db) =>
{
    var u = await db.Users.FindAsync(id);
    if (u is null) return Results.NotFound();

    return Results.Ok(UserDto(u));
}).RequireAuthorization();

app.MapPatch("/api/users/{id:int}", async (int id, ManjuDbContext db, UserPatchDto body, HttpContext context) =>
{
    // Verify user is updating their own profile
    var userIdClaim = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
    if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId) || userId != id)
        return Results.Forbid();

    var u = await db.Users.FindAsync(id);
    if (u is null) return Results.NotFound();

    if (body.Name is not null)
    {
        var sanitized = InputSanitizer.SanitizeText(body.Name, 100);
        if (sanitized.Length < 2)
            return Results.BadRequest(new { error = "Name must be at least 2 characters" });
        u.Name = sanitized;
    }

    if (body.Title is not null)
    {
        var sanitized = InputSanitizer.SanitizeText(body.Title, 100);
        u.Title = sanitized;
    }

    if (body.Current is not null)
    {
        var sanitized = InputSanitizer.SanitizeText(body.Current, 100);
        u.Current = sanitized;
    }

    if (body.Location is not null)
    {
        var sanitized = InputSanitizer.SanitizeText(body.Location, 100);
        u.Location = sanitized;
    }

    if (body.Completeness.HasValue)
    {
        if (body.Completeness.Value < 0 || body.Completeness.Value > 100)
            return Results.BadRequest(new { error = "Completeness must be between 0 and 100" });
        u.Completeness = body.Completeness.Value;
    }

    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

app.MapPost("/api/users/{id:int}/resume", async (int id, HttpContext context, ManjuDbContext db) =>
{
    var u = await db.Users.FindAsync(id);
    if (u is null) return Results.NotFound();

    if (!context.Request.HasFormContentType)
        return Results.BadRequest(new { error = "Content-Type must be multipart/form-data" });

    var form = await context.Request.ReadFormAsync();
    var file = form.Files.FirstOrDefault();
    if (file is null || file.Length == 0)
        return Results.BadRequest(new { error = "No file uploaded" });

    // Validate file type
    var allowedTypes = new[] { "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
    if (!allowedTypes.Contains(file.ContentType))
        return Results.BadRequest(new { error = "Only PDF and Word documents are allowed" });

    // Validate file size (max 5MB)
    const long maxSize = 5 * 1024 * 1024;
    if (file.Length > maxSize)
        return Results.BadRequest(new { error = "File size must be less than 5MB" });

    using var ms = new MemoryStream();
    await file.CopyToAsync(ms);
    var bytes = ms.ToArray();

    // Sanitize filename
    var sanitizedFileName = InputSanitizer.SanitizeFileName(file.FileName);

    // Store in dictionary with timestamp (in production, use S3 + encryption)
    userResumes[id] = (sanitizedFileName, bytes);

    u.Completeness = Math.Min(100, u.Completeness + 5);
    await db.SaveChangesAsync();

    return Results.Ok(new { fileName = sanitizedFileName, completeness = u.Completeness });
}).DisableAntiforgery();

app.MapGet("/api/users/{id:int}/resume", async (int id, ManjuDbContext db) =>
{
    var u = await db.Users.FindAsync(id);
    if (u is null) return Results.NotFound();

    if (userResumes.TryGetValue(id, out var resume))
    {
        return Results.File(resume.Bytes, "application/pdf", resume.FileName);
    }

    // No mock fallback - resume must be uploaded
    return Results.NotFound(new { error = "Resume not uploaded. Please upload a resume first." });
});

// ─── SAVED JOBS ───────────────────────────────────────────────────────────────
app.MapGet("/api/users/{userId:int}/saved", async (int userId, ManjuDbContext db) =>
{
    var ids = await db.SavedJobs.Where(s => s.UserId == userId)
                                .Select(s => s.JobId)
                                .ToListAsync();
    return ids;
}).RequireAuthorization();

app.MapPost("/api/users/{userId:int}/saved/{jobId}", async (int userId, string jobId, ManjuDbContext db) =>
{
    if (!await db.SavedJobs.AnyAsync(s => s.UserId == userId && s.JobId == jobId))
    {
        db.SavedJobs.Add(new SavedJob { UserId = userId, JobId = jobId });
        await db.SaveChangesAsync();
    }
    return Results.Ok();
}).RequireAuthorization();

app.MapDelete("/api/users/{userId:int}/saved/{jobId}", async (int userId, string jobId, ManjuDbContext db) =>
{
    var s = await db.SavedJobs.FindAsync(userId, jobId);
    if (s is not null) { db.SavedJobs.Remove(s); await db.SaveChangesAsync(); }
    return Results.NoContent();
}).RequireAuthorization();

// ─── APPLICATIONS ─────────────────────────────────────────────────────────────
app.MapGet("/api/users/{userId:int}/applications", async (int userId, ManjuDbContext db) =>
{
    var apps = await db.Applications.Where(a => a.UserId == userId).ToListAsync();
    return apps.Select(a => new
    {
        a.Id, a.JobId, a.Stage, a.AppliedAt, a.CoverNote,
        referrals = Arr<string>(a.Referrals),
    });
}).RequireAuthorization();

app.MapPost("/api/users/{userId:int}/applications", async (int userId, ManjuDbContext db, EmailService email, ApplicationPostDto body) =>
{
    var app2 = new Application
    {
        UserId    = userId,
        JobId     = body.JobId,
        Stage     = "Applied",
        AppliedAt = DateTime.UtcNow.ToString("yyyy-MM-dd"),
        CoverNote = body.CoverNote ?? "",
        Referrals = JsonSerializer.Serialize(body.Referrals ?? []),
    };
    db.Applications.Add(app2);
    await db.SaveChangesAsync();

    // Send referral emails if referrals were requested
    if (body.Referrals?.Length > 0)
    {
        var job = await db.Jobs.FindAsync(body.JobId);
        var user = await db.Users.FindAsync(userId);

        if (job != null && user != null)
        {
            foreach (var alumniName in body.Referrals)
            {
                var alumni = await db.Alumni.FirstOrDefaultAsync(a => a.Name == alumniName);
                if (alumni != null)
                {
                    // Create referral request record
                    var referralRequest = new ReferralRequest
                    {
                        UserId = userId,
                        AlumniName = alumniName,
                        Company = job.Company,
                        JobId = body.JobId,
                        State = "pending",
                        CreatedAt = "just now",
                    };
                    db.ReferralRequests.Add(referralRequest);

                    // Send email asynchronously (fire-and-forget)
                    _ = email.SendReferralInviteAsync(
                        $"{alumniName.ToLower().Replace(" ", ".")}@alumni.in",
                        alumniName,
                        job.Role,
                        job.Company,
                        user.Name
                    );
                }
            }
            await db.SaveChangesAsync();
        }
    }

    return Results.Created($"/api/users/{userId}/applications/{app2.Id}", new { app2.Id });
}).RequireAuthorization();

app.MapPatch("/api/users/{userId:int}/applications/{jobId}", async (int userId, string jobId, ManjuDbContext db, StagePatchDto body) =>
{
    var a = await db.Applications.FirstOrDefaultAsync(x => x.UserId == userId && x.JobId == jobId);
    if (a is null) return Results.NotFound();

    a.Stage = body.Stage;
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

// ─── REFERRAL REQUESTS ────────────────────────────────────────────────────────
app.MapGet("/api/users/{userId:int}/referrals", async (int userId, ManjuDbContext db) =>
    await db.ReferralRequests.Where(r => r.UserId == userId).ToListAsync()
).RequireAuthorization();

app.MapPost("/api/users/{userId:int}/referrals", async (int userId, ManjuDbContext db, ReferralPostDto body) =>
{
    var r = new ReferralRequest
    {
        UserId    = userId,
        AlumniName = body.AlumniName,
        Company   = body.Company,
        JobId     = body.JobId,
        State     = "pending",
        CreatedAt = "just now",
    };
    db.ReferralRequests.Add(r);
    await db.SaveChangesAsync();
    return Results.Created($"/api/users/{userId}/referrals/{r.Id}", new { r.Id });
}).RequireAuthorization();

// ─── ADMIN ENDPOINTS ─────────────────────────────────────────────────────────
app.MapGet("/api/admin/stats", async (ManjuDbContext db) =>
{
    var usersCount = await db.Users.CountAsync();
    var appsCount = await db.Applications.CountAsync();
    var savedCount = await db.SavedJobs.CountAsync();
    var referralsCount = await db.ReferralRequests.CountAsync();
    var jobsCount = await db.Jobs.CountAsync();

    return Results.Ok(new
    {
        users = usersCount,
        applications = appsCount,
        savedJobs = savedCount,
        referrals = referralsCount,
        jobs = jobsCount
    });
});

app.MapGet("/api/admin/users", async (ManjuDbContext db) =>
{
    var list = await db.Users.ToListAsync();
    return Results.Ok(list.Select(UserDto));
});

app.MapGet("/api/admin/applications", async (ManjuDbContext db) =>
{
    var apps = await db.Applications.ToListAsync();
    var results = new List<object>();
    foreach (var a in apps)
    {
        var user = await db.Users.FindAsync(a.UserId);
        var job = await db.Jobs.FindAsync(a.JobId);
        results.Add(new
        {
            a.Id,
            a.UserId,
            a.JobId,
            a.Stage,
            a.AppliedAt,
            a.CoverNote,
            referrals = Arr<string>(a.Referrals),
            userName = user?.Name ?? "Unknown Candidate",
            userEmail = user?.Email ?? "",
            jobRole = job?.Role ?? "Unknown Role",
            jobCompany = job?.Company ?? "Unknown Company"
        });
    }
    return Results.Ok(results);
});

app.MapGet("/api/admin/referrals", async (ManjuDbContext db) =>
{
    var list = await db.ReferralRequests.ToListAsync();
    return Results.Ok(list);
});

// ─── COMPANY ENDPOINTS ───────────────────────────────────────────────────────
app.MapGet("/api/companies/{companyName}/applications", async (string companyName, ManjuDbContext db) =>
{
    var jobIds = await db.Jobs.Where(j => j.Company.ToLower() == companyName.ToLower())
                              .Select(j => j.Id)
                              .ToListAsync();

    var apps = await db.Applications.Where(a => jobIds.Contains(a.JobId)).ToListAsync();

    var results = new List<object>();
    foreach (var a in apps)
    {
        var user = await db.Users.FindAsync(a.UserId);
        var job = await db.Jobs.FindAsync(a.JobId);
        if (user is not null && job is not null)
        {
            results.Add(new
            {
                a.Id,
                a.UserId,
                a.JobId,
                a.Stage,
                a.AppliedAt,
                a.CoverNote,
                referrals = Arr<string>(a.Referrals),
                user = UserDto(user),
                job = JobDto(job)
            });
        }
    }
    return results;
});

app.Run();

// ─── DTOs ─────────────────────────────────────────────────────────────────────
record UserPatchDto(string? Name, string? Title, string? Current, string? Location, int? Completeness);
record CreateJobRequest(string Role, string Company, string? LogoColor, string? Location, string? Mode, string? Exp, string? Comp, string? Description, string[]? Responsibilities, string[]? Skills, string[]? Tags, string? Team);
record ApplicationPostDto(string JobId, string? CoverNote, string[]? Referrals);
record StagePatchDto(string Stage);
record ReferralPostDto(string AlumniName, string Company, string JobId);
