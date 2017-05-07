var hta = (function ( window ) {
    var search = window.location.search.substr( 1 );
    var params = search.split( '&' );

    var dic = new ActiveXObject( 'Scripting.Dictionary' );
    var param;
    for ( var i = 0; i < params.length; i++ ) {
        param = params[ i ].split( '=' );
        dic.add( param[ 0 ], param[ 1 ] );
    }

    var innerWidth = window.parseInt( dic.Item( 'width' ) );
    var innerHeight = window.parseInt( dic.Item( 'height' ) );

    var width = window.outerWidth;
    if ( innerWidth !== window.innerWidth ) {
        width = 2 * window.outerWidth - window.innerWidth;
    }
    var height = window.outerHeight;
    if ( innerHeight !== window.innerHeight ) {
        height = 2 * window.outerHeight - window.innerHeight;
    }
    window.resizeTo( width, height );

    var args = dic.Item( 'args' ).match( /"[^"]+"|[^\s]+/g );

    return {
        args: args
    };
})( window, undefined );