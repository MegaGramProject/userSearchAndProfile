package com.example.springBootFrontend;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class frontendController {

    @GetMapping("/search/{username}")
    public String home(@PathVariable String username, Model model) {
        model.addAttribute("username", username);
        return "search";
    }

    @GetMapping("/profilePage/{authenticatedUsername}/{profileUsername}")
    public String profilePage(@PathVariable String authenticatedUsername, @PathVariable String profileUsername, Model model) {
        model.addAttribute("authenticatedUsername", authenticatedUsername);
        model.addAttribute("profileUsername", profileUsername);
        return "profilePage";
    }

    @GetMapping("/profilePage/{profileUsername}")
    public String profilePageRoute2(@PathVariable String profileUsername, Model model) {
        model.addAttribute("authenticatedUsername", "");
        model.addAttribute("profileUsername", profileUsername);
        return "profilePage";
    }

    @GetMapping("/editProfile/{authenticatedUsername}")
    public String editProfile(@PathVariable String authenticatedUsername, Model model) {
        model.addAttribute("authenticatedUsername", authenticatedUsername);
        return "editProfile";
    }

    @GetMapping("/saves/{authenticatedUsername}")
    public String saves(@PathVariable String authenticatedUsername, Model model) {
        model.addAttribute("authenticatedUsername", authenticatedUsername);
        return "saves";
    }

    @GetMapping("/likes/{authenticatedUsername}")
    public String likes(@PathVariable String authenticatedUsername, Model model) {
        model.addAttribute("authenticatedUsername", authenticatedUsername);
        return "likes";
    }

    @GetMapping("/topicMatches/{authenticatedUsername}/{topic}")
    public String topicMatches(@PathVariable String authenticatedUsername, @PathVariable String topic, Model model) {
        model.addAttribute("authenticatedUsername", authenticatedUsername);
        model.addAttribute("topic", topic);
        return "topicMatches";
    }

    @GetMapping("/notifications/{authenticatedUsername}")
    public String notifications(@PathVariable String authenticatedUsername, Model model) {
        model.addAttribute("authenticatedUsername", authenticatedUsername);
        return "notifications";
    }

    @GetMapping("/viewPost/{authenticatedUsername}/{postId}")
    public String viewPost(@PathVariable String authenticatedUsername, @PathVariable String postId, Model model) {
        model.addAttribute("authenticatedUsername", authenticatedUsername);
        model.addAttribute("postId", postId);
        return "viewPost";
    }

}
