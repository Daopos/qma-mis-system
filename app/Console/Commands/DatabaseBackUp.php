<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;

class DatabaseBackUp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'database:backup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Creates a backup of the database and stores it in the storage folder';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // File name with timestamp
        $filename = "backup-" . Carbon::now()->format('Y-m-d_H-i-s') . ".gz";
        $path = storage_path("app/backup/{$filename}");

        // Ensure the backup directory exists
        if (!is_dir(storage_path('app/backup'))) {
            mkdir(storage_path('app/backup'), 0755, true);
        }

        // MySQL dump command
        $command = sprintf(
            'mysqldump --user=%s --password=%s --host=%s --port=%s --databases %s --skip-lock-tables --column-statistics=0 > %s',
            escapeshellarg(env('DB_USERNAME')),
            escapeshellarg(env('DB_PASSWORD')),
            escapeshellarg(env('DB_HOST')),
            escapeshellarg(env('DB_PORT', 3306)),
            escapeshellarg(env('DB_DATABASE')),
            escapeshellarg($path)
        );

        // Execute the command and capture output
        $output = [];
        $returnVar = null;
        exec($command . ' 2>&1', $output, $returnVar);

        // Handle success or failure
        if ($returnVar === 0) {
            $this->info("Backup successfully created at: {$path}");
        } else {
            $this->error("Backup failed. Error output: " . implode("\n", $output));
        }

        return $returnVar;
    }
}