using System.ComponentModel.DataAnnotations;


namespace Megagram.Models;

public class UserNotification
{
    
    public string recipient { get; set; }
    public string subject { get; set; }
    public string action { get; set; }
    public bool isread { get; set; }
    public DateTime origin_datetime { get; set; }
}

