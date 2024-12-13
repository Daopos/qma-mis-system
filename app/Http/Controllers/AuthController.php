<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Audit;
use App\Models\Employee;
use App\Models\EmployeeServiceRecords;
use App\Models\Guardian;
use App\Models\Registrar;
use App\Models\Student;
use App\Notifications\AdminLoginNotification;
use App\Notifications\EmployeePasswordNotification;
use App\Notifications\EmpoyeeResetCode;
use App\Notifications\LoginSuccessful;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    //
    public function AdminRegister(Request $request) {
        $fields = $request->validate([
            'username' => 'required|max:255',
            'password' => 'required',
        ]);

        $admin = Admin::create($fields);

        $token = $admin->createToken($admin->username);


        return [
            'user' => $admin,
            'token' => $token->plainTextToken
        ];
    }

    public function AdminLogin(Request $request) {
        $request->validate([
            'username' => 'required|exists:admins',
            'password' => 'required',
        ]);

        $admin = Admin::where('username', $request->username)->first();

        if(!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json([
                'message' => 'The provided credentials are incorrect.'
            ], 401); // Return 401 Unauthorized status code
        }
        $token = $admin->createToken($admin->username, ['role:admin']);

        $loginDate = now()->format('F j, l g:i A');
        $device = $request->header('User-Agent');

        $notification = new AdminLoginNotification($admin, $loginDate, $device);
        $notification->sendLoginNotification();

        return [
            'user' => $admin,
            'token' => $token->plainTextToken
        ];
    }

    public function AdminLogout(Request $request) {
    }

            // 'name' => 'required|max:255',

            public function EmployeeRegister(Request $request)
            {
                // Validate input fields
                $fields = $request->validate([
                    'email' => 'required|email|unique:employees',
                    'password' => 'required|string|min:6',
                    'fname' => 'required|string',
                    'mname' => 'nullable|string',
                    'lname' => 'required|string',
                    'extension_name' => 'nullable|string',
                    'address' => 'required|string',
                    'type' => 'required|string',
                    'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                    'desc' => 'nullable|string',
                    'hired_date' => 'nullable|date', // Added hired_date validation
                ]);

                // Handle image upload if provided
                if ($request->hasFile('image')) {
                    $fields['image'] = $request->file('image')->store('images', 'public');
                }

                // Hash password
                $fields['password'] = Hash::make($fields['password']);

                // Create the employee record
                $employee = Employee::create($fields);

                $hiredDate = $request->input('hired_date', Carbon::now()->toDateString()); // Default to current date if not provided

                EmployeeServiceRecords::create([
                    'employee_id' => $employee->id,
                    'remarks' => 'Employee hired on ' . $hiredDate,
                ]);
                // Create an audit log
                Audit::create([
                    'user' => 'Admin',
                    'action' => 'Admin registered new employee: ' . $employee->fname . ' ' . $employee->lname,
                    'user_level' => 'Admin',
                ]);
               // Dynamically set the login link based on the employee's type
    switch ($employee->type) {
        case 'Registrar':
            $loginLink = 'https://qma-portal.online/registrar/login';
            break;
        case 'Principal':
            $loginLink = 'https://qma-portal.online/principal/login';
            break;
        case 'Finance':
            $loginLink = 'https://qma-portal.online/finance/login';
            break;
        case 'Teacher':
            $loginLink = 'https://qma-portal.online/teacher/login';
            break;
        default:
            $loginLink = 'https://qma-portal.online/login'; // Default login link
            break;
    }

    // Send the password notification
    $notification = new EmployeePasswordNotification($employee, $request->password, $loginLink);
    $notification->sendPasswordNotification();


                return response()->json([
                    'user' => $employee,
                    'message' => 'Employee registered and notification sent successfully.'
                ], 201);
            }

    public function EmployeeLogin(Request $request) {
        $request->validate([
            'email' => 'required|email|exists:employees',
            'password' => 'required',
        ]);

        $user = Employee::where('email', $request->email)->first();

        if(!$user || !Hash::check($request->password, $user->password)) {
            return [
                'message' => 'The provided credentials are incorrect.'
            ];
        }
        $token = "";
        if($user->type == "Teacher") {
            $token = $user->createToken($user->email, ['role:teacher']);
        }
        if($user->type == "Principal") {
            $token = $user->createToken($user->email, ['role:principal']);
        }
        if($user->type == "Registrar") {
            $token = $user->createToken($user->email, ['role:registrar']);
        }
        if($user->type == "Finance") {
            $token = $user->createToken($user->email, ['role:finance']);
        }



        return [
            'user' => $user,
            'token' => $token->plainTextToken
        ];
    }

    public function RegistrarLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:employees,email',
            'password' => 'required',
        ]);

        $registrar = Employee::where('email', $request->email)
                             ->where('type', 'Registrar')
                             ->first();

        if (!$registrar || !Hash::check($request->password, $registrar->password)) {
            return response()->json(['message' => 'The provided credentials are incorrect.'], 401);
        }

        // Check activation status
        if (!$registrar->activation) {
            return response()->json(['message' => 'Your account is not activated. Please reset your password to activate your account.'], 403);
        }

        $token = $registrar->createToken('registrar-token', ['role:registrar'])->plainTextToken;

        $loginDate = now()->format('F j, l g:i A');
        $device = $request->header('User-Agent');

        $notification = new LoginSuccessful($registrar, $loginDate, $device);
        $notification->sendLoginNotification();

        $fullName = $registrar->fname . ' ' .
                    ($registrar->mname ? $registrar->mname[0] . '. ' : '') .
                    $registrar->lname;

        Audit::create([
            'user' => $fullName,
            'action' => 'Log in',
            'user_level' => "Registrar",
        ]);

        return response()->json(['user' => $registrar, 'token' => $token], 200);
    }


    public function TeacherLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:employees,email',
            'password' => 'required',
        ]);

        $teacher = Employee::where('email', $request->email)
        ->where('type', 'Teacher')
        ->first();


        // Check if the employee exists, the password is correct, and the employee type is 'teacher'
        if (!$teacher || !Hash::check($request->password, $teacher->password)) {
            return response()->json(['message' => 'The provided credentials are incorrect.'], 401);
        }

          // Check activation status
          if (!$teacher->activation) {
            return response()->json(['message' => 'Your account is not activated. Please reset your password to activate your account.'], 403);
        }
        $token = $teacher->createToken('teacher-token', ['role:teacher'])->plainTextToken;

        $loginDate = now()->format('F j, l g:i A'); // e.g., October 15, Tuesday 9:30 PM
        $device = $request->header('User-Agent'); // Get device info from User-Agent

        $notification = new LoginSuccessful($teacher, $loginDate, $device);
        $notification->sendLoginNotification();

        $fullName = $teacher->fname . ' ' .
        ($teacher->mname ? $teacher->mname[0] . '. ' : '') . // Check if mname is not null
        $teacher->lname;
        Audit::create([
            'user' =>   $fullName,  // Use . for concatenation and add spaces as needed
            'action' => 'Log in',
            'user_level' => "Teacher",
        ]);
        return response()->json(['user' => $teacher, 'token' => $token]);
    }

    public function FinanceLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:employees,email',
            'password' => 'required',
        ]);

        $finance = Employee::where('email', $request->email)
        ->where('type', 'Finance')
        ->first();


        // Check if the employee exists, the password is correct, and the employee type is 'teacher'
        if (!$finance || !Hash::check($request->password, $finance->password)) {
            return response()->json(['message' => 'The provided credentials are incorrect.'], 401);
        }

        // Check activation status
        if (!$finance->activation) {
            return response()->json(['message' => 'Your account is not activated. Please reset your password to activate your account.'], 403);
        }

        $token = $finance->createToken('finance-token', ['role:finance'])->plainTextToken;

        $loginDate = now()->format('F j, l g:i A'); // e.g., October 15, Tuesday 9:30 PM
        $device = $request->header('User-Agent'); // Get device info from User-Agent

        $notification = new LoginSuccessful($finance, $loginDate, $device);
        $notification->sendLoginNotification();


            $fullName = $finance->fname . ' ' .
                        ($finance->mname ? $finance->mname[0] . '. ' : '') . // Check if mname is not null
                        $finance->lname;

            Audit::create([
                'user' => $fullName,
                'action' => 'Log in',
                'user_level' => "Finance",
            ]);

        return response()->json(['user' => $finance, 'token' => $token]);
    }


    public function PrincipalLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:employees,email',
            'password' => 'required',
        ]);

        $principal = Employee::where('email', $request->email)
        ->where('type', 'Principal')
        ->first();


        // Check if the employee exists, the password is correct, and the employee type is 'teacher'
        if (!$principal || !Hash::check($request->password, $principal->password)) {
            return response()->json(['message' => 'The provided credentials are incorrect.'], 401);
        }


        if (!$principal->activation) {
            return response()->json(['message' => 'Your account is not activated. Please reset your password to activate your account.'], 403);
        }

        $token = $principal->createToken('principal-token', ['role:principal'])->plainTextToken;

        $loginDate = now()->format('F j, l g:i A'); // e.g., October 15, Tuesday 9:30 PM
        $device = $request->header('User-Agent'); // Get device info from User-Agent

        $notification = new LoginSuccessful($principal, $loginDate, $device);
        $notification->sendLoginNotification();


        $fullName = $principal->fname . ' ' .
        ($principal->mname ? $principal->mname[0] . '. ' : '') . // Check if mname is not null
        $principal->lname;
        Audit::create([
            'user' => $fullName,  // Use . for concatenation and add spaces as needed
            'action' => 'Log in',
            'user_level' => "Principal",
        ]);

        return response()->json(['user' => $principal, 'token' => $token]);
    }



    public function Logout(Request $request) {

        $request->user()->tokens()->delete();

        return [
            'message' =>  "You are logged out",
        ];
    }

    public function StudentLogin(Request $request)
    {
        $request->validate([
            'lrn' => 'required|exists:students',
            'password' => 'required',
        ]);

        $student = Student::where('lrn', $request->lrn)->first();

        if (!$student || !Hash::check($request->password, $student->password)) {
            return response()->json(['message' => 'The provided credentials are incorrect.'], 401);
        }
        if (!$student->activation) {
            return response()->json(['message' => 'Your account is not activated. Please reset your password to activate your account.'], 403);
        }

        $token = $student->createToken('student-token', ['role:student'])->plainTextToken;

        // Send login notification
        $loginDate = now()->format('F j, l g:i A'); // e.g., October 15, Tuesday 9:30 PM
        $device = $request->header('User-Agent'); // Get device info from User-Agent

        $notification = new LoginSuccessful($student, $loginDate, $device);
        $notification->sendLoginNotification();


        $fullName = $student->firstname . ' ' .
        ($student->middlename ? $student->middlename[0] . '. ' : '') . // Check if mname is not null
        $student->lastname;
        Audit::create([
            'user' =>  $fullName,  // Use . for concatenation and add spaces as needed
            'action' => 'Log in',
            'user_level' => "Student",
        ]);

        return response()->json(['user' => $student, 'token' => $token]);
    }

    public function ParentLogin(Request $request)
    {
        $request->validate([
            'username' => 'required|exists:guardians',
            'password' => 'required',
        ]);

        $parent = Guardian::where('username', $request->username)->first();

        if (!$parent || !Hash::check($request->password, $parent->password)) {
            return response()->json(['message' => 'The provided credentials are incorrect.'], 401);
        }

        if (!$parent->activation) {
            return response()->json(['message' => 'Your account is not activated. Please reset your password to activate your account.'], 403);
        }

        $token = $parent->createToken('parent-token', ['role:parent'])->plainTextToken;

        // Send login notification
        $loginDate = now()->format('F j, l g:i A'); // e.g., October 15, Tuesday 9:30 PM
        $device = $request->header('User-Agent'); // Get device info from User-Agent

        $notification = new LoginSuccessful($parent, $loginDate, $device);
        $notification->sendLoginNotification();

        $student = Student::where('id', $parent->student_id)->first();
        $fullName = $student->firstname . ' ' .
        ($student->middlename ? $student->middlename[0] . '. ' : '') . // Check if mname is not null
        $student->surname;
        Audit::create([
            'user' => 'Parent of '. $fullName,  // Use . for concatenation and add spaces as needed
            'action' => 'Log in',
            'user_level' => "Parent",
        ]);


        return response()->json(['user' => $parent, 'token' => $token]);
    }


    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:employees,email',
            'password' => 'required|confirmed|min:8',
        ]);

        $registrar = Employee::where('email', $request->email)->first();

        // Reset the password and activate the account
        $registrar->password = Hash::make($request->password);
        $registrar->activation = true;
        $registrar->save();

        return response()->json(['message' => 'Your password has been reset, and your account is now activated.'], 200);
    }


    public function resetStudentPassword(Request $request)
    {
        $request->validate([
            'username' => 'required|exists:students,lrn',
            'password' => 'required|confirmed|min:8',
        ]);

        $student = Student::where('lrn', $request->username)->first();

        // Reset the password and activate the account
        $student->password = Hash::make($request->password);
        $student->activation = true;
        $student ->save();

        return response()->json(['message' => 'Your password has been reset, and your account is now activated.'], 200);
    }

    public function resetParentPassword(Request $request)
    {
        $request->validate([
            'username' => 'required|exists:guardians,username',
            'password' => 'required|confirmed|min:8',
        ]);

        $parent = Guardian::where('username', $request->username)->first();

        // Reset the password and activate the account
        $parent->password = Hash::make($request->password);
        $parent->activation = true;
        $parent->save();

        return response()->json(['message' => 'Your password has been reset, and your account is now activated.'], 200);
    }


    public function sendResetCode(Request $request) {
        $request->validate(['email' => 'required|email']);
        $employee = Employee::where('email', $request->email)->first();

        if (!$employee) {
            return response()->json(['message' => 'Email not found'], 404);
        }

        $code = rand(100000, 999999); // Generate a random code
        // Save the code (store in DB or cache)
        $employee->reset_code = $code;
        $employee->save();

        // Send the code via email

        $notification = new EmpoyeeResetCode($employee->email, $code);
        $notification->sendResetCodeEmail();

        return response()->json(['message' => 'Reset code sent to your email']);
    }

    public function resetPasswordCode(Request $request) {
        // Validate incoming fields
        $request->validate([
            'email' => 'required|email',
            'code' => 'required',
            'new_password' => 'required|min:8',
            'new_password_confirmation' => 'required|min:8',
        ]);

        // Check if the passwords match
        if ($request->new_password !== $request->new_password_confirmation) {
            return response()->json(['message' => 'The new password and confirmation do not match.'], 400);
        }

        // Find the employee based on email
        $employee = Employee::where('email', $request->email)->first();

        // Verify the reset code
        if (!$employee || $employee->reset_code !== $request->code) {
            return response()->json(['message' => 'Invalid code'], 400);
        }

        // Update the password and clear the reset code
        $employee->password = bcrypt($request->new_password);
        $employee->reset_code = null; // Clear the reset code
        $employee->save();

        // Respond with success
        return response()->json(['message' => 'Password reset successfully']);
    }



    public function sendStudentResetCode(Request $request) {
        $request->validate(['email' => 'required|email']);
        $student = Student::where('email', $request->email)->first();

        if (!$student) {
            return response()->json(['message' => 'Email not found'], 404);
        }

        $code = rand(100000, 999999); // Generate a random code
        // Save the code (store in DB or cache)
        $student->reset_code = $code;
        $student->save();

        // Send the code via email

        $notification = new EmpoyeeResetCode($student->email, $code);
        $notification->sendResetCodeEmail();

        return response()->json(['message' => 'Reset code sent to your email']);
    }

    public function resetStudentPasswordCode(Request $request) {
        // Validate incoming fields
        $request->validate([
            'email' => 'required|email',
            'code' => 'required',
            'new_password' => 'required|min:8',
            'new_password_confirmation' => 'required|min:8',
        ]);

        // Check if the passwords match
        if ($request->new_password !== $request->new_password_confirmation) {
            return response()->json(['message' => 'The new password and confirmation do not match.'], 400);
        }

        // Find the employee based on email
        $student = Student::where('email', $request->email)->first();

        // Verify the reset code
        if (!$student || $student->reset_code !== $request->code) {
            return response()->json(['message' => 'Invalid code'], 400);
        }

        // Update the password and clear the reset code
        $student->password = bcrypt($request->new_password);
        $student->reset_code = null; // Clear the reset code
        $student->save();

        // Respond with success
        return response()->json(['message' => 'Password reset successfully']);
    }


    public function sendParentResetCode(Request $request) {
        $request->validate(['email' => 'required|email']);
        $guardian = Guardian::where('email', $request->email)->first();

        if (!$guardian) {
            return response()->json(['message' => 'Email not found'], 404);
        }

        $code = rand(100000, 999999); // Generate a random code
        // Save the code (store in DB or cache)
        $guardian->reset_code = $code;
        $guardian->save();

        // Send the code via email

        $notification = new EmpoyeeResetCode($guardian->email, $code);
        $notification->sendResetCodeEmail();

        return response()->json(['message' => 'Reset code sent to your email']);
    }

    public function resetParentPasswordCode(Request $request) {
        // Validate incoming fields
        $request->validate([
            'email' => 'required|email',
            'code' => 'required',
            'new_password' => 'required|min:8',
            'new_password_confirmation' => 'required|min:8',
        ]);

        // Check if the passwords match
        if ($request->new_password !== $request->new_password_confirmation) {
            return response()->json(['message' => 'The new password and confirmation do not match.'], 400);
        }

        // Find the employee based on email
        $guardian = Guardian::where('email', $request->email)->first();

        // Verify the reset code
        if (!$guardian || $guardian->reset_code !== $request->code) {
            return response()->json(['message' => 'Invalid code'], 400);
        }

        // Update the password and clear the reset code
        $guardian->password = bcrypt($request->new_password);
        $guardian->reset_code = null; // Clear the reset code
        $guardian->save();

        // Respond with success
        return response()->json(['message' => 'Password reset successfully']);
    }



}