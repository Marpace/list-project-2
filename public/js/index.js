// functions for querySelector and querySelectorAll
function qs(el, doc = document){return doc.querySelector(el)};
function qsa(el, doc = document){return [...doc.querySelectorAll(el)]};

const todoList = qs(".todo-list")
const listItems = qsa(".todo-list__item")
const itemsCheck = qsa(".js-item-check");
const clearCompletedForm = qs(".clear-completed");



// checking list items off 
function readItemStatus() {
    listItems.forEach(item => {
        if(item.classList.contains("completed")){
            const form = item.children[0];
            form.classList.add("icon-checked");
            form.children[1].children[0].classList.add("img-checked");
            form.nextElementSibling.classList.add("line-through");


        }
    });
}
readItemStatus();

itemsCheck.forEach(item => {
    item.addEventListener("click", function(){
        this.parentElement.classList.toggle("icon-checked"); 
        this.children[0].classList.toggle("img-checked");
        this.parentElement.nextElementSibling.classList.toggle("line-through");
        updatePending();
    });
});

//filtering list items
const showAll = qsa(".all");
const showActive = qsa(".active");
const showCompleted = qsa(".item-completed");

showAll.forEach(item => {
    item.addEventListener("click", function(){
        listItems.forEach(item => {
            item.style.display = "flex"
        });
    });
})
showActive.forEach(item => {
    item.addEventListener("click", function(){
        listItems.forEach(item => {
            if(item.classList.contains("completed")) {
                item.style.display = "none";
            } else {
                item.style.display = "flex";
            }
        });
    });
})
showCompleted.forEach(item => {
    item.addEventListener("click", function(){
        listItems.forEach(item => {
            if(!item.classList.contains("completed")) {
                item.style.display = "none";
            } else {
                item.style.display ="flex";
            }
        });
    });
});

// drag and drop functionality from js library called Sortable - CDN in partials/footer
Sortable.create(todoList, {
    group: '.todoList',
    animation: 150,
    filter: ".todo-list__footer",
    delayOnTouchOnly: true
});

// indicating amount of pending items in list
function updatePending(){
    const pending = qs(".js-pending");
    let pendingItems = [];
    
    listItems.forEach(item => {
        if(!item.classList.contains("item-checked")){
            pendingItems.push(item)
        }
    });
    pending.innerHTML = `${pendingItems.length} items left`
}
updatePending();

//highlighting active filter option
