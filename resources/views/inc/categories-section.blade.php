<div id="add-category-container" class="d-flex justify-content-end mt-4">
    <button id="add-category-button" type="button" class="btn btn-primary">Añadir Categoria</button>
</div>

<div id="categories-container" class="mt-4">
    <div id="accordion">
        @foreach( $categories as $category )
            <div class="card" data-category-id="{{$category->id}}">
                <div class="card-header" id="headingTwo">
                    <h5 class="mb-0">
                        <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapse-{{$category->id}}" aria-expanded="false" aria-controls="collapse-{{$category->id}}">
                            {{$category->name}}
                            <button type="button" class="close delete-category"
                                    data-action-url="{{route('category.delete',['id'=>$category->id])}}"
                            >×</button>
                        </button>
                    </h5>
                </div>
                <div id="collapse-{{$category->id}}" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                    <div class="card-body">
                        <h4>Listado de tareas</h4>
                        <div class="d-flex justify-content-end my-4">
                            <button type="button" class="btn btn-primary add-task"
                                    data-action-url="{{route('task.create',['id'=>$category->id])}}">Añadir Tarea</button>
                        </div>
                        <ul class="list-group">
                            @foreach( $category->tasks as $task )
                                <li class="list-group-item"
                                    data-task-id="{{$task->id}}"
                                >{{$task->name}}
                                    <button type="button" class="close delete-task"
                                            data-action-url="{{route('task.delete',['id'=>$task->id])}}"
                                    >×</button>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</div>

</div>
