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

        public bool Noti_Settings { get; set; }

        public bool Is_Banned { get; set; }

        // Navigation properties
        public virtual ICollection<RoleUserProject> RoleUserProjects { get; set; } = new List<RoleUserProject>();
        public virtual ICollection<TaskUser> TaskUsers { get; set; } = new List<TaskUser>();
        public virtual ICollection<UserNotification> UserNotifications { get; set; } = new List<UserNotification>();
    }
}