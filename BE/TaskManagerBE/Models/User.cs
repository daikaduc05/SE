using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TaskManagerBE.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; } 

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        public bool NotificationSettings { get; set; }

        public bool IsBanned { get; set; }

        // Navigation properties
        public ICollection<RoleUserProject> RoleUserProjects { get; set; } = new List<RoleUserProject>();
        public ICollection<TaskUser> TaskUsers { get; set; } = new List<TaskUser>();
        public ICollection<UserNotification> UserNotifications { get; set; } = new List<UserNotification>();
    }
}