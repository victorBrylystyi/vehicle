import * as $ from "../dist/bundle";
import res from "./assets/assets.json";


let div = document.getElementsByClassName('elemForCanv')[0];
let app = new $.App(div,res);

window.myApp = app;

app.greeting(); 
app.run();