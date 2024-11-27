<?php

namespace App\Http\Controllers;

use App\Models\Guardian;
use App\Http\Requests\StoreGuardianRequest;
use App\Http\Requests\UpdateGuardianRequest;
use App\Models\Audit;
use App\Notifications\GuardianResetPasswordNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class GuardianController extends Controller
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
    public function store(StoreGuardianRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Guardian $guardian)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGuardianRequest $request, Guardian $guardian)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Guardian $guardian)
    {
        //
    }

    public function guardianResetPassword(Request $request, $id) {
        // Find the guardian by the student's ID
        $guardian = Guardian::where('student_id', $id)->first();

        // Validate the request fields
        $fields = $request->validate([
            "password" => "required"
        ]);

        // Update the guardian's password
        $guardian->update([
            'password' => bcrypt($fields['password']), // Make sure to hash the password before saving
            'activation' => false, // Set activation to false
        ]);

        // Get the registrar (person who resets the password)
        $registrar = Auth::user();

        // Define the login URL
        $loginUrl = 'https://qma-portal.online/parent/login'; // Default login link

        // Send the reset password notification to the guardian
        $notification = new GuardianResetPasswordNotification($guardian, $fields['password'], $loginUrl);
        $notification->sendResetPasswordNotification();

        // Log the registrar's action in the audit log
        Audit::create([
            'user' => $registrar->fname . ' ' . ($registrar->mname ? $registrar->mname . ' ' : '') . $registrar->lname,
            'action' => 'Reset password for guardian of student: ' . $guardian->student->firstname . ' ' . $guardian->student->surname . ' (Grade Level: ' . $guardian->student->grade_level . ')',
            'user_level' => 'Registrar',
        ]);

        return response()->json(["message" => "Success"]);
    }



    public function resetPassword(Request $request)
{
    // Get the currently authenticated user
    $user = Auth::user();

    // Find the guardian record based on the user ID
    $guardian = Guardian::where('id', $user->id)->firstOrFail();

    // Validate incoming request data
    $fields = $request->validate([
        'current_password' => 'required',
        'new_password' => 'required|min:8',
    ]);

    // Check if the current password matches the one stored in the database
    if (!Hash::check($fields['current_password'], $guardian->password)) {
        return response()->json(['error' => 'Invalid Credentials'], 403);
    }

    // Hash the new password and update the guardian record
    $guardian->update([
        'password' => Hash::make($fields['new_password']),
    ]);

    return response()->json(['message' => 'Password updated successfully']);
}
}