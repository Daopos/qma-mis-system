<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Http\Requests\StoreNotificationRequest;
use App\Http\Requests\UpdateNotificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNotificationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Notification $notification)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNotificationRequest $request, Notification $notification)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Notification $notification)
    {
        //
    }
    public function getStudentNotification(Request $request)
    {
        $studentId = Auth::user()->id; // Assuming the user is authenticated

        // Fetch notifications for the logged-in student, ordered by latest created_at
        $notifications = Notification::where('user_id', $studentId)
                                      ->orderBy('created_at', 'desc')
                                      ->get();

        return response()->json($notifications);
    }

    public function markAsRead(Request $request, $id)
{
    // $notification = Notification::findOrFail($id);
    // $notification->is_read = true;
    // $notification->save();

    // return response()->json(['message' => 'Notification marked as read.']);


     // Find the notification by ID
     $notification = Notification::findOrFail($id);

     // Delete the notification
     $notification->delete();

     // Return a response
     return response()->json(['message' => 'Notification deleted successfully.']);
}
public function deleteNotif($id)
    {
        // Find the notification by its ID
        $notification = Notification::findOrFail($id);

        // Delete the notification
        $notification->delete();

        // Return a response indicating the notification was deleted
        return response()->json(['message' => 'Notification deleted successfully.']);
    }
}