<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Http\Requests\StoreSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;
use App\Models\Audit;
use App\Models\Classroom;
use App\Models\Employee;
use App\Models\SubjectSchedule;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SubjectController extends Controller
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
    // public function store(Request $request)
    // {
    //     //
    //     $fields = $request->validate([
    //         'title' => 'required',
    //         'teacher_id' => 'nullable',
    //         'classroom_id' => 'required',
    //         'start' => 'nullable',
    //         'end' => 'nullable',
    //         'day' => 'nullable',
    //     ]);

    //     $subject = Subject::create($fields);

    // }

//     public function store(Request $request)
// {
//     // Validate the incoming request
//     $fields = $request->validate([
//         'title' => 'required|string',
//         'teacher_id' => 'nullable|exists:employees,id',
//         'classroom_id' => 'required|exists:classrooms,id',
//         'start' => 'required|date_format:H:i',
//         'end' => 'required|date_format:H:i|after:start',
//         'day' => 'required|string',
//     ]);

//     // Check for overlapping schedule in the same classroom
//     $classOverlap = Subject::where('classroom_id', $fields['classroom_id'])
//         ->where('day', $fields['day'])
//         ->where(function ($query) use ($fields) {
//             $query->whereBetween('start', [$fields['start'], $fields['end']])
//                   ->orWhereBetween('end', [$fields['start'], $fields['end']])
//                   ->orWhere(function ($query) use ($fields) {
//                       $query->where('start', '<=', $fields['start'])
//                             ->where('end', '>=', $fields['end']);
//                   });
//         })
//         ->exists();

//     if ($classOverlap) {
//         return response()->json(['error' => 'Another class is scheduled in this classroom during the selected time.'], 422);
//     }

//     // Check for overlapping schedule for the same teacher
//     if (!empty($fields['teacher_id'])) {
//         $teacherOverlap = Subject::where('teacher_id', $fields['teacher_id'])
//             ->where('day', $fields['day'])
//             ->where(function ($query) use ($fields) {
//                 $query->whereBetween('start', [$fields['start'], $fields['end']])
//                       ->orWhereBetween('end', [$fields['start'], $fields['end']])
//                       ->orWhere(function ($query) use ($fields) {
//                           $query->where('start', '<=', $fields['start'])
//                                 ->where('end', '>=', $fields['end']);
//                       });
//             })
//             ->exists();

//         if ($teacherOverlap) {
//             return response()->json(['error' => 'This teacher is already scheduled to teach another class during this time.'], 422);
//         }
//     }

//     // If no overlaps, create the subject
//     $subject = Subject::create($fields);

//     return response()->json($subject, 201);
// }


public function store(Request $request)
{
    // Validate general fields
    $fields = $request->validate([
        'title' => 'required|string',
        'teacher_id' => 'nullable|exists:employees,id',
        'classroom_id' => 'required|exists:classrooms,id',
        'schedules' => 'required|array|min:1|max:3', // Allow up to 3 schedules
        'schedules.*.start' => 'required|date_format:H:i',
        'schedules.*.end' => 'required|date_format:H:i|after:schedules.*.start',
        'schedules.*.day' => 'required|string',
    ]);

    // Begin a transaction
    DB::beginTransaction();

    try {
        $subject = Subject::create([
            'title' => $fields['title'],
            'teacher_id' => $fields['teacher_id'],
            'classroom_id' => $fields['classroom_id'],
        ]);

        foreach ($fields['schedules'] as $schedule) {
            // Check for overlapping schedule in the classroom
            $classOverlap = SubjectSchedule::where('classroom_id', $fields['classroom_id'])
                ->where('day', $schedule['day'])
                ->where(function ($query) use ($schedule) {
                    $query->whereBetween('start', [$schedule['start'], $schedule['end']])
                          ->orWhereBetween('end', [$schedule['start'], $schedule['end']])
                          ->orWhere(function ($query) use ($schedule) {
                              $query->where('start', '<=', $schedule['start'])
                                    ->where('end', '>=', $schedule['end']);
                          });
                })
                ->exists();

            if ($classOverlap) {
                // Rollback the transaction and return error response
                DB::rollBack();
                return response()->json(['error' => 'Another class is scheduled in this classroom during the selected time.'], 422);
            }

            // Check for overlapping schedule for the same teacher
            if (!empty($fields['teacher_id'])) {
                $teacherOverlap = SubjectSchedule::where('teacher_id', $fields['teacher_id'])
                    ->where('day', $schedule['day'])
                    ->where(function ($query) use ($schedule) {
                        $query->whereBetween('start', [$schedule['start'], $schedule['end']])
                              ->orWhereBetween('end', [$schedule['start'], $schedule['end']])
                              ->orWhere(function ($query) use ($schedule) {
                                  $query->where('start', '<=', $schedule['start'])
                                        ->where('end', '>=', $schedule['end']);
                              });
                    })
                    ->exists();

                if ($teacherOverlap) {
                    // Rollback the transaction and return error response
                    DB::rollBack();
                    return response()->json(['error' => 'This teacher is already scheduled to teach another class during this time.'], 422);
                }
            }

            // Store the schedule
            SubjectSchedule::create([
                'subject_id' => $subject->id,
                'classroom_id' => $fields['classroom_id'],
                'teacher_id' => $fields['teacher_id'],
                'start' => $schedule['start'],
                'end' => $schedule['end'],
                'day' => $schedule['day'],
            ]);
        }


        $user = auth()->user();
        $userFullName = $user->fname . ' ' . ($user->mname ? $user->mname[0] . '. ' : '') . $user->lname;

        Audit::create([
            'user' => $userFullName,
            'action' => "Created subject '{$subject->title}' for classroom '{$subject->classroom->title}'",
            'user_level' => 'Principal',
        ]);


        // Commit the transaction if everything is successful
        DB::commit();
        return response()->json($subject, 201);

    } catch (\Exception $e) {
        // Rollback the transaction if there's an error
        DB::rollBack();
        return response()->json(['error' => 'Failed to create subject due to an unexpected error.'], 500);
    }
}


    /**
     * Display the specified resource.
     */
    public function show(Subject $subject)
    {
        // Load the classroom and schedules relationships
        $subject->load([
            'classroom' => function($query) {
                $query->where('archived', false);
            },
            'schedules' // Load schedules directly
        ]);

        // Format start and end times for each schedule
        foreach ($subject->schedules as $schedule) {
            $schedule->formatted_time = Carbon::parse($schedule->start)->format('g:iA') . '-' . Carbon::parse($schedule->end)->format('g:iA');
        }

        return response()->json($subject);
    }

    public function showArchived($subjectId)
    {
        // Find the subject by its ID
        $subject = Subject::with([
            'classroom' => function ($query) {
                $query->where('archived', true);
            },
            'schedules'
        ])->findOrFail($subjectId);

        // Format start and end times for each schedule
        foreach ($subject->schedules as $schedule) {
            $schedule->formatted_time = Carbon::parse($schedule->start)->format('g:iA') . '-' . Carbon::parse($schedule->end)->format('g:iA');
        }

        return response()->json($subject);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Subject $subject)
{
    // Attempt to normalize times to H:i format
    $schedules = $request->input('schedules', []);
    foreach ($schedules as $index => &$schedule) {
        if (!empty($schedule['start'])) {
            $schedule['start'] = date('H:i', strtotime($schedule['start']));
        }
        if (!empty($schedule['end'])) {
            $schedule['end'] = date('H:i', strtotime($schedule['end']));
        }
    }
    $request->merge(['schedules' => $schedules]);

    // Validate after normalizing
    $fields = $request->validate([
        'title' => 'nullable|string|max:255',
        'teacher_id' => 'nullable|exists:employees,id',
        'classroom_id' => 'required|exists:classrooms,id',
        'schedules' => 'nullable|array|min:1|max:3',
        'schedules.*.start' => 'nullable|date_format:H:i',
        'schedules.*.end' => 'nullable|date_format:H:i',
        'schedules.*.day' => 'nullable|string',
    ]);

    // Validation and update logic as before...

    // Update subject details
    $subject->update([
        'title' => $fields['title'],
        'teacher_id' => $fields['teacher_id'],
        'classroom_id' => $fields['classroom_id'],
    ]);

    // Update schedules
    $subject->schedules()->delete(); // Remove existing schedules

    foreach ($fields['schedules'] as $scheduleData) {
        if (isset($scheduleData['start'], $scheduleData['end'], $scheduleData['day'])) {
            $subject->schedules()->create([
                'classroom_id' => $fields['classroom_id'],
                'teacher_id' => $fields['teacher_id'],
                'start' => $scheduleData['start'],
                'end' => $scheduleData['end'],
                'day' => $scheduleData['day'],
            ]);
        }
    }

       // Fetch the classroom name
       $classroom = Classroom::find($fields['classroom_id']);

       // Log audit for the update
       $user = auth()->user();
       $userFullName = $user->fname . ' ' . ($user->mname ? $user->mname[0] . '. ' : '') . $user->lname;

       Audit::create([
           'user' => $userFullName,
           'action' => "Updated subject '{$subject->title}' in classroom '{$classroom->title}'",
           'user_level' => 'Principal',

       ]);

    return response()->json(['message' => 'Subject updated successfully!']);
}
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subject $subject)
    {
        // Begin a transaction
        DB::beginTransaction();

        try {
            // Fetch related data before deleting
            $classroom = $subject->classroom; // Assuming the Subject model has a `belongsTo` relationship with Classroom
            $classroomName = $classroom ? $classroom->title : 'Unknown';

            // Fetch the user performing the action
            $user = auth()->user();
            $userFullName = $user->fname . ' ' . ($user->mname ? $user->mname[0] . '. ' : '') . $user->lname;

            // Log the deletion in the audit table
            Audit::create([
                'user' => $userFullName,
                'action' => "Deleted subject '{$subject->title}' from classroom '{$classroomName}'",
                'user_level' => 'Principal',
            ]);

            // Delete the subject
            $subject->delete();

            // Commit the transaction
            DB::commit();

            return response()->json(['message' => 'Subject deleted successfully.'], 200);

        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            return response()->json(['error' => 'Failed to delete subject due to an unexpected error.'], 500);
        }
    }


    // public function getSubjectByClass($id) {
    //     // Join the subjects table with the employees table using teacher_id and employees.id
    //     $subjects = Subject::leftJoin('employees', 'subjects.teacher_id', '=', 'employees.id')
    //         ->select('subjects.*', 'employees.fname', 'employees.mname', 'employees.lname') // Assuming employees table has a 'name' column
    //         ->where('subjects.classroom_id', $id) // Filter by classroom_id
    //         ->get();

    //     // Return the subjects along with the teacher's name in the response
    //     return response()->json(['subjects' => $subjects]);
    // }

    public function getSubjectByClass($id) {
        // Join the subjects table with the employees table using teacher_id and employees.id
        // Also join with subject_schedules to get the schedules
        $subjects = Subject::leftJoin('employees', 'subjects.teacher_id', '=', 'employees.id')
            ->leftJoin('subject_schedules', 'subjects.id', '=', 'subject_schedules.subject_id') // Join with subject_schedules
            ->select('subjects.*',
                     'employees.fname as teacher_fname',
                     'employees.mname as teacher_mname',
                     'employees.lname as teacher_lname',
                     'subject_schedules.start',
                     'subject_schedules.end',
                     'subject_schedules.day') // Select relevant fields
            ->where('subjects.classroom_id', $id) // Filter by classroom_id
            ->get();

        // Group by subject id to consolidate schedules
        $groupedSubjects = $subjects->groupBy('id')->map(function ($subjectGroup) {
            $subject = $subjectGroup->first(); // Get the subject details
            $schedules = $subjectGroup->map(function ($item) {
                return [
                    'start' => $item->start,
                    'end' => $item->end,
                    'day' => $item->day,
                ];
            })->toArray(); // Collect schedules into an array

            // Add schedules to subject
            $subject->schedules = $schedules;

            return $subject;
        })->values(); // Reset keys

        // Return the subjects along with the teacher's name and schedules in the response
        return response()->json(['subjects' => $groupedSubjects]);
    }

    public function getSubjectByTeacher() {
        $user = Auth::user();

        $subjects = Subject::with('schedules') // Eager load schedules
            ->join('classrooms', 'subjects.classroom_id', '=', 'classrooms.id')
            ->select('subjects.*', 'classrooms.title AS classroom_title', 'classrooms.grade_level')
            ->where('subjects.teacher_id', $user->id)
            ->where(function($query) {
                $query->where('subjects.archived', false)
                      ->orWhereNull('subjects.archived');
            })
            ->get();

        return response()->json(['subjects' => $subjects]);
    }

    public function getArchivedSubjectsByTeacher() {
        $user = Auth::user();

        // Retrieve archived subjects along with classroom information
        $archivedSubjects = Subject::join('classrooms', 'subjects.classroom_id', '=', 'classrooms.id')
            ->select('subjects.*', 'classrooms.title AS classroom_title', 'classrooms.grade_level')
            ->where('subjects.teacher_id', $user->id)  // Specify the table for teacher_id
            ->where('subjects.archived', true)  // Specify the table for archived subjects
            ->get();

        return response()->json(['archived_subjects' => $archivedSubjects]);
    }

    public function getSubjectByStudent()
    {
        $user = Auth::user();
        $studentId = $user->id;

        $subjects = Subject::with('schedules') // Eager load schedules
            ->join('classrooms', 'subjects.classroom_id', '=', 'classrooms.id')
            ->join('classlists', 'classrooms.id', '=', 'classlists.class_id')
            ->join('employees', 'subjects.teacher_id', '=', 'employees.id')
            ->where('classlists.student_id', $studentId)
            ->where('classrooms.archived', false)
            ->select(
                'subjects.*',
                'employees.fname as teacher_fname',
                'employees.lname as teacher_lname',
                'classrooms.title as classroom_title'
            )
            ->get();

        return response()->json(['subjects' => $subjects]);
    }

    public function getStudentsBySubject($subjectId)
{
    $students = DB::table('subjects')
        ->join('classrooms', 'subjects.classroom_id', '=', 'classrooms.id')
        ->join('classlists', 'classlists.class_id', '=', 'classrooms.id')
        ->join('students', 'classlists.student_id', '=', 'students.id')
        ->select('students.*', 'classrooms.title AS classroom_title', 'subjects.title AS subject_title')
        ->where('subjects.id', $subjectId)
        ->get();

    return response()->json($students);
}

public function getSubjectByparent() {
    $user = Auth::user();
    $studentId = $user->student_id; // Assuming this is the actual student ID field for the parent user

    $subjects = Subject::with('schedules') // Eager load schedules
        ->join('classrooms', 'subjects.classroom_id', '=', 'classrooms.id')
        ->join('classlists', 'classrooms.id', '=', 'classlists.class_id')
        ->join('employees', 'subjects.teacher_id', '=', 'employees.id')
        ->where('classlists.student_id', $studentId)
        ->where('classrooms.archived', false)
        ->select(
            'subjects.*',
            'employees.fname as teacher_fname',
            'employees.lname as teacher_lname',
            'classrooms.title as classroom_title'
        )
        ->get();

    return response()->json(['subjects' => $subjects]);
}
public function getSubjectCountByTeacher() {

    $user = Auth::user();

    $subjectCount = Subject::join('classrooms', 'subjects.classroom_id', '=', 'classrooms.id')
        ->where('subjects.teacher_id', $user->id)  // Specify the table for teacher_id
        ->where('subjects.archived', false)  // Specify the table for archived
        ->count();

    return response()->json(['subject_count' => $subjectCount]);

}

public function getSubjectCountByStudent() {
    $user = Auth::user();
    $studentId = $user->id;

    $subjectCount = DB::table('subjects')
        ->join('classrooms', 'subjects.classroom_id', '=', 'classrooms.id')
        ->join('classlists', 'classrooms.id', '=', 'classlists.class_id')
        ->join('employees', 'subjects.teacher_id', '=', 'employees.id')
        ->where('classlists.student_id', operator: $studentId)
        ->where('classrooms.archived', false)
        ->count();

    return response()->json(['subject_count' => $subjectCount]);
}

public function getSubjectCountByParent() {
    $user = Auth::user();
    $studentId = $user->student_id;

    $subjectCount = DB::table('subjects')
        ->join('classrooms', 'subjects.classroom_id', '=', 'classrooms.id')
        ->join('classlists', 'classrooms.id', '=', 'classlists.class_id')
        ->join('employees', 'subjects.teacher_id', '=', 'employees.id')
        ->where('classlists.student_id', $studentId)
        ->where('classrooms.archived', false)
        ->count();

    return response()->json(['subject_count' => $subjectCount]);
}

}