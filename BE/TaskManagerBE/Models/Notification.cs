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
        public int ProjectId { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string Context { get; set; } = string.Empty;

        [Required]
        [ForeignKey("User")]
        public int CreatedById { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        // Navigation properties
        public Project Project { get; set; } = null!;
        public User CreatedBy { get; set; } = null!;
        public ICollection<UserNotification> UserNotifications { get; set; } = new List<UserNotification>();
    }
}