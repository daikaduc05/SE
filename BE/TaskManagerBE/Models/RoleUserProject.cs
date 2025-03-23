using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManagerBE.Models
{
    public class RoleUserProject
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        [ForeignKey("Role")]
        public int RoleId { get; set; }

        [ForeignKey("Project")]
        public int ProjectId { get; set; }

        // Navigation properties
        public User User { get; set; } = null!;
        public Role Role { get; set; } = null!;
        public Project Project { get; set; } = null!;
    }
}