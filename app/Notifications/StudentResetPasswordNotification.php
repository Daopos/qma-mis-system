<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;

class StudentResetPasswordNotification extends Notification
{
    use Queueable;

    protected $student;
    protected $password;
    protected $loginUrl;

    public function __construct($student, $password, $loginUrl)
    {
        $this->student = $student;
        $this->password = $password;
        $this->loginUrl = $loginUrl;
    }

    public function via($notifiable)
    {
        // Empty array since we're sending a raw email
        return [];
    }

    public function sendResetPasswordNotification()
    {
        // Create a plain text email
        Mail::raw(
            $this->buildMessage(),
            function ($message) {
                $message->to($this->student->email) // Use the student's email
                    ->from('noreply@gmail.com', 'Qma Password Reset') // From the specified sender
                    ->subject('Your Student Account Password Has Been Reset');
            }
        );
    }

    protected function buildMessage()
    {
        return "Hello " . $this->student->firstname . ",\n\n" .
        "Your student account password has been reset by the registrar. Here are your new login details:\n\n" .
        "Username: " . $this->student->lrn . "\n" .
        "New Password: " . $this->password . "\n\n" .
       "Please reactivate your account before logging in.\n\n" .
        "To log in, please click the following link: \n" .
        $this->loginUrl . "\n\n" .
        "If you did not request this change, please contact the registrar's office immediately.\n\n" .
        "Thank you!";
    }
}
