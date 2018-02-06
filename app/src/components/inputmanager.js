export default class InputManager {
  down(event) {
    switch(event.keyCode) {
      case 27: //Escape
        skutextbox.value = "";
        resetInput();
        break;
      case 13: //Enter
        executequery();
        break;
      default:
        break;
    }
  }
}
