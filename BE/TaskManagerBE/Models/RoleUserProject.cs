using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManagerBE.Models
{
    public class RoleUserProject
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public int User_Id { get; set; }

        [ForeignKey("Role")]
        public int Role_Id { get; set; }

        [ForeignKey("Project")]
        public int Project_Id { get; set; }

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Role Role { get; set; } = null!;
        public virtual Project Project { get; set; } = null!;
    }
}