<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;

class AdminLoginNotification extends Notification
{
    use Queueable;

    protected $admin;
    protected $loginDate;
    protected $device;

    public function __construct($admin, $loginDate, $device)
    {
        $this->admin = $admin;
        $this->loginDate = $loginDate;
        $this->device = $device;
    }

    public function via($notifiable)
    {
        // You can return an empty array since we're sending a raw email
        return [];
    }

    public function toMail($notifiable)
    {
        // This method will not be called anymore, so you can omit it.
    }

    public function sendLoginNotification()
    {
        // Create a plain text email
        Mail::raw(
            $this->buildMessage(),
            function ($message) {
                $message->to($this->admin->email) // Use the admin's email address
                    ->from('noreply@gmail.com', 'Qma Email Security') // Send from the noreply address
                    ->subject('Admin Account Login Alert');
            }
        );
    }

    protected function buildMessage()
    {
        return "Hello Admin\n\n" .
               "We have detected a login to your admin account on " . $this->loginDate . ".\n" .
               "Device: " . $this->device . "\n\n" .
               "If this login was not performed by you, please take immediate action to secure your account and report this incident to the system administrator.\n\n" .
               "Stay vigilant and thank you for your attention!";
    }

}