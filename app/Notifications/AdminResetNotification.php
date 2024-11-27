<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;

class AdminResetNotification extends Notification
{
    use Queueable;

    protected $admin;
    protected $changedFields;

    public function __construct($admin, $changedFields)
    {
        $this->admin = $admin;
        $this->changedFields = $changedFields; // List of fields that were changed
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

    public function sendCredentialChangeNotification()
    {
        // Create a plain text email
        Mail::raw(
            $this->buildMessage(),
            function ($message) {
                $message->to($this->admin->email) // Use the admin's email address
                    ->from('noreply@gmail.com', 'Qma Email Security') // Send from the noreply address
                    ->subject('Admin Account Credentials Updated');
            }
        );
    }

    protected function buildMessage()
    {
        $changedFieldsList = implode(', ', $this->changedFields);

        return "Hello Admin,\n\n" .
               "We have detected a change to your admin account credentials. The following details were updated:\n" .
               "- " . $changedFieldsList . "\n\n" .
               "If you did not make these changes, please take immediate action to secure your account and contact the system administrator.\n\n" .
               "Stay vigilant and thank you for your attention!";
    }
}