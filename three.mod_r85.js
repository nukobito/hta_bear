// for three.js r85
THREE.FileLoader.prototype.load = function ( url, onLoad, onProgress, onError ) {
    if ( url === undefined ) url = '';
    if ( this.path !== undefined ) url = this.path + url;

    var scope = this;
    var cached = THREE.Cache.get( url );
    if ( cached !== undefined ) {
        scope.manager.itemStart( url );
        setTimeout( function () {
            if ( onLoad ) onLoad( cached );
            scope.manager.itemEnd( url );
        }, 0 );
        return cached;
    }

    var dataUriRegex = /^data:(.*?)(;base64)?,(.*)$/;
    var dataUriRegexResult = url.match( dataUriRegex );

    if ( dataUriRegexResult ) {
        // DataURLには未対応。
        console.worn( 'THREE.FileLoader: DataURL is not supported.' );
    }
    else {
        var request = new ActiveXObject( 'Msxml2.XMLHTTP.6.0' );
        request.open( 'GET', url, true );
        request.onreadystatechange = function ( event ) {
            if ( request.readyState === 4 ) {
                var response = JSON.parse( request.responseText );
                THREE.Cache.add( url, response );
                if ( request.status === 200 ) {
                    if ( onLoad ) onLoad( response );
                    scope.manager.itemEnd( url );
                }
                else if ( request.status === 0 ) {
                    console.warn( 'THREE.FileLoader: HTTP Status 0 received.' );
                    if ( onLoad ) onLoad( response );
                    scope.manager.itemEnd( url );
                }
                else {
                    if ( onError ) onError( event );
                    scope.manger.itemEnd( url );
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
    }

    scope.manager.itemStart( url );

    return request;
};