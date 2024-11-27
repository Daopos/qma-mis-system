<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Http\Requests\StoreEnrollmentRequest;
use App\Http\Requests\UpdateEnrollmentRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class EnrollmentController extends Controller
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
    public function store(StoreEnrollmentRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Enrollment $enrollment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEnrollmentRequest $request, Enrollment $enrollment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Enrollment $enrollment)
    {
        //
    }
    public function getUnenrolledStudents()
    {
        // Query to get students where enrollment_status is not 'enrolled'
        $unenrolledStudents = Enrollment::where('enrollment_status', '=', 'unenrolled')
                                         ->with('student') // Optional: Load the student relationship
                                         ->get()
                                         ->map(function ($enrollment) {
                                             // Get the student and add the full image URL to the student data
                                             $student = $enrollment->student;
                                             // Check if image exists and generate full URL
                                             if ($student->image) {
                                                $student->image_url = $student->image ? url(Storage::url($student->image)) : null;
                                             } else {
                                                 $student->image_url = null; // Handle case where no image exists
                                             }
                                             return $enrollment;
                                         });

        return response()->json($unenrolledStudents);
    }

    public function getArchivedByAcademicYear($academicYearId)
    {
        $archivedStudents = Enrollment::where('archived', true)
            ->where('academic_year_id', $academicYearId)
            ->with('student') // Assuming you have a relationship with the `Student` model
            ->get();

            $students = $archivedStudents->map(function ($enrollment) {
                return $enrollment->student; // Get the student associated with the enrollment
            });
        return response()->json($students);
    }

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


    public function getStudentCountByGrade($academicYearId)
    {
        $counts = Enrollment::select('grade_level', DB::raw('count(*) as total'))
            ->where('academic_year_id', $academicYearId)
            ->groupBy('grade_level')
            ->get();

        return response()->json($counts);
    }
    public function getEnrollmentCountsByYear()
    {
        $enrollmentCounts = DB::table('enrollments')
            ->join('academic_years', 'enrollments.academic_year_id', '=', 'academic_years.id')
            ->select('academic_years.academic_year', DB::raw('count(enrollments.student_id) as total'))
            ->where('academic_years.status', '!=', 'Inactive') // Exclude inactive academic years
            ->groupBy('academic_years.academic_year') // Group by academic year
            ->orderBy('academic_years.academic_year', 'desc') // Sort by year
            ->get();

        return response()->json($enrollmentCounts);
    }


    public function getCountEnrolledByGrade()
    {
        // Query to count enrolled students per grade level from grade 7 to grade 12
        $enrollmentCounts = DB::table('enrollments')
            ->select('grade_level', DB::raw('count(*) as total'))
            ->whereIn('grade_level', ['7', '8', '9', '10', '11', '12'])
            ->where('enrollment_status', 'enrolled') // Assuming you want only active enrollments
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


    public function getCountUnEnrolledByGrade()
    {
        // Query to count enrolled students per grade level from grade 7 to grade 12
        $enrollmentCounts = DB::table('enrollments')
            ->select('grade_level', DB::raw('count(*) as total'))
            ->whereIn('grade_level', ['7', '8', '9', '10', '11', '12'])
            ->where('enrollment_status', 'unenrolled') // Assuming you want only active enrollments
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

}