using System.ComponentModel.DataAnnotations;


namespace Megagram.Models;

public class FollowRequest
{
    
    [Key]
    public int id {get; set; }
    public string requester { get; set; }
    public string requestee { get; set; }
    public bool isRead { get; set; }
}

