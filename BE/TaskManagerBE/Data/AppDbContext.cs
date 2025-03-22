using Microsoft.EntityFrameworkCore;
using TaskManagerBE.Models;

namespace TaskManagerBE.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    }
}
