<?php

namespace App\Http\Controllers;

use App\Models\Classwork;
use App\Http\Requests\StoreClassworkRequest;
use App\Http\Requests\UpdateClassworkRequest;
use App\Models\Classlist;
use App\Models\ClassworkSubmission;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ClassworkController extends Controller
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
        $fields = $request->validate([
            "title" => "required",
            "subject_id" => "required",
            'description' => "nullable",
            "status" => "required",
            "deadline" => 'nullable|date_format:Y-m-d H:i:s',
            "score" => "integer|required",
        ], [
            "title.required" => "Please provide a title for the classwork.",
            "subject_id.required" => "The subject is required. Please select a subject.",
            "status.required" => "Please specify the status of the classwork.",
            "deadline.date_format" => "The deadline must be in the format YYYY-MM-DD HH:MM:SS.",
            "score.required" => "A score is required and must be a whole number.",
            "score.integer" => "The score must be a whole number.",
        ]);

        // Create classwork
        $classwork = Classwork::create($fields);

        // Fetch enrolled students based on the subject's classroom
        $students = DB::table('classlists')
            ->join('students', 'classlists.student_id', '=', 'students.id')
            ->join('subjects', 'classlists.class_id', '=', 'subjects.classroom_id')
            ->where('subjects.id', $classwork->subject_id)
            ->select('students.*')
            ->get();

        // Get the subject title for notification
        $subjectTitle = DB::table('subjects')
            ->where('id', $classwork->subject_id)
            ->value('title');

        // Create notifications for each enrolled student
        foreach ($students as $student) {
            Notification::create([
                'user_id' => $student->id,
                'title' => 'New Classwork Assigned',
                'message' => "A new classwork titled '{$classwork->title}' has been assigned in the subject '{$subjectTitle}'.",
            ]);
        }

        return response()->json(['message' => 'Successfully Created']);
    }


    /**
     * Display the specified resource.
     */
    public function show(Classwork $classwork)
    {
        return response()->json($classwork);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Classwork $classwork)
    {


        $fields = $request->validate([
            "title" => "required",
            'description' => "nullable",
            "status" => "required",
            "deadline" => "date_format:Y-m-d H:i:s|nullable",
            "score" => "integer",
           ]);

        $classwork->update($fields);


        return response()->json(['message' => 'Successfully Updated']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Classwork $classwork)
    {
        //
        $classwork->delete();

        return response()->json(['message' => 'Successfully Deleted']);

    }
public function getClassworkBySubject($id) {

    // Classwork::updateStatusBasedOnDeadline();

    $classworks = Classwork::where('subject_id', $id)
        ->withCount('submissions') // Count the submissions
        ->orderByDesc('created_at')
        ->get();



    return response()->json($classworks);
}
public function getClassworksForStudent($subjectId)
{

    // Classwork::updateStatusBasedOnDeadline();

    $studentId = Auth::user()->id;

    // Get classworks with submissions and student classworks for the student
    $classworks = Classwork::with(['submissions' => function($query) use ($studentId) {
        $query->where('student_id', $studentId)
              ->with(['studentClassworks' => function($query) {
                  $query->select('id', 'submission_id', 'file');  // Fetch student classwork details including files
              }]);
    }])->where('subject_id', $subjectId)
        ->orderBy('created_at', 'desc')
        ->get();

    // Check deadlines and append file URLs to each studentClasswork
    $classworks->each(function ($classwork) {


        // Append file URLs
        $classwork->submissions->each(function ($submission) {
            $submission->studentClassworks->each(function ($studentClasswork) {
                // Use Laravel Storage to get the file URL
                $studentClasswork->file_url = $studentClasswork->file ? Storage::url($studentClasswork->file) : null;
            });
        });
    });

    return response()->json($classworks);
}

// public function getSubmissionsByClasswork($classworkId)
// {
//     // Fetch submissions for the specified classwork_id, including student and student_classworks
//     $submissions = ClassworkSubmission::with(['studentClassworks', 'student'])
//         ->where('classwork_id', $classworkId)
//         ->get();

//     // if ($submissions->isEmpty()) {
//     //     return response()->json(['error' => 'No submissions found for this classwork.'], 404);
//     // }

//     // Attach file URLs to each student_classwork
//     foreach ($submissions as $submission) {
//         foreach ($submission->studentClassworks as $studentClasswork) {
//             $studentClasswork->file_url = $studentClasswork->file ? asset('storage/studentfiles/' . $studentClasswork->file) : null;
//         }
//     }

//     return response()->json($submissions);
// }
public function getSubmissionsByClasswork($classworkId)
{
    // Get the classwork and its associated subject
    $classwork = Classwork::with('subject')->findOrFail($classworkId);

    // Get the classroom ID through the subject
    $classroomId = $classwork->subject->classroom_id;

    if (!$classroomId) {
        return response()->json(['error' => 'Classroom not found for the subject of this classwork.'], 404);
    }

    // Fetch all students in the class
    $students = Classlist::with('student')
        ->where('class_id', $classroomId)
        ->get()
        ->pluck('student');

    if ($students->isEmpty()) {
        return response()->json(['error' => 'No students found in this class.'], 404);
    }

    // Fetch submissions for the classwork
    $submissions = ClassworkSubmission::with(['studentClassworks', 'student'])
        ->where('classwork_id', $classworkId)
        ->get()
        ->keyBy('student_id');

    // Combine students with their submissions
    $results = $students->map(function ($student) use ($submissions) {
        $submission = $submissions->get($student->id);

        return [
            'student' => $student,
            'submission' => $submission ? [
                'id' => $submission->id,
                'created_at' => $submission->created_at,
                'score' => $submission->score,
                'student_classworks' => $submission->studentClassworks->map(function ($studentClasswork) {
                    return [
                        'id' => $studentClasswork->id,
                        'file' => $studentClasswork->file,
                        'file_url' => $studentClasswork->file ? asset('storage/' . $studentClasswork->file) : null,
                    ];
                }),
            ] : null, // If no submission, return null
        ];
    });

    return response()->json($results);
}

}
