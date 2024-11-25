<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Http\Requests\StoreClassroomRequest;
use App\Http\Requests\UpdateClassroomRequest;
use App\Models\Audit;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClassroomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classrooms = DB::table('classrooms')
            ->leftJoin('employees', 'classrooms.adviser_id', '=', 'employees.id')
            ->leftJoin('classlists', 'classrooms.id', '=', 'classlists.class_id')
            ->select(
                'classrooms.id',
                'classrooms.title',
                'classrooms.grade_level',
                'classrooms.adviser_id',
                'employees.lname',
                'employees.fname',
                'employees.mname',
                DB::raw('COUNT(classlists.student_id) as student_count')
            )
            ->where('classrooms.archived', '=', false) // Add condition to exclude archived classrooms
            ->groupBy(
                'classrooms.id',
                'classrooms.title',
                'classrooms.grade_level',
                'classrooms.adviser_id',
                'employees.lname',
                'employees.fname',
                'employees.mname'
            )
            ->get();

        return response()->json(['classrooms' => $classrooms]);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //

        $fields = $request->validate([
            'title' => 'required',
            'grade_level' => 'required',
            'adviser_id' => 'nullable|integer'
        ]);

        $classroom = Classroom::create($fields);
        // Fetch the user performing the action
    $user = auth()->user();
    $userFullName = $user->fname . ' ' . ($user->mname ? $user->mname[0] . '. ' : '') . $user->lname;

    // Log the creation in the audit table
    Audit::create([
        'user' => $userFullName,
        'action' => "Created classroom '{$classroom->title}' for grade level '{$classroom->grade_level}'",
        'user_level' => 'Principal', // Adjust as needed based on user roles
    ]);

    return response()->json(['message' => 'Classroom created successfully!', 'classroom' => $classroom], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Classroom $classroom)
    {
        //

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Classroom $classroom)
    {
        // Validate the request fields
        $fields = $request->validate([
            'title' => 'nullable|string',
            'grade_level' => 'nullable|string',
            'adviser_id' => 'nullable|integer',
        ]);

        // Capture the original classroom details before the update
        $originalDetails = $classroom->only(['title', 'grade_level', 'adviser_id']);

        // Update the classroom with the new details
        $classroom->update($fields);

        // Fetch the user performing the action
        $user = auth()->user();
        $userFullName = $user->fname . ' ' . ($user->mname ? $user->mname[0] . '. ' : '') . $user->lname;

        // Log the update in the audit table
        Audit::create([
            'user' => $userFullName,
            'action' => "Updated classroom '{$classroom->title}'",
            'user_level' => 'Principal', // Adjust as needed based on user roles

        ]);

        return response()->json(['message' => 'Classroom updated successfully!', 'classroom' => $classroom], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Classroom $classroom)
{
    // Check if the classroom has related subjects or classlists
    $hasSubjects = DB::table('subjects')->where('classroom_id', $classroom->id)->exists();
    $hasClasslists = DB::table('classlists')->where('class_id', $classroom->id)->exists();

    // If the classroom has subjects or classlists, prevent deletion
    if ($hasSubjects || $hasClasslists) {
        return response()->json([
            'message' => 'Cannot delete classroom because it has associated subjects or students.'
        ], 400); // Bad request response
    }

    // Capture classroom details before deletion for the audit
    $classroomDetails = $classroom->only(['id', 'title', 'grade_level', 'adviser_id']);

    // Delete the classroom
    $classroom->delete();

    // Fetch the user performing the action
    $user = auth()->user();
    $userFullName = $user->fname . ' ' . ($user->mname ? $user->mname[0] . '. ' : '') . $user->lname;

    // Log the deletion in the audit table
    Audit::create([
        'user' => $userFullName,
        'action' => "Deleted classroom '{$classroomDetails['title']}'",
        'user_level' => 'Principal', // Adjust as needed based on user roles
        'details' => json_encode($classroomDetails),
    ]);

    return response()->json([
        'message' => 'Classroom deleted successfully.'
    ], 200); // Success response
}



    public function countStudentsByGrades() {
        $grades = [7, 8, 9, 10, 11, 12];
        $studentCounts = [];

        foreach ($grades as $grade) {
            $count = Enrollment::where('enrollment_status', 'enrolled')
                ->whereHas('student', function ($query) use ($grade) {
                    $query->where('grade_level', $grade)
                          ->whereDoesntHave('classlists', function ($query) {
                              $query->whereHas('classroom', function ($query) {
                                  $query->where('archived', false); // Only exclude students in non-archived classrooms
                              });
                          });
                })
                ->count();

            $studentCounts[$grade] = $count; // Store the count for each grade level
        }

        return response()->json( $studentCounts);
    }

    public function getCountClassrooms() {
        $count = Classroom::where('archived', false)->count();

        return response()->json($count);
    }
}