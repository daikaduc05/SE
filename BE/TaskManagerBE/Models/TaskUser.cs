using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManagerBE.Models
{
    public class TaskUser
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public int User_Id { get; set; }

        [ForeignKey("Task")]
        public int Task_Id { get; set; }

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Task Task { get; set; } = null!;
    }
}