<?php

namespace App\Http\Controllers;

use App\Models\TeacherNotification;
use App\Http\Requests\StoreTeacherNotificationRequest;
use App\Http\Requests\UpdateTeacherNotificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeacherNotificationController extends Controller
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
    public function store(StoreTeacherNotificationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(TeacherNotification $teacherNotification)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeacherNotificationRequest $request, TeacherNotification $teacherNotification)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TeacherNotification $teacherNotification)
    {
        //
    }

    public function getTeacherNotification(Request $request)
    {
        $studentId = Auth::user()->id; // Assuming the user is authenticated

        // Fetch notifications for the logged-in student, ordered by latest created_at
        $notifications = TeacherNotification::where('user_id', $studentId)
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
     $notification = TeacherNotification::findOrFail($id);

     // Delete the notification
     $notification->delete();

     // Return a response
     return response()->json(['message' => 'Notification deleted successfully.']);
}
public function deleteNotif($id)
    {
        // Find the notification by its ID
        $notification = TeacherNotification::findOrFail($id);

        // Delete the notification
        $notification->delete();

        // Return a response indicating the notification was deleted
        return response()->json(['message' => 'Notification deleted successfully.']);
    }
}