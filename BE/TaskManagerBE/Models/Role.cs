using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TaskManagerBE.Models
{
    public class Role
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = "Member";

        // Navigation properties
        public ICollection<RoleUserProject> RoleUserProjects { get; set; } = new List<RoleUserProject>();
    }
}