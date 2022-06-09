<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class CreateCategoryController extends Controller
{
    public function __invoke(Request $request):JsonResponse
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->messages(), 422);
        }

        $name = $request->name;
        $category = new Category();
        $category->name = $name;
        $category->save();
        return response()->json([
            'categoryId' => $category->id,
            'deleteActionUrl'=>route('category.delete',['id'=>$category->id]),
            'addTaskActionUrl'=>route('task.create',['id'=>$category->id])
        ]);
    }
}
