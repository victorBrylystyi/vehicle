import * as $ from '../dist/bundle';
import res from './assets/assets.json';

const div = document.querySelector( '.elemForCanv' );

const app = new $.App( div, res );

app.action();

// window.app = app;


// const app2 = new $.VehicleFilm(div,res);
// app2.init();
// app2.run();


// for test 2 films

// const div = document.querySelector('.elemForCanvV1');
// const div2 = document.querySelector('.elemForCanvV2');


// const app = new $.App(div,res);
// const app2 = new $.App(div2,res);

// app.action();
// app2.action();

// window.app = app;
// window.app2 = app2;

