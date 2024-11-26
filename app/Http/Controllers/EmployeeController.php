<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Audit;
use App\Notifications\EmployeeResetPasswordNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employees = Employee::orderBy('created_at', 'desc')->get()->map(function ($employee) {
            if ($employee->image) {
                $employee->image_url = asset('storage/' . $employee->image);
            } else {
                $employee->image_url = null;
            }
            return $employee;
        });

        return ['employees' => $employees];
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        // $fields = $request->validate([
        //     'name' => 'required|max:255',
        // ]);

        // $registrar = Employee::create($fields);

        // return [
        //     'registrar' => $registrar
        // ];
    }

    /**
     * Display the specified resource.
     */
    public function show(Employee $employee)
    {

    }

    public function employeeResetPassword(Request $request, $id)
    {
        // Find the employee by ID
        $employee = Employee::where('id', $id)->first();

        if (!$employee) {
            return response()->json(["message" => "Employee not found"], 404);
        }

        // Validate the request fields
        $fields = $request->validate([
            "password" => "required"
        ]);

        // Update the employee's password
        $employee->update([
            'password' => bcrypt($fields['password']), // Hash the password for security
            'activation' => false
        ]);

          // Dynamically set the login link based on the employee's type
        switch ($employee->type) {
        case 'Registrar':
            $loginUrl = 'https://qma-portal.online/registrar/login';
            break;
        case 'Principal':
            $loginUrl = 'https://qma-portal.online/principal/login';
            break;
        case 'Finance':
            $loginUrl = 'https://qma-portal.online/finance/login';
            break;
        case 'Teacher':
            $loginUrl = 'https://qma-portal.online/teacher/login';
            break;
        default:
            $loginUrl = 'https://qma-portal.online/login'; // Default login link
            break;
    }

        // Send the reset password notification
        $notification = new EmployeeResetPasswordNotification($employee, $request->password, $loginUrl);
        $notification->sendResetPasswordNotification();

        // Log the admin's action in the audit log
        Audit::create([
            'user' => 'Admin', // Assuming 'Admin' is performing the action
            'action' => 'Reset password for employee: ' . $employee->fname . ' ' . $employee->lname,
            'user_level' => 'Admin',
        ]);

        return response()->json(["message" => "Success"]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Employee $employee)
    {
        $fields = $request->validate([
            'fname' => 'required|max:255',
            'mname' => 'nullable|max:255',
            'extension_name' => 'nullable|max:255',
            'lname' => 'required|max:255',
            'address' => 'required|max:255',
            'type' => 'required|max:255',
            'email' => 'required|email',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ], [
            'fname.required' => 'First name is required.',
            'fname.max' => 'First name must not exceed 255 characters.',
            'mname.required' => 'Middle name is required.',
            'mname.max' => 'Middle name must not exceed 255 characters.',
            'lname.required' => 'Last name is required.',
            'lname.max' => 'Last name must not exceed 255 characters.',
            'address.required' => 'Address is required.',
            'address.max' => 'Address must not exceed 255 characters.',
            'type.required' => 'Employee type is required.',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($employee->image) {
                Storage::disk('public')->delete($employee->image);
            }

            $imagePath = $request->file('image')->store('images', 'public');
            $fields['image'] = $imagePath;
        }



        $employee->update($fields);

    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Find the employee, including soft deleted ones
        $employee = Employee::withTrashed()->find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        // If the employee is already trashed (soft deleted), force delete
        if ($employee->trashed()) {
            // Delete the image associated with the employee
            if ($employee->image) {
                Storage::disk('public')->delete($employee->image);
            }

            // Permanently delete the employee
            $employee->forceDelete();
            return response()->json(['message' => 'Employee permanently deleted']);
        }

        Audit::create([
            'user' => 'Admin',
            'action' => 'Admin permanently deleted employee: ' . $employee->fname . ' ' . $employee->lname,
            'user_level' => 'Admin',
        ]);


        Audit::create([
            'user' => 'Admin',
            'action' => 'Admin archived employee: ' . $employee->fname . ' ' . $employee->lname,
            'user_level' => 'Admin',
        ]);
        // Soft delete the employee
        $employee->delete();
        return response()->json(['message' => 'Employee soft deleted']);
    }


    public function employeeSearch($request) {
        $search_value = $request; // search string
        $search_terms = explode(' ', $search_value); // split search string into terms
        $columns = ['fname', 'mname', 'lname']; // columns to search

        $query = Employee::query(); // Initialize query

        foreach ($search_terms as $term) {
            $query->where(function($q) use ($term, $columns) {
                foreach ($columns as $column) {
                    $q->orWhere($column, 'LIKE', '%' . $term . '%');
                }
            });
        }

        $result = $query->distinct()->get(); // Get distinct results

        return $result;
    }


    public function archive() {
        $employees = Employee::onlyTrashed('year', 'desc')->get();
        return ['employees' => $employees];
    }


    public function recover($id) {
        $employee = Employee::withTrashed()->find($id);
        $employee->restore();

        Audit::create([
            'user' => 'Admin',
            'action' => 'Admin recovered (unarchived) employee: ' . $employee->fname . ' ' . $employee->lname,
            'user_level' => 'Admin',
        ]);

        return ['message' => 'recovered'];
    }

    public function count() {
        $count = Employee::count();

        return ['count' => $count];
    }


    public function updateProfile(Request $request)
{
    // Get the currently authenticated user
    $user = Auth::user();

    // Find the employee record based on the user ID
    $employee = Employee::where('id', $user->id)->firstOrFail();

    // Validate incoming request data
    $fields = $request->validate([
        'email' => 'nullable|email',
        'fname' => 'nullable|max:255',
        'mname' => 'nullable|max:255',
        'lname' => 'nullable|max:255',
        'address' => 'nullable|max:255',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);

    // Handle image upload
    if ($request->hasFile('image')) {
        // Delete old image if exists
        if ($employee->image && Storage::disk('public')->exists($employee->image)) {
            Storage::disk('public')->delete($employee->image);
        }

        // Store new image and update path in $fields
        $imagePath = $request->file('image')->store('images', 'public');
        $fields['image'] = $imagePath;
    }

    // Update employee with validated fields
    $employee->update($fields);

}
public function resetPassword(Request $request)
{
    // Get the currently authenticated user
    $user = Auth::user();

    // Find the employee record based on the user ID
    $employee = Employee::where('id', $user->id)->firstOrFail();

    // Validate incoming request data
    $fields = $request->validate([
        'current_password' => 'required',
        'new_password' => 'required|min:8',

    ]);

    if (!Hash::check($fields['current_password'], $employee->password)) {
        return response()->json(['error' => 'Invalid Credentials'], 403);
    }

    $new_password = [
            'password' => $fields['new_password'],
        ];

    // Update employee with validated fields
    $employee->update($new_password);

}


    public function employeeProfile() {
        $user = Auth::user();

        if ($user->image) {
            $user->image_url = asset('storage/' . $user->image);
        } else {
            $user->image_url = null;
        }

        return ['employee' => $user];
    }

    public function showTeacher() {
        $teacher  = Employee::where('type', 'teacher')->get();


        return response()->json(['teachers' => $teacher]);
    }

    public function getCountTeachers() {
        $count = Employee::where('type','teacher')->count();

        return response()->json($count);
    }



    public function getTeachersList()
    {
        $teachers = Employee::where('type', 'Teacher') // Filter only Teachers
            ->with([
                'advisoryClass', // Load the advisory class
                'subjects' => function ($query) {
                    $query->where('archived', false) // Only include subjects that are not archived
                          ->with(['schedules', 'classroom']); // Load schedules and classrooms for the subjects
                }
            ])
            ->get();

        return response()->json($teachers);
    }



}