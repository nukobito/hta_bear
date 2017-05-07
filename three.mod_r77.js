// for three.js r77
THREE.XHRLoader.prototype.load = function ( url, onLoad, onProgress, onError ) {
    if ( this.path !== undefined ) url = this.path + url;

    var scope = this;
    var cached = THREE.Cache.get( url );
    if ( cached !== undefined ) {
        if ( onLoad ) {
            setTimeout( function () {
                onLoad( cached );
            }, 0 );
        }
        return cached;
    }

    var request = new ActiveXObject( 'Msxml2.XMLHTTP.6.0' );
    request.open( 'GET', url, true );
    request.onreadystatechange = function ( event ) {
        if ( request.readyState === 4 ) {
            var response = request.responseText;
            THREE.Cache.add( url, response );
            if ( request.status === 200 ) {
                if ( onLoad ) onLoad( response );
                scope.manager.itemEnd( url );
            }
            else if ( request.status === 0 ) {
                console.warn( 'THREE.XHRLoader: HTTP Status 0 received.' );
                if ( onLoad ) onLoad( response );
                scope.manager.itemEnd( url );
            }
            else {
                if ( onError ) onError( event );
                scope.manager.itemError( url );
            }
        }
        else if ( request.readyState === 3 ) {
            if ( onProgress !== undefined ) {
                onProgress( event );
            }
        }
    };
    request.send();
    scope.manager.itemStart( url );

    return request;
};