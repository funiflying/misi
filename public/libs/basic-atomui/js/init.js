'use strict'
ui.require.config({
    'ui': [
        'js/ui/css/basic.css',
        'js/ui/ajax.js',

    ]
});
//
$(function () {
    ui.require(['ui'], function () {
        $('#js-ui-result').html('<i class="fa fa-check m5-r"></i><span class="dib p10-l">Basic component load successfully</span>');
    });
    //
});



