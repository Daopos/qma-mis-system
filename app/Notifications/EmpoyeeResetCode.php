<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;

class EmpoyeeResetCode extends Notification
{
    use Queueable;

    protected $email;
    protected $resetCode;

    /**
     * Create a new notification instance.
     *
     * @param string $email
     * @param string $resetCode
     */
    public function __construct($email, $resetCode)
    {
        $this->email = $email;
        $this->resetCode = $resetCode;
    }

    /**
     * Define the channels this notification will use.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        // Returning an empty array since we're manually sending the email.
        return [];
    }

    /**
     * Send the reset code email notification.
     */
    public function sendResetCodeEmail()
    {
        // Send the plain-text email
        Mail::raw(
            $this->buildMessage(),
            function ($message) {
                $message->to($this->email) // Recipient's email
                    ->from('noreply@gmail.com', 'Qma Email Security') // Sender information
                    ->subject('Password Reset Code'); // Email subject
            }
        );
    }

    /**
     * Build the plain text email message.
     *
     * @return string
     */
    protected function buildMessage()
    {
        return "Hello,\n\n" .
               "You requested a password reset for your account. Use the following code to reset your password:\n\n" .
               "Reset Code: " . $this->resetCode . "\n\n" .
               "If you did not request this, please ignore this email or contact support immediately.\n\n" .
               "Thank you.";
    }
}