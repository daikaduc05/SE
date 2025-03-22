using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManagerBE.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Project")]
        public int Project_Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string Context { get; set; } = string.Empty;

        [Required]
        public string Created_By { get; set; } = string.Empty;

        [Required]
        public DateTime Created_At { get; set; }

        // Navigation properties
        public virtual Project Project { get; set; } = null!;
        public virtual ICollection<UserNotification> UserNotifications { get; set; } = new List<UserNotification>();
    }
}