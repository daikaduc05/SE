using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManagerBE.Models
{
    public class UserNotification
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public int User_Id { get; set; }

        [ForeignKey("Notification")]
        public int Noti_Id { get; set; }

        public bool Is_Read { get; set; } = false;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Notification Notification { get; set; } = null!;
    }
}