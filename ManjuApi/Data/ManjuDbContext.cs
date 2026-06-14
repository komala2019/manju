using Microsoft.EntityFrameworkCore;
using ManjuApi.Models;

namespace ManjuApi.Data;

public class ManjuDbContext(DbContextOptions<ManjuDbContext> options) : DbContext(options)
{
    public DbSet<Job> Jobs => Set<Job>();
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<AlumniMember> Alumni => Set<AlumniMember>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Application> Applications => Set<Application>();
    public DbSet<SavedJob> SavedJobs => Set<SavedJob>();
    public DbSet<ReferralRequest> ReferralRequests => Set<ReferralRequest>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        // SavedJob composite key
        mb.Entity<SavedJob>().HasKey(s => new { s.UserId, s.JobId });

        // User constraints
        mb.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Application indexes for faster queries
        mb.Entity<Application>()
            .HasIndex(a => a.UserId);
        mb.Entity<Application>()
            .HasIndex(a => a.JobId);

        // SavedJob indexes
        mb.Entity<SavedJob>()
            .HasIndex(s => s.UserId);

        // ReferralRequest indexes
        mb.Entity<ReferralRequest>()
            .HasIndex(r => r.UserId);
        mb.Entity<ReferralRequest>()
            .HasIndex(r => r.JobId);

        // RefreshToken indexes
        mb.Entity<RefreshToken>()
            .HasIndex(t => t.UserId);

        // Foreign key cascade behaviors
        mb.Entity<Application>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        mb.Entity<Application>()
            .HasOne<Job>()
            .WithMany()
            .HasForeignKey(a => a.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        mb.Entity<SavedJob>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        mb.Entity<SavedJob>()
            .HasOne<Job>()
            .WithMany()
            .HasForeignKey(s => s.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        mb.Entity<ReferralRequest>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        mb.Entity<RefreshToken>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
