<?php

namespace App\Http\Controllers;

use App\Models\Classlist;
use App\Http\Requests\StoreClasslistRequest;
use App\Http\Requests\UpdateClasslistRequest;
use App\Models\Audit;
use App\Models\Classroom;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClasslistController extends Controller
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
    public function store(Request $request)
    {
        // Retrieve the authenticated principal's information
        $principal = auth()->user();

        // Validate incoming request data
        $fields = $request->validate([
            '*.student_id' => 'required|exists:students,id', // Ensure student exists
            '*.class_id' => 'required|exists:classrooms,id', // Ensure classroom exists
        ]);

        // Prepare the principal's full name
        $fullName = $principal->fname . ' ' .
            ($principal->mname ? $principal->mname[0] . '. ' : '') . // Include middle initial if present
            $principal->lname;

        // Iterate over each student and log an audit entry for their addition
        foreach ($fields as $entry) {
            // Add the student to the classlist
            $createdClasslist = Classlist::create($entry);

            // Retrieve the classroom and student details
            $classroom = Classroom::find($entry['class_id']); // Get classroom by ID
            $student = Student::find($entry['student_id']);   // Get student by ID

            // Prepare the student's full name
            $studentFullName = $student->firstname . ' ' .
                ($student->middlename ? $student->middlename[0] . '. ' : '') .
                $student->surname;

            // Log an audit for the student addition
            Audit::create([
                'user' => $fullName,
                'action' => "Added student '{$studentFullName}' to classroom '{$classroom->title}'",
                'user_level' => "Principal",
            ]);
        }

        return response()->json([
            'message' => 'Students successfully added to the classlist!',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Classlist $classlist)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClasslistRequest $request, Classlist $classlist)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($ids)
{
    // Convert the comma-separated string of IDs into an array
    $idsArray = explode(',', $ids);

    // Ensure $idsArray is an array of integers
    $idsArray = array_map('intval', $idsArray);

    // Retrieve the authenticated principal's information
    $principal = auth()->user();
    $principalFullName = $principal->fname . ' ' .
        ($principal->mname ? $principal->mname[0] . '. ' : '') .
        $principal->lname;

    // Fetch the classlist records before deletion for audit logging
    $classlists = Classlist::whereIn('id', $idsArray)->get();

    // Iterate over the records to log audits
    foreach ($classlists as $classlist) {
        $student = Student::find($classlist->student_id);
        $classroom = Classroom::find($classlist->class_id);

        // Prepare student's full name
        $studentFullName = $student->firstname . ' ' .
            ($student->middlename ? $student->middlename[0] . '. ' : '') .
            $student->surname;

        // Log the audit for each removed student
        Audit::create([
            'user' => $principalFullName,
            'action' => "Removed student '{$studentFullName}' from classroom '{$classroom->title}'",
            'user_level' => "Principal",
        ]);
    }

    // Delete the records by IDs
    Classlist::whereIn('id', $idsArray)->delete();

    return response()->json(['message' => 'Records deleted successfully.']);
}


        //


        public function getByClassId($id) {
            $classLists = ClassList::with('student')  // Eager load the student relationship
                ->where('class_id', $id)
                ->get();

            // Map over the results to include both the student and the classlist ID
            $students = $classLists->map(function($classList) {
                return [
                    'classlist_id' => $classList->id,
                    'student' => $classList->student,
                ];
            });

            return response()->json(['students' => $students]);
        }

    public function getStudentByAdviser() {

        $user = Auth::user();


        $students = Classlist::join('students', 'classlists.student_id', '=', 'students.id')
        ->join('classrooms', 'classlists.class_id', '=', 'classrooms.id')
        ->where('classrooms.adviser_id', $user->id)
        ->select('students.*')
        ->get();


        return response()->json($students);
    }

}
