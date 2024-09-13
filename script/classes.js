class Cell{
  //#flag;
  //static flag;
  constructor(){
      this.cell=document.createElement("div");
      this.cell.style.width="50px";
      this.cell.style.height="50px";
      this.flag=0;
      this.image="";
      this.imageIndex=0;
      // this.cell.style.backgroundColor="red";
  }
  appendToParent(parent){
    parent.appendChild(this.cell);
  }
  removeContent(){
    this.cell.removeChild(this.cell.childNodes[0]); //removing the image
  }
  
  removeImage(){
    this.flag=0;
  }
  appendImage(image){
      this.flag=1;
      this.imageIndex = image.attributes.src.value;
      //console.log(image.attributes.src.value);
      //console.log(this.imageIndex);
      this.image=image;
      this.cell.appendChild(image);
  }
  
  

  cellImageNumber(){

    if(!this.flag){
       return -1; //the cell has no image
    }
    else{
      //console.log(this.imageIndex);
      return this.imageIndex;
    }  

  }

  isEmpty(){
      if(this.flag)
         return false;
      else 
        return true;
  }
}



class ScoreGame{
static score=0;
constructor(){
  this.image=this.createRandomImage();
}

createRandomImage(){
  let image=this.document.createElement("img");
  let imageSrcIndex= Math.ceil(5*Math.random()); //from 1 to 5
  // console.log(imageSrcIndex);
  image.src=`images/${imageSrcIndex}.png`;
  return image;
}

increaseScore(){
  Element.score++;
}

}

class Grid{

constructor(rows,columns,parent){
  this.grid = []; //intial matrix
  for (let i = 0; i < rows; i++) {
      this.grid[i] = [];  //each element is an array
      for (let j = 0; j < columns; j++) {
          let newCell = new Cell();  //creating new child class each time
          newCell.appendToParent(parent);
          grid[i][j] = newCell;
      }
  }
  

}



}