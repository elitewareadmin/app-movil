import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  Platform,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { WebView } from 'react-native-webview';
import { ArrowLeft, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Typography from '@/components/ui/Typography';
import Button from '@/components/ui/Button';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import Colors from '@/constants/Colors';

// WebXR content HTML with Three.js and advanced features
const webXRContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MetaFashion Showroom</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: radial-gradient(circle at center, #1a1a1a, #121212);
      color: white;
      font-family: Arial, sans-serif;
    }
    #container {
      position: relative;
      width: 100%;
      height: 100%;
    }
    #canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    #ui {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 100;
      pointer-events: none;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 16px;
      background: linear-gradient(to right, #D4AF37, #B76E79);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    #enter-vr {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(to right, #D4AF37, #B76E79);
      border: none;
      color: #121212;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      pointer-events: auto;
      z-index: 1000;
    }
    .product-info {
      position: absolute;
      background: rgba(30, 30, 30, 0.9);
      border: 1px solid #D4AF37;
      border-radius: 8px;
      padding: 16px;
      color: white;
      pointer-events: auto;
      display: none;
      backdrop-filter: blur(10px);
      max-width: 250px;
      z-index: 1000;
    }
    .product-title {
      color: #D4AF37;
      margin: 0 0 8px 0;
      font-size: 16px;
    }
    .product-description {
      color: #BBBBBB;
      margin: 8px 0;
      font-size: 14px;
    }
    .product-price {
      color: white;
      margin: 8px 0 0 0;
      font-weight: bold;
    }
    #loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #D4AF37;
      font-size: 18px;
      z-index: 2000;
    }
  </style>
</head>
<body>
  <div id="container">
    <canvas id="canvas"></canvas>
    <div id="ui">
      <h1>MetaFashion Showroom</h1>
    </div>
    <div id="loading">Loading Virtual Showroom...</div>
    <button id="enter-vr">Enter VR Experience</button>
    <div id="product-info" class="product-info"></div>
  </div>

  <script>
    let camera, scene, renderer, controls;
    let products = [];
    let raycaster, mouse;
    let currentIntersect = null;
    let productInfo;
    let isLoading = true;

    const productData = [
      {
        name: "Luxury Gold Watch",
        description: "Handcrafted timepiece with premium materials",
        price: "$12,999",
        position: { x: 3, y: 1.5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        name: "Designer Handbag",
        description: "Exclusive leather bag with signature details",
        price: "$5,999",
        position: { x: -3, y: 1.5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        name: "Diamond Necklace",
        description: "Exquisite diamond-encrusted piece",
        price: "$24,999",
        position: { x: 0, y: 1.5, z: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      },
      {
        name: "Premium Sunglasses",
        description: "Avant-garde design with premium materials",
        price: "$899",
        position: { x: 0, y: 1.5, z: -3 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      }
    ];

    async function init() {
      scene = new THREE.Scene();
      
      // Camera setup
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 2, 8);

      // Renderer setup
      renderer = new THREE.WebGLRenderer({ 
        canvas: document.querySelector('#canvas'),
        antialias: true,
        alpha: true
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Controls
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2;
      controls.minDistance = 5;
      controls.maxDistance = 15;

      // Raycaster setup
      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();

      // Lighting
      setupLighting();
      
      // Create environment
      await createEnvironment();
      
      // Create products
      await createProducts();

      // Event listeners
      setupEventListeners();

      // Hide loading screen
      isLoading = false;
      document.getElementById('loading').style.display = 'none';

      // Start animation loop
      animate();
    }

    function setupLighting() {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(0xffffff, 1);
      mainLight.position.set(5, 5, 5);
      mainLight.castShadow = true;
      mainLight.shadow.mapSize.width = 2048;
      mainLight.shadow.mapSize.height = 2048;
      scene.add(mainLight);

      const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
      rimLight.position.set(-5, 5, -5);
      scene.add(rimLight);

      // Add point lights for product highlights
      const pointLight1 = new THREE.PointLight(0xD4AF37, 1, 10);
      pointLight1.position.set(3, 3, 3);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0xB76E79, 1, 10);
      pointLight2.position.set(-3, 3, -3);
      scene.add(pointLight2);
    }

    async function createEnvironment() {
      // Floor
      const floorGeometry = new THREE.CircleGeometry(10, 64);
      const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a,
        metalness: 0.9,
        roughness: 0.1
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      // Walls
      const wallGeometry = new THREE.CylinderGeometry(10, 10, 8, 64, 1, true);
      const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2a2a2a,
        metalness: 0.5,
        roughness: 0.5,
        side: THREE.BackSide
      });
      const walls = new THREE.Mesh(wallGeometry, wallMaterial);
      scene.add(walls);

      // Add reflective floor overlay
      const reflectionGeometry = new THREE.CircleGeometry(10, 64);
      const reflectionMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
        shininess: 100
      });
      const reflection = new THREE.Mesh(reflectionGeometry, reflectionMaterial);
      reflection.rotation.x = -Math.PI / 2;
      reflection.position.y = 0.01;
      scene.add(reflection);
    }

    async function createProducts() {
      productData.forEach((data, index) => {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ 
          color: 0xD4AF37,
          metalness: 0.7,
          roughness: 0.3
        });
        const product = new THREE.Mesh(geometry, material);
        
        product.position.set(
          data.position.x,
          data.position.y,
          data.position.z
        );
        
        product.castShadow = true;
        product.receiveShadow = true;
        
        product.userData = {
          isProduct: true,
          id: index,
          name: data.name,
          description: data.description,
          price: data.price
        };
        
        products.push(product);
        scene.add(product);

        // Add floating platform under product
        const platformGeometry = new THREE.CylinderGeometry(0.6, 0.4, 0.1, 32);
        const platformMaterial = new THREE.MeshStandardMaterial({
          color: 0xD4AF37,
          metalness: 0.9,
          roughness: 0.1
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.set(
          data.position.x,
          data.position.y - 0.6,
          data.position.z
        );
        platform.castShadow = true;
        platform.receiveShadow = true;
        scene.add(platform);
      });
    }

    function setupEventListeners() {
      window.addEventListener('resize', onWindowResize, false);
      window.addEventListener('mousemove', onMouseMove, false);
      window.addEventListener('click', onMouseClick, false);
      
      productInfo = document.getElementById('product-info');

      if (navigator.xr) {
        navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
          const vrButton = document.getElementById('enter-vr');
          if (supported) {
            vrButton.style.display = 'block';
            vrButton.addEventListener('click', onVRButtonClick);
          } else {
            vrButton.textContent = 'VR Not Supported';
            vrButton.disabled = true;
          }
        });
      }
    }

    function onMouseMove(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(products);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        
        if (intersectedObject.userData.isProduct) {
          document.body.style.cursor = 'pointer';
          
          if (currentIntersect !== intersectedObject) {
            currentIntersect = intersectedObject;
            showProductInfo(intersectedObject, event);
          }
        }
      } else {
        document.body.style.cursor = 'default';
        currentIntersect = null;
        hideProductInfo();
      }
    }

    function onMouseClick(event) {
      if (currentIntersect) {
        const product = currentIntersect.userData;
        console.log('Selected product:', product.name);
        // Handle product selection
      }
    }

    function showProductInfo(product, event) {
      const info = product.userData;
      productInfo.innerHTML = \`
        <h3 class="product-title">\${info.name}</h3>
        <p class="product-description">\${info.description}</p>
        <p class="product-price">\${info.price}</p>
      \`;
      
      productInfo.style.display = 'block';
      productInfo.style.left = event.clientX + 20 + 'px';
      productInfo.style.top = event.clientY + 'px';
    }

    function hideProductInfo() {
      productInfo.style.display = 'none';
    }

    async function onVRButtonClick() {
      if (navigator.xr) {
        try {
          const session = await navigator.xr.requestSession('immersive-vr', {
            optionalFeatures: ['local-floor', 'bounded-floor']
          });
          
          // Set up VR session
          const xrRefSpace = await session.requestReferenceSpace('local-floor');
          renderer.xr.setSession(session);
          renderer.xr.setReferenceSpace(xrRefSpace);
          
          session.addEventListener('end', () => {
            renderer.xr.setSession(null);
          });
        } catch (err) {
          console.error('Error starting VR session:', err);
        }
      }
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);
      
      if (!isLoading) {
        // Rotate products
        products.forEach((product, index) => {
          product.rotation.y += 0.005;
          
          // Add floating animation
          const time = Date.now() * 0.001;
          const offset = index * (Math.PI / 2);
          product.position.y = productData[index].position.y + Math.sin(time + offset) * 0.1;
        });

        controls.update();
        renderer.render(scene, camera);
      }
    }

    // Initialize everything
    init();
  </script>
</body>
</html>`;

export default function ShowroomScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isXRSupported, setIsXRSupported] = useState(Platform.OS === 'web');
  
  useEffect(() => {
    const checkXRSupport = async () => {
      if (Platform.OS === 'web' && navigator.xr) {
        try {
          const supported = await navigator.xr.isSessionSupported('immersive-vr');
          setIsXRSupported(supported);
        } catch (err) {
          console.error('WebXR support check failed:', err);
          setIsXRSupported(false);
        }
      }
      setIsLoading(false);
    };
    
    checkXRSupport();
  }, []);
  
  const handleBack = () => {
    router.back();
  };

  if (Platform.OS !== 'web' || !isXRSupported) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.dark.text} />
          </TouchableOpacity>
          <Typography variant="h2">Virtual Showroom</Typography>
        </View>
        
        <View style={styles.centeredContent}>
          <GlassmorphicCard style={styles.notSupportedCard}>
            <Zap size={48} color={Colors.gold.primary} style={styles.icon} />
            <Typography variant="h3" style={styles.title}>
              WebXR Experience
            </Typography>
            <Typography 
              variant="body1" 
              color={Colors.dark.secondaryText}
              style={styles.description}
            >
              The immersive 3D showroom experience is available on web browsers that support WebXR.
              Please visit our website on a compatible browser to experience the virtual showroom.
            </Typography>
            <Button
              title="Return to Home"
              variant="gradient"
              onPress={() => router.push('/')}
              style={styles.button}
            />
          </GlassmorphicCard>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LinearGradient
            colors={[Colors.gold.primary, Colors.roseGold.primary]}
            style={styles.loadingIndicator}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <ActivityIndicator size="large" color={Colors.gold.primary} style={styles.spinner} />
          <Typography variant="subtitle1" style={styles.loadingText}>
            Loading Virtual Showroom...
          </Typography>
        </View>
      ) : (
        <WebView
          source={{ html: webXRContent }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 16,
  },
  spinner: {
    marginVertical: 16,
  },
  loadingText: {
    marginTop: 16,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  notSupportedCard: {
    padding: 24,
    maxWidth: 400,
    width: '100%',
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    alignSelf: 'center',
  },
});