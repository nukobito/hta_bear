// var MESH_DATA_PATH = 'bear_idle_walk.json';
var MESH_DATA_PATH = 'bear.json';

var canvas;
var scene, renderer, camera, clock, mixer;

function createCanvas() {
    canvas = document.createElement( 'canvas' );
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.body.appendChild( canvas );

    return (canvas !== undefined);
}

function initialize() {
    var ambient = new THREE.AmbientLight( 0x7F7F7F );

    var directional = new THREE.DirectionalLight( 0xFFFFFF, 1 );
    directional.position.set( 0, 1, 1 ).normalize();

    scene = new THREE.Scene();
    scene.add( ambient );
    scene.add( directional );

    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: false } );
    renderer.setSize( canvas.width, canvas.height );
    renderer.setClearColor( 0x00007F, 1 );
    renderer.autoClear = false;

    var aspect = (canvas.width / 3) / canvas.height;
    camera = new THREE.PerspectiveCamera( 45, aspect, 0.1, 1000 );
    camera.position.set( 1, 0, 5 );
    camera.up.set( 0, 1, 0 );
    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

    clock = new THREE.Clock();
}

function load( callback ) {
    var loader = new THREE.JSONLoader();
    loader.load( MESH_DATA_PATH, function ( geometry, materials ) {
        materials.forEach( function ( material ) {
            material.skinning = true;
        } );

        var material = new THREE.MultiMaterial( materials );
        var mesh = new THREE.SkinnedMesh( geometry, material );
        scene.add( mesh );

        mixer = new THREE.AnimationMixer( mesh );
        mixer.clipAction( 'idle' ).play();
        mixer.clipAction( 'walk' ).play();

        callback();
    } );
}

var k = 0.0, s = 1;
function mainLoop( age ) {
    window.requestAnimationFrame( function () {
        mainLoop( age + 1 );
    } );

    var delta = clock.getDelta();

    renderer.clear();

    var width = canvas.width / 3;
    [
        { x: 0, idle: 1.0, walk: 0.0 },
        { x: 1, idle: 0.0, walk: 1.0 },
        // { x: 2, idle: 0.5, walk: 0.5 }
        { x: 2, idle: 1.0 - k, walk: k }
    ].forEach( function ( line ) {
        mixer.clipAction( 'idle' ).setEffectiveWeight( line.idle );
        mixer.clipAction( 'walk' ).setEffectiveWeight( line.walk );

        mixer.update( delta );

        renderer.setViewport( line.x * width, 0, width, canvas.height );
        renderer.render( scene, camera );
    } );

    k += 0.002 * s;
    if ( k >= 1.0 ) s = -1;
    else if ( k <= 0.0 ) s = 1;
}

window.addEventListener( 'load', function () {
    if ( !createCanvas() ) {
        window.close();
        return;
    }

    initialize();
    load( function () {
        mainLoop( 0 );
    } );
} );