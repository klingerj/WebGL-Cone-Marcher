require('file-loader?name=[name].[ext]!../index.html');

const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE)

import DAT from 'dat-gui'
import Stats from 'stats-js'
import ProxyGeometry, {ProxyMaterial} from './proxy_geometry'
import RayMarcher from './rayMarching'

var BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
var SphereGeometry = new THREE.SphereGeometry(1, 32, 32);
var ConeGeometry = new THREE.ConeGeometry(1, 1);

var clock = new THREE.Clock();
var camera;

var squareRes = 1024;
export var windowResPow2 = { innerWidth: squareRes, innerHeight: squareRes };

window.addEventListener('load', function() {
    var stats = new Stats();
    stats.setMode(1);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

    var scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, windowResPow2.innerWidth/windowResPow2.innerHeight, 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(windowResPow2.innerWidth, windowResPow2.innerHeight);
    renderer.setClearColor(0x999999, 1.0);
    document.body.appendChild(renderer.domElement);

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.rotateSpeed = 0.3;
    controls.zoomSpeed = 1.0;
    controls.panSpeed = 2.0;

    window.addEventListener('resize', function() {
        camera.aspect = windowResPow2.innerWidth / windowResPow2.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(windowResPow2.innerWidth, windowResPow2.innerHeight);
    });

    scene.add(new THREE.AxisHelper(20));
    scene.add(new THREE.DirectionalLight(0xffffff, 1));

    var proxyGeometry = new ProxyGeometry();

    var boxMesh = new THREE.Mesh(BoxGeometry, ProxyMaterial);
    var sphereMesh = new THREE.Mesh(SphereGeometry, ProxyMaterial);
    var coneMesh = new THREE.Mesh(ConeGeometry, ProxyMaterial);
    
    boxMesh.position.set(-3, 0, 0);
    coneMesh.position.set(3, 0, 0);

    proxyGeometry.add(boxMesh);
    proxyGeometry.add(sphereMesh);
    proxyGeometry.add(coneMesh);

    scene.add(proxyGeometry.group);

    camera.position.set(0, 0, 5);
    camera.lookAt(new THREE.Vector3(0,0,0));
    controls.target.set(0,0,0);

    var gui = new DAT.GUI();

    var options = {
        FractalType: 'Mandelbulb'
    }

    gui.add(options, 'FractalType', ['Mandelbulb', 'Menger Sponge']);
    
    var rayMarcher = new RayMarcher(renderer, scene, camera);

    (function tick() {
        controls.update();
        stats.begin();
        rayMarcher.render(clock, camera, options);
        stats.end();
        requestAnimationFrame(tick);
    })();
});