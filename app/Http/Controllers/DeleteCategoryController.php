<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;

class DeleteCategoryController extends Controller
{
    public function __invoke(int $id):JsonResponse
    {
        $category = Category::find($id);
        $category->delete();
        return response()->json(null,200);
    }

}
