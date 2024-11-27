<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Http\Requests\StoreAdminRequest;
use App\Http\Requests\UpdateAdminRequest;
use App\Notifications\AdminResetNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
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
    public function store(StoreAdminRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Admin $admin)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */





     public function updateProfile(Request $request)
     {
         $admin = Auth::user(); // Retrieve the authenticated admin

         // Store the old email
         $oldEmail = $admin->email;

         // Validate incoming request
         $fields = $request->validate([
             'new_username' => 'nullable|string',
             'email' => 'nullable|email',
             'current_password' => [
                 'required_with:new_username,email,new_password',
                 function ($attribute, $value, $fail) use ($admin) {
                     if (!Hash::check($value, $admin->password)) {
                         $fail('The current password is incorrect.');
                     }
                 },
             ],
             'new_password' => 'nullable|string|min:6',
         ]);

         // Prepare data for updating
         $new_credentials = [];
         $changed_fields = [];

         if ($fields['new_username']) {
             $new_credentials['username'] = $fields['new_username'];
             $changed_fields[] = 'Username';
         }

         if ($fields['email']) {
             $new_credentials['email'] = $fields['email'];
             $changed_fields[] = 'Email';
         }

         if ($fields['new_password']) {
             $new_credentials['password'] = bcrypt($fields['new_password']); // Hash password
             $changed_fields[] = 'Password';
         }

         // Check if there are changes
         if (!empty($new_credentials)) {
             // Update the admin details
             $admin->update($new_credentials);

             // Send notification using the old email
             if (!empty($changed_fields)) {
                 $notification = new AdminResetNotification($admin, $changed_fields);

                 // Temporarily override the admin email to the old email for notification
                 $admin->email = $oldEmail;
                 $notification->sendCredentialChangeNotification();
             }

             return response()->json(['message' => 'Profile updated successfully.']);
         }

         return response()->json(['message' => 'No changes were made.'], 400);
     }




    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Admin $admin)
    {
        //
    }


}