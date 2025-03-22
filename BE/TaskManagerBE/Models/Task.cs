using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManagerBE.Models
{
    public class Task
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Project")]
        public int Project_Id { get; set; }

        [Required]
        public string State { get; set; } = "Pending";

        [Required]
        public string Priority { get; set; } = "Medium";

        [Required]
        public string Task_Name { get; set; } = string.Empty;

        [Required]
        public string Created_By { get; set; } = string.Empty;

        // Navigation properties
        public virtual Project Project { get; set; } = null!;
        public virtual ICollection<TaskUser> TaskUsers { get; set; } = new List<TaskUser>();
    }
}