<?php

namespace App\Http\Controllers;

use App\Models\TestSubmission;
use App\Http\Requests\StoreTestSubmissionRequest;
use App\Http\Requests\UpdateTestSubmissionRequest;
use App\Models\Question;
use App\Models\StudentAnswer;
use App\Models\TeacherNotification;
use App\Models\Test;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TestSubmissionController extends Controller
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
    public function store(StoreTestSubmissionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(TestSubmission $testSubmission)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTestSubmissionRequest $request, TestSubmission $testSubmission)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TestSubmission $testSubmission)
    {
        //
    }

    public function submitTest(Request $request)
{
    $studentId = Auth::user()->id;

    // Validate the incoming request data
    $validatedData = $request->validate([
        'test_id' => 'required|exists:tests,id', // Ensure test_id exists in the tests table
        'answers' => 'required|array',
        'answers.*.question_id' => 'required|exists:questions,id',
        'answers.*.answer' => 'nullable|string',
    ]);

    $testId = $validatedData['test_id'];

    // Retrieve the test
    $test = Test::with('subject.teacher')->find($testId); // Eager load subject and teacher
    if (!$test) {
        \Log::error('Test not found for ID: ' . $testId, ['request_data' => $request->all()]);
        return response()->json(['message' => 'Invalid test ID.'], 404);
    }

    // Check if the test is closed
    if ($test->status === 'closed') {
        return response()->json(['message' => 'The test is closed and cannot be submitted.'], 403);
    }

    // Get the teacher associated with the test's subject
    $teacherId = $test->subject->teacher_id ?? null;
    if (!$teacherId) {
        \Log::warning('No teacher found for test ID: ' . $testId, [
            'test_id' => $testId,
            'subject_id' => $test->subject_id,
        ]);
        return response()->json(['message' => 'No teacher associated with this test.'], 400);
    }

    // Create the test submission record
    $submission = TestSubmission::create([
        'test_id' => $testId,
        'student_id' => $studentId,
    ]);

    // Fetch correct answers for the test
    $questions = Question::whereIn('id', array_column($validatedData['answers'], 'question_id'))
                         ->get()
                         ->keyBy('id');

    // Iterate over answers and create StudentAnswer records
    foreach ($validatedData['answers'] as $answerData) {
        $question = $questions->get($answerData['question_id']);
        $isCorrect = null;
        $score = 0;

        if ($question) {
            if ($question->correct_answer == $answerData['answer']) {
                $isCorrect = true;
                $score = 1; // Increment score for correct answer
            } else {
                $isCorrect = false;
            }
        }

        // Create the StudentAnswer record
        StudentAnswer::create([
            'submission_id' => $submission->id,
            'question_id' => $answerData['question_id'],
            'answer' => $answerData['answer'],
            'is_correct' => $isCorrect,
            'score' => $score,
        ]);
    }

    // Optionally set is_pass based on criteria
    $isPass = false; // Modify this logic as needed

    // Update the submission record with the is_pass boolean
    $submission->is_done = $isPass;
    $submission->save();

    // Send a notification to the teacher
    $student = Auth::user(); // Assuming the authenticated user is the student
    $fullName = $student->firstname .
                ($student->middlename ? ' ' . $student->middlename : '') .
                ' ' . $student->surname .
                ($student->extension_name ? ' ' . $student->extension_name : ''); // Build the full name

    TeacherNotification::create([
        'user_id' => $teacherId,
        'title' => 'New Test Submission',
        'message' => $fullName . ' has submitted the assessment titled "' . $test->title . '".',
    ]);

    return response()->json(['message' => 'Test submitted successfully.']);
}




    // public function getSubmissions($testId)
    // {
    //     // Fetch submissions for the specified test, including student data
    //     $submissions = TestSubmission::where('test_id', $testId)
    //         ->with('student') // Assuming a relation to the student exists
    //         ->get();

    //     // Map through each submission and calculate the total score
    //     $submissionsWithScores = $submissions->map(function ($submission) {
    //         // Calculate the total score from StudentAnswer table
    //         $totalScore = StudentAnswer::where('submission_id', $submission->id)
    //                                    ->sum('score');

    //       return [
    //        'id' => $submission->id,
    //         'student' => $submission->student, // Include student information
    //         'test_id' => $submission->test_id,
    //         'is_pass' => $submission->is_pass,
    //         'total_score' => $totalScore, // Calculated total score
    //         'created_at' => $submission->created_at->toDateTimeString(), // Include created_at timestamplude created_at timestamp
    //     ];
    //     });

    //     return response()->json($submissionsWithScores);
    // }

    public function getSubmissions($testId)
{
    // Fetch the test with its related subject and classroom
    $test = Test::with(['subject.classroom.classlistss.student'])
                ->find($testId);

    if (!$test) {
        return response()->json(['message' => 'Test not found'], 404);
    }

    // Get all students in the classroom of the subject
    $students = $test->subject->classroom->classlistss->pluck('student'); // Get all students from classlists

    // Fetch existing submissions
    $submissions = TestSubmission::where('test_id', $testId)
        ->with('student') // Include student information in the submission
        ->get();

    // Map through all students and check if they have made a submission
    $submissionsWithScores = $students->map(function ($student) use ($submissions, $testId) {
        // Find the submission for the student
        $submission = $submissions->firstWhere('student_id', $student->id);

        $totalScore = 0;
        $isDone = false;

        if ($submission) {
            // If a submission exists, calculate the total score from StudentAnswer table
            $totalScore = StudentAnswer::where('submission_id', $submission->id)->sum('score');
            $isDone = $submission->is_done;
        }

        return [
            'id' => $submission->id ?? null, // Include submission id if exists
            'student' => $student, // Include student information
            'test_id' => $testId,
            'is_done' => $isDone,
            'total_score' => $totalScore,
            'created_at' => $submission ? $submission->created_at->toDateTimeString() : null,
            'status' => $submission ? ($submission->is_done ? 'Submitted' : 'Pending') : 'Not Submitted',
        ];
    });

    return response()->json($submissionsWithScores);
}

public function getStudentSubmissionAnswer($testId, $studentId)
{
    $submission = TestSubmission::where('test_id', $testId)
        ->where('student_id', $studentId)
        ->with(['student', 'answers.question']) // Load answers and related questions
        ->firstOrFail();

    return response()->json($submission);

}

}
