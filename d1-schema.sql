-- D1 (SQLite) schema converted from supabase-schema.sql
-- Users
CREATE TABLE Users (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Email TEXT NOT NULL,
    PasswordHash TEXT NOT NULL,
    Name TEXT NOT NULL DEFAULT '',
    First TEXT NOT NULL DEFAULT '',
    Last TEXT NOT NULL DEFAULT '',
    Title TEXT NOT NULL DEFAULT '',
    Current TEXT NOT NULL DEFAULT '',
    Institute TEXT NOT NULL DEFAULT '',
    InstituteShort TEXT NOT NULL DEFAULT '',
    Batch TEXT NOT NULL DEFAULT '',
    Location TEXT NOT NULL DEFAULT '',
    AvatarColor TEXT NOT NULL DEFAULT '',
    Completeness INTEGER NOT NULL DEFAULT 0,
    Experience TEXT NOT NULL DEFAULT '[]',
    Education TEXT NOT NULL DEFAULT '[]',
    Skills TEXT NOT NULL DEFAULT '[]',
    Preferences TEXT NOT NULL DEFAULT '{}',
    Role TEXT NOT NULL DEFAULT 'candidate',
    RecruiterCompany TEXT,
    CreatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IX_Users_Email ON Users (Email);

-- Jobs
CREATE TABLE Jobs (
    Id TEXT PRIMARY KEY,
    Role TEXT NOT NULL,
    Company TEXT NOT NULL,
    LogoColor TEXT NOT NULL DEFAULT '',
    Location TEXT NOT NULL DEFAULT '',
    Mode TEXT NOT NULL DEFAULT '',
    Exp TEXT NOT NULL DEFAULT '',
    Comp TEXT NOT NULL DEFAULT '',
    Match INTEGER NOT NULL DEFAULT 0,
    Alumni INTEGER NOT NULL DEFAULT 0,
    AlumniInRole INTEGER NOT NULL DEFAULT 0,
    Description TEXT NOT NULL DEFAULT '',
    Responsibilities TEXT NOT NULL DEFAULT '[]',
    Skills TEXT NOT NULL DEFAULT '[]',
    Tags TEXT NOT NULL DEFAULT '[]',
    Team TEXT,
    Posted TEXT NOT NULL DEFAULT ''
);

-- Companies
CREATE TABLE Companies (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL DEFAULT '',
    Open INTEGER NOT NULL DEFAULT 0,
    Color TEXT NOT NULL DEFAULT ''
);

-- Alumni
CREATE TABLE Alumni (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL DEFAULT '',
    Initials TEXT NOT NULL DEFAULT '',
    Color TEXT NOT NULL DEFAULT '',
    Institute TEXT NOT NULL DEFAULT '',
    Batch TEXT NOT NULL DEFAULT '',
    Role TEXT NOT NULL DEFAULT '',
    Mutual INTEGER NOT NULL DEFAULT 0
);

-- SavedJobs
CREATE TABLE SavedJobs (
    UserId INTEGER NOT NULL,
    JobId TEXT NOT NULL,
    PRIMARY KEY (UserId, JobId),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (JobId) REFERENCES Jobs(Id) ON DELETE CASCADE
);
CREATE INDEX IX_SavedJobs_UserId ON SavedJobs (UserId);

-- Applications
CREATE TABLE Applications (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL,
    JobId TEXT NOT NULL,
    Stage TEXT NOT NULL DEFAULT 'Applied',
    AppliedAt TEXT NOT NULL DEFAULT '',
    CoverNote TEXT NOT NULL DEFAULT '',
    Referrals TEXT NOT NULL DEFAULT '[]',
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (JobId) REFERENCES Jobs(Id) ON DELETE CASCADE
);
CREATE INDEX IX_Applications_UserId ON Applications (UserId);
CREATE INDEX IX_Applications_JobId ON Applications (JobId);

-- ReferralRequests
CREATE TABLE ReferralRequests (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL,
    AlumniName TEXT NOT NULL DEFAULT '',
    Company TEXT NOT NULL DEFAULT '',
    JobId TEXT NOT NULL DEFAULT '',
    State TEXT NOT NULL DEFAULT 'pending',
    CreatedAt TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
CREATE INDEX IX_ReferralRequests_UserId ON ReferralRequests (UserId);
CREATE INDEX IX_ReferralRequests_JobId ON ReferralRequests (JobId);

-- RefreshTokens
CREATE TABLE RefreshTokens (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL,
    Token TEXT NOT NULL DEFAULT '',
    ExpiresAt TEXT NOT NULL,
    IsRevoked INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
CREATE INDEX IX_RefreshTokens_UserId ON RefreshTokens (UserId);

-- Seed data will be inserted via d1-seed.sql
