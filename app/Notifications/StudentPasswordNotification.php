<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;

class StudentPasswordNotification extends Notification
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

    public function sendPasswordNotification()
    {
        // Create a plain text email
        Mail::raw(
            $this->buildMessage(),
            function ($message) {
                $message->to($this->student->email) // Use the student's email
                    ->from('noreply@gmail.com', 'Qma Log In Information') // From the specified sender
                    ->subject('Your New Student Account Password');
            }
        );
    }

    protected function buildMessage()
    {
        return "Hello " . $this->student->firstname . ",\n\n" .
        "Your student account has been created. Here are your login details:\n\n" .
        "username: " . $this->student->lrn . "\n" .
        "Password: " . $this->password . "\n\n" .
        "Please activate your account before logging in.\n\n" .
        "To log in, please click the following link: \n" .
        $this->loginUrl . "\n\n" . // Use the dynamic login link
        "If you did not request this account, please contact the registrar's office immediately.\n\n" .
        "Thank you for joining us!";

    }
}
