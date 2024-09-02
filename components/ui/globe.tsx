/* eslint-disable react/no-unknown-property */
'use client';

import { Canvas, Object3DNode, extend, useThree } from '@react-three/fiber';
import { Color, Fog, PerspectiveCamera, Scene, Vector3 } from 'three';
import { genRandomNumbers, getRandomElement, hexToRgb } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

import { OrbitControls } from '@react-three/drei';
import { RING_PROPAGATION_SPEED } from '@/constants';
import ThreeGlobe from 'three-globe';
import countries from '@/data/globe.json';

extend({ ThreeGlobe });

export const Globe: AceternityComponent<WorldProps> = ({ config, data, polygons = countries }) => {
  const ref = useRef<ThreeGlobe>(null);

  const numbersOfRings = useRef([0]);
  const [ringList, setRingList] = useState<GlobeRing[]>([]);

  const {
    pointSize = 1,
    atmosphereColor = '#ffffff',
    showAtmosphere = true,
    atmosphereAltitude = 0.1,
    polygonColor = 'rgba(255,255,255,0.7)',
    globeColor = '#1d072e',
    emissive = '#000000',
    emissiveIntensity = 0.1,
    shininess = 0.9,
    arcTime = 2000,
    arcLength = 0.9,
    rings = 1,
    maxRings = 3
  } = config;

  const filterUniquePoints = (points: GlobeRing[]) =>
    points.filter(
      (v, i, a) =>
        a.findIndex((v2) => ['lat', 'lng'].every((k) => v2[k as 'lat' | 'lng'] === v[k as 'lat' | 'lng'])) === i
    );

  const _buildMaterial = () => {
    if (!ref.current) return;

    const globeMaterial = ref.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };

    globeMaterial.color = new Color(globeColor);
    globeMaterial.emissive = new Color(emissive);
    globeMaterial.emissiveIntensity = emissiveIntensity;
    globeMaterial.shininess = shininess;
  };

  const _buildData = () => {
    const points: GlobeRing[] = [];

    for (const arc of data) {
      const { r, g, b } = hexToRgb(arc.color);

      points.push({
        size: pointSize,
        order: arc.order,
        color: (t) => `rgba(${r},${g},${b},${1 - t})`,
        lat: arc.startLat,
        lng: arc.startLng
      });
      points.push({
        size: pointSize,
        order: arc.order,
        color: (t) => `rgba(${r},${g},${b},${1 - t})`,
        lat: arc.endLat,
        lng: arc.endLng
      });
    }

    setRingList(filterUniquePoints(points));
  };

  const startAnimation = () => {
    if (!ref.current) return;

    ref.current
      .arcsData(data)
      .arcStartLat((arc) => (arc as GlobeArc).startLat)
      .arcStartLng((arc) => (arc as GlobeArc).startLng)
      .arcEndLat((arc) => (arc as GlobeArc).endLat)
      .arcEndLng((arc) => (arc as GlobeArc).endLng)
      .arcColor((arc: unknown) => (arc as GlobeArc).color)
      .arcAltitude((arc) => (arc as GlobeArc).arcAlt)
      .arcStroke(() => getRandomElement([0.32, 0.28, 0.3]))
      .arcDashLength(arcLength)
      .arcDashInitialGap((arc) => (arc as GlobeArc).order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => arcTime);

    ref.current
      .pointsData(data)
      .pointColor((e) => (e as { color: string }).color)
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2);

    ref.current
      .ringsData([])
      .ringColor((ring: unknown) => (t: number) => (ring as GlobeRing).color(t))
      .ringMaxRadius(maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod((arcTime * arcLength) / rings);
  };

  useEffect(() => {
    if (!ref.current) return;
    _buildData();
    _buildMaterial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current]);

  useEffect(() => {
    if (!ref.current) return;

    ref.current
      .hexPolygonsData(polygons.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(showAtmosphere)
      .atmosphereColor(atmosphereColor)
      .atmosphereAltitude(atmosphereAltitude)
      .hexPolygonColor(() => polygonColor);

    startAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ringList]);

  useEffect(() => {
    if (!ref.current) return;

    const interval = setInterval(() => {
      if (!ref.current) return;
      numbersOfRings.current = genRandomNumbers(0, data.length, Math.floor((data.length * 4) / 5));

      ref.current.ringsData(ringList.filter((_, i) => numbersOfRings.current.includes(i)));
    }, 2000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, ringList]);

  return <threeGlobe ref={ref} />;
};

export const WebGLRendererConfig = () => {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export const World: AceternityComponent<WorldProps> = (props) => {
  const { config, aspect = 1.2, cameraZ = 300 } = props;
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);

  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, aspect, 180, 1800)}>
      <WebGLRendererConfig />
      <ambientLight color={config.ambientLight} intensity={0.6} />
      <directionalLight color={config.directionalLeftLight} position={new Vector3(-400, 100, 400)} />
      <directionalLight color={config.directionalTopLight} position={new Vector3(-200, 500, 200)} />
      <pointLight color={config.pointLight} position={new Vector3(-200, 500, 200)} intensity={0.8} />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={1}
        autoRotate={true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
};

declare module '@react-three/fiber' {
  interface ThreeElements {
    threeGlobe: Object3DNode<ThreeGlobe, typeof ThreeGlobe>;
  }
}

export type HexPolygonsData = typeof countries;

export type GlobeArc = {
  color: string;
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
};

export type GlobeRing = { size: number; order: number; color: (t: number) => string; lat: number; lng: number };

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

export type WorldProps = {
  data: GlobeArc[];
  config: GlobeConfig;
  aspect?: number;
  cameraZ?: number;
  polygons?: HexPolygonsData;
};
