<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;

class EmployeeResetNotification extends Notification
{
    use Queueable;

    protected $employee;
    protected $loginDate;
    protected $device;

    public function __construct($employee, $loginDate, $device)
    {
        $this->employee = $employee;
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
                $message->to($this->employee->email) // Use the student's email address
                    ->from('noreply@gmail.com', 'Qma Email Security') // Send from the noreply address
                    ->subject('Login Notification');
            }
        );
    }

    protected function buildMessage()
    {
        return "Hello " . $this->employee->name . ",\n\n" .
               "We have detected an update to your email address on " . $this->loginDate . ".\n" .
               "Device: " . $this->device . "\n\n" .
               "If you did not update your email address, please immediately contact the admin to verify and secure your account.\n\n" .
               "Thank you for using our application!";
    }
}