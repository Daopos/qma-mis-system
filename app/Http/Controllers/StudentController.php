<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\AcademicYear;
use App\Models\Audit;
use App\Models\Enrollment;
use App\Models\GradeFee;
use App\Models\Guardian;
use App\Models\StudentFee;
use App\Models\StudentTotalFee;
use App\Notifications\GuardianPasswordNotification;
use App\Notifications\StudentPasswordNotification;
use App\Notifications\StudentResetPasswordNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $students = Student::orderBy('created_at', 'desc')->get();
        return [
            'students' => $students
        ];
    }


    /**
     * Store a newly created resource in storage.
     */
    // public function store(Request $request)
    // {
    //     // Validate the request data
    //     $fields = $request->validate([
    //         'lrn' => 'required|digits:12|unique:students,lrn',
    //         'track' => 'nullable|string|max:255',
    //         'strand' => 'nullable|string|max:255',
    //         'surname' => 'required|string|max:255',
    //         'firstname' => 'required|string|max:255',
    //         'middlename' => 'nullable|string|max:255',
    //         'extension_name' => 'nullable|string|max:255',
    //         'street' => 'required|string|max:255',
    //         'barangay' => 'required|string|max:255',
    //         'municipality' => 'required|string|max:255',
    //         'province' => 'required|string|max:255',
    //         'birthdate' => 'required|string|max:255',
    //         'nationality' => 'required|string|max:255',
    //         'birth_municipality' => 'required|string|max:255',
    //         'birth_province' => 'required|string|max:255',
    //         'gender' => 'required|string|max:10',
    //         'religion' => 'required|string|max:255',
    //         'contact' => 'required|string|max:255',
    //         'email' => 'nullable|email|max:255',
    //         'social_media' => 'nullable|string|max:255',
    //         'father_name' => 'required|string|max:255',
    //         'father_occupation' => 'required|string|max:255',
    //         'father_contact' => 'required|string|max:255',
    //         'father_social' => 'nullable|string|max:255',
    //         'mother_name' => 'required|string|max:255',
    //         'mother_occupation' => 'required|string|max:255',
    //         'mother_contact' => 'required|string|max:255',
    //         'mother_social' => 'nullable|string|max:255',
    //         'guardian_name' => 'nullable|string|max:255',
    //         'guardian_occupation' => 'required|string|max:255',
    //         'guardian_contact' => 'required|string|max:255',
    //         'guardian_social' => 'nullable|string|max:255',
    //         'mother_email' => 'nullable|email|max:255',
    //         'father_email' => 'nullable|email|max:255',
    //         'guardian_email' => 'nullable|email|max:255',
    //         'previous_school_name' => 'required|string|max:255',
    //         'previous_school_address' => 'required|string|max:255',
    //         'birth_certificate' => 'nullable|boolean',
    //         'report_card' => 'nullable|boolean',
    //         'transcript_record' => 'nullable|boolean',
    //         'good_moral' => 'nullable|boolean',
    //         'enrolment_status' => 'nullable|string|max:255',
    //         'password' => 'nullable|string|max:255',
    //         'grade_level' => 'required|string|max:255',
    //         'student_fee' => 'nullable|string|max:255',
    //     ]);

    //     // Get the active academic year
    //     $activeAcademicYear = AcademicYear::where('active', true)->first();

    //     if (!$activeAcademicYear) {
    //         return response()->json(['error' => 'No active academic year found.'], 400);
    //     }

    //     // Check for GradeFee records for the given grade_level
    //     $gradeType = $fields['grade_level'];
    //     $gradeFees = GradeFee::where('gradetype', $gradeType)->get();

    //     if ($gradeFees->isEmpty()) {
    //         return response()->json(['error' => 'No grade fees found for the specified grade level.'], 400);
    //     }

    //     // Handle file uploads


    //     // Create the student record
    //     $student = Student::create($fields);

    //     // Prepare fees data based on grade fees
    //     $feesData = [];
    //     $totalFee = 0; // Initialize total fee

    //     foreach ($gradeFees as $gradeFee) {
    //         $feesData[] = [
    //             'title' => $gradeFee->title,
    //             'amount' => $gradeFee->amount,
    //             'student_id' => $student->id,
    //             'academic_year' => $activeAcademicYear->academic_year, // Use the active academic year
    //         ];
    //         $totalFee += $gradeFee->amount; // Accumulate total fee
    //     }

    //     // Create student fees
    //     foreach ($feesData as $fee) {
    //         StudentFee::create($fee);
    //     }

    //     // Create or update StudentTotalFee record
    //     StudentTotalFee::updateOrCreate(
    //         ['student_id' => $student->id],
    //         ['total_fee' => $totalFee]
    //     );

    //     $registrar = auth()->user(); // Assuming you're using Sanctum for authentication

    //     // Log an audit entry for the student registration
    //     Audit::create([
    //         'user' => $registrar->fname . ' ' . ($registrar->mname ? $registrar->mname . ' ' : '') . $registrar->lname,
    //         'action' => 'Added student: ' . $student->firstname . ' ' . $student->surname . ' (Grade Level: ' . $student->grade_level . ')',
    //         'user_level' => 'Registrar',
    //     ]);


    //     return response()->json(['student' => $student], 201);
    // }
    // /**
    public function show(Student $student)
    {
        //
        $student->birth_url = $student->birth_certificate ? asset('storage/' . $student->birth_certificate) : null;
        $student->report_url = $student->report_card ? asset('storage/' . $student->report_card) : null;
        $student->transcript_url = $student->transcript_record ? asset('storage/' . $student->transcript_record) : null;
        $student->moral_url = $student->good_moral ? asset('storage/' . $student->good_moral) : null;



        return [
            'student' => $student
        ];

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student)
    {
        // Validate incoming request fields
        $fields = $request->validate([
            'lrn' => [
                'required',
                'numeric',
                'digits:12',
                Rule::unique('students', 'lrn')->ignore($student->id), // Exclude current student's ID from the check
            ],
            'track' => 'required_if:grade_level,11,12|nullable|string|max:255',
            'strand' => 'required_if:grade_level,11,12|nullable|string|max:255',
            'surname' => 'required|string|max:255',
            'firstname' => 'required|string|max:255',
            'middlename' => 'nullable|string|max:255',
            'extension_name' => 'nullable|string|max:255',
            'street' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'municipality' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'birthdate' => 'required|string|max:255',
            'nationality' => 'required|string|max:255',
            'birth_municipality' => 'required|string|max:255',
            'birth_province' => 'required|string|max:255',
            'gender' => 'required|string|max:10',
            'religion' => 'required|string|max:255',
            'contact' => 'required|numeric|digits:11',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('students', 'email')->ignore($student->id), // Exclude current student's ID from the check
            ],
            'social_media' => 'nullable|string|max:255',
            'father_name' => 'required|string|max:255',
            'father_occupation' => 'required|string|max:255',
            'father_contact' => 'required|numeric|digits:11',
            'father_social' => 'nullable|string|max:255',
            'mother_name' => 'required|string|max:255',
            'mother_occupation' => 'required|string|max:255',
            'mother_contact' => 'required|numeric|digits:11',
            'mother_social' => 'nullable|string|max:255',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_occupation' => 'required|string|max:255',
            'guardian_contact' => 'required|numeric|digits:11',
            'guardian_social' => 'nullable|string|max:255',
            'mother_email' => [
                'nullable',
                'max:255',
            ],
            'father_email' => [
                'nullable',
                'max:255',
            ],
            'guardian_email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('guardians', 'email')->ignore($student->id, 'student_id'), // Exclude current guardian's email
            ],
            'previous_school_name' => 'required|string|max:255',
            'previous_school_address' => 'required|string|max:255',
            'birth_certificate' => 'nullable|boolean',
            'report_card' => 'nullable|boolean',
            'transcript_record' => 'nullable|boolean',
            'good_moral' => 'nullable|boolean',
            'enrolment_status' => 'nullable|string|max:255',
            'grade_level' => 'required|string|max:255',
            'student_fee' => 'nullable|string|max:255',
        ]);

        $gradeLevel = $request->input('grade_level');

        if (in_array($gradeLevel, [11, 12])) {
            // Require track and strand if grade_level is  11 or 12
            $request->validate([
                'track' => 'required|string|max:255',
                'strand' => 'required|string|max:255',
            ]);
        } elseif (in_array($gradeLevel, [7, 8, 9, 10])) {
            // Ensure track and strand are null if grade_level is between 7 and 10
            $request->validate([
                'track' => 'prohibited',
                'strand' => 'prohibited',
            ]);
        }

        // Handle file uploads (if applicable)
        // Example: $request->file('birth_certificate')->store('uploads');

        // Update the existing student record
        $student->update($fields);

         // Check if the guardian exists and update their email if necessary
        $guardian = Guardian::where('student_id', $student->id)->first(); // Fetch guardian by student_id

        if ($guardian) {
            // If the guardian exists and their email is different, update it
            if ($guardian->email !== $fields['guardian_email']) {
                $guardian->update(['email' => $fields['guardian_email']]);
            }
        } else {
            // If no guardian exists, you can choose to create one or handle the logic accordingly
            // Optionally, you can create a new guardian:
            // Guardian::create(['student_id' => $student->id, 'email' => $fields['guardian_email']]);
        }

        $registrar = auth()->user(); // Assuming you're using Sanctum for authentication

        // Log an audit entry for the student registration
        Audit::create([
            'user' => $registrar->fname . ' ' . ($registrar->mname ? $registrar->mname . ' ' : '') . $registrar->lname,
            'action' => 'Edited student: ' . $student->firstname . ' ' . $student->surname . ' (Grade Level: ' . $student->grade_level . ')',
            'user_level' => 'Registrar',
        ]);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        //
        if ($student->birth_certificate) {
            Storage::disk('public')->delete($student->birth_certificate);
        }
        if ($student->good_moral) {
            Storage::disk('public')->delete($student->good_moral);
        }
        if ($student->report_card) {
            Storage::disk('public')->delete($student->report_card);
        }
        if ($student->transcript_record) {
            Storage::disk('public')->delete($student->transcript_record);
        }

        // Permanently delete the student record
        $student->delete();

        return response()->json([
            'message' => 'Student record permanently deleted successfully.'
        ]);
    }

    public function ShowStudentPre() {
        $students = Student::where('enrolment_status', 'pre-enrolled')->get();

        return [
            'students' => $students
        ];
    }

    public function StudentConfirm($id) {
        // Fetch the student with the given ID
        $student = Student::find($id);

        // Check if the student was found
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        // Update the enrollment status
        $student->enrolment_status = 'confirmed';
        $student->save();

        return response()->json(['message' => 'Student enrollment status updated to confirmed'], 200);
    }

    public function ShowStudentConfirm() {
        $students = Student::where('enrolment_status', 'confirmed')->get();

        return [
            'students' => $students
        ];
    }
    public function StudentEnroll(Request $request, $studentId)
    {
        // Fetch the active academic year
        $activeAcademicYear = AcademicYear::where('active', true)->first();

        // Check if there's an active academic year
        if (!$activeAcademicYear) {
            return response()->json(['message' => 'No active academic year found'], 404);
        }

        // Fetch the student with the given ID
        $student = Student::find($studentId);

        // Check if the student was found
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        // Validate the input (only password needed)
        $fields = $request->validate([
            'password' => 'required|string',
        ]);

        // Update the student's password
        $student->update([
            'password' => bcrypt($fields['password']), // Hash the password
            'enrolment_status' => null
        ]);

        // Retrieve the student's grade level from their record
        $gradeLevel = $student->grade_level;

        // Check if the student is already enrolled in this academic year
        $existingEnrollment = Enrollment::where('student_id', $studentId)
            ->where('academic_year_id', $activeAcademicYear->id)
            ->first();

        if ($existingEnrollment) {
            // If the student is already enrolled, update their status
            $existingEnrollment->enrollment_status = 'enrolled';
            $existingEnrollment->grade_level = $gradeLevel; // Use the grade level from the student table
            $existingEnrollment->archived = false; // Ensure the enrollment is not archived
            $existingEnrollment->save();
        } else {
            // If the student is not yet enrolled, create a new enrollment
            Enrollment::create([
                'student_id' => $studentId,
                'academic_year_id' => $activeAcademicYear->id,
                'grade_level' => $gradeLevel, // Use the grade level from the student table
                'enrollment_status' => 'enrolled',
                'archived' => false,
            ]);
        }

        Guardian::create([
            'username' => $student->lrn, // Set the username as the student's LRN
            'password' => bcrypt($fields['password']), // Hash the password
            'email' => $student->guardian_email, // Get guardian's email from student record
            'student_id' => $student->id,
        ]);

        return response()->json(['message' => 'Student enrolled successfully in the active academic year'], 200);
    }

    public function store(Request $request)
{
    // Validate the request data
    $fields = $request->validate([
        'lrn' => 'required|numeric|digits:12|unique:students,lrn',
        'track' => 'required_if:grade_level,11,12|nullable|string|max:255',
        'strand' => 'required_if:grade_level,11,12|nullable|string|max:255',
        'surname' => 'required|string|max:255',
        'firstname' => 'required|string|max:255',
        'middlename' => 'nullable|string|max:255',
        'extension_name' => 'nullable|string|max:255',
        'street' => 'required|string|max:255',
        'barangay' => 'required|string|max:255',
        'municipality' => 'required|string|max:255',
        'province' => 'required|string|max:255',
        'birthdate' => 'required|string|max:255',
        'nationality' => 'required|string|max:255',
        'birth_municipality' => 'required|string|max:255',
        'birth_province' => 'required|string|max:255',
        'gender' => 'required|string|max:10',
        'religion' => 'required|string|max:255',
        'contact' => 'required|numeric|digits:11',
        'email' => 'required|email|max:255|unique:students,email',
        'social_media' => 'nullable|string|max:255',
        'father_name' => 'required|string|max:255',
        'father_occupation' => 'required|string|max:255',
        'father_contact' => 'required|numeric|digits:11',
        'father_social' => 'nullable|string|max:255',
        'mother_name' => 'required|string|max:255',
        'mother_occupation' => 'required|string|max:255',
        'mother_contact' => 'required|numeric|digits:11',
        'mother_social' => 'nullable|string|max:255',
        'guardian_name' => 'required|string|max:255',
        'guardian_occupation' => 'required|string|max:255',
        'guardian_contact' => 'required|numeric|digits:11',
        'guardian_social' => 'nullable|string|max:255',
        'mother_email' => 'nullable|email|max:255',
        'father_email' => 'nullable|email|max:255',
        'guardian_email' => 'required|email|max:255|unique:guardians,email',
        'previous_school_name' => 'required|string|max:255',
        'previous_school_address' => 'required|string|max:255',
        'birth_certificate' => 'nullable|boolean',
        'report_card' => 'nullable|boolean',
        'transcript_record' => 'nullable|boolean',
        'good_moral' => 'nullable|boolean',
        'enrolment_status' => 'nullable|string|max:255',
        'grade_level' => 'required|string|max:255',
        'student_fee' => 'nullable|string|max:255',
    ]);

    $password = Str::random(8);

    // Hash the password and add it to the fields array
    $fields['password'] = Hash::make($password);

    $gradeLevel = $request->input('grade_level');

    if (in_array($gradeLevel, [11, 12])) {
        // Require track and strand if grade_level is 11 or 12
        $request->validate([
            'track' => 'required|string|max:255',
            'strand' => 'required|string|max:255',
        ]);
    } elseif (in_array($gradeLevel, [7, 8, 9, 10])) {
        // Ensure track and strand are null if grade_level is between 7 and 10
        $request->validate([
            'track' => 'prohibited',
            'strand' => 'prohibited',
        ]);
    }

    // Get the active academic year
    $activeAcademicYear = AcademicYear::where('active', true)->first();

    if (!$activeAcademicYear) {
        return response()->json(['error' => 'No active academic year found.'], 400);
    }

    // Check for GradeFee records for the given grade_level
    $gradeType = $fields['grade_level'];
    $gradeFees = GradeFee::where('gradetype', $gradeType)->get();

    if ($gradeFees->isEmpty()) {
        return response()->json(['error' => 'No grade fees found for the specified grade level.'], 400);
    }

    // Create the student record
    $student = Student::create($fields);
    $loginUrl = 'https://qma-portal.online/student/login'; // Default login link

    if ($student->email) {
        $notification = new StudentPasswordNotification($student, $password, $loginUrl);
        $notification->sendPasswordNotification(); // Send the custom notification
    }
    // Prepare fees data based on grade fees
    $feesData = [];
    $totalFee = 0;

    foreach ($gradeFees as $gradeFee) {
        $feesData[] = [
            'title' => $gradeFee->title,
            'amount' => $gradeFee->amount,
            'student_id' => $student->id,
            'academic_year' => $activeAcademicYear->academic_year,
        ];
        $totalFee += $gradeFee->amount;
    }

    // Create student fees
    foreach ($feesData as $fee) {
        StudentFee::create($fee);
    }

    // Create or update StudentTotalFee record
    StudentTotalFee::updateOrCreate(
        ['student_id' => $student->id],
        ['total_fee' => $totalFee]
    );

    $registrar = auth()->user(); // Assuming you're using Sanctum for authentication

    // Log an audit entry for the student registration
    Audit::create([
        'user' => $registrar->fname . ' ' . ($registrar->mname ? $registrar->mname . ' ' : '') . $registrar->lname,
        'action' => 'Added student: ' . $student->firstname . ' ' . $student->surname . ' (Grade Level: ' . $student->grade_level . ')',
        'user_level' => 'Registrar',
    ]);

    // Enrollment section
    // Check if the student is already enrolled in this academic year
    $existingEnrollment = Enrollment::where('student_id', $student->id)
        ->where('academic_year_id', $activeAcademicYear->id)
        ->first();

    if ($existingEnrollment) {
        $existingEnrollment->enrollment_status = 'enrolled';
        $existingEnrollment->grade_level = $student->grade_level;
        $existingEnrollment->archived = false;
        $existingEnrollment->save();
    } else {
        Enrollment::create([
            'student_id' => $student->id,
            'academic_year_id' => $activeAcademicYear->id,
            'grade_level' => $student->grade_level,
            'enrollment_status' => 'enrolled',
            'archived' => false,
        ]);
    }




    if ($student->guardian_email) {
        $guardian_password = Str::random(8);

        $parentloginUrl = 'https://qma-portal.online/parent/login'; // Default login link

        // Create the guardian and get the newly created instance
        $guardian = Guardian::create([
            'username' => $student->lrn,
            'email' => $student->guardian_email,
            'student_id' => $student->id,
            'password' => bcrypt($guardian_password)
        ]);

        // Send a notification with the guardian and generated password
        $notification = new GuardianPasswordNotification($guardian, $guardian_password,$parentloginUrl);
        $notification->sendPasswordNotification(); // Send the custom notification
    }

    return response()->json(['student' => $student, 'message' => 'Student enrolled successfully in the active academic year'], 201);
}


    // public function StudentEnroll(Request $request,$id) {
    //      // Fetch the student with the given ID
    //      $student = Student::find($id);

    //      // Check if the student was found
    //      if (!$student) {
    //          return response()->json(['message' => 'Student not found'], 404);
    //      }

    //      $fields = $request->validate([
    //         'password' => 'required'
    //      ]);

    //      $student->update($fields);

    //      // Update the enrollment status
    //      $student->enrolment_status = 'enrolled';
    //      $student->save();

    //      return response()->json(['message' => 'Student enrollment status updated to confirmed'], 200);
    // }

    public function ShowStudentEnrolled() {
        $enrolledStudents = Enrollment::where('enrollment_status', 'enrolled')
            ->with('student') // Assuming a relationship is defined in Enrollment model
            ->orderByDesc('created_at') // Sort the enrollments by created_at in descending order
            ->get();

        // Extract student information from enrollments
        $students = $enrolledStudents->map(function ($enrollment) {
            return $enrollment->student; // Get the student associated with the enrollment
        });

        return [
            'students' => $students
        ];
    }


//     public function StudentCancel(Request $request,$id) {
//         // Fetch the student with the given ID
//         $student = Student::find($id);

//         // Check if the student was found
//         if (!$student) {
//             return response()->json(['message' => 'Student not found'], 404);
//         }

//         // Update the enrollment status
//         $student->enrolment_status = 'cancelled';
//         $student->save();

//         return response()->json(['message' => 'Student enrollment status updated to confirmed'], 200);
//    }


   public function StudentCancel(Request $request, $id) {
    // Fetch the student with the given ID
    $student = Student::find($id);

    // Check if the student was found
    if (!$student) {
        return response()->json(['message' => 'Student not found'], 404);
    }

    // Update the student's enrollment status
    $student->enrolment_status = 'cancelled';
    $student->save();

    // Fetch the most recent enrollment associated with the student
    $recentEnrollment = Enrollment::where('student_id', $id)
        ->orderBy('created_at', 'desc') // Order by the creation date, descending
        ->first(); // Get the most recent one

    // Check if the recent enrollment exists
    if ($recentEnrollment) {
        // Update the enrollment status to 'unenrolled'
        $recentEnrollment->enrollment_status = 'unenrolled';
        $recentEnrollment->save();
    }

    return response()->json(['message' => 'Student enrollment status updated to cancelled, and the most recent enrollment updated to unenrolled'], 200);
}

public function studentResetPassword(Request $request, $id)
{
    // Retrieve the student by ID
    $student = Student::find($id);

    if (!$student) {
        return response()->json(["message" => "Student not found"], 404);
    }

    // Validate the incoming request for the new password
    $fields = $request->validate([
        "password" => "required|string|min:8" // Add any additional validation as needed
    ]);

    // Generate a new password or use the provided one
    $newPassword = $fields['password'];

    // Hash the new password before updating
    $student->password = bcrypt($newPassword);
    $student->activation = false;

    // Update the student's password in the database
    $student->save();

    // Prepare the notification data
    $loginUrl = 'https://qma-portal.online/student/login'; // Default login link
    // Replace with the actual login URL
    $notification = new StudentResetPasswordNotification($student, $newPassword, $loginUrl);
    $notification->sendResetPasswordNotification(); // Send the reset password notification

    // Log the registrar's action in the audit log
    $registrar = Auth::user();
    Audit::create([
        'user' => $registrar->fname . ' ' . ($registrar->mname ? $registrar->mname . ' ' : '') . $registrar->lname,
        'action' => 'Reset password for student: ' . $student->firstname . ' ' . $student->surname . ' (Grade Level: ' . $student->grade_level . ')',
        'user_level' => 'Registrar',
    ]);

    // Return a success response
    return response()->json(["message" => "Success"]);
}

    public function count() {
        $count = Enrollment::where('enrollment_status', 'enrolled')->count();

        return ['count' => $count];
    }

    // public function getStudentByGrade($grade) {
    //     $students = Student::where('grade_level', $grade)
    //         ->whereDoesntHave('classlists')
    //         ->where('enrolment_status', 'enrolled')
    //         ->get();

    //     return response()->json(['students' => $students]);
    // }

    // public function getStudentByGrade($grade) {
    //     $enrolledStudents = Enrollment::where('enrollment_status', 'enrolled')
    //         ->whereHas('student', function ($query) use ($grade) {
    //             $query->where('grade_level', $grade)
    //                   ->whereDoesntHave('classlists');
    //         })
    //         ->with('student') // Assuming a relationship is defined in the Enrollment model
    //         ->get();

    //     // Extract student information from enrollments
    //     $students = $enrolledStudents->map(function ($enrollment) {
    //         return $enrollment->student; // Get the student associated with the enrollment
    //     });

    //     return response()->json(['students' => $students]);
    // }

    public function getStudentByGrade($grade) {
        $enrolledStudents = Enrollment::where('enrollment_status', 'enrolled')
            ->whereHas('student', function ($query) use ($grade) {
                $query->where('grade_level', $grade)
                      ->whereDoesntHave('classlists', function ($query) {
                          $query->whereHas('classroom', function ($query) {
                              $query->where('archived', false); // Only exclude students in non-archived classrooms
                          });
                      });
            })
            ->with('student') // Assuming a relationship is defined in the Enrollment model
            ->get();

        // Extract student information from enrollments
        $students = $enrolledStudents->map(function ($enrollment) {
            return $enrollment->student; // Get the student associated with the enrollment
        });

        return response()->json(['students' => $students]);
    }
    public function studentProfile() {

        $studentId = Auth::user()->id;

        // Find the student by ID
        $student = Student::find($studentId);

        // Modify the image attribute to include the full URL
        if ($student && $student->image) {
            $student->image = asset('storage/' . $student->image); // Assuming the image is stored in the 'storage' folder
        }

        return response()->json($student);
    }

    public function updateProfile(Request $request)
    {
        // Get the currently authenticated user
        $user = Auth::user();

        // Find the employee record based on the user ID
        $student = Student::find($user->id);

        // Validate incoming request data
        $fields = $request->validate([
            'email' => 'nullable|email',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($student->image && Storage::disk('public')->exists($student->image)) {
                Storage::disk('public')->delete($student->image);
            }

            // Store new image and update path in $fields
            $imagePath = $request->file('image')->store('images', 'public');
            $fields['image'] = $imagePath;
        }

        // Update employee with validated fields
        $student->update($fields);

    }

    public function resetPassword(Request $request)
{
    // Get the currently authenticated user
    $user = Auth::user();

    // Find the employee record based on the user ID
    $student = Student::where('id', $user->id)->firstOrFail();

    // Validate incoming request data
    $fields = $request->validate([
        'current_password' => 'required',
        'new_password' => 'required|min:8',

    ]);

    if (!Hash::check($fields['current_password'], $student->password)) {
        return response()->json(['error' => 'Invalid Credentials'], 403);
    }

    $new_password = [
            'password' => $fields['new_password'],
        ];

    // Update employee with validated fields
    $student->update($new_password);

}

    public function parentProfile() {

        $studentId = Auth::user()->student_id;

        // Find the student by ID
        $student = Student::find($studentId);

        // Modify the image attribute to include the full URL
        if ($student && $student->image) {
            $student->image = asset('storage/' . $student->image); // Assuming the image is stored in the 'storage' folder
        }

        return response()->json($student);
    }




    public function OldStudentConfirm(Request $request, $id)
    {
        // Start a database transaction
        DB::beginTransaction();

        try {
            // Fetch the active academic year
            $activeAcademicYear = AcademicYear::where('active', true)->first();

            // Check if there's an active academic year
            if (!$activeAcademicYear) {
                return response()->json(['message' => 'No active academic year found'], 404);
            }

            // Fetch the student with the given ID
            $student = Student::find($id);

            // Check if the student was found
            if (!$student) {
                return response()->json(['message' => 'Student not found'], 404);
            }

            // Validate the request fields
            $fields = $request->validate([
                'lrn' => 'required|string|max:255',
                'track' => 'nullable|string|max:255',
                'strand' => 'nullable|string|max:255',
                'surname' => 'required|string|max:255',
                'firstname' => 'required|string|max:255',
                'middlename' => 'nullable|string|max:255',
                'extension_name' => 'nullable|string|max:255',
                'street' => 'required|string|max:255',
                'barangay' => 'required|string|max:255',
                'municipality' => 'required|string|max:255',
                'province' => 'required|string|max:255',
                'birthdate' => 'required|string|max:255',
                'nationality' => 'required|string|max:255',
                'birth_municipality' => 'required|string|max:255',
                'birth_province' => 'required|string|max:255',
                'gender' => 'required|string|max:10',
                'religion' => 'required|string|max:255',
                'contact' => 'required|string|max:255',
                'email' => 'nullable|email|max:255',
                'social_media' => 'nullable|string|max:255',
                'father_name' => 'required|string|max:255',
                'father_occupation' => 'required|string|max:255',
                'father_contact' => 'required|string|max:255',
                'father_social' => 'nullable|string|max:255',
                'mother_name' => 'required|string|max:255',
                'mother_occupation' => 'required|string|max:255',
                'mother_contact' => 'required|string|max:255',
                'mother_social' => 'nullable|string|max:255',
                'guardian_name' => 'nullable|string|max:255',
                'guardian_occupation' => 'required|string|max:255',
                'guardian_contact' => 'required|string|max:255',
                'guardian_social' => 'nullable|string|max:255',
                'previous_school_name' => 'required|string|max:255',
                'previous_school_address' => 'required|string|max:255',
                'birth_certificate' => 'nullable|boolean',
                'report_card' => 'nullable|boolean',
                'transcript_record' => 'nullable|boolean',
                'good_moral' => 'nullable|boolean',
                'enrolment_status' => 'nullable|string|max:255',
                'password' => 'nullable|string|max:255',
                'grade_level' => 'required|string|max:255',
                'student_fee' => 'nullable|string|max:255',
            ]);


            // Fetch the student's current grade level
            $currentGradeLevel = $student->grade_level;

            // New grade level from the request
            $newGradeLevel = $fields['grade_level'];

            // Check for existing enrollment for the student
            $existingEnrollment = Enrollment::where('student_id', $id)
                ->where('enrollment_status', "unenrolled")
                ->first();

            // If there is an existing enrollment
            if ($existingEnrollment) {
                // Check if the existing enrollment's grade level matches the new grade level
                if ($existingEnrollment->grade_level === $newGradeLevel) {
                    return response()->json(['message' => 'Student is already enrolled in this grade level.'], 400);
                }
                // Update the status of the existing enrollment to "done"
                $existingEnrollment->enrollment_status = "done";
                $existingEnrollment->save();
            }

            // Prevent enrolling in the same or lower grade level
            if ($newGradeLevel <= $currentGradeLevel) {
                return response()->json(['message' => 'Enrollment cannot be confirmed in the same or lower grade level.'], 400);
            }

            // Create a new enrollment record with status "enrolled"
            Enrollment::create([
                'student_id' => $id,
                'academic_year_id' => $activeAcademicYear->id,
                'grade_level' => $newGradeLevel,
                'enrollment_status' => 'enrolled',
                'archived' => false,
            ]);

            // Update the student record
            $student->update($fields);

            // Confirm the enrollment status to 'done'
            $student->enrolment_status = 'done';
            $student->save();

            // Fetch the new enrollment record
            $enrollment = Enrollment::where('student_id', $id)
                ->where('academic_year_id', $activeAcademicYear->id)
                ->first();

            // Ensure the enrollment record was created
            if (!$enrollment) {
                return response()->json(['message' => 'Enrollment record not found after creation.'], 404);
            }

            // Check for GradeFee records for the given grade_level
            $gradeFees = GradeFee::where('gradetype', $newGradeLevel)->get();

            $totalFee = 0; // Initialize total fee
            foreach ($gradeFees as $gradeFee) {
                StudentFee::create([
                    'title' => $gradeFee->title,
                    'amount' => $gradeFee->amount,
                    'student_id' => $student->id,
                    'academic_year' => $activeAcademicYear->academic_year, // Use the active academic year
                ]);
                $totalFee += $gradeFee->amount; // Accumulate total fee
            }

            // Create or update StudentTotalFee record
            StudentTotalFee::updateOrCreate(
                ['student_id' => $student->id],
                ['total_fee' => $totalFee]
            );

            $registrar = auth()->user(); // Assuming you're using Sanctum for authentication

    // Log an audit entry for the student registration
    Audit::create([
        'user' => $registrar->fname . ' ' . ($registrar->mname ? $registrar->mname . ' ' : '') . $registrar->lname,
        'action' => 'Enroll old student: ' . $student->firstname . ' ' . $student->surname . ' (Grade Level: ' . $student->grade_level . ')',
        'user_level' => 'Registrar',
    ]);

            // Commit the transaction
            DB::commit();

            return response()->json(['message' => 'Student record, enrollment status, and fees updated successfully'], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Rollback the transaction if there is a validation error
            DB::rollBack();
            return response()->json(['errors' => $e->validator->errors()], 422); // Return validation errors
        } catch (\Exception $e) {
            // Rollback the transaction for any other error
            DB::rollBack();
            return response()->json(['message' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }






public function getPreEnrolledCount() {

    $count = Student::where('enrolment_status', 'pre-enrolled')->count();

    return response()->json($count);
}

public function getConfirmedCount() {

    $count = Student::where('enrolment_status', 'confirmed')->count();

    return response()->json($count);
}



public function getStudentsWithoutBirthCertificate()
{
    // Use whereHas to filter based on the enrollment status
    $students = Student::where('birth_certificate', false)
        ->whereHas('enrollments', function ($query) {
            $query->where('enrollment_status', 'enrolled');
        })
        ->get();

    return response()->json($students);
}

    public function getStudentsWithoutReportCard()
    {
        $students = Student::where('birth_certificate', false)->whereHas('enrollments', function ($query) {
            $query->where('enrollment_status', 'enrolled');
        })
        ->get();

        return response()->json($students);
    }

    public function getStudentsWithoutTranscriptRecord()
    {
        $students = Student::where('transcript_record', false)->whereHas('enrollments', function ($query) {
            $query->where('enrollment_status', 'enrolled');
        })
        ->get();

        return response()->json($students);
    }

    public function getStudentsWithoutGoodMoral()
    {
        $students = Student::where('good_moral', false) ->whereHas('enrollments', function ($query) {
            $query->where('enrollment_status', 'enrolled');
        })
        ->get();

        return response()->json($students);
    }



    public function getStudents() {
        $students = Student::all();

        return response()->json($students);

    }

    public function getCountStudents() {
        $count = Student::count();

        return response()->json($count);

    }

    public function getCountStudentsByGrade() {
// Query to count enrolled students per grade level from grade 7 to grade 12
$enrollmentCounts = DB::table('students')
->select('grade_level', DB::raw('count(*) as total'))
->whereIn('grade_level', ['7', '8', '9', '10', '11', '12'])
->groupBy('grade_level')
->get();

// Transform the result into an associative array
$result = [
'grade_7' => 0,
'grade_8' => 0,
'grade_9' => 0,
'grade_10' => 0,
'grade_11' => 0,
'grade_12' => 0,
];
foreach ($enrollmentCounts as $enrollment) {
// Format the key to include 'grade_' prefix
$result['grade_' . $enrollment->grade_level] = $enrollment->total;
}

return response()->json($result); // Example output: ['grade_7' => 2, 'grade_9' => 5] // Example output: ['grade_7' => 10, 'grade_9' => 20]
    }


    public function getStudentWithInfo() {

    }

    public function updateStudentTransfer($id)
    {
        // Find the student by ID
        $student = Student::find($id);

        if ($student) {
            // Update the 'other' field to 'transferred'
            $student->other = 'transferred';

            // Save the changes
            $student->save();

            // Return success response
            return response()->json('Success');
        } else {
            // Return error if student not found
            return response()->json('Student not found', 404);
        }
    }



}
