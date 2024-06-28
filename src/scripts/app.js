import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture';

import { Perlin, FBM } from 'three-noise/build/three-noise.module';

//post-processing imports
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';

//console.log( "222221111" );

import Data from '../data/data.csv';
import BackgroundImg from '../imgs/bg.hdr';

//console.log( Data );

const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = -5;

scene.background = new THREE.Color( 0xf4f3ee );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//These are just helpers. Should be commented on production.
let controls = new OrbitControls( camera, renderer.domElement );
//scene.add( new THREE.AxesHelper( 500 ) );

//This event guarantees that the renderer and camera aspect ratio change whenever the screen is resized
window.addEventListener( 'resize', (event) => {
    renderer.setSize( event.target.innerWidth, event.target.innerHeight, true );
    camera.aspect = event.target.innerWidth / event.target.innerHeight;
    camera.updateProjectionMatrix();
});



//Global light
let ambientLight = new THREE.AmbientLight( 0x404040 );
scene.add( ambientLight );

const light = new THREE.PointLight( 0xFFFFFF, 1, 500 );
light.position.set( 10, 10, 10 );
scene.add( light );

//cube container

let cubeContainer = new THREE.Object3D();

let noiseVector = new THREE.Vector3( 1.34435, 2.113234, 3.77676);
noiseVector.multiplyScalar( 0.3 );

const perlin = new Perlin(Math.random());
console.log( noiseVector );

const noisedPerlin = perlin.get3( noiseVector ) * 10;
console.log( noisedPerlin );

let widthElements = 60;
let depthElements = 60;
let heightElements = 10;
let originalPositions = [];
let movingPositions = []; 

let initialPoints = [];
let finalPoints = [];

for( let i = 0; i < widthElements; i++ ){
    for( let j = 0; j < depthElements; j++){
        //for( let k = 0; k < heightElements; k++ ){
            let geometry = new THREE.TetrahedronGeometry( 0.1, 0 );
            let material = new THREE.MeshLambertMaterial({ color: 0xa9d6e5, transparent: true, opacity: 1.0 });
            let cube = new THREE.Mesh( geometry, material );
            cube.position.x = (i - (widthElements/2)) * 0.14;
            //cube.position.y = (k - (heightElements/2)) * 0.18;
            cube.position.z = (j - (depthElements/2)) * 0.14;
        
            originalPositions.push( cube.position.clone() );
            cube.position.multiplyScalar( 2 );
            movingPositions.push( cube.position.clone() );
        
            //let newPos = cube.position.clone();
        
            //let noiseIncrement = perlin.get3( newPos ) * .5;
            //cube.position.add(noiseIncrement );
            //cube.position.y += noiseIncrement;
            //cube.position.x += noiseIncrement;
            //cube.position.z += noiseIncrement;
            initialPoints.push( cube.position.clone() );
            cubeContainer.add( cube );
        //}
    }
}

scene.add( cubeContainer );

let bgCubeGeom = new THREE.PlaneGeometry( 17, 17, 10, 10 );
//let bgCubeMaterial = new THREE.MeshLambertMaterial( { color: 0xE0E1DD, wireframe: true, wireframeLineWidth: 5 } );
let bgCubeMaterial = new THREE.MeshLambertMaterial( { color: 0x000000, wireframe: true, wireframeLineWidth: 5 } );
let bgCube = new THREE.Mesh( bgCubeGeom, bgCubeMaterial );
bgCube.position.y = -1;
bgCube.rotation.x = degToRad( -90 );
scene.add( bgCube );

//console.log( originalPositions );
let testCounter = 0;

const lineMaterial = new THREE.LineBasicMaterial({
	color: 0xf5ebe0
});

let haveLinesBeenDrawn = false;

function animate(){
    if( testCounter <= 200 ){
    for( let i = 0; i < cubeContainer.children.length; i++ ){
        //originalPositions[ i ].multiplyScalar( 2 );
        //console.log( "111/////" );
        //console.log( originalPositions[ i ] );
        let noiseIncrement = perlin.get3( originalPositions[ i ] );
        //noiseIncrement = degToRad( noiseIncrement );
        //console.log( "2222//////" );
        //console.log( originalPositions[ i ] );
        cubeContainer.children[ i ].position.x += noiseIncrement * 0.01;
        //cubeContainer.children[ i ].position.y += noiseIncrement * 0.01;
        cubeContainer.children[ i ].position.z += noiseIncrement * 0.01;
        /*if( testCounter % 60 == 0 ){
            let haloGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05 );
            let haloMaterial = new THREE.MeshBasicMaterial({color:0xFF0000});
            let haloElement = new THREE.Mesh( haloGeometry, haloMaterial );
            haloElement.position.x = cubeContainer.children[ i ].position.x;
            haloElement.position.y = cubeContainer.children[ i ].position.y;
            haloElement.position.z = cubeContainer.children[ i ].position.z;
            scene.add( haloElement );
        }*/
        originalPositions[ i ] = cubeContainer.children[ i ].position.clone().multiplyScalar( 0.5 );

        
    }
    }
    
    if( testCounter == 200 && !haveLinesBeenDrawn ){
        haveLinesBeenDrawn = true;
        console.log( initialPoints );
        console.log( "333333" );
        

        for( let i = 0; i < initialPoints.length; i++ ){
            console.log( "11111" );
            finalPoints.push( cubeContainer.children[ i ].position.clone() );
        }

        console.log( finalPoints );

        for( let i = 0; i < initialPoints.length; i++ ){
            let points = [];
            points.push( initialPoints[ i ] );
            points.push( finalPoints[ i ] );
            let lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
            let line = new THREE.Line( lineGeometry, lineMaterial );
            //scene.add( line );
        }
    }    

    testCounter++;

    renderer.render( scene, camera );
}//animate

renderer.setAnimationLoop( animate );

//Utilities

function degToRad(degrees){
  let pi = Math.PI;
  return degrees * (pi/180);
}

function computeDistance( x1, x2, y1, y2, z1, z2 ){
    let a = x2 - x1;
    let b = y2 - y1;
    let c = z2 - z1;
    let distance = Math.sqrt( a * a + b * b + c * c );
    return distance;
}