var app = {
    init: function() {
        app.csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        app.addCategory.init();
        app.addTask.init();
        app.deleteTask.init();
        app.deleteCategory.init();

    },

    addCategory:{
        init: function (){
            document.getElementById('add-category-button').addEventListener('click',function (event){
                app.addCategory.showAddCategoryModal();
            });
            document.getElementById('add-category-action').addEventListener('click',function (event){
               app.addCategory.addAction(event.target.dataset.actionUrl);
            })
        },

        showAddCategoryModal: function (){
            document.getElementById('category-name-error').hidden = true;
            $("#add-category-modal").modal('show');
        },

        addAction:async function (actionUrl){
            document.getElementById('category-name-error').hidden = true;
            let value = document.getElementById('category-name-input').value.trim();
            if(value.length > 0){
                let payload = {
                    name: value
                };
                let response = await fetch(actionUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'X-CSRF-TOKEN': app.csrfToken
                    },
                    body: JSON.stringify(payload)
                });
                let result = await response.json();
                if( response.status == 200 ){
                    app.addCategory.newCategoryRender(result,value);
                }

            }else {
                document.getElementById('category-name-error').hidden = false;
            }
        },

        newCategoryRender:function (data,categoryName){
            let categoryTemplate = document.querySelector('.category-template');
            const newCat = categoryTemplate.cloneNode(true);
            newCat.hidden=false;
            newCat.classList.remove('category-template');
            newCat.dataset.categoryId = data.categoryId
            const button = newCat.querySelector('[data-target="#collapseTwo"]');
            button.textContent = categoryName;

            document.getElementById('add-category-action').addEventListener('click',function (event){
                app.addCategory.addAction(event.target.dataset.actionUrl);
            })

            let addTaskButton = newCat.querySelector('.add-task');
            addTaskButton.dataset.actionUrl=data.addTaskActionUrl;
            addTaskButton.onclick = function (event){
                app.addTask.addTaskAction(event.target.dataset.actionUrl)
            }

            let removeButton = newCat.querySelector('.delete-category');
            removeButton.dataset.actionUrl=data.deleteActionUrl;
            removeButton.onclick = function (event){
                app.deleteCategory.deleteCategoryAction(event.target.dataset.actionUrl, event.target.closest('.card'))
            }

            let a = document.getElementById('accordion');
            a.append(newCat);
            document.getElementById('category-name-input').value="";
            $("#add-category-modal").modal('hide');
        }
    },

    addTask:{
        init:function (){
            document.querySelectorAll('.add-task').forEach(function (element){
                element.onclick = function (event){
                    app.addTask.addTaskAction(event.target.dataset.actionUrl)
                }
            })
        },

        addTaskAction: async function(actionUrl){
            let addTaskButton = document.getElementById('add-task-action');
            addTaskButton.dataset.actionUrl = actionUrl;
            document.getElementById('task-name-error').hidden = true;
            $("#add-task-modal").modal('show');
            document.getElementById('add-task-action').onclick = async function (event){
                document.getElementById('task-name-error').hidden = true;
                let value = document.getElementById('task-name-input').value.trim();
                if(value.length > 0){
                    let payload = {
                        name: value
                    };
                    let response = await fetch(actionUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                            'X-CSRF-TOKEN': app.csrfToken
                        },
                        body: JSON.stringify(payload)
                    });
                    let result = await response.json();
                    app.addTask.newTaskRender(result,value);
                }else{
                    document.getElementById('task-name-error').hidden = false;
                }
            }
        },

        newTaskRender:function (data,taskName){

            let li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent=taskName;
            li.dataset.taskId=data.taskId

            let removeButton = document.createElement('button');
            removeButton.type='button';
            removeButton.classList.add('close');
            removeButton.classList.add('delete-task');
            removeButton.dataset.actionUrl=data.deleteActionUrl;
            removeButton.innerHTML='×';
            removeButton.onclick = function (event){
                app.deleteTask.deleteTaskAction(event.target.dataset.actionUrl, event.target.closest('li'))
            }

            li.append(removeButton);

            let categoryCard = document.querySelector(`[data-category-id="${data.categoryId}"]`);
            let taskList = categoryCard.querySelector('ul');
            taskList.append(li);
            let a = document.getElementById('accordion');
            document.getElementById('task-name-input').value="";
            $("#add-task-modal").modal('hide');
        }
    },

    deleteTask:{
        init:function (){
            document.querySelectorAll('.delete-task').forEach(function (element){
                element.onclick = function (event){
                    app.deleteTask.deleteTaskAction(event.target.dataset.actionUrl, event.target.closest('li'))
                }
            })
        },
        deleteTaskAction:async function(actionUrl,taskElement) {
            let response = await fetch(actionUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'X-CSRF-TOKEN': app.csrfToken
                }
            });

           if(response.status == 200){
               taskElement.remove();
           }
        }
    },

    deleteCategory:{
        init:function (){
            document.querySelectorAll('.delete-category').forEach(function (element){
                element.onclick = function (event){


                    app.deleteCategory.deleteCategoryAction(event.target.dataset.actionUrl, event.target.closest('.card'))
                }
            })
        },
        deleteCategoryAction:async function(actionUrl,categoryElement) {
            let response = await fetch(actionUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'X-CSRF-TOKEN': app.csrfToken
                }
            });

            if(response.status == 200){
                categoryElement.remove();
            }
        }

    }
}

$(document).ready(function () {
    app.init();
});
