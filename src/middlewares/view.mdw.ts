import express from 'express'
import exphbs from 'express-handlebars';
import numeral from 'numeral';
import hbs_helpers from 'handlebars-helpers';
import path from 'path';
const  hbs_sections = require('express-handlebars-sections')


hbs_helpers();

export default function viewMdw(app:express.Express) {
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, '../views'));

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