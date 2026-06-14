using System.Text.Json;
using BCrypt.Net;
using ManjuApi.Models;

namespace ManjuApi.Data;

public static class SeedData
{
    static string J(object v) => JsonSerializer.Serialize(v);

    public static readonly Job[] Jobs =
    [
        new()
        {
            Id = "j1", Role = "Head of Product", Company = "Razorpay",
            LogoColor = "#2D6BE4", Location = "Bengaluru", Mode = "Hybrid",
            Exp = "5–8 years", Comp = "₹52–68 LPA", Match = 94,
            Alumni = 12, AlumniInRole = 4, Posted = "2d ago",
            Description = "Own the entire product surface for Razorpay's merchant-facing checkout and payments stack. Work with the CEO on 0→1 products that redefine how India pays.",
            Responsibilities = J(new[]
            {
                "Define and own the product roadmap for checkout and the merchant dashboard",
                "Work with design and engineering to ship at high velocity",
                "Manage a team of 6 PMs across checkout, risk, and analytics",
                "Define pricing and packaging strategy alongside the CEO",
                "Drive OKRs — GMV, activation rate, checkout success rate",
            }),
            Skills = J(new[] { "Product Strategy", "Payments Domain", "Team Leadership", "Data Analysis", "Stakeholder Mgmt" }),
            Tags = J(new[] { "Product", "Fintech" }),
            Team = "Reports to CPO · team of 6 PMs + dedicated design pod",
        },
        new()
        {
            Id = "j2", Role = "Staff Engineer – Infra", Company = "Flipkart",
            LogoColor = "#F7941D", Location = "Bengaluru", Mode = "Hybrid",
            Exp = "5–8 years", Comp = "₹70–90 LPA", Match = 88,
            Alumni = 9, AlumniInRole = 2, Posted = "4d ago",
            Description = "Lead the platform infrastructure work underpinning Flipkart's sale traffic — 100M+ concurrent users. Architect solutions for reliability, performance and cost.",
            Responsibilities = J(new[]
            {
                "Architect and lead distributed systems work across compute and storage",
                "Drive reliability engineering — SLOs, error budgets, runbooks",
                "Mentor 4–6 senior engineers; run hiring loops",
                "Partner with product to make infra a competitive advantage",
                "Own cost optimisation initiatives — ₹20Cr+ savings annually",
            }),
            Skills = J(new[] { "Distributed Systems", "Kubernetes", "Go", "System Design", "SRE" }),
            Tags = J(new[] { "Engineering", "Infrastructure" }),
            Team = "Reports to VP Eng · works across Platform, Search and Supply-chain pods",
        },
        new()
        {
            Id = "j3", Role = "VP – Strategy & Operations", Company = "Goldman Sachs",
            LogoColor = "#0A3B6B", Location = "Mumbai", Mode = "On-site",
            Exp = "8+ years", Comp = "₹90 LPA–1.2 Cr", Match = 81,
            Alumni = 7, AlumniInRole = 1, Posted = "1w ago",
            Description = "Drive strategic initiatives across GS India's technology and operations division. Partner with global leadership on market expansion and efficiency programs.",
            Responsibilities = J(new[]
            {
                "Own strategic planning cycle for India technology division (2000+ headcount)",
                "Lead 3–5 cross-functional transformation programs simultaneously",
                "Build board-level presentations and executive briefings",
                "Drive vendor and partner relationships — $50M+ spend portfolio",
                "Coach and develop a team of 8 analysts and associates",
            }),
            Skills = J(new[] { "Strategy", "Financial Modelling", "Executive Communication", "Program Management", "Consulting" }),
            Tags = J(new[] { "Strategy", "Finance" }),
            Team = "Reports to MD Operations India · matrix to Global COO office",
        },
        new()
        {
            Id = "j4", Role = "Engagement Manager", Company = "McKinsey",
            LogoColor = "#1C1C4E", Location = "Pan-India", Mode = "Hybrid",
            Exp = "3–5 years", Comp = "₹48–60 LPA", Match = 76,
            Alumni = 21, AlumniInRole = 8, Posted = "3d ago",
            Description = "Lead client-facing project teams on strategy and digital transformation engagements. McKinsey India's fastest-growing practice — tech, fintech and consumer sectors.",
            Responsibilities = J(new[]
            {
                "Lead day-to-day client delivery on 2–3 concurrent engagements",
                "Manage teams of 3–5 consultants and business analysts",
                "Build trusted advisor relationships with C-suite clients",
                "Contribute to practice development and thought leadership",
                "Drive proposals and account development",
            }),
            Skills = J(new[] { "Problem Solving", "Client Management", "Team Leadership", "PowerPoint", "Financial Modelling" }),
            Tags = J(new[] { "Strategy", "Consulting" }),
            Team = "Reports to Associate Partner · McKinsey India Digital practice",
        },
        new()
        {
            Id = "j5", Role = "Senior Product Manager", Company = "Zerodha",
            LogoColor = "#387ED1", Location = "Bengaluru", Mode = "Remote",
            Exp = "3–5 years", Comp = "₹42–55 LPA", Match = 72,
            Alumni = 4, AlumniInRole = 2, Posted = "5d ago",
            Description = "Own the trader experience on Kite — India's most-used trading platform. Work in a small high-trust team. No bureaucracy, full ownership.",
            Responsibilities = J(new[]
            {
                "Own and evolve the Kite web and mobile trading experience",
                "Deeply understand retail trader mental models and workflows",
                "Define and ship 0→1 features — options analytics, portfolio intelligence",
                "Work directly with the founder on product direction",
                "Drive data analysis on trading patterns and feature adoption",
            }),
            Skills = J(new[] { "Product Management", "Financial Markets", "UX Thinking", "SQL", "Trader Domain" }),
            Tags = J(new[] { "Product", "Fintech" }),
            Team = "Small flat team — reports to Founder · 0 layers",
        },
        new()
        {
            Id = "j6", Role = "Engineering Manager", Company = "Swiggy",
            LogoColor = "#FC8019", Location = "Bengaluru", Mode = "Hybrid",
            Exp = "5–8 years", Comp = "₹65–85 LPA", Match = 69,
            Alumni = 6, AlumniInRole = 1, Posted = "1w ago",
            Description = "Lead Swiggy's consumer app engineering team — 50M MAU. Drive the quarterly roadmap across Android, iOS and backend. Hire, grow, and retain top talent.",
            Responsibilities = J(new[]
            {
                "Manage a team of 12 engineers across Android, iOS and backend",
                "Define team roadmap in partnership with product and design",
                "Drive hiring — 4 open roles in your first quarter",
                "Run engineering excellence initiatives — velocity, quality, oncall",
                "Partner with Data Science on personalisation features",
            }),
            Skills = J(new[] { "Engineering Management", "Android/iOS", "System Design", "Hiring", "Agile" }),
            Tags = J(new[] { "Engineering", "Consumer" }),
            Team = "Reports to Director of Engineering · Consumer Platform",
        },
        new()
        {
            Id = "j7", Role = "Head of Growth", Company = "CRED",
            LogoColor = "#1A1A2E", Location = "Bengaluru", Mode = "Hybrid",
            Exp = "5–8 years", Comp = "₹58–78 LPA", Match = 65,
            Alumni = 5, AlumniInRole = 1, Posted = "6d ago",
            Description = "Own CRED's member growth and engagement funnel end-to-end. High-trust role with direct access to founders. Work at the intersection of product, data and brand.",
            Responsibilities = J(new[]
            {
                "Own member acquisition — paid, organic, referral channels",
                "Define and run growth experiments at scale — 10M+ member base",
                "Work with brand and creative on campaign strategy",
                "Build and lead a team of 5 growth PMs and analysts",
                "Drive cohort retention and engagement metrics",
            }),
            Skills = J(new[] { "Growth Hacking", "Performance Marketing", "Product Analytics", "A/B Testing", "CRM" }),
            Tags = J(new[] { "Product", "Marketing" }),
            Team = "Reports to Co-founder · Growth pod",
        },
        new()
        {
            Id = "j8", Role = "Product Lead – Commerce", Company = "Tata Digital",
            LogoColor = "#0032A0", Location = "Mumbai", Mode = "On-site",
            Exp = "3–5 years", Comp = "₹44–58 LPA", Match = 62,
            Alumni = 3, AlumniInRole = 1, Posted = "2w ago",
            Description = "Define the next chapter for Tata Neu's commerce experience — grocery, fashion, electronics. Work with India's most iconic brand to build a super-app that matters.",
            Responsibilities = J(new[]
            {
                "Own product vision and roadmap for Tata Neu commerce verticals",
                "Lead a team of 3 PMs and 1 UX researcher",
                "Drive integration strategy across Tata group portfolio",
                "Define success metrics and own the P&L impact",
                "Work with tech leads to architect scalable commerce platform",
            }),
            Skills = J(new[] { "Product Management", "E-commerce", "Retail Domain", "Roadmap Planning", "Stakeholder Mgmt" }),
            Tags = J(new[] { "Product", "E-commerce" }),
            Team = "Reports to VP Product · Tata Digital Mumbai HQ",
        },
    ];

    public static readonly Company[] Companies =
    [
        new() { Name = "Razorpay",      Open = 8,  Color = "#2D6BE4" },
        new() { Name = "Flipkart",      Open = 14, Color = "#F7941D" },
        new() { Name = "Goldman Sachs", Open = 5,  Color = "#0A3B6B" },
        new() { Name = "McKinsey",      Open = 11, Color = "#1C1C4E" },
        new() { Name = "Zerodha",       Open = 3,  Color = "#387ED1" },
        new() { Name = "Swiggy",        Open = 9,  Color = "#FC8019" },
        new() { Name = "CRED",          Open = 6,  Color = "#1A1A2E" },
        new() { Name = "Tata Digital",  Open = 7,  Color = "#0032A0" },
        new() { Name = "Ola",           Open = 4,  Color = "#25B847" },
        new() { Name = "Groww",         Open = 6,  Color = "#5367FF" },
        new() { Name = "PhonePe",       Open = 9,  Color = "#5F259F" },
        new() { Name = "Meesho",        Open = 5,  Color = "#F43397" },
    ];

    public static readonly AlumniMember[] Alumni =
    [
        new()
        {
            Name = "Rohan Mehta", Initials = "RM", Color = "#4A90D9",
            Institute = "IIT Bombay", Batch = "'14", Role = "Senior PM @ Razorpay", Mutual = 8,
        },
        new()
        {
            Name = "Priya Iyer", Initials = "PI", Color = "#E67E22",
            Institute = "IIM Bangalore", Batch = "'16", Role = "Engagement Manager @ McKinsey", Mutual = 5,
        },
        new()
        {
            Name = "Aditya Rao", Initials = "AR", Color = "#27AE60",
            Institute = "IIT Delhi", Batch = "'15", Role = "Staff SWE @ Flipkart", Mutual = 3,
        },
    ];

    public static readonly User DemoUser = new()
    {
        Id = 1,
        Email = "arjun@iitbombay.ac.in",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("demo123"), // password: demo123
        Name = "Arjun Sharma", First = "Arjun", Last = "Sharma",
        Title = "Senior Software Engineer", Current = "Flipkart",
        Institute = "IIT Bombay", InstituteShort = "IIT B", Batch = "'18",
        Location = "Bengaluru", AvatarColor = "#2970FF", Completeness = 72,
        Experience = J(new[]
        {
            new { role = "Senior Software Engineer", company = "Flipkart", loc = "Bengaluru", dates = "2021 – present", desc = "Tech lead on the relevance and ranking team. Own search personalisation for 200M+ catalogue items across 50M MAU." },
            new { role = "SDE-2", company = "Ola", loc = "Bengaluru", dates = "2019 – 2021", desc = "Backend services for the driver allocation and surge pricing systems. Reduced allocation latency by 38%." },
            new { role = "SDE-1", company = "Freshworks", loc = "Chennai", dates = "2018 – 2019", desc = "Full-stack feature development on Freshdesk's ticket management module." },
        }),
        Education = J(new[]
        {
            new { school = "IIT Bombay", degree = "B.Tech Computer Science", dates = "2014 – 2018", detail = "CGPA 8.7 · Core team, E-Cell · TA for Algorithms" },
            new { school = "Kendriya Vidyalaya No. 1", degree = "Class XII · PCM", dates = "2012 – 2014", detail = "96.4% · City rank 3 in JEE Advanced" },
        }),
        Skills = J(new[]
        {
            "Product Thinking", "System Design", "Python", "Go", "Distributed Systems",
            "SQL", "Kafka", "Redis", "gRPC", "ML Basics",
        }),
        Preferences = J(new
        {
            roles = new[] { "Head of Engineering", "Staff Engineer", "Engineering Manager" },
            locations = new[] { "Bengaluru", "Remote", "Mumbai" },
            comp = "₹70–100 LPA",
        }),
    };

    public static readonly User AdminUser = new()
    {
        Id = 2,
        Email = "admin@manju.in",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
        Name = "Admin", First = "Admin", Last = "",
        Title = "Platform Admin", AvatarColor = "#101828",
        Role = "admin", Completeness = 100,
        Experience = "[]", Education = "[]", Skills = "[]",
        Preferences = "{\"roles\":[],\"locations\":[],\"comp\":\"\"}",
    };

    public static readonly User[] RecruiterUsers =
    [
        new() {
            Id = 3, Email = "recruiter@swiggy.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("recruiter123"),
            Name = "Swiggy Recruiter", First = "Swiggy", Last = "Recruiter",
            Title = "Talent Acquisition", AvatarColor = "#FC8019",
            Role = "recruiter", RecruiterCompany = "Swiggy",
            Completeness = 100, Experience = "[]", Education = "[]", Skills = "[]",
            Preferences = "{\"roles\":[],\"locations\":[],\"comp\":\"\"}",
        },
        new() {
            Id = 4, Email = "recruiter@flipkart.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("recruiter123"),
            Name = "Flipkart Recruiter", First = "Flipkart", Last = "Recruiter",
            Title = "Talent Acquisition", AvatarColor = "#F7941D",
            Role = "recruiter", RecruiterCompany = "Flipkart",
            Completeness = 100, Experience = "[]", Education = "[]", Skills = "[]",
            Preferences = "{\"roles\":[],\"locations\":[],\"comp\":\"\"}",
        },
        new() {
            Id = 5, Email = "recruiter@razorpay.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("recruiter123"),
            Name = "Razorpay Recruiter", First = "Razorpay", Last = "Recruiter",
            Title = "Talent Acquisition", AvatarColor = "#2D6BE4",
            Role = "recruiter", RecruiterCompany = "Razorpay",
            Completeness = 100, Experience = "[]", Education = "[]", Skills = "[]",
            Preferences = "{\"roles\":[],\"locations\":[],\"comp\":\"\"}",
        },
    ];

    // Default saved job IDs for demo user
    public static readonly SavedJob[] SavedJobs =
    [
        new() { UserId = 1, JobId = "j2" },
        new() { UserId = 1, JobId = "j4" },
        new() { UserId = 1, JobId = "j7" },
    ];

    // Default applications for demo user
    public static readonly Application[] Applications =
    [
        new() { UserId = 1, JobId = "j1", Stage = "Interviewing",  AppliedAt = "2026-05-20", CoverNote = "sample", Referrals = J(new[] { "Rohan Mehta" }) },
        new() { UserId = 1, JobId = "j3", Stage = "In review",     AppliedAt = "2026-05-19", CoverNote = "sample", Referrals = J(new[] { "Priya Iyer" }) },
        new() { UserId = 1, JobId = "j6", Stage = "Applied",       AppliedAt = "2026-05-22", CoverNote = "sample", Referrals = J(Array.Empty<string>()) },
        new() { UserId = 1, JobId = "j8", Stage = "Applied",       AppliedAt = "2026-05-23", CoverNote = "sample", Referrals = J(Array.Empty<string>()) },
    ];

    // Default referral requests for demo user
    public static readonly ReferralRequest[] ReferralRequests =
    [
        new() { UserId = 1, AlumniName = "Rohan Mehta", Company = "Razorpay",  JobId = "j1", State = "accepted", CreatedAt = "2h" },
        new() { UserId = 1, AlumniName = "Priya Iyer",  Company = "McKinsey",  JobId = "j4", State = "viewed",   CreatedAt = "5h" },
        new() { UserId = 1, AlumniName = "Aditya Rao",  Company = "Flipkart",  JobId = "j2", State = "replied",  CreatedAt = "2d" },
    ];
}
