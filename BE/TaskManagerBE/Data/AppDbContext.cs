using Microsoft.EntityFrameworkCore;
using TaskManagerBE.Models;

namespace TaskManagerBE.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Tasks> Tasks { get; set; } = null!;
        public DbSet<Project> Projects { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<TaskUser> TaskUsers { get; set; } = null!;
        public DbSet<RoleUserProject> RoleUserProjects { get; set; } = null!;
        public DbSet<Notification> Notifications { get; set; } = null!;

    }
}
