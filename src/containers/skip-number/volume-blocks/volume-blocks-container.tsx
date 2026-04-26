'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Cuboid, Minus, Pause, Play, Plus, RotateCcw } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { Button } from '@/components/button';
import { Card, CardContent } from '@/components/card';
import { Heading1 } from '@/components/heading';
import { Input } from '@/components/input';
import { Slider } from '@/components/slider';
import { Switch } from '@/components/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/tabs';
import { cn } from '@/styles/utils';

type Mode = 'build' | 'convert' | 'meter';
type BuildUnit = 'single' | 'row' | 'layer' | 'all';
type Dimension = {
  width: number;
  depth: number;
  height: number;
};

const BUILD_UNIT_LABEL: Record<BuildUnit, string> = {
  single: '낱개',
  row: '가로줄',
  layer: '한 층',
  all: '전체',
};

const DEFAULT_SIZE: Dimension = {
  width: 6,
  depth: 4,
  height: 5,
};

const DEFAULT_CONVERT_SIZE: Dimension = {
  width: 200,
  depth: 30,
  height: 50,
};

const PASTEL_COLORS = {
  block: 0xffd98f,
  blockEdge: 0xc98b36,
  width: 0xff8fb1,
  depth: 0x8ed0ff,
  height: 0x86edb6,
  meterLine: 0x7c6dff,
  transparentFace: 0xf9fcff,
  transparentEdge: 0x8db3e2,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const toSafeNumber = (
  value: string,
  fallback: number,
  min: number,
  max: number,
) =>
  clamp(
    Number.isNaN(Number(value)) ? fallback : Math.floor(Number(value)),
    min,
    max,
  );

const formatNumber = (value: number) =>
  value.toLocaleString('ko-KR', {
    maximumFractionDigits: 6,
  });

const getBuildUnitSize = (unit: BuildUnit, currentSize: Dimension) => {
  if (unit === 'layer') return currentSize.width * currentSize.depth;
  if (unit === 'row') return currentSize.width;
  if (unit === 'all') {
    return currentSize.width * currentSize.depth * currentSize.height;
  }

  return 1;
};

const getIntervals = (max: number, step: number) => {
  const values = [];

  for (let value = 0; value <= max; value += step) {
    values.push(value);
  }

  if (values[values.length - 1] !== max) values.push(max);

  return values;
};

const createPastelMaterial = (color: number, opacity = 1) =>
  new THREE.MeshLambertMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.12,
    transparent: opacity < 1,
    opacity,
    depthWrite: opacity >= 1,
  });

function DimensionInput({
  id,
  label,
  value,
  accentClassName,
  max,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  accentClassName: string;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className={cn('text-xs font-bold', accentClassName)}>
        {label}
      </label>
      <Input
        id={id}
        type="number"
        min={1}
        max={max}
        value={value}
        onChange={(event) =>
          onChange(toSafeNumber(event.target.value, value, 1, max))
        }
        className="h-11 text-right text-lg font-black"
      />
    </div>
  );
}

function ThreeVolumeScene({
  mode,
  size,
  count,
  convertSize,
  convertUnit,
  meterSize,
}: {
  mode: Mode;
  size: Dimension;
  count: number;
  convertSize: Dimension;
  convertUnit: 'cm' | 'm';
  meterSize: Dimension;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const contentRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 5000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    const controls = new OrbitControls(camera, renderer.domElement);
    let frameId = 0;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.touchAction = 'none';
    container.appendChild(renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.minDistance = 4;
    controls.maxDistance = 220;

    scene.add(new THREE.AmbientLight(0xffffff, 0.95));
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8ba3b6, 0.55);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.95);
    dirLight.position.set(20, 28, 18);
    scene.add(dirLight);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;

    const resize = () => {
      const width = container.clientWidth || 640;
      const height = container.clientHeight || 420;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      scene.clear();
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!scene || !camera || !controls) return;

    if (contentRef.current) {
      contentRef.current.traverse((object) => {
        const mesh = object as THREE.Mesh;
        const { geometry, material } = mesh;
        geometry?.dispose();
        if (Array.isArray(material)) {
          material.forEach((item) => item.dispose());
        } else {
          material?.dispose();
        }
      });
      scene.remove(contentRef.current);
    }

    const group = new THREE.Group();
    contentRef.current = group;
    scene.add(group);

    const addTransparentBox = (dimension: Dimension, unitScale = 1) => {
      const width = dimension.width * unitScale;
      const height = dimension.height * unitScale;
      const depth = dimension.depth * unitScale;
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const face = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          color: PASTEL_COLORS.transparentFace,
          transparent: true,
          opacity: 0.18,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry),
        new THREE.LineBasicMaterial({
          color: PASTEL_COLORS.transparentEdge,
          transparent: true,
          opacity: 0.9,
        }),
      );
      group.add(face);
      group.add(edges);
    };

    const addMeterUnitLines = (dimension: Dimension, unitScale: number) => {
      const width = dimension.width * unitScale;
      const height = dimension.height * unitScale;
      const depth = dimension.depth * unitScale;
      const thickness = Math.max(width, height, depth) * 0.008;
      const material = new THREE.MeshBasicMaterial({
        color: PASTEL_COLORS.meterLine,
        transparent: true,
        opacity: 0.92,
      });
      const xValues = getIntervals(dimension.width, 100).map(
        (value) => value * unitScale - width / 2,
      );
      const yValues = getIntervals(dimension.height, 100).map(
        (value) => value * unitScale - height / 2,
      );
      const zValues = getIntervals(dimension.depth, 100).map(
        (value) => depth / 2 - value * unitScale,
      );

      yValues.forEach((y) => {
        zValues.forEach((z) => {
          const rod = new THREE.Mesh(
            new THREE.BoxGeometry(width + thickness, thickness, thickness),
            material,
          );
          rod.position.set(0, y, z);
          group.add(rod);
        });
      });

      xValues.forEach((x) => {
        zValues.forEach((z) => {
          const rod = new THREE.Mesh(
            new THREE.BoxGeometry(thickness, height + thickness, thickness),
            material,
          );
          rod.position.set(x, 0, z);
          group.add(rod);
        });
      });

      xValues.forEach((x) => {
        yValues.forEach((y) => {
          const rod = new THREE.Mesh(
            new THREE.BoxGeometry(thickness, thickness, depth + thickness),
            material,
          );
          rod.position.set(x, y, 0);
          group.add(rod);
        });
      });
    };

    const addCentimeterSurfaceGrid = (
      dimension: Dimension,
      unitScale: number,
    ) => {
      const width = dimension.width * unitScale;
      const height = dimension.height * unitScale;
      const depth = dimension.depth * unitScale;
      const xValues = getIntervals(dimension.width, 1).map(
        (value) => value * unitScale - width / 2,
      );
      const yValues = getIntervals(dimension.height, 1).map(
        (value) => value * unitScale - height / 2,
      );
      const zValues = getIntervals(dimension.depth, 1).map(
        (value) => depth / 2 - value * unitScale,
      );
      const points: THREE.Vector3[] = [];
      const offset = unitScale * 0.35;

      xValues.forEach((x) => {
        points.push(
          new THREE.Vector3(x, -height / 2, depth / 2 + offset),
          new THREE.Vector3(x, height / 2, depth / 2 + offset),
          new THREE.Vector3(x, height / 2 + offset, -depth / 2),
          new THREE.Vector3(x, height / 2 + offset, depth / 2),
        );
      });

      yValues.forEach((y) => {
        points.push(
          new THREE.Vector3(-width / 2, y, depth / 2 + offset),
          new THREE.Vector3(width / 2, y, depth / 2 + offset),
          new THREE.Vector3(width / 2 + offset, y, -depth / 2),
          new THREE.Vector3(width / 2 + offset, y, depth / 2),
        );
      });

      zValues.forEach((z) => {
        points.push(
          new THREE.Vector3(width / 2 + offset, -height / 2, z),
          new THREE.Vector3(width / 2 + offset, height / 2, z),
          new THREE.Vector3(-width / 2, height / 2 + offset, z),
          new THREE.Vector3(width / 2, height / 2 + offset, z),
        );
      });

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const grid = new THREE.LineSegments(
        geometry,
        new THREE.LineBasicMaterial({
          color: 0x334155,
          transparent: true,
          opacity: 0.16,
        }),
      );

      group.add(grid);
    };

    const fitCamera = (maxDimension: number) => {
      const distance = Math.max(maxDimension * 2.15, 10);
      camera.position.set(distance, distance * 0.78, distance * 1.15);
      controls.target.set(0, 0, 0);
      controls.update();
    };

    if (mode === 'build') {
      addTransparentBox(size);

      const blockGeometry = new THREE.BoxGeometry(0.96, 0.96, 0.96);
      const edgeGeometry = new THREE.EdgesGeometry(blockGeometry);
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: PASTEL_COLORS.blockEdge,
        transparent: true,
        opacity: 0.24,
      });
      const createBlockMaterials = (x: number, y: number, zIndex: number) => {
        const materials = [
          createPastelMaterial(PASTEL_COLORS.block), // +x right
          createPastelMaterial(PASTEL_COLORS.block), // -x left
          createPastelMaterial(PASTEL_COLORS.block), // +y top
          createPastelMaterial(PASTEL_COLORS.block), // -y bottom
          createPastelMaterial(PASTEL_COLORS.block), // +z front
          createPastelMaterial(PASTEL_COLORS.block), // -z back
        ];

        if (y === 0 && zIndex === 0) {
          materials[4] = createPastelMaterial(PASTEL_COLORS.width);
        }

        if (y === 0 && x === size.width - 1) {
          materials[0] = createPastelMaterial(PASTEL_COLORS.depth);
        }

        if (x === size.width - 1 && zIndex === size.depth - 1) {
          materials[5] = createPastelMaterial(PASTEL_COLORS.height);

          if (y > 0) {
            materials[0] = createPastelMaterial(PASTEL_COLORS.height);
          }
        }

        return materials;
      };
      const visibleCount = Math.min(
        count,
        size.width * size.depth * size.height,
      );

      for (let index = 0; index < visibleCount; index += 1) {
        const x = index % size.width;
        const zIndex = Math.floor(index / size.width) % size.depth;
        const y = Math.floor(index / (size.width * size.depth));
        const z = size.depth - 1 - zIndex;
        const block = new THREE.Mesh(
          blockGeometry,
          createBlockMaterials(x, y, zIndex),
        );
        block.position.set(
          x - (size.width - 1) / 2,
          y - (size.height - 1) / 2,
          z - (size.depth - 1) / 2,
        );
        block.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));
        group.add(block);
      }

      fitCamera(Math.max(size.width, size.depth, size.height));
    }

    if (mode === 'convert') {
      const maxDimension = Math.max(
        convertSize.width,
        convertSize.depth,
        convertSize.height,
      );
      const unitScale = 9 / maxDimension;
      const geometry = new THREE.BoxGeometry(
        convertSize.width * unitScale,
        convertSize.height * unitScale,
        convertSize.depth * unitScale,
      );
      const solid = new THREE.Mesh(geometry, [
        createPastelMaterial(PASTEL_COLORS.depth, 0.9),
        createPastelMaterial(PASTEL_COLORS.block, 0.9),
        createPastelMaterial(PASTEL_COLORS.height, 0.9),
        createPastelMaterial(PASTEL_COLORS.block, 0.9),
        createPastelMaterial(PASTEL_COLORS.width, 0.9),
        createPastelMaterial(PASTEL_COLORS.block, 0.9),
      ]);
      const lineColor =
        convertUnit === 'cm'
          ? PASTEL_COLORS.blockEdge
          : PASTEL_COLORS.meterLine;
      solid.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(geometry),
          new THREE.LineBasicMaterial({
            color: lineColor,
            transparent: true,
            opacity: convertUnit === 'cm' ? 0.24 : 0.85,
          }),
        ),
      );
      group.add(solid);
      addCentimeterSurfaceGrid(convertSize, unitScale);
      if (convertUnit === 'm') addMeterUnitLines(convertSize, unitScale);
      fitCamera(9);
    }

    if (mode === 'meter') {
      const boxSize = 10;
      addTransparentBox({ width: boxSize, depth: boxSize, height: boxSize });

      const widthScale = meterSize.width / 100;
      const depthScale = meterSize.depth / 100;
      const heightScale = meterSize.height / 100;
      const geometry = new THREE.BoxGeometry(
        boxSize * widthScale,
        boxSize * heightScale,
        boxSize * depthScale,
      );
      const block = new THREE.Mesh(geometry, [
        createPastelMaterial(PASTEL_COLORS.depth, 0.82),
        createPastelMaterial(0xd8e8ff, 0.82),
        createPastelMaterial(PASTEL_COLORS.height, 0.82),
        createPastelMaterial(0xd4f8e5, 0.82),
        createPastelMaterial(PASTEL_COLORS.width, 0.82),
        createPastelMaterial(0xffdce4, 0.82),
      ]);
      block.position.set(
        -boxSize / 2 + (boxSize * widthScale) / 2,
        -boxSize / 2 + (boxSize * heightScale) / 2,
        boxSize / 2 - (boxSize * depthScale) / 2,
      );
      block.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(geometry),
          new THREE.LineBasicMaterial({
            color: PASTEL_COLORS.blockEdge,
            transparent: true,
            opacity: 0.24,
          }),
        ),
      );
      group.add(block);
      addMeterUnitLines({ width: 100, depth: 100, height: 100 }, boxSize / 100);
      fitCamera(boxSize);
    }
  }, [convertSize, convertUnit, count, meterSize, mode, size]);

  return (
    <div className="relative h-[420px] overflow-hidden rounded-md border bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 md:h-[560px]">
      <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-md border bg-bg/90 px-3 py-2 text-sm font-bold shadow-sm">
        {mode === 'build' &&
          `${formatNumber(count)} / ${formatNumber(
            size.width * size.depth * size.height,
          )} cm³`}
        {mode === 'convert' &&
          (convertUnit === 'cm' ? 'cm³ 단위 보기' : 'm³ 단위 변환')}
        {mode === 'meter' &&
          `${meterSize.width} × ${meterSize.depth} × ${meterSize.height}cm`}
      </div>
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}

function FormulaBar({
  x,
  z,
  y,
  total,
  unit,
}: {
  x: number;
  z: number;
  y: number;
  total: number;
  unit: string;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-sm font-bold text-text-subtitle">
        부피 구하는 식
      </p>
      <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-base font-black">
        <span className="rounded-md border-2 border-rose-300 bg-rose-50 px-2 py-1.5 text-rose-600">
          {formatNumber(x)}
        </span>
        <span className="text-text-subtitle">×</span>
        <span className="rounded-md border-2 border-sky-300 bg-sky-50 px-2 py-1.5 text-sky-600">
          {formatNumber(z)}
        </span>
        <span className="text-text-subtitle">×</span>
        <span className="rounded-md border-2 border-emerald-300 bg-emerald-50 px-2 py-1.5 text-emerald-600">
          {formatNumber(y)}
        </span>
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-text-subtitle">=</span>
          <span className="rounded-md border-2 border-gray-300 bg-bg px-2 py-1.5 text-text-title">
            {formatNumber(total)}
          </span>
          <span className="text-xs font-bold text-text-subtitle">{unit}</span>
        </span>
      </div>
    </div>
  );
}

export default function VolumeBlocksContainer() {
  const [mode, setMode] = useState<Mode>('build');
  const [size, setSize] = useState<Dimension>(DEFAULT_SIZE);
  const [convertSize, setConvertSize] =
    useState<Dimension>(DEFAULT_CONVERT_SIZE);
  const [buildUnit, setBuildUnit] = useState<BuildUnit>('single');
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [convertUnit, setConvertUnit] = useState<'cm' | 'm'>('cm');
  const [meterSize, setMeterSize] = useState<Dimension>({
    width: 1,
    depth: 1,
    height: 1,
  });
  const [isMeterPlaying, setIsMeterPlaying] = useState(false);
  const [meterSpeed, setMeterSpeed] = useState(1);
  const [showFormula, setShowFormula] = useState(true);
  const total = size.width * size.depth * size.height;

  const formula = useMemo(() => {
    if (mode === 'convert') {
      const multiplier = convertUnit === 'cm' ? 1 : 0.01;
      const x = convertSize.width * multiplier;
      const z = convertSize.depth * multiplier;
      const y = convertSize.height * multiplier;
      return {
        x,
        z,
        y,
        total: x * z * y,
        unit: convertUnit === 'cm' ? 'cm³' : 'm³',
      };
    }

    if (mode === 'meter') {
      return {
        x: meterSize.width,
        z: meterSize.depth,
        y: meterSize.height,
        total: meterSize.width * meterSize.depth * meterSize.height,
        unit: 'cm³',
      };
    }

    return {
      x: size.width,
      z: size.depth,
      y: size.height,
      total,
      unit: 'cm³',
    };
  }, [convertSize, convertUnit, meterSize, mode, size, total]);

  const getNextCount = (direction: 1 | -1) => {
    if (buildUnit === 'all') return direction === 1 ? total : 0;

    const unitSize = getBuildUnitSize(buildUnit, size);
    const remainder = count % unitSize;

    if (direction === 1) {
      return clamp(
        count + (remainder === 0 ? unitSize : unitSize - remainder),
        0,
        total,
      );
    }

    return clamp(count - (remainder === 0 ? unitSize : remainder), 0, total);
  };

  useEffect(() => {
    if (!isPlaying) return undefined;

    const interval = window.setInterval(
      () => {
        setCount((current) => {
          if (current >= total) {
            setIsPlaying(false);
            return current;
          }

          const unitSize = getBuildUnitSize(buildUnit, size);
          const remainder = current % unitSize;
          return clamp(
            current + (remainder === 0 ? unitSize : unitSize - remainder),
            0,
            total,
          );
        });
      },
      buildUnit === 'single' ? 180 : 520,
    );

    return () => window.clearInterval(interval);
  }, [buildUnit, isPlaying, size, total]);

  useEffect(() => {
    if (mode !== 'meter' || !isMeterPlaying) return undefined;

    const interval = window.setInterval(() => {
      setMeterSize((current) => {
        if (current.width < 100) {
          return {
            ...current,
            width: clamp(current.width + meterSpeed, 1, 100),
          };
        }
        if (current.depth < 100) {
          return {
            ...current,
            depth: clamp(current.depth + meterSpeed, 1, 100),
          };
        }
        if (current.height < 100) {
          return {
            ...current,
            height: clamp(current.height + meterSpeed, 1, 100),
          };
        }

        setIsMeterPlaying(false);
        return current;
      });
    }, 90);

    return () => window.clearInterval(interval);
  }, [isMeterPlaying, meterSpeed, mode]);

  const updateSize = (key: keyof Dimension, value: number) => {
    setSize((prev) => ({ ...prev, [key]: value }));
    setCount(0);
    setIsPlaying(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Heading1 className="text-2xl font-black">
          직육면체 부피 구하기
        </Heading1>
        <p className="text-sm font-medium text-text-subtitle">
          1cm³ 블록을 쌓아 가로 × 세로 × 높이의 의미를 눈으로 확인해요.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit shadow-lg">
          <CardContent className="flex flex-col gap-4 p-5">
            <Tabs
              value={mode}
              onValueChange={(value) => {
                setMode(value as Mode);
                setIsPlaying(false);
                setIsMeterPlaying(false);
              }}
            >
              <TabsList className="grid h-auto w-full grid-cols-3">
                <TabsTrigger value="build" className="gap-1">
                  <Box className="size-4" />
                  쌓기
                </TabsTrigger>
                <TabsTrigger value="convert" className="gap-1">
                  <Cuboid className="size-4" />
                  변환
                </TabsTrigger>
                <TabsTrigger value="meter" className="gap-1">
                  <Play className="size-4" />
                  1m³
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {mode === 'build' && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <DimensionInput
                    id="volume-width"
                    label="가로(cm)"
                    value={size.width}
                    max={12}
                    accentClassName="text-rose-600"
                    onChange={(value) => updateSize('width', value)}
                  />
                  <DimensionInput
                    id="volume-depth"
                    label="세로(cm)"
                    value={size.depth}
                    max={12}
                    accentClassName="text-sky-600"
                    onChange={(value) => updateSize('depth', value)}
                  />
                  <DimensionInput
                    id="volume-height"
                    label="높이(cm)"
                    value={size.height}
                    max={10}
                    accentClassName="text-emerald-600"
                    onChange={(value) => updateSize('height', value)}
                  />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(BUILD_UNIT_LABEL) as BuildUnit[]).map(
                    (unit) => (
                      <Button
                        key={unit}
                        type="button"
                        variant={
                          buildUnit === unit ? 'primary' : 'gray-outline'
                        }
                        size="sm"
                        onClick={() => {
                          setBuildUnit(unit);
                          setIsPlaying(false);
                        }}
                        className="px-2 font-bold"
                      >
                        {BUILD_UNIT_LABEL[unit]}
                      </Button>
                    ),
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="gray-outline"
                    size="lg"
                    onClick={() => {
                      setIsPlaying(false);
                      setCount(getNextCount(-1));
                    }}
                    className="gap-2"
                  >
                    <Minus className="size-5" />
                    빼기
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => {
                      setIsPlaying(false);
                      setCount(getNextCount(1));
                    }}
                    className="gap-2"
                  >
                    <Plus className="size-5" />
                    추가
                  </Button>
                  <Button
                    type="button"
                    variant={isPlaying ? 'secondary' : 'primary-outline'}
                    size="lg"
                    onClick={() => setIsPlaying((prev) => !prev)}
                    className="gap-2"
                  >
                    {isPlaying ? (
                      <Pause className="size-5" />
                    ) : (
                      <Play className="size-5" />
                    )}
                    자동
                  </Button>
                  <Button
                    type="button"
                    variant="gray-ghost"
                    size="lg"
                    onClick={() => {
                      setIsPlaying(false);
                      setCount(0);
                    }}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <RotateCcw className="size-5" />
                    초기화
                  </Button>
                </div>
              </>
            )}

            {mode === 'convert' && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <DimensionInput
                    id="convert-width"
                    label="가로(cm)"
                    value={convertSize.width}
                    max={2000}
                    accentClassName="text-rose-600"
                    onChange={(value) =>
                      setConvertSize((prev) => ({ ...prev, width: value }))
                    }
                  />
                  <DimensionInput
                    id="convert-depth"
                    label="세로(cm)"
                    value={convertSize.depth}
                    max={2000}
                    accentClassName="text-sky-600"
                    onChange={(value) =>
                      setConvertSize((prev) => ({ ...prev, depth: value }))
                    }
                  />
                  <DimensionInput
                    id="convert-height"
                    label="높이(cm)"
                    value={convertSize.height}
                    max={2000}
                    accentClassName="text-emerald-600"
                    onChange={(value) =>
                      setConvertSize((prev) => ({ ...prev, height: value }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={convertUnit === 'cm' ? 'primary' : 'gray-outline'}
                    onClick={() => setConvertUnit('cm')}
                    className="font-bold"
                  >
                    cm³로 보기
                  </Button>
                  <Button
                    type="button"
                    variant={convertUnit === 'm' ? 'primary' : 'gray-outline'}
                    onClick={() => setConvertUnit('m')}
                    className="font-bold"
                  >
                    m³로 변환
                  </Button>
                </div>
              </>
            )}

            {mode === 'meter' && (
              <>
                <div className="rounded-md border bg-bg-secondary p-3">
                  <div className="mb-3 flex justify-between text-xs font-bold text-text-subtitle">
                    <span>느리게</span>
                    <span>속도</span>
                    <span>빠르게</span>
                  </div>
                  <Slider
                    min={1}
                    max={8}
                    step={1}
                    value={[meterSpeed]}
                    onValueChange={([value]) => setMeterSpeed(value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => {
                      setMeterSize((prev) =>
                        prev.width >= 100 &&
                        prev.depth >= 100 &&
                        prev.height >= 100
                          ? { width: 1, depth: 1, height: 1 }
                          : prev,
                      );
                      setIsMeterPlaying(true);
                    }}
                    className="gap-2"
                  >
                    <Play className="size-5" />
                    {isMeterPlaying ? '진행 중' : '시작'}
                  </Button>
                  <Button
                    type="button"
                    variant="gray-outline"
                    size="lg"
                    onClick={() => {
                      setIsMeterPlaying(false);
                      setMeterSize({ width: 1, depth: 1, height: 1 });
                    }}
                    className="gap-2"
                  >
                    <RotateCcw className="size-5" />
                    다시
                  </Button>
                </div>
                <p className="text-sm font-semibold text-text-subtitle">
                  1cm³ 조각이 가로, 세로, 높이 순서로 100cm까지 커지며 1m³를
                  채웁니다.
                </p>
              </>
            )}

            <div className="flex items-center justify-between gap-3 border-t pt-3">
              <span className="text-sm font-bold text-text-subtitle">
                공식 보이기
              </span>
              <Switch checked={showFormula} onCheckedChange={setShowFormula} />
            </div>

            {showFormula && (
              <FormulaBar
                x={formula.x}
                z={formula.z}
                y={formula.y}
                total={formula.total}
                unit={formula.unit}
              />
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <ThreeVolumeScene
            mode={mode}
            size={size}
            count={count}
            convertSize={convertSize}
            convertUnit={convertUnit}
            meterSize={meterSize}
          />
        </div>
      </div>
    </div>
  );
}
