using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManagerBE.Models
{
    public class TaskUser
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        [ForeignKey("Tasks")]
        public int TaskId { get; set; }

        // Navigation properties
        public User User { get; set; } = null!;
        public Tasks Task { get; set; } = null!;
    }
}