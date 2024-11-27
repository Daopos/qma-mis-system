<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;

class EmployeeResetPasswordNotification extends Notification
{
    use Queueable;

    protected $employee;
    protected $password;
    protected $loginUrl;

    public function __construct($employee, $password, $loginUrl)
    {
        $this->employee = $employee;
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
                $message->to($this->employee->email) // Use the employee's email
                    ->from('noreply@gmail.com', 'Qma Password Reset') // From the specified sender
                    ->subject('Your Employee Account Password Has Been Reset');
            }
        );
    }

    protected function buildMessage()
    {
        return "Hello " . $this->employee->fname . ",\n\n" .
        "Your employee account password has been reset by the admin. Here are your new login details:\n\n" .
        "Email: " . $this->employee->email . "\n" .
        "New Password: " . $this->password . "\n\n" .
        "Please reactivate your account before logging in.\n\n" .
        "To log in, please click the following link: \n" .
        $this->loginUrl . "\n\n" . // Use the dynamic login link
        "If you did not request this change, please contact the admin office immediately.\n\n" .
        "Thank you!";
    }
}