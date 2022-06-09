<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\JsonResponse;

class DeleteTaskController extends Controller
{
    public function __invoke(int $id):JsonResponse
    {
        $task = Task::find($id);
        $task->delete();
        return response()->json(null,200);
    }

}
