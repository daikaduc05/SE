using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace TaskManagerBE.Models
{
    public class Tasks
    {   
        [Key]
        public int Id { get; set; }
        [ForeignKey("Project")]
        public int ProjectId { get; set; }
        public string State { get; set; } = "Pending";
        public string Priority { get; set; } = "Medium";
        public string TaskName { get; set; } = string.Empty;
        [ForeignKey("User")]
        public int CreatedById { get; set; }
        public Project Project { get; set; } = null!;
        public User CreatedBy { get; set; } = null!;
        public ICollection<TaskUser> TaskUsers { get; set; } = new List<TaskUser>();
    }
}