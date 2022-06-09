<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CreateTaskController extends Controller
{
    public function __invoke(string $categoryId,Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->messages(), 422);
        }

        $task = new Task();
        $task->category_id = $categoryId;
        $task->name = $request->name;
        $task->save();

        return response()->json([
            'taskId' => $task->id,
            'categoryId'=> $categoryId,
            'deleteActionUrl' => route('task.delete',['id'=>$task->id])
        ]);

    }


}
