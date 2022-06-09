<div id="add-category-modal" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" style="display: none;" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="myLargeModalLabel">Añadir Categoría</h4>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            </div>
            <div class="modal-body">
                <div class="col-10">
                    <label>Nombre</label>
                    <input id="category-name-input" class="form-control" type="text">
                    <div id="category-name-error" class="text-danger">El nombre es requerido</div>
                </div>
            </div>
            <div class="modal-footer">
                <button id="add-category-action" type="button" class="btn btn-danger waves-effect text-left"
                        data-action-url={{route('category.create')}}
                >Añadir</button>
            </div>
        </div>
    </div>
</div>
