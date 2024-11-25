<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;

class GuardianResetPasswordNotification extends Notification
{
    use Queueable;

    protected $guardian;
    protected $newPassword;
    protected $loginUrl;

    public function __construct($guardian, $newPassword, $loginUrl)
    {
        $this->guardian = $guardian;
        $this->newPassword = $newPassword;
        $this->loginUrl = $loginUrl;
    }

    public function via($notifiable)
    {
        // Sending via email
        return [];
    }

    public function sendResetPasswordNotification()
    {
        // Create and send the email
        Mail::raw(
            $this->buildMessage(),
            function ($message) {
                $message->to($this->guardian->email) // Use the student's email
                    ->from('noreply@gmail.com', 'Qma Password Reset') // From the specified sender
                    ->subject('Your Guardian Account Password Has Been Reset');

            }
        );

    }

    protected function buildMessage()
    {
        return "Hello\n\n" . // Assuming 'name' is the guardian's full name
        "Your guardian account password has been reset. Here are your new login details:\n\n" .
        "Username: " . $this->guardian->username . "\n" .
        "New Password: " . $this->newPassword . "\n\n" .
         "Please reactivate your account before logging in.\n\n" .
        "To log in, please click the following link: \n" .
        $this->loginUrl . "\n\n" .
        "If you did not request this password reset, please contact the registrar's office immediately.\n\n" .
        "Thank you!";
    }
}