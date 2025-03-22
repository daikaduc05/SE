namespace TaskManagerBE.Models
{
    public class Tasks
    {
        public int Id { get; set; }
        public int Project_Id { get; set; }
        public string State { get; set; } = "Pending";
        public string Priority { get; set; } = "Medium";
        public string Task_Name { get; set; } = string.Empty;
        public string Created_By { get; set; } = string.Empty;
        public virtual Project Project { get; set; } = null!;
        public virtual ICollection<TaskUser> TaskUsers { get; set; } = new List<TaskUser>();
    }
}