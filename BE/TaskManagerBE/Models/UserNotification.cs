using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManagerBE.Models
{
    public class UserNotification
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        [ForeignKey("Notification")]
        public int NotificationId { get; set; }

        public bool IsRead { get; set; } = false;

        // Navigation properties
        public User User { get; set; } = null!;
        public Notification Notification { get; set; } = null!;
    }
}