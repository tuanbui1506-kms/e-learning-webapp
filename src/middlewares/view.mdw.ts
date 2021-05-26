import express from 'express'
import exphbs from 'express-handlebars';
const  hbs_sections = require('express-handlebars-sections')
import numeral from 'numeral';
import hbs_helpers from 'handlebars-helpers';
import path from 'path';

hbs_helpers();

export function viewMdwFunc(app:express.Express) {
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, '../views'));
    //hbs.registerPartials(__dirname + '/src/views/partials');

    app.engine('hbs', exphbs({
        defaultLayout: 'bs4.hbs',
        extname:'.hbs',
        helpers: {
            section: hbs_sections(),
            format_number(val:any) {
                return numeral(val).format('0,0[.]00 $');
            },
            format_rating(val:any) {
                return numeral(val).format('0,0[.]0');
            },
            hbs_helpers
        },
    }));
};