<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;

class EmployeePasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $employee;
    protected $password;
    protected $loginLink; // Add a property for the login link
    public function __construct($employee, $password, $loginLink)
    {
        $this->employee = $employee;
        $this->password = $password;
        $this->loginLink = $loginLink; // Initialize the login link
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
                $message->to($this->employee->email)
                    ->from('noreply@gmail.com', 'Qma Log In Information')
                    ->subject('Your Employee Account Login Information');
            }
        );
    }

    protected function buildMessage()
    {
        // Modify the message to include the passed login link
        return "Hello  " . $this->employee->fname . ",\n\n" .
        "Your employee account has been created. Here are your login details:\n\n" .
        "Email: " . $this->employee->email . "\n" .
        "Password: " . $this->password . "\n\n" .
        "Please activate your account before logging in.\n\n" .
        "To log in, please click the following link: \n" .
        $this->loginLink . "\n\n" . // Use the dynamic login link
        "If you did not request this account, please contact the admin office immediately.\n\n" .
        "Thank you for joining us!";
    }
}