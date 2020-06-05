const fill =  document.querySelector('.fill');
//select all the .empty classes et the only .fill class
const empties = document.querySelectorAll('.empty');

//Fill listeners
fill.addEventListener('dragstart', dragStart);
fill.addEventListener('dragend', dragEnd);



//Loop through the empties and call drag events

for(const empty of empties){

    empty.addEventListener('dragover', dragOver);
    empty.addEventListener('dragenter', dragEnter);
    empty.addEventListener('dragleave', dragLeave);
    empty.addEventListener('drop', dragDrop);

}

//Drag functions

//taking the image outside the .empty class box
function dragStart(){

    this.className += ' hold';

    //so there is no double image, the image inside the first box is invisible
    setTimeout(() => this.className = 'invisible', 0);

}

//when you let the image go
function dragEnd(){

    this.className='fill';

}

//When the image passes over a box, the dragOver action is being activated
//if we don't prevent default, the box will just go back to this initial position when letting go, and we don't want that
function dragOver(e){
    e.preventDefault();
}


//When enter a perimeter of a box, we want to set image as hovered
function dragEnter(e){
    e.preventDefault();
    this.className += ' hovered';

}


//when we leave the perimeter of the box, we want to make the class of the image empty again
function dragLeave(){
    this.className = 'empty';
}


//start the game
function dragDrop(){

    this.className = 'empty';
    this.append(fill);
    window.open("start.html", "_self")


}



