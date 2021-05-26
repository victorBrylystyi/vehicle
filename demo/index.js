import * as $ from "../dist/bundle";

let div = document.getElementsByClassName('elemForCanv')[0];
let app = new $.App(div);

window.myApp = app;

app.greeting(); 
app.run();