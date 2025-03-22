using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TaskManagerBE.Models
{
    public class Project
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = "New Project";

        // Navigation properties
        public virtual ICollection<RoleUserProject> RoleUserProjects { get; set; } = new List<RoleUserProject>();
        public virtual ICollection<Tasks> Tasks { get; set; } = new List<Tasks>();
        public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }
}