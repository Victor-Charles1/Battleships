export function Ship(name,length) {
    const coordinates =[]
    
    const ship = {
      hitCount :0,
      length,
      coordinates,
      name,

      hit() {
        if(this.isSunk()===true){
            return 'Ship is already sunk'
            }else{
            this.hitCount++;
        }
      },
      isSunk(){
        if(this.hitCount === length){
            return true
            }else{
            return false
      }
    },
    getCoordinates(){
      return coordinates;

    }
  }
  return ship;
}